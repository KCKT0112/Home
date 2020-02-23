const request = require('request');
const config = require('../config');

function reCAPTCHA(retoken) {
    return new Promise(function (resolve, reject) {
        if (config.recaptcha.use === true) {
            request.post({
                url: 'https://recaptcha.net/recaptcha/api/siteverify', form: {
                    response: retoken,
                    secret: config.recaptcha.secret
                }
            }, function (error, response, body) {
                let data= JSON.parse(body);
                if (data.success === true) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        } else {
            resolve(true);
        }
    });
}

module.exports = {
    reCAPTCHA
};