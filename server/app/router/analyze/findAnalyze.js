const Router = require('koa-router');
const router = new Router();
import select from '../../dao/select';

router.get('/getAnalyze', async ctx => {
  const { query } = ctx.request;
  const [res] = await select('snippet', query);
  if (res.length) {
    return ctx.ok({ error: false, msg: res[0] });
  }
  return ctx.notFound({ error: true, errCode: 1009 });
});

router.get('/getAllAnalyze', async ctx => {
  const [res] = await select('snippet');
  return ctx.ok({ error: false, msg: res });
});

router.get('/selectAnalyze', async ctx => {
  const { query } = ctx.request;
  const [res] = await select('snippet', query, true);
  return ctx.ok({ error: false, msg: res });
});

module.exports = router;
