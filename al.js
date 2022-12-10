const express = require('express');
const app = express();
app.use(express.json());



//READ Request Handlers
app.get('/', async (req, res) => {
    console.log('sqsData--')




});


app.post('/AlarmPush', async(req, res) => {
    console.log('post')
	console.log(req.body)
	res.send(req.body)

});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Listening on port ${port}..`));
