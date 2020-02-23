const pug = require('pug');

// 生成邮件模板的方法
function mail_temp(mail_title, mail_content) {
    const compiledFunction = pug.compileFile('assets/mail_template/default.pug');
    return compiledFunction({ title: mail_title, content: mail_content });
}

module.exports = {
    mail_temp
};