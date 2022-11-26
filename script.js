const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());


var AWS = require("aws-sdk");

AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: 'AKIAX7BFP72C6Z774WVT',
    secretAccessKey: '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',
    endpoint: new AWS.Endpoint('https://sqs.ap-south-1.amazonaws.com/'),
});

var sqs = new AWS.SQS();


const queryURL = "https://sqs.ap-south-1.amazonaws.com/547686973061/video-telematics";

var params = {
    MessageBody: "keshav test",
    QueueUrl: queryURL
};






//READ Request Handlers
app.get('/', async (req, res) => {
    let sqsData = await readFromSQS();
    console.log('sqsData--', sqsData)
    res.send('Welcome to Tutorial!!'+JSON.stringify(sqsData));
});


app.get('/sendMessage', async (req, res) => {

    sqs.sendMessage(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
            console.log('--SQS--->', data)
        }
    });

});
function readFromSQS(){
    return new Promise((resolve, reject) => {
        const params = {
            QueueUrl: queryURL,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 0,
            WaitTimeSeconds: 0
        };
        sqs.receiveMessage(params, (err, data) => {
            if (err) {
                reject(err, err.stack);
            } else {
                if (!data.Messages) {
                    resolve('Nothing to process');
                }
                const sqsData = data.Messages;
                for (var i = 0; i < data.Messages.length; i++) {
                    var message = data.Messages[i];
                    var body = JSON.parse(message.Body);
                    // execute logic
                    removeFromQueue(message);
                }
                resolve(sqsData)
            }
        })
    })
}


var removeFromQueue = function(message) {
    sqs.deleteMessage({
        QueueUrl : queryURL,
        ReceiptHandle : message.ReceiptHandle
    }, function(err, data) {
        err && console.log(err);
    });
};

function validateBook(book) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(book, schema);

}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
