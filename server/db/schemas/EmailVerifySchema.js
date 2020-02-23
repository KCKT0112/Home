const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const EmailVerifySchema = new Schema({
  email: String,
  code: String,
});
module.exports = EmailVerifySchema;
