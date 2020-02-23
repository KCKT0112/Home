const mongoose = require('mongoose');
const ReEmailVerifySchema = require('../schemas/ReEmailVerifySchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const ReEmailVerify = mongoose.model('ReEmail_Verify', ReEmailVerifySchema);
module.exports = ReEmailVerify;
