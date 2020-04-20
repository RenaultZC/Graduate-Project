const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('@koa/cors');
const koaBody = require('koa-body');
const env = require('./config/env');
const analyze = require('./router/analyze');
const user = require('./router/user');
const history = require('./router/history');
const getAllData = require('./router/getAllData');
const session = require('koa-session');
const respond = require('koa-respond');
const koaStatic = require('koa-static');
const send = require('koa-send');
const path = require('path');
import Cron from './common/crontime';

const CONFIG = {
  key: 'SESSION',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: true,
};

const app = new Koa();
const router = new Router();

app.keys = ['HASH123'];

app.use(koaStatic(path.join(__dirname, './static')));

app.use(session(CONFIG, app));
app.use(Cors({
  credentials: true,
}));
app.use(koaBody());
app.use(respond());

router.use('/analyze', analyze.routes(), analyze.allowedMethods());
router.use('/history', history.routes(), history.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
router.use('/getAllData', getAllData.routes(), getAllData.allowedMethods());
router.get('/analyzeFile/file/:name', async(ctx) => {
  const name = ctx.params.name;
  const filePath = `./static/file/${name}`;
  ctx.attachment(filePath);
  await send(ctx, filePath, {
    root: __dirname
  });
});
Cron.init();

app.use(router.routes(), router.allowedMethods());

const port = 1000;

app.listen(env.port, () => {
  console.log(`API server started on ${port}`);
});
