let express = require('express')
let router = express.Router()
let {articleTalk,getUserInfo,changeUserInfo,sendMail,getMails,getUserMail,getArticleType,articleLike} = require('../controller/userNeedCheck')

router.post('/article/talk', articleTalk)
router.get('/info/:username', getUserInfo)
router.post('/changeInfo', changeUserInfo)
router.post('/mail/:username', sendMail)
router.get('/mailsGet', getMails)
router.get('/mailsGet/:id', getUserMail)
router.get('/getArticleType', getArticleType)
router.get('/like/:id/:like', articleLike)

module.exports = router;