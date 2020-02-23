const express = require('express');
const stringRandom = require('string-random');
const { body, oneOf, validationResult } = require('express-validator');
const Mail = require('../../helpers/Mail'); //邮件模块
const User = require('../../db/models/UserModel'); // 引入模型
const EmailVerify = require('../../db/models/EmailVerifyModel'); // 引入模型
const ReEmailVerify = require('../../db/models/ReEmailVerifyModel'); // 引入模型
const RePassVerify = require('../../db/models/RePassVerifyModel'); // 引入模型
const { SHA256_SUFFIX } = require('../../config');
const ReqUser = require('../../helpers/ReqUser');
const Other = require('../../helpers/Other');
const PushMsg = require('../../helpers/PushMsg');

const router = express.Router();

// 登入
router.post(
  '/login',
  [
    [
      body('username')
        .isString()
        .withMessage('username类型不正确'),
      body('password')
        .isString()
        .withMessage('password类型不正确')
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        code: 422,
        message: '字段名称不合法',
        data: {
          success: false,
          error: errors.array()
        }
      });
    }
    ReqUser.login(req.body.username, req.body.password, req.body.retoken).then(function (data) {
      if (data.success !== false) {
        res.json({
          data
        });
      } else {
        res.status(405).json({
          data
        });
      }
    }
    );
  }
);

