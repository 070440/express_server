let express = require('express')
let router = express.Router();
let {setArticle,showArticle,setArticleType,getAllUser,stopLogin,setIndexPic,setNavMenu,setFooter,setFooter} = require('../controller/admin')
let {setNavMenu} = require('../controller/getData')

router.post('/changeNav', setNavMenu);
router.post('/setArticle',setArticle);
router.post('/showArticle', showArticle);
router.post('/setArticleType', setArticleType);
router.get('/getAllUser', getAllUser);
router.get('/stopLogin/:id', stopLogin);
router.post('/setIndexPic', setIndexPic);
router.post('/changeNav', setNavMenu);
router.post('/setFooter', setFooter);
router.post('/setLinks', setLinks)

module.exports = router;