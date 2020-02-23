const express = require('express');
const auth = require('./auth');
const user = require('./user');
const postarticle = require('./user/PostArticle');
const statemsg = require('./user/statemsg');
const admin = require('./admin/index');
const site = require('./site');
const jwtAuth = require('./jwt');

// 注册路由
const router = express.Router();

// 所有请求过来都会进行身份验证
router.use(jwtAuth);
// 路由中间件
router.use((req, res, next) => {
  // 任何路由信息都会执行这里面的语句
  // console.log('this is a api request!');
  // 把它交给下一个中间件，注意中间件的注册顺序是按序执行
  next();
});

router.use('/site', site);
router.use('/auth', auth);
router.use('/user', user);
router.use('/user', postarticle);
router.use('/statemsg', statemsg);
router.use('/admin', admin);

// 处理 404
router.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// 处理5错误
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      code: 401,
      message: 'invalid token',
      data: err
    });
  } else {
    res.status(err.status || 500).json({
      code: err.status || 500,
      message: err.message,
      data: err
    });
  }
});

module.exports = router;
