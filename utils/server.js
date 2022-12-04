var net = require("net");
var utils = require("./utils/utils.js")
var connectionArr = {};
var id;
var connectionArr = {};
var tcpServer = net.createServer(handlerLotin).listen(1338);

function handlerLotin(connection){
  console.log("connection ESTAB");
  tcpServer.getConnections(function (error, count) {
        console.log("number of concurrent tcp connection " + count);
  });

  connection.on("error", function(err){
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack)
  });

  

  connection.on('end', function () {
      console.log("server disconnected....");
  });
  connection.on('close', function () {
      console.log("closed event fired");
      clearTimeout(id)
  });
  connection.on('data', function (data) {
    //data = "7e02000032784087664007015bffffffff004c000301af9f03048dd95600fb006100b92211191320440104000263a70302005a30019631010c250400000000d37e";
    try{
      data = data.toString('hex');
      var deviceDataObj = {};
      if(data.slice(0, 2).toLowerCase() == '7e' ){
        if(parseInt(data.slice(2, 4),16) == 2){
           deviceDataObj['identifier'] = data.slice(0, 2);
           deviceDataObj['locationPacketType'] = parseInt(data.slice(2, 4),16);
           deviceDataObj['messageBodyLength'] = data.slice(4, 10);
           deviceDataObj['phoneNumber'] = data.slice(10, 22);
           deviceDataObj['msgSerialNumber'] = data.slice(22, 26);
           deviceDataObj['alarms'] = utils.getAlarmSeriesDet(data.slice(26, 34));
           deviceDataObj['terminalStatus'] = utils.getTerminalStatus(data.slice(34, 42));
           deviceDataObj['latitute'] = parseInt(data.slice(42, 50),16)/1000000;
           deviceDataObj['longitute'] = parseInt(data.slice(50, 58),16)/1000000;
           deviceDataObj['height'] = parseInt(data.slice(58, 62),16);
           deviceDataObj['speed'] = parseInt(data.slice(62, 66),16)/10;
           deviceDataObj['direction'] = parseInt(data.slice(66, 70),16);
           let timeString = data.slice(70, 82);
           var split = timeString.replace(/.{2}/g, '$&-').split('-');
           var date = '';
           var time = '';
           for(var i = 0; i<3;i++){
             if(date == ''){
               date += split[i];
             }else{
               date += '-'+split[i];
             }
           }
       
           for(var i = 3; i<6; i++){
             if(time == ''){
               time += split[i];
             }else{
               time += ':'+split[i];
             }
           }
           deviceDataObj['time'] = date+' '+time;
           //deviceDataObj['additionalInf'] = data.slice(82, 130);
           //deviceDataObj['additionalInfId'] = data.slice(82, 84);
           //deviceDataObj['additionalInfLength'] = parseInt(data.slice(84, 86),16);
           deviceDataObj['mileage'] = parseInt(data.slice(86, 94),16)/10;
           //deviceDataObj['unknownadditionalInfId'] = data.slice(94, 96);
           //deviceDataObj['unknownadditionalInfLength'] = parseInt(data.slice(96, 98),16);
           deviceDataObj['gsmNetworkStrength'] = parseInt(data.slice(98, 102),16);
           deviceDataObj['numberofSatelite'] = parseInt(data.slice(124, 126),16);
           console.log('deviceDataObj', deviceDataObj);
           console.log('now insert into database');
        }
     }
    }catch(e){
      console.log(e);
    }
  });
}




