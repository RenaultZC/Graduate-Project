const Router = require('koa-router');
const router = new Router();
const addUser = require('./addUser');
const findUser = require('./findUser');
const deleteUser = require('./deleteUser');
const login = require('./login');
const changeUser = require('./changeUser');

router.post('/addUser', addUser);
router.post('/changeUser', changeUser);
router.post('/deleteUser', deleteUser);
router.post('/login', login);
router.use('/findUser', findUser.routes(), findUser.allowedMethods());

module.exports = router;
