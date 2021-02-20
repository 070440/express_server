let redis = require("../util/redisDB")
const {ALLOW_APP} = require('../config/app')
const util = require('./common')
exports.checkApp = (req, res, next) => {
    console.log(req.headers)
    if(!ALLOW_APP.includes(req.headers.fapp)) {
        res.json(util.getReturnData(500,"来源不正确"))
    }
    else {
        next()
    }
}

exports.checkUser = (req, res, next) => {
    console.log("检测用户登录情况")
    if('token' in req.headers) {
        let key = req.headers.fapp + ":user:token:" + req.headers.token
        redis.get(key).then((data) => {
            if(data) {
                req.username = data.username
                next()
            } else {
                res.json(util.getReturnData(403, "登录已过期，请重新登录"))
            }
        })
    } else {
        res.json(util.getReturnData(403, "请登录"))
    }
}