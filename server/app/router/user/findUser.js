const Router = require('koa-router');
const router = new Router();
import select from '../../dao/select';
import { USER_TYPE } from '../../config/common';

router.get('/getInfo', async ctx => {
  const { query } = ctx.request;
  if (ctx.session.id !== parseInt(query.id, 0))
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const [res] = await select('user', query);
  if (res.length) {
    const { avatar, email, username, type, id } = res[0];
    return ctx.ok({ error: false, msg: {
      avatar,
      email,
      username,
      type,
      id
    } });
  }
  return ctx.notFound({ error: true, errCode: 1004 });
});

router.get('/getAllUser', async ctx => {
  if (ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1006 });
  const [res] = await select('user');
  if (res.length) {
    return ctx.ok({ error: false, msg: res });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
});

router.get('/selectUser', async ctx => {
  const { query } = ctx.request;
  if (ctx.session.type !== USER_TYPE.ADMIN)
    return ctx.unauthorized({ error: true, errCode: 1006 });
  const [res] = await select('user', query, true);
  return ctx.ok({ error: false, msg: res });
});

module.exports = router;
