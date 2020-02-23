const express = require('express');
const Other = require('../../helpers/Other');
const ReqUser = require('../../helpers/ReqUser');

const router = express.Router();

// 拦截请求验证用户权限
router.use(function (req, response, next) {
    // console.log(req);
    ReqUser.finduser({ _id: req.user.id })
        .then(function (obj) {
            if (obj.data[0].usertype === 0) {
                let data = Other.callback(-1, false, '无权限访问');
                response.json({
                    data
                });
            } else {
                next();
            }
        });
});

router.get('/userlist', (req, res) => {
    let page = req.query.page ? req.query.page : 0;
    ReqUser.finduserpage(page).then(function (data) {
        res.json({
            data
        });
    });
});

// router.post('/', (req, res) => {

// });

module.exports = router;