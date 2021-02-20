var express = require('express');
var router = express.Router();
var {getNavMenu,getFooter,getLinks,getIndexPic,getHotArticle,getNewArticle,getArticle,getArticleTalk, viewArticle,getArticles} = require('../controller/getData')
const util = require('../util/common')

/* GET home page. */
router.get('/getFooter', function(req, res, next) {
  res.json(util.getReturnData(0, 'success'));
});

router.get('/getNavMenu', getNavMenu);
router.get('/getFooter', getFooter);
router.get('/getLinks',getLinks);
router.get('/getIndexPic',getIndexPic);
router.get('/getHotArticle',getHotArticle);
router.get('/getNewArticle',getNewArticle);
router.get('/getArticle/:id',getArticle);
router.get('/getArticleTalk/:id',getArticleTalk);
router.post('/getArticles',getArticles);
router.get('/viewArticle/:id', viewArticle);


module.exports = router;
