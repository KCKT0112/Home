const mongoose = require('mongoose');
const RePassVerifySchema = require('../schemas/RePassVerifySchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const RePassVerify = mongoose.model('Re_Pass_Verify', RePassVerifySchema);
module.exports = RePassVerify;
