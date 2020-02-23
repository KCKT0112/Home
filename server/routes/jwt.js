const expressJwt = require('express-jwt');
const { secretKey, credentialsRequired } = require('../config');

const jwtAuth = expressJwt({
  secret: secretKey,
  credentialsRequired: credentialsRequired,
}).unless({
  path: [
    '/api/site/config',
    '/api/user/login',
    '/api/user/register',
    '/api/user/re_pass_sendemail',
    '/api/user/re_pass_verify',
    '/api/user/profile/id',
    '/api/auth/github/v2/callback',
    '/api/auth/github/v2/login',
    '/api/auth/gitlab/login',
    '/api/auth/gitlab/callback'
  ]
});

module.exports = jwtAuth;