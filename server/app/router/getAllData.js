const Router = require('koa-router');
const router = new Router();
import select from '../dao/select';

router.get('/getAllConsum', async ctx => {
  const [res] = await select('consum');
  return ctx.ok({ error: false, msg: res });
});

router.get('/getAllScreenshot', async ctx => {
  const [res] = await select('screenshot');
  return ctx.ok({ error: false, msg: res });
});

module.exports = router;