// 注册
router.post(
  '/register',
  [
    body('username').isLength({ min: 4 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    console.log(errors, errors.isEmpty(), errors.array());
    if (!errors.isEmpty()) {
      return res.status(422).json({
        code: 422,
        message: '字段名称不合法',
        data: {
          success: false,
          error: errors.array()
        }
      });
    }
    ReqUser.register({
      username: Other.removeHTMLTag(req.body.username),
      email: req.body.email,
      password: req.body.password,
      retoken: req.body.retoken
    }).then(function (data) {
      res.json({
        data
      });
    });
  }
);

// 根据token返回个人资料
router.get('/profile', (req, res) => {
  ReqUser.finduser({ username: req.user.username }).then(function (obj) {
    if (obj.success === false) {
      res.json({
        obj
      });
    } else {
      let obj2 = {
        username: obj.data[0].username,
        email: obj.data[0].email,
        avatar: Other.md5(obj.data[0].email),
        usertype: obj.data[0].usertype,
        email_verify: obj.data[0].email_verify,
        mystate: obj.data[0].mystate,
        online: Other.online(obj.data[0].last_online),
        sex: obj.data[0].sex,
        myurl: obj.data[0].myurl,
        oauth: obj.data[0].oauth
      };
      res.json({
        code: obj.code,
        message: obj.message,
        data: obj2
      });
    }
  });
});

// 根据ID查询资料
router.get('/profile/id', (req, res) => {
  ReqUser.finduser({ username: req.query.username }).then(function (obj) {
    if (obj.success === false) {
      res.json({
        obj
      });
    } else {
      let obj2 = {
        username: obj.data[0].username,
        avatar: Other.md5(obj.data[0].email),
        usertype: obj.data[0].usertype,
        email_verify: obj.data[0].email_verify,
        mystate: obj.data[0].mystate,
        online: Other.online(obj.data[0].last_online),
        sex: obj.data[0].sex,
        myurl: obj.data[0].myurl
      };
      res.json({
        code: obj.code,
        message: obj.message,
        data: obj2
      });
    }
  });
});

// 修改个人资料
router.post('/profile/change', (req, res) => {
  if (Other.removeHTMLTag(req.body.mystate).length <= 20) {
    User.findByIdAndUpdate(req.user.id, {
      mystate: Other.removeHTMLTag(req.body.mystate),
      sex: req.body.sex
    }, function (err, data) {
      if (err) {
        res.json({
          code: -1,
          message: '更新失败'
        });
      } else {
        res.json({
          code: 0,
          message: '更新成功'
        });
      }
    });
  } else {
    res.json({
      code: -1,
      message: '更新失败，签名字数超过20'
    });
  }
});

// 修改密码
router.post('/change_pass', (req, res) => {
  User.findByIdAndUpdate(req.user.id, { password: Other.sha256(req.body.password + SHA256_SUFFIX) }, function (err, data) {
    if (err) {
      res.json({
        code: -1,
        message: '更改失败'
      });
    } else {
      res.json({
        code: 0,
        message: '更改成功'
      });
    }
  });
});

//验证邮件地址
router.post('/verify/email', (req, res) => {
  EmailVerify.findOne(
    {
      code: req.body.code
    },
    (err, code) => {
      if (err) {
        res.send('server or db error');
      } else {
        EmailVerify.findOne(
          {
            //验证验证码
            email: req.body.email,
            code: req.body.code
          },
          (err, code) => {
            if (code !== null) {
              //console.log(code);
              User.updateOne({ email: req.body.email }, { $set: { email_verify: 1 } }, { new: true }, function (err, data) {
                if (err) {
                  res.json({
                    code: -1,
                    message: '验证失败,似乎出现了一些问题。'
                  });
                } else {
                  EmailVerify.deleteOne({ code: req.body.code }, (err, res) => { });
                  Mail.sendmail(req.body.email, '邮件验证通过', '您的邮件地址已验证通过，此邮箱将作为您的账户安全邮箱。');
                  PushMsg.AddMsg(req.user.id, 1, 'System', '邮件验证通过', '您的安全邮箱已成功验证，此邮箱将作为您的安全邮箱，并在紧急时刻协助您找回您的账户。:)');
                  res.json({
                    code: 0,
                    message: '验证成功'
                  });
                }
              });
            } else {
              res.json({
                code: 404,
                message: '验证代码不存在或失效',
                data: {
                  success: false
                }
              });
            }
          }
        );
      }
    });
});

// 发送修改密码验证码
router.post('/email/change_password', (req, res) => {
  User.findOne(
    {
      //查询邮件绑定激活状态
      email: req.body.email
    },
    (err, user) => {
      if (err) {
        res.send('server or db error');
      } else {
        RePassVerify.deleteMany({ email: req.body.email }, (err, doc) => {
          if (err) {
            res.json({
              code: 500,
              messsge: '验证码生成失败',
              data: {
                success: false
              }
            });
          } else {
            if (user.email_verify === 0) {
              res.json({
                code: -1,
                message: '无法发送,您的邮件并未完成验证,因此无法作为修改密码的安全邮箱。'
              });
            } else {
              const insertObj = {
                email: req.body.email,
                code: stringRandom()
              };
              const newRePassVerify = new RePassVerify(insertObj);
              newRePassVerify.save(insertObj, (err, doc) => {
                if (err) {
                  res.json({
                    code: 500,
                    messsge: '验证码生成失败',
                    data: {
                      success: false
                    }
                  });
                } else {
                  console.log(doc);
                  Mail.sendmail(req.body.email, '找回您的密码', '这是您找回密码的验证代码：' + insertObj.code)
                    .then(function (value) {
                      if (value === true) {
                        res.json({
                          code: data,
                          message: '验证邮件发送成功',
                          data: { success: true }
                        });
                      } else {
                        res.json({
                          code: data,
                          message: '验证邮件发送失败',
                          data: { success: true }
                        });
                      }
                    });
                }
              });
            }
          }
        });
      }
    });
});

// 验证码修改密码
router.post('/verify/change_password', (req, res) => {
  RePassVerify.findOne(
    {
      email: req.body.email
    },
    (err, code) => {
      if (err) {
        res.send('server or db error');
      } else {
        RePassVerify.findOne(
          {
            //验证验证码
            email: req.body.email,
            code: req.body.code
          },
          (err, code) => {
            if (code !== null) {
              //console.log(code);
              User.updateOne({ email: req.body.email }, { $set: { password: Other.sha256(req.body.password + SHA256_SUFFIX) } }, { new: true }, function (err, data) {
                if (err) {
                  res.json({
                    code: -1,
                    message: '更改失败,似乎出现了一些问题。'
                  });
                } else {
                  RePassVerify.deleteOne({ code: req.body.code }, (err, res) => { });
                  Mail.sendmail(req.body.email, '您的密码已修改', '您好! 您的密码已修改成功，请牢记您的密码。');
                  res.json({
                    code: 0,
                    message: '更改成功'
                  });
                }
              });
            } else {
              res.json({
                code: 404,
                message: '验证代码不存在或失效',
                data: {
                  success: false
                }
              });
            }
          }
        );
      }
    });
});

// 验证绑定邮件验证码发送
router.post('/email/verify_email', (req, res) => {
  EmailVerify.deleteMany({ email: req.body.email }, (err, doc) => {
    if (err) {
      res.json({
        code: 500,
        messsge: '验证码生成失败',
        data: {
          success: false
        }
      });
    } else {
      const insertObj = {
        email: req.body.email,
        code: stringRandom()
      };

      const newEmailVerify = new EmailVerify(insertObj);

      newEmailVerify.save(insertObj, (err, doc) => {
        if (err) {
          res.json({
            code: 500,
            messsge: '验证码生成失败',
            data: {
              success: false
            }
          });
        } else {
          Mail.sendmail(req.body.email, '验证您的电子邮件', '这是您验证邮件的验证代码：' + insertObj.code)
            .then(function (value) {
              if (value === true) {
                res.json({
                  code: 0,
                  message: '验证邮件发送成功',
                  data: { success: true }
                });
              } else {
                res.json({
                  code: -1,
                  message: '验证邮件发送失败',
                  data: { success: true }
                });
              }
            });
        }
      });
    }
  });
});

// 发送修改邮箱验证码
router.post('/email/change_email', (req, res) => {
  User.findOne({ email: req.body.email }, (err, data) => {
    if (!data) {
      ReEmailVerify.deleteMany({ email: req.body.email }, (err, doc) => {
        if (err) {
          res.json({
            code: 500,
            messsge: '验证码生成失败',
            data: {
              success: false
            }
          });
        } else {
          const insertObj = {
            email: req.body.email,
            newemail: req.body.newemail,
            code: stringRandom()
          };
          const newReEmailVerify = new ReEmailVerify(insertObj);
          newReEmailVerify.save(insertObj, (err, doc) => {
            if (err) {
              res.json({
                code: 500,
                messsge: '验证码生成失败',
                data: {
                  success: false
                }
              });
            } else {
              Mail.sendmail(req.body.newemail, '验证您的新电子邮件', '您正在更改安全邮箱，这是您验证邮件的验证代码：' + insertObj.code)
                .then(function (value) {
                  if (value === true) {
                    res.json({
                      code: data,
                      message: '验证邮件发送成功',
                      data: { success: true }
                    });
                  } else {
                    res.json({
                      code: data,
                      message: '验证邮件发送失败',
                      data: { success: true }
                    });
                  }
                });
            }
          });
        }
      });
    } else {
      res.json({
        code: -1,
        message: '此邮件已绑定其他账户',
        data: { success: true }
      });
    }
  });
});

// 验证代码并修改邮箱
router.post('/verify/change_email', (req, res) => {
  ReEmailVerify.findOne(
    {
      email: req.body.email
    },
    (err, code) => {
      if (err) {
        res.send('server or db error');
      } else {
        ReEmailVerify.findOne(
          {
            //验证验证码
            email: req.body.email,
            code: req.body.code
          },
          (err, code) => {
            if (code !== null) {
              //console.log(code);
              User.updateOne({ email: req.body.email }, { $set: { email: code.newemail } }, { new: true }, function (err, data) {
                if (err) {
                  res.json({
                    code: -1,
                    message: '更改失败,似乎出现了一些问题。'
                  });
                } else {
                  ReEmailVerify.deleteOne({ code: req.body.code }, (err, res) => { });
                  Mail.sendmail(data.newemail, '您的邮箱已修改', '您好! 您的邮箱已修改成功，此邮箱将作为您的新安全邮箱。');
                  PushMsg.AddMsg(req.user.id, 1, 'System', '邮箱已修改', '您的安全邮件地址已发生改变。');
                  res.json({
                    code: 0,
                    message: '更改成功'
                  });
                }
              });
            } else {
              res.json({
                code: 404,
                message: '验证代码不存在或失效',
                data: {
                  success: false
                }
              });
            }
          }
        );
      }
    });
});

module.exports = router;
