const express = require('express');
const { body, oneOf, validationResult } = require('express-validator');
const User = require('../../db/models/UserModel'); // 引入模型
const Msg = require('../../db/models/StateMsgModel'); // 引入模型

const router = express.Router();

/**
 * @api {post} /api/statemsg/state UpdateOnlineState And Callback MsgList
 * @apiDescription State
 * @apiName Online State And Msg List
 * @apiGroup User
 * @apiParam {string} Token
 * @apiParam {number} Page
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.get('/state', (req, res) => {
    User.updateOne({ _id: req.user.id }, { $set: { last_online: Math.round(new Date() / 1000) } }, { new: true });
    Msg.find({ msg_master: req.user.id, msg_read: false }, (err, data) => {
        var noread;
        if (!err) {
            if (data.length > 0) {
                noread = true;
            } else {
                noread = false;
            }
            res.send({
                code: 0,
                message: '拉取信息成功',
                data: {
                    success: true,
                    noread: noread,
                    num: data.length
                }
            });
        } else {
            res.json({
                code: -1,
                message: '拉取信息失败',
                data: {
                    success: false
                }
            });
        }
    })
        .sort({ '_id': -1 })
        .skip(req.query.page * 5)
        .limit(5);
});

/**
 * @api {post} /api/statemsg/msg Get Msg Content
 * @apiDescription Msg Content
 * @apiName Msg Content
 * @apiGroup User
 * @apiParam {string} Token
 * @apiParam {string} MsgID
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.get('/msg', (req, res) => {
    Msg.findOne({ _id: req.query.msgid }, (err, data) => {
        if (!err) {
            Msg.updateOne({ _id: data._id, msg_master: req.user.id }, { $set: { msg_read: true } }, { new: true }, function (err, fb) {
                res.json({
                    code: 0,
                    message: 'OK',
                    data
                });
            });
        } else {
            res.json({
                code: -1,
                message: 'Error'
            });
        }
    });
});

/**
 * @api {post} /api/statemsg/msg/list Get Msg List
 * @apiDescription Get Msg List
 * @apiName Msg List
 * @apiGroup User
 * @apiParam {string} Token
 * @apiParam {number} Page
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.get('/msg/list', (req, res) => {
    Msg.find({ msg_master: req.user.id }, (err, data) => {
        Msg.find({ msg_master: req.user.id }, (err, obj) => {
            if (!err) {
                res.json({
                    code: 0,
                    message: '信息拉取成功',
                    maxpage: Math.ceil(obj.length / 10),
                    data
                });
            } else {
                res.json({
                    code: -1,
                    message: '信息拉取失败'
                });
            }
        });
    })
        .sort({ '_id': -1 })
        .skip(req.query.page * 10)
        .limit(10);
});

/**
 * @api {post} /api/statemsg/read_msg Modify Msg ReadSatate
 * @apiDescription Modify Msg State
 * @apiName Modify Msg State
 * @apiGroup User
 * @apiParam {string} Token
 * @apiParam {string} MsgID If Type = All Unwanted this Param
 * @apiParam {string} Type One or All
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.post('/read_msg', (req, res) => {
    if (req.body.type === 'one' && !req.body.type) {
        Msg.updateOne({ msg_master: req.user.id }, { $set: { msg_read: true } }, { new: true }, function (err, data) {
            if (!err) {
                res.json({
                    code: 0,
                    message: 'OK'
                });
            } else {
                res.json({
                    code: -1,
                    message: 'Error'
                });
            }
        });
    }
    if (req.body.type === 'all') {
        Msg.updateMany({ msg_master: req.user.id, msg_read: false }, { $set: { msg_read: true } }, { new: true }, function (err, data) {
            if (!err) {
                res.json({
                    code: 0,
                    message: 'OK'
                });
            } else {
                res.json({
                    code: -1,
                    message: 'Error'
                });
            }
        });
    }
});

/**
 * @api {post} /api/statemsg/msg/list Remove Msg
 * @apiDescription Remove Msg
 * @apiName Remove Msg
 * @apiGroup User
 * @apiParam {string} Token
 * @apiParam {number} Page
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
router.post('/msg/remove', (req, res) => {
    Msg.findByIdAndRemove({ _id: req.body.msgid, msg_master: req.user.id }, (err, data) => {
        if (!err) {
            res.json({
                code: 0,
                message: '删除成功',
                data
            });
        } else {
            res.json({
                code: -1,
                message: '删除失败'
            });
        }
    });
});

module.exports = router;