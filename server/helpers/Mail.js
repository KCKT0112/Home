const mailgun = require("mailgun-js");
const nodemailer = require("nodemailer");
const { mail_temp } = require('./EmailTemp');
const config = require('../config');

function sendmail(to, title, content) {
    if (config.MailSendModel === 'none' || config.MailSendModel == null) {
        console.log('未配置Mail参数，无法发送邮件');
    }

    if (config.MailSendModel === 'mailgun') {
        return new Promise(function (resolve, reject) {
            if (to && title && content) {
                const data = {
                    from: config.mailgun.from,
                    to: to,
                    subject: title,
                    html: mail_temp(title, content)
                };
                if (config.mailgun.apikey && config.mailgun.domain && config.mailgun.from) {
                    const mg = mailgun({ apiKey: config.mailgun.apikey, domain: config.mailgun.domain });
                    mg.messages().send(data, function (error, body) {
                        if (!error) {
                            console.log(body);
                            resolve(true);
                        } else {
                            console.log(error);
                            console.log(html);
                            resolve(false);
                        }
                    });
                } else {
                    console.log('邮件参数设置有误');
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    }

    if (config.MailSendModel === 'smtp') {
        return new Promise(function (resolve, reject) {

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: config.smtp.host,
                port: config.smtp.port,
                secure: config.smtp.secure, // true for 465, false for other ports
                auth: {
                    user: config.smtp.user, // generated ethereal user
                    pass: config.smtp.password // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = transporter.sendMail({
                from: config.smtp.from, // sender address
                to: to, // list of receivers
                subject: title, // Subject line
                html: mail_temp(title, content) // html body
            });

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    //return console.log(error);
                    resolve(false);
                } else {
                    resolve(true);
                }

                //console.log('Message sent: %s', info.messageId);
                // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
            });
        });
    }
}

module.exports = {
    sendmail
};