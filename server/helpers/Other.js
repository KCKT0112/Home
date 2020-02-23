const crypto = require('crypto');
// 其他方法

// 过滤HTML标签
function removeHTMLTag(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
    //str = str.replace(/ /ig, '');//去掉 
    return str;
}

// 在线状态时间计算
function online(time) {
    if (Math.round(new Date() / 1000) - time <= 30) {
        return true;
    } else {
        return false;
    }
}

function sha256(data) {
    let sha256 = crypto.createHash('sha256');
    return sha256.update(data).digest('hex');
}

function md5(data) {
    let md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

function callback(code, success, message, data) {
    if (!data) {
        let obj = {
            code: code,
            success: success,
            message: message
        };
        return obj;
    } else {
        let obj = {
            code: code,
            success: success,
            message: message,
            data: data
        };
        return obj;
    }
}

function authjson(data) {
    let d = data.oauth;
    for (i in d) {
        var jname = '{ "oauth.' + i + '": ' + null + ' }';
        var jname2 = '{ "oauth.' + i + '": "' + d[i] + '" }';
    }

    let n1 = JSON.parse(jname);
    let n2 = JSON.parse(jname2);

    let back = {
        n1,
        n2
    };
    return back;
}

module.exports = {
    removeHTMLTag,
    online,
    sha256,
    md5,
    callback,
    authjson
};