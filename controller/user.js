let redis = require('../util/redisDB')
const util = require('../util/common')
const crypto = require("crypto")


exports.userRegister = (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
    let ip = req.ip
    if(username || password) {
        let key = 'book:user:info:' + username
        redis.get(key).then((user) => {
            if(user) {
                res.json(res.json(util.getReturnData(1, '用户已经存在')))
            } else {
                let userData = {
                    phone: 'phone' in req.body ? req.body.phone : '未知',
                    nickname: 'nickname' in req.body ? req.body.nickname : '未知',
                    age: 'age' in req.body ? req.body.age : '未知',
                    sex: 'sex' in req.body ? req.body.sex : '未知',
                    ip: ip,
                    username: username,
                    password: password,
                    login: 0
                }
                redis.set(key, userData)
                res.json(res.json(util.getReturnData(0, '注册成功，请登录')))
            }
        })
    } else {
        res.json(res.json(util.getReturnData(1, '资料不完整')))
    }
}

exports.userLogin = (req, res, next) => {
    let username = req.body.username
    let password = req.body.password
    redis.get(req.headers.fapp + ":user:info:" + username).then((data) => {
        if(data) {
            if(data.login == 0) {
                if(data.password != password) {
                    res.json(util.getReturnData(1, '用户名或密码错误'))
                } else {
                    let token = crypto.createHash('md5').update(Date.now() + username).digest("hex")
                    let tokenKey = req.headers.fapp + ":user:token:" + token
                    delete data.password
                    redis.set(tokenKey, data)
                    redis.expire(tokenKey, 1000)
                    res.json(util.getReturnData(0, '登录成功', {token: token}))
                }
            } else {
                res.json(util.getReturnData(1,'用户被封停'))
            }
        }
        else{
        res.json(util.getReturnData(1, '用户名或密码错误'))
    }
    })
}
