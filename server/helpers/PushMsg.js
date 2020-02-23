const Msg = require('../db/models/StateMsgModel'); // 引入模型

function AddMsg(msg_master, msg_type, msg_sender, msg_title, msg_content) {
    const insertObj = {
        msg_master: msg_master,
        msg_type: msg_type,
        msg_sender: msg_sender,
        msg_title: msg_title,
        msg_content: msg_content,
        msg_read: false,
        msg_addtime: Math.round(new Date() / 1000)
    };
    const newMsg = new Msg(insertObj);
    newMsg.save(insertObj, (err, doc) => {

    });
}

module.exports = {
    AddMsg
};