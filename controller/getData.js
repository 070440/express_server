let redis = require('../util/redisDB')
const util = require('../util/common')
const crypto = require('crypto');
const { log } = require('console');
exports.getNavMenu = (req, res, next) => {
    let key = req.headers.fapp + ':nav_menu'
    redis.get(key).then((data) => {
        console.log(data)
        res.json(util.getReturnData(0, '', data))
    })
}

exports.setNavMenu = (req, res, next) => {
    let key = req.headers.fapp + ":nav_menu"
    let data = req.body.nav_menu
    console.log(data)
    redis.set(key, data)
    res.json(util.getReturnData(0, '修改成功'))
}

exports.getFooter = (req, res, next) => {
    let key = req.headers.fapp + ":footer"
    redis.get(key).then((data) => {
        console.log(data)
        res.json(util.getReturnData(0, '', data))
    })
}

exports.getLinks = (req, res, next) => {
    let key = req.headers.fapp + ":links"
    redis.get(key).then((data) => {
        console.log(data)
        res.json(util.getReturnData(0, '', data))
    })
}

exports.getIndexPic = (req, res, next) => {
    let key = req.headers.fapp + ":indexPic"
    redis.get(key).then((data) => {
        console.log(data)
        res.json(util.getReturnData(0, '', data))
    })
}


exports.getHotArticle = (req, res, next) => {
    let key = req.headers.fapp + ":a_view"
    redis.zrevrange(key, 0, 4).then(async (data) => {
        console.log(data)
        let result = data.map((item) => {
            return redis.get(item.number).then((data1) => {
                console.log(data1)
                if(data1 && data1.show != 0) {
                    return {
                        'title': data1.title,
                        'date': util.getLocalDate(data1.time),
                        'id': data1.a_id,
                        'view': item.score
                    }
                } else {
                    return {'title': '文章暂未上线', 'date': '', 'id': 0}
                }
            })
        })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0, '', t_data))
    })
}

exports.getNewArticle = (req, res, next) => {
    let key = req.headers.fapp + ":a_time"
    console.log(key)
    redis.zrevrange(key, 0, -1).then(async(data) => {
        console.log(data)
        let result = data.map((item) => {
            return redis.get(item.member).then((data1) => {
                console.log(data1)
                if(data1 && data1.show != 0) {
                    return {'title': data1.title, 'date': util.getLocalDate(item.score), 'id': data1.a_id}
                } else {
                    return {'title': '文章暂未上线', 'date': '', 'id': 0}
                }
            })
        })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0, '', t_data))
    })
}


exports.getArticle = (req, res, next) => {
    let key = req.headers.fapp + ":article:" + req.params.id
    redis.get(key).then((data) => {
        if(data) {
            if(data.show == 1) {
                redis.get(req.headers.fapp + ":a_type").then((type) => {
                    type.map((item) => {
                        if(item.uid == data.type) {
                            data.typename = item.name
                        }
                    })
                    redis.zscore(req.headers.fapp + ":a_view", key).then((view) => {
                        console.log(view)
                        data.view = view
                        redis.zscore(req.headers.fapp + ":a_like", key).then((like) => {
                            data.like = like
                            res.json(util.getReturnData(0, 'success', data))
                        })
                    })
                })
            } else {
                res.json(util.getReturnData(403, '该文章已经被删除或者不存在'))
            }
        } else {
            res.json(util.getReturnData(404, '该文章已经被删除或者不存在'))
        }
    })
}

exports.getArticleTalk = (req, res, next) => {
    let key = req.headers.fapp + ":article" + req.params.id + ":talk"
    redis.get(key).then((data) => {
        res.json(util.getReturnData(0, 'success', data))
    })
}



exports.getArticles = (req, res, next) => {
    let key = req.headers.fapp
    if('tag' in req.body) {
        let tKeyMd5 = crypto.createHash('md5').update(req.body.tag).digest("hex")
        key = key + ":tag:" + tKeyMd5
        console.log(key)
    }
    else if('type' in req.body) {
        key = key + ':a_type:' + req.body.type
        console.log(key)
    } else {
        res.json(util.getReturnData(1, '数据参数错误'))
        return 
    }
    redis.get(key).then(async (data) => {
        console.log(data)
        let result = data.map((item) => {
            return redis.get(item).then((data1) => {
                console.log(data1)
                if(data1 && data1.show != 0) {
                    return {'title': data1.title, 'date': util.getLocalDate(data1.time), 'id': data1.a_id}
                } else {
                    return {'title': '文章暂未上线', 'date': '', 'id': 0}
                }
            })
        })
        let t_data = await Promise.all(result)
        res.json(util.getReturnData(0, '', t_data))
    })
} 

exports.viewArticle = (req, res, next) => {
    let key = req.headers.fapp + ":article:" + req.params.id
    redis.zincrby(req.headers.fapp + ":a_view", key)
    res.json(util.getReturnData(0, 'success',))
}


exports.getNewArticle = (req, res, next) => {
    let key = req.headers.fapp + ":a_time"
    let isAdmin = false
    console.log(key);
    if('token' in req.headers) {
        let pKey = req.headers.fapp + ":user:power:" + req.headers.token
        redis.get(pKey).then((power) => {
            if(power == 'admin') {
                redis.zrevrange(key, 0, -1).then(async (data) => {
                    let result = data.map((item) => {
                        return redis.get(item.number).then((data1) => {
                            console.log(data1)
                            if(data1) {
                                return {
                                    'title': data1.title,
                                    'date': util.getLocalDate(item.score),
                                    'id': data1.a_id,
                                    'show': data1.show
                                }
                            }
                        })
                    })
                    let t_data = await Promise.all(result)
                    console.log(t_data);
                    res.json(util.getReturnData(0, '', t_data))
                })
            } else {
                res.json(util.getReturnData(1, '其他权限'))
            }
        })
    } else {
        redis.zrevrange(key, 0, -1).then(async (data) => {
            console.log(data);
            let result = data.map((item) => {
                return redis.get(item.member).then((data1) => {
                    if(data1 && data1.show != 0) {
                        return {
                            'title': data1.title,
                            'date': util.getLocalDate(item.score),
                            'id': data1.a_id
                    }
    
                    } 
                    else {
                        return {'title': '文章暂未上线', 'date': '', 'id': 0}
                    }
                })
            })
            let t_data = await Promise.all(result)
            res.json(util.getReturnData(0, '', t_data))
        })
    }
}