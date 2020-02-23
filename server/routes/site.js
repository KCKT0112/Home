const express = require('express');

const router = express.Router();

const SiteConfig = require('../db/models/SiteConfigModel');

router.get('/config', (req, res) => {
    SiteConfig.find({}, { _id: 0, __v: 0 }, (err, data) => {
        res.json({
            code: 0,
            success: true,
            message: "拉取成功",
            data
        });
    });
});

module.exports = router;