const mongoose = require('mongoose');
const EmailVerifySchema = require('../schemas/EmailVerifySchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const EmailVerify = mongoose.model('Email_Verify', EmailVerifySchema);
module.exports = EmailVerify;
