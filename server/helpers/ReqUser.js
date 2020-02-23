const { SHA256_SUFFIX, secretKey } = require('../config');
const stringRandom = require('string-random');
const jwt = require('jsonwebtoken');
const { reCAPTCHA } = require('./ReCAPTCHA');
const { sha256, md5, callback, authjson } = require('./Other');
const User = require('../db/models/UserModel'); // 引入模型
const Mail = require('./Mail'); //邮件模块
const EmailVerify = require('../db/models/EmailVerifyModel'); // 引入模型
const PushMsg = require('./PushMsg');


function finduser(data) {
    return new Promise(function (resolve, reject) {
        User.find(data, 'username email usertype email_verify mystate online sex myurl oauth last_online', (error, data) => {
            if (error) {
                resolve(callback(-1, false, '查询失败'));
            }
            if (data.length !== 0) {
                resolve(callback(0, true, '查询成功', data));
                //console.log(JSON.stringify(data));
            } else {
                resolve(callback(-1, false, '用户不存在'));
            }
        });
    });
}

function finduserpage(page) {
    return new Promise(function (resolve, reject) {
        User.find({}, '_id username email usertype email_verify mystate online sex last_online', function (error, data) {
            User.find(function (error, data2) {
                let obj = {
                    maxpage: Math.ceil(data2.length / 10),
                    data
                };
                resolve(callback(0, true, '查询成功', obj));
            });
        })
            .sort({ '_id': -1 })
            .skip(page * 10)
            .limit(10);
    });
}

function login(username, password, retoken) {
    return new Promise(function (resolve, reject) {
        reCAPTCHA(retoken).then(function (data) {
            if (data !== true) {
                resolve(callback(-1, false, 'reCAPTCHA验证不通过'));
            } else {
                User.findOne({
                    username: username,
                    password: sha256(password + SHA256_SUFFIX)
                }, (error, data) => {
                    if (error) {
                        resolve(callback(-1, false, '发生了一些错误'));
                    }
                    if (data) {
                        const tokenObj = {
                            id: data._id,
                            username: data.username,
                            email: data.email,
                            usertype: data.usertype
                        };
                        // 用户登录成功过后生成token返给前端
                        let token = jwt.sign(tokenObj, secretKey, {
                            expiresIn: 31536000 // 授权较长时间避免token失效被登出
                        });
                        let obj = {
                            success: true,
                            token: token,
                            username: data.username,
                            email: data.email,
                            avatar: md5(data.email),
                            email_verify: data.email_verify,
                            usertype: data.usertype,
                            mystate: data.mystate,
                            sex: data.sex,
                            myurl: data.myurl,
                            oauth: data.oauth
                        };
                        resolve(callback(0, true, '登入成功', obj));
                    } else {
                        resolve(callback(-1, false, '登入失败，用户不存在或密码错误'));
                    }
                });
            }
        });
    });
}

function register(data) {
    return new Promise(function (resolve, reject) {
        reCAPTCHA(data.retoken).then(function (obj) {
            if (obj !== true) {
                resolve(callback(-1, false, 'reCAPTCHA验证不通过'));
            } else {
                finduser({ username: data.username }).then(function (dataobj) {
                    if (dataobj.success === false) {
                        finduser({ email: data.email }).then(function (dataobj) {
                            if (dataobj.success === false) {
                                const insertObj = {
                                    username: data.username,
                                    password: sha256(data.password + SHA256_SUFFIX),
                                    email: data.email,
                                    mystate: "",
                                    online: false,
                                    usertype: 0,
                                    sex: 0,
                                    email_verify: 0,
                                    myurl: [],
                                    oauth: [],
                                    last_online: 1581338068
                                };
                                const newUser = new User(insertObj);
                                newUser.save(insertObj, (err, doc) => {
                                    if (err) {
                                        resolve(-1);
                                    } else {
                                        console.log(doc);
                                        PushMsg.AddMsg(doc._id, 1, 'System', '欢迎', '欢迎你加入我们，现在就随便逛逛来了解一下我们有什么功能吧~');
                                        EmailVerify.deleteMany({ email: data.email }, (err, doc) => {
                                            const insertObj = {
                                                email: data.email,
                                                code: stringRandom()
                                            };
                                            const newEmailVerify = new EmailVerify(insertObj);
                                            newEmailVerify.save(insertObj, (err, doc) => {
                                                if (err) {
                                                    //none
                                                } else {
                                                    Mail.sendmail(data.email, '验证您的电子邮件', '这是您验证邮件的验证代码：' + insertObj.code);
                                                }
                                            });
                                        });
                                        resolve(callback(0, true, '注册成功'));
                                    }
                                });
                            } else {
                                resolve(callback(-1, false, '邮箱已被注册'));
                            }
                        });
                    } else {
                        resolve(callback(-1, false, '用户名已存在'));
                    }
                });
            }
        });
    });
}

function authAccount(data) {
    return new Promise(function (resolve, reject) {
        let authj = authjson(data);
        finduser(authj.n2).then(function (res) {
            if (data.bind !== true && res.success === true) {
                const tokenObj = {
                    id: res.data[0]._id,
                    username: res.data[0].username,
                    email: res.data[0].email,
                    usertype: res.data[0].usertype
                };

                // 用户登录成功过后生成token返给前端
                let token = jwt.sign(tokenObj, secretKey, {
                    expiresIn: 31536000 // 授权较长时间避免token失效被登出
                });

                let profile = {
                    token: token,
                    data
                };

                let obj = {
                    type: login,
                    token: token,
                    profile: profile
                };

                resolve(callback(0, true, '登入成功', obj));
            } else {
                if (data.bind === true) {
                    if (res.success === true) {
                        resolve(callback(-1, false, 'OAuth无法重复绑定'));
                    } else {
                        let authj = authjson(data);

                        User.updateOne({ _id: data.userid }, { $addToSet: authj.n2 }, { new: true }, function (err, data2) {
                            if (data2.nModified === 1 && data2.ok === 1) {
                                resolve(callback(0, true, 'OAuth绑定成功'));
                            } else {
                                resolve(callback(-1, false, 'OAuth绑定失败'));
                            }
                        });
                    }
                } else {
                    resolve(callback(-1, false, 'OAuth未绑定'));
                }
            }
        });
    });
}

function unauthAccount(data) {
    return new Promise(function (resolve, reject) {
        let authj = authjson(data);
        User.updateOne({ _id: data.userid }, { $unset: authj.n2 }, { new: true }, function (err, data) {
            if (data.nModified === 1 && data.ok === 1) {
                resolve(callback(0, true, '解绑成功'));
            } else {
                resolve(callback(-1, false, 'OAuth解绑失败'));
            }
        });
    });
}

module.exports = {
    finduser,
    finduserpage,
    login,
    register,
    authAccount,
    unauthAccount
};