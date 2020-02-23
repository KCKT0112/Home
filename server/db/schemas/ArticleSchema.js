const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const ArticleSchema = new Schema({
    masterid: String,
    title: String,
    tag: Object,
    content: String,
});
module.exports = ArticleSchema;