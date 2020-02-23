const mongoose = require('mongoose');
const StateMsgSchema = require('../schemas/StateMsgSchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const StateMsg = mongoose.model('message', StateMsgSchema);
module.exports = StateMsg;
