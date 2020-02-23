const mongoose = require('mongoose');
const SiteConfigSchema = require('../schemas/SiteConfigSchema');
//创建model，这个地方的user对应mongodb数据库中users的conllection。
const SiteConfig = mongoose.model('SiteConfig', SiteConfigSchema);
module.exports = SiteConfig;