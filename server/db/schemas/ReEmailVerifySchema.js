const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const ReEmailVerifySchema = new Schema({
  email: String,
  newemail: String,
  code: String,
});
module.exports = ReEmailVerifySchema;
