const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('@koa/cors');
const koaBody = require('koa-body');
const env = require('./config/env');
const analyze = require('./router/analyze');
const user = require('./router/user');
const history = require('./router/history');
const session = require('koa-session');
const respond = require('koa-respond');
import Cron from './common/crontime';

const CONFIG = {
  key: 'SESSION',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

const app = new Koa();
const router = new Router();

app.keys = ['HASH123'];
app.use(session(CONFIG, app));
app.use(Cors({
  credentials: true,
}));
app.use(koaBody());
app.use(respond());

router.use('/analyze', analyze.routes(), analyze.allowedMethods());
router.use('/history', history.routes(), history.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());
Cron.init();

app.use(router.routes(), router.allowedMethods());

const port = 1000;

app.listen(env.port, () => {
  console.log(`API server started on ${port}`);
});
