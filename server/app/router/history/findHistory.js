const Router = require('koa-router');
const router = new Router();
import select from '../../dao/select';

router.get('/getHistory', async ctx => {
  const { query } = ctx.request;
  const historyId = query.id;
  let [res] = await select('history', query);
  if (res.length) {
    res = res[0];
    const [consumRes] = await select('consum', { historyId });
    const [screenshotRes] = await select('screenshot', { historyId });
    const [user] = await select('user', { id: res.userId });
    const [snippet] = await select('snippet', { id: res.snippetId });
    res.consumData = consumRes[0];
    res.screenshotData = screenshotRes[0];
    res.userData = {
      email: user[0].email,
      username: user[0].username,
      type: user[0].type,
      avatar: user[0].avatar,
      id: user[0].id
    };
    res.snippetName = snippet[0].name;
    return ctx.ok({ error: false, msg: res });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
});

router.get('/getAllHistory', async ctx => {
  const [res] = await select('history');
  return ctx.ok({ error: false, msg: res });
});

router.get('/selectHistory', async ctx => {
  const { query } = ctx.request;
  const [res] = await select('history', query, true);
  return ctx.ok({ error: false, msg: res });
});

router.get('/selectUserHistory', async ctx => {
  const { query } = ctx.request;
  const [res] = await select('history', query);
  return ctx.ok({ error: false, msg: res });
});

module.exports = router;
