const Router = require('koa-router');
const router = new Router();
const addAnalyze = require('./addAnalyze');
const deleteAnalyze = require('./deleteAnalyze');
const changeAnalyze = require('./changeAnalyze');
const findAnalyze = require('./findAnalyze');

router.post('/addAnalyze', addAnalyze);
router.post('/deleteAnalyze', deleteAnalyze);
router.post('/changeAnalyze', changeAnalyze);
router.use('/findAnalyze', findAnalyze.routes(), findAnalyze.allowedMethods());

module.exports = router;
