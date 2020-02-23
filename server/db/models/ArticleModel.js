const mongoose = require('mongoose');
const ArticleSchema = require('../schemas/ArticleSchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;