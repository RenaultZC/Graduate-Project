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
    createTime: startTime,
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
    new Promise((resolve, reject) => {
      try {
        runAnalyze(snippet, historyId, headless, delayTime, name, email).then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
      } catch (e) {
        reject(e);
      }
    })
      .then(async res => {
        res.endTime = Date.now();
        console.log('success', historyId);
        await update('history', {
          search: {
            id: historyId
          },
          value: res
        });
      }, async() => {
        console.log('fialed', historyId);
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
