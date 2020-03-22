const Router = require('koa-router');
const router = new Router();
import select from '../../dao/select';
import { makePromiseForQuery } from '../../dao/common';

router.get('/getHistory', async ctx => {
  const { query } = ctx.request;
  const historyId = query.id;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const [res] = await select('history', query);
  if (res.length) {
    const [snippetRes] = await select('snippet', { id: res[0].snippetId });
    if (snippetRes.length) return ctx.notFound({ error: true, errCode: 1010 });

    const [consumRes] = await select('consum', { historyId });
    if (consumRes.length) return ctx.notFound({ error: true, errCode: 1010 });

    const [screenshotRes] = await select('screenshot', { historyId });
    if (consumRes.length) return ctx.notFound({ error: true, errCode: 1010 });

    res.consumData = consumRes;
    res.snippetData = snippetRes[0];
    res.screenshotData = screenshotRes;
    return ctx.ok({ error: false, msg: res });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
});

router.get('/getAllHistory', async ctx => {
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const query = `SELECT from snippet,history WHERE history=${ctx.session.id}`;
  const [res] = await makePromiseForQuery();
  if (res.length) {
    return ctx.ok({ error: false, msg: res });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
});

router.get('/selectUser', async ctx => {
  const { query } = ctx.request;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const [res] = await select('user', query, true);
  if (res.length) {
    return ctx.ok({ error: false, msg: res });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
});

module.exports = router;
