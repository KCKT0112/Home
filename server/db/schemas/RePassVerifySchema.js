const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const RePassVerifySchema = new Schema({
  email: String,
  code: String,
});
module.exports = RePassVerifySchema;
