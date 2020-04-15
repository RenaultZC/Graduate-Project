const Router = require('koa-router');
const router = new Router();
const addHistory = require('./addHistory');
const deleteHistory = require('./deleteHistory');
const restartHistory = require('./restartHistory');
const findHistory = require('./findHistory');

router.post('/addHistory', addHistory);
router.post('/deleteHistory', deleteHistory);
router.post('/restartHistory', restartHistory);
router.use('/findHistory', findHistory.routes(), findHistory.allowedMethods());

module.exports = router;
