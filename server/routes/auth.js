// Auth Model
const express = require('express');
const axios = require('axios');
const { secretKey, Oauth } = require('../config');
const jwt = require('jsonwebtoken');
const Other = require('../helpers/Other');
const { authAccount, unauthAccount } = require('../helpers/ReqUser');

const router = express.Router();

router.get('/github/v2/login', function (req, res) {
    if (Oauth.github.use === true) {
        let dataStr = (new Date()).valueOf();
        //重定向到认证接口,并配置参数
        let path = "https://github.com/login/oauth/authorize";
        path += '?client_id=' + Oauth.github.Client_ID;
        path += '&state=' + dataStr;
        res.redirect(path);
    } else {
        let data = Other.callback(-1, false, 'Oauth未启用');
        res.json(
            data
        );
    }
});

router.get("/github/v2/callback", function (req, res) {
    if (Oauth.github.use === true) {
        if (req.query.code) {

            axios({
                method: 'post',
                url: 'https://github.com/login/oauth/access_token',
                data: {
                    client_id: Oauth.github.Client_ID,
                    client_secret: Oauth.github.Client_Secret,
                    code: req.query.code
                },
                headers: {
                    accept: 'application/json'
                }
            }).then(data => {
                if (data) {
                    axios({
                        method: 'get',
                        url: `https://api.github.com/user`,
                        headers: {
                            accept: 'application/json',
                            Authorization: `token ${data.data.access_token}`
                        }
                    }).then(data2 => {

                        if (req.query.token && req.query.bind === 'true') {
                            jwt.verify(req.query.token, secretKey, function (err, decoded) {
                                if (err) {
                                    resolve(callback(-1, false, 'OAuth绑定失败,Token无效'));
                                } else
                                    if (decoded) {
                                        let obj = {
                                            bind: true,
                                            oauth: { 'github': data2.data.id },
                                            userid: decoded.id
                                        };

                                        authAccount(obj)
                                            .then(function (back) {
                                                res.json(back);
                                            });
                                    }
                            });
                        } else {
                            let obj = {
                                oauth: { 'github': data2.data.id }
                            };

                            authAccount(obj)
                                .then(function (back) {
                                    res.json(back);
                                });
                        }

                    });
                }
            });
        } else {
            let data = Other.callback(-1, false, '参数不正确');
            res.json(
                data
            );
        }

    } else {
        let data = Other.callback(-1, false, 'Oauth未启用');
        res.json({
            data
        });
    }
});

router.post("/github/v2/unbind", function (req, res) {
    let data = {
        userid: req.user.id,
        oauth: { 'github': null }
    };

    unauthAccount(data)
        .then(data => {
            res.json(data);
        });
});

router.get('/gitlab/login', function (req, res) {
    if (Oauth.gitlab.use === true) {
        let dataStr = (new Date()).valueOf();
        //重定向到认证接口,并配置参数
        let path = "https://gitlab.com/oauth/authorize";
        path += '?client_id=' + Oauth.gitlab.Client_ID;
        path += '&response_type=code';
        path += '&redirect_uri=' + req.query.redirect_uri;
        path += '&state=' + dataStr;
        res.redirect(path);
    } else {
        let data = Other.callback(-1, false, 'Oauth未启用');
        res.json(
            data
        );
    }
});

router.get("/gitlab/callback", function (req, res) {
    if (Oauth.gitlab.use === true) {
        if (req.query.code) {

            axios({
                method: "post",
                url: "https://gitlab.com/oauth/token",
                data: {
                    client_id: Oauth.gitlab.Client_ID,
                    client_secret: Oauth.gitlab.Client_Secret,
                    code: req.query.code,
                    grant_type: 'authorization_code',
                    redirect_uri: "http://10.0.0.123:8080/auth/gitlab"
                },
                headers: {
                    accept: 'application/json'
                }
            }).then(data => {
                if (data) {
                    axios({
                        method: 'get',
                        url: 'https://gitlab.com/oauth/token/info',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${data.data.access_token}`
                        }
                    }).then(data2 => {

                        if (req.query.token && req.query.bind === 'true') {
                            jwt.verify(req.query.token, secretKey, function (err, decoded) {
                                if (err) {
                                    resolve(callback(-1, false, 'OAuth绑定失败,Token无效'));
                                } else
                                    if (decoded) {
                                        let obj = {
                                            bind: true,
                                            oauth: { 'gitlab': data2.data.application.uid },
                                            userid: decoded.id
                                        };

                                        authAccount(obj)
                                            .then(function (back) {
                                                res.json(back);
                                            });
                                    }
                            });
                        } else {
                            let obj = {
                                oauth: { 'gitlab': data2.data.application.uid }
                            };

                            authAccount(obj)
                                .then(function (back) {
                                    res.json(back);
                                });
                        }

                    })
                        .catch(err => {
                            if (err) {
                                console.log(err);
                            }
                        });
                }
            })
                .catch(err => {
                    if (err) {
                        console.log(err);
                    }
                });
        } else {
            let data = Other.callback(-1, false, '参数不正确');
            res.json(
                data
            );
        }

    } else {
        let data = Other.callback(-1, false, 'Oauth未启用');
        res.json(
            data
        );
    }
});

router.post("/gitlab/unbind", function (req, res) {
    let data = {
        userid: req.user.id,
        oauth: { 'gitlab': null }
    };

    unauthAccount(data)
        .then(data => {
            res.json(data);
        });
});

module.exports = router;