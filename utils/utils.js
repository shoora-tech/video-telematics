var Hex2Bin = function (n) {
    if (!checkHex(n))
        return 0;
    return parseInt(n, 16).toString(2);
}

var Hex2BinStr = function (hex) {
    var binary = "";
    var remainingSize = hex.length;
    for (var p = 0; p < hex.length/8; p++) {
        //In case remaining hex length (or initial) is not multiple of 8
        var blockSize = remainingSize < 8 ? remainingSize  : 8;

        binary += parseInt(hex.substr(p * 8, blockSize), 16).toString(2).padStart(blockSize*4,"0");

        remainingSize -= blockSize;
    }
    return binary;
}

var checkHex = function (n) {
    return /^[0-9A-Fa-f]{1,64}$/.test(n);
}

var getTerminalStatus = function(terminalStr){
    let terminalStatus = new Array();
    
    terminalStatus['ignitionStatus'] = 0;
    terminalStatus['latituteposition'] = 0;
    terminalStatus['longituteposition'] = 0;

    let binryTerminalStr = this.Hex2Bin(terminalStr);

    terminalStatus['ignitionStatus'] = parseInt(binryTerminalStr.slice(0, 1));
    terminalStatus['latituteposition'] = parseInt(binryTerminalStr.slice(2, 3));
    terminalStatus['longituteposition'] = parseInt(binryTerminalStr.slice(3, 4));
    return terminalStatus;
}

var getAlarmSeriesDet = function(alarmstr){
    let alarmDet = new Array();
    alarmDet['sosAlarm'] = 0;
    alarmDet['speeding'] = 0;
    alarmDet['fatigueDriving'] = 0;
    alarmDet['dangerWarning'] = 0;
    alarmDet['isGpsConnected'] = 1;
    alarmDet['lowBattery'] = 0;
    alarmDet['disconnected'] = 0;
    alarmDet['laneChange'] = 0;
    alarmDet['collisionWarning'] = 0;
    alarmDet['entryExitAlarm'] = 0;
    let binryAlarmStr = this.Hex2Bin(alarmstr);
    let alarmStrLen = binryAlarmStr.length;
    if(alarmStrLen < 32){
        var dif = 32 - alarmStrLen;
        for(var i=0; i<dif; i++){
            binryAlarmStr = '0'+binryAlarmStr;
        }
    }
    alarmDet['sosAlarm'] = parseInt(binryAlarmStr.slice(0, 1));
    alarmDet['speeding'] = parseInt(binryAlarmStr.slice(1, 2));
    alarmDet['fatigueDriving'] = parseInt(binryAlarmStr.slice(2, 3));
    alarmDet['dangerWarning'] = parseInt(binryAlarmStr.slice(3, 4));
    let bit4 = parseInt(binryAlarmStr.slice(4, 5));
    let bit5 = parseInt(binryAlarmStr.slice(5, 6));
    let bit6 = parseInt(binryAlarmStr.slice(6, 7));
    if(bit4 == 0 || bit5 == 0 || bit6 == 0 ){
        alarmDet['isGpsConnected'] = 1;
    }
    alarmDet['lowBattery'] = parseInt(binryAlarmStr.slice(7, 8));
    alarmDet['disconnected'] = parseInt(binryAlarmStr.slice(8, 9));
    alarmDet['laneChange'] = parseInt(binryAlarmStr.slice(30, 31));
    alarmDet['collisionWarning'] = parseInt(binryAlarmStr.slice(29, 30));
    alarmDet['entryExitAlarm'] = parseInt(binryAlarmStr.slice(20, 21));
    return alarmDet;
}
module.exports.Hex2Bin = Hex2Bin;
module.exports.checkHex = checkHex;
module.exports.getAlarmSeriesDet = getAlarmSeriesDet;
module.exports.getTerminalStatus = getTerminalStatus;
module.exports.Hex2BinStr = Hex2BinStr;
