var Hex2Bin = function (n) {
    if (!checkHex(n))
        return 0;
    return parseInt(n, 16).toString(2);
}

var checkHex = function (n) {
    return /^[0-9A-Fa-f]{1,64}$/.test(n);
}
module.exports.Hex2Bin = Hex2Bin;
