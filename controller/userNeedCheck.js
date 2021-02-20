let redis = require('../util/redisDB')
const util = require('../util/common')
let bodyParser = require('body-parser')
const crypto = require('crypto');
const { getReturnData } = require('../util/common');


exports.articleTalk = (req, res, next) => {
    console.log(req.body)
    if('a_id' in req.body && 'talk' in req.body) {
        let talk = {talk: req.body.talk, time: Date.now(), username: req.username}
        let key = req.headers.fapp + ':article:' + req.body.a_id + ':talk'
        redis.get(key).then((data) => {
            let tData = []
            if(data) {
                tData = data
            } else {
                tData.push(talk)
            }
            redis.set(key, tData)
            res.json(util.getReturnData(0, '评论成功'))
        })
    } else {
        res.json(util.getReturnData(1, '评论错误',1))
    }
}

exports.getUserInfo = (req, res, next) => {
    redis.get(req.headers.fapp + ":user:info:" + req.params.username).then((data) => {
        if(data) {
            if(req.params.username == req.username) {
                delete data.password
            } else {
                delete data.phone
                delete data.password
            }
            res.json(util.getReturnData(0, '', data))
        } else {
            res.json(util.getReturnData(1,'用户不存在'))
        }
    })
} 

exports.changeUserInfo = (req, res, next) => {
    let key = req.headers.fapp + ":user:info:" + req.username
    redis.get(key).then((data) => {
        if(data) {
            let userData = {
            username: req.username,
            phone: 'phone' in req.body ? req.body.phone : data.phone,
            nickname: 'nickname' in req.body ? req.body.nickname : data.nickname,
            age: 'age' in req.body ? req.body.age : data.age,
            sex: 'phone' in req.body ? req.body.sex : data.sex,
            password: 'password' in req.body ? req.body.password : data.password,
            login: data.login
            }
            redis.set(key, userData)
            res.json(util.getReturnData(0, '修改成功'))
        } else {
            res.json(util.getReturnData(1, '修改失败'))
        }
    })
}

exports.sendMail = (req, res, next) => {
    let checkKey = req.headers.fapp + ":user:info:" + req.params.username
    redis.get(checkKey).then((user) => {
        if(user && req.body.text) {
            let userKey1 = req.headers.fapp + ":user:" + req.username + ':mail'
            let userKey2 = req.headers.fapp + ":user:" + req.params.username + ":mail"
            let mailKey = req.headers.fapp + ":mail:"
            redis.get(userKey1).then((mail) => {
                if(!mail) mail = []
                let has = false
                for(let i = 0; i < mail.length; i++) {
                    if(mail[i].users.indexOf(req.params.username) > -1) {
                        has = true
                        mailKey = mailKey + mail[i].m_id
                        redis.get(mailKey).then((mailData = []) => {
                            mailData.push({text: req.body.text, time: Date.now(), read: []})
                            redis.set(mailKey, mailData)
                            res.json(util.getReturnData(0, '发送私信成功'))
                            next()
                        })
                    }
                }
                if(!has) {
                    redis.incr(mailKey).then((m_id) => {
                        mailKey = mailKey + m_id
                        redis.set(mailKey, [{text: req.body.text, time: Date.now(), read: []}])
                        console.log({users: [req.params.username]})
                        mail.push({m_id: m_id, users: [req.username, req.params.username]})
                        redis.set(userKey1, mail)
                        redis.get(userKey2).then((mail2) => {
                            if(!mail2) mail2 = []
                            mail2.push({m_id: m_id, users: [req.username, req.params.username]})
                            redis.set(userKey2, mail2)
                            res.json(util.getReturnData(0,'发送私信成功'))
                        })
                    })
                }
            })
        } else {
            res.json(util.getReturnData(1, '用户不存在,发送失败'))
        }
    })
}

exports.getMails = (req, res, next) => {
    let userKey1 = req.headers.fapp + ":user:" + req.username + ":mail"
    redis.get(userKey1).then((mail) => {
        res.json(getReturnData(0, '', mail))
    })
}

exports.getUserMail = (req, res, next) => {
    let userKey1 = req.headers.fapp + ":user:" + req.username + ":mail"
    let rData = {}
    redis.get(userKey1).then((mail) => {
        if(!mail) res.json(util.getReturnData(0, '', []))
        let has = false
        for(let i = 0; i < mail.length; i++) {
            if(mail[i].m_id == req.params.id) {
            has = true
            mail[i].users.splice(mail[i].users.indexOf(req.username), 1)
            rData.toUser = mail[i].users[0]
            let key = req.headers.fapp + ":mail:" + req.params.id
            redis.get(key).then((data) => {
                console.log(data)
                if(data[data.length - 1].read.indexOf(req.username) < 0)
                {
                    data[data.length - 1].read.push(req.username)
                }
                rData.mail = data
                redis.set(key, data)
                res.json(util.getReturnData(0, '', rData))
                next()
            })
            break;
        }
        }
        if(!has) {
            res.json(util.getReturnData(1, '请求错误'))
        }
    })
}

exports.getArticleType = (req, res, next) => {
    redis.get("book:a_type").then((data) => {
        res.json(util.getReturnData(0, '', data))
    })
}

exports.articleLike = (req, res, next) => {
    let member = req.headers.fapp + ":article:" + req.params.id
    let like = req.params.id
    if(like == 0) {
        redis.zincrby(req.headers.fapp + "a_like", member)
    } else {
        
    }
}