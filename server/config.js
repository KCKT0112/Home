// 配置文件

module.exports = {
  //前端地址
  baseUrl: "http://localhost:8080",

  // 数据库地址： 'mongodb://用户名:密码@ip地址:端口号/数据库';
  // 一般如果没设置用户名和密码直接写IP地址就可以,数据库你可以新建一个
  mongodb: "mongodb://127.0.0.1:27017/home",

  // 密码盐值
  SHA256_SUFFIX: 'HomeProjectC2020',

  // Token加密密钥
  secretKey: 'home_houduan_2020_jwttoken',

  // 路由token校验开关，设置为false就不进行校验了，游客也可以访问
  credentialsRequired: true,

  // 邮件发送协议 smtp | mailgnun
  MailSendModel: 'mailgun',

  // 配置Mailgun的域名和APIKEY, form填写邮件地址如noreply@xxx.com
  mailgun: {
    domain: "sp.kilins.com",
    apikey: "key-c162dd45a777b6d95efd4064a1ab01ef",
    from: "noreply@sp.kilins.com"
  },

  // 配置SMTP(目前未测试)
  smtp: {
    host: "",
    port: 578,
    // 如果为true, 端口请更改为456
    secure: false,
    // 用于SMTP鉴权的用户账户与密码
    user: "",
    password: "",
    // 填写发件人
    from: ""
  },

  //reCAPTCHA人机验证
  recaptcha: {
    use: false,
    secret: '6Lf0EdkUAAAAAECSnA-20uq0KgCnJM42iHpm9dqm'
  },

  //Oauth 设置
  Oauth: {
    github: {
      use: true,
      Client_ID: 'f1706c2967a9764784f3',
      Client_Secret: '4037b866f0d048a0501337765a5ab3a58c059ad9'
    },
    gitlab: {
      use: true,
      Client_ID: '28ad422f9f243adc188737d403aa1fc9246185d29c0169c2c133b997e30de8e9',
      Client_Secret: 'c8fdc6044f33d57136327affa42b126d19f4cd443a34d299fab2cbdd7dbe0a07'
    }
  }
};