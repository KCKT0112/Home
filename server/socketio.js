const { secretKey } = require('./config');
const User = require('./db/models/UserModel'); // 引入模型
const Msg = require('./db/models/StateMsgModel'); // 引入模型

// socketio.js
var socketio = {};
var socket_io = require('socket.io');

const jwt = require('jsonwebtoken');

//获取io
socketio.getSocketio = function (server) {
    var io = socket_io.listen(server);

    //获取io  
    //有新的客户端连接时触发
    io.on('connection', function (socket) {

        socket.on('state', function (data) {
            setInterval(function () {
                if (data) {
                    jwt.verify(data, secretKey, function (err, decoded) {
                        if (err) {
                            // todo
                        } else
                            if (decoded) {
                                User.updateOne({ _id: decoded.id }, { $set: { last_online: Math.round(new Date() / 1000) } }, { new: true });
                                Msg.find({ msg_master: decoded.id, msg_read: false }, (err, data) => {
                                    var noread;
                                    if (!err) {
                                        if (data.length > 0) {
                                            noread = true;
                                        } else {
                                            noread = false;
                                        }
                                        socket.emit('state', {
                                            data: {
                                                success: true,
                                                noread: noread,
                                                num: data.length
                                            }
                                        });
                                    }
                                });
                            }
                    });
                }
            }, 1000);
        });

        //发生错误时触发
        socket.on('error', function (err) {
            console.log(err);
        });

        // 断开触发
        socket.on('disconnect', function () {

        });

    });
};

module.exports = socketio;