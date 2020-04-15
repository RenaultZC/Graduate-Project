import insert from '../../dao/insert';
import update from '../../dao/update';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';
import Cron from '../../common/crontime';


module.exports = async ctx => {
  const { snippetId, name, headless, snippet, cronTime, delayTime, email } = ctx.request.body;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const startTime =  Date.now();
  const [res] = await insert('history', {
    userId: ctx.session.id,
    snippetId,
    startTime,
    status: HISTORY_STATUS.RUNNING,
    name,
    snippet,
    cronTime,
    delayTime,
    email,
    endTime: '',
    successTemp: 0,
    failTemp: 0,
    analyzeFile: '',
    analyzeData: '',
  });
  if (res.affectedRows) {
    const historyId = res.insertId;
    new Promise(() => runAnalyze(snippet, historyId, headless, delayTime))
      .then(async res => {
        res.endTime = Date.now();
        res.status = HISTORY_STATUS.SUCCESS;
        await update('history', {
          search: {
            id: historyId
          },
          value: res
        });
      }, async() => {
        await update('history', {
          search: {
            id: historyId
          },
          value: {
            endTime: Date.now(),
            status: HISTORY_STATUS.FAILED
          }
        });
      }).finally(() => {
        if (cronTime) {
          Cron.start(historyId, cronTime, { name, headless, snippet, cronTime, delayTime, email, historyId });
        }
      });
    return ctx.ok({
      error: false,
      msg: '执行成功'
    });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
