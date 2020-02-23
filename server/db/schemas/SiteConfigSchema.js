const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//创建Schema
const SiteConfigSchema = new Schema({
    tags: Object
});
module.exports = SiteConfigSchema;