const Router = require('koa-router');
const router = new Router();
const addUser = require('./addUser');
const findUser = require('./findUser');
const deleteUser = require('./deleteUser');
const login = require('./login');
const changeUser = require('./changeUser');
const uploadAvatar = require('./uploadAvatar');

router.post('/addUser', addUser);
router.post('/changeUser', changeUser);
router.post('/deleteUser', deleteUser);
router.post('/login', login);
router.post('/uploadAvatar', uploadAvatar);
router.get('/loginOut', ctx => {
  ctx.session = null;
  return ctx.ok({ error: false, msg: '成功退出登录' });
});
router.use('/findUser', findUser.routes(), findUser.allowedMethods());

module.exports = router;
