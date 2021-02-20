const { redisConfig } = require("../config/db")

exports.checkAdmin = (req, res, next) => {
    console.log("检查管理员用户")
    if(req.username == 'admin') {
        let key = req.headers.fapp + ":user:power:" + req.headers.token
        redis.set(key, 'admin')
        next()
    } else {
        res.json(403, "权限不足")
    }
}