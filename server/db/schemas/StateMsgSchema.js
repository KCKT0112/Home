const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const StateMsgSchema = new Schema({
  msg_master: String,
  msg_type: Number,
  msg_sender: String,
  msg_title: String,
  msg_content: String,
  msg_read: Boolean,
  msg_addtime: Number
});
module.exports = StateMsgSchema;
