const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  mystate: String,
  usertype: Number,
  sex: Number,
  email_verify: Number,
  myurl: Object,
  oauth: Object,
  last_online: Number
});
module.exports = UserSchema;
