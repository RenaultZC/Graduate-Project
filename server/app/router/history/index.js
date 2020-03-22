const Router = require('koa-router');
const router = new Router();
const addHistory = require('./addHistory');
const deleteHistory = require('./deleteHistory');
const restartHistory = require('./restartHistory');

router.post('/addHistory', addHistory);
router.post('/deleteHistory', deleteHistory);
router.post('/restartHistory', restartHistory);

module.exports = router;
