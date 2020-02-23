const express = require('express');
const Article = require('../../db/models/ArticleModel'); // 引入模型
const { callback } = require('../../helpers/Other');

const router = express.Router();

router.post('/Add_Article', (req, res) => {
    let insertObj = {
        masterid: req.user.id,
        title: req.body.title,
        tag: req.body.tag,
        content: req.body.content
    };
    if (!insertObj.title) {
        res.json({
            code: -1,
            success: false,
            message: "标题不能为空"
        });
    } else if (!insertObj.tag) {
        res.json({
            code: -1,
            success: false,
            message: "标签不能为空"
        });
    } else if (!insertObj.content) {
        res.json({
            code: -1,
            success: false,
            message: "内容不能为空"
        });
    } else {
        const newArticle = new Article(insertObj);
        newArticle.save(insertObj, (err, doc) => {
            if (err) {
                console.log(err);
                res.json({
                    code: -1,
                    success: false,
                    message: "发布失败"
                });
            } else {
                res.json({
                    code: 0,
                    success: true,
                    message: "发布成功"
                });
            }
        });
    }
});

module.exports = router;