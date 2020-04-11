import insert from '../../dao/insert';
import update from '../../dao/update';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';


module.exports = async ctx => {
  const { snippetId, name, headless, snippet, cronTime } = ctx.request.body;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  const startTime =  Date.now();
  console.log(ctx.request.body);
  return;
  const [res] = await insert('history', {
    userId: ctx.session.id,
    snippetId,
    startTime,
    status: HISTORY_STATUS.RUNNING,
    name,
    snippet,
    cronTime,
    endTime: '',
    successTemp: -1,
    failTemp: -1,
    analyzeFile: '',
    analyzeData: '',
  });
  if (res.affectedRows) {
    const historyId = res.insertId;
    new Promise(() => runAnalyze(snippet, historyId, headless))
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
      });
    return ctx.ok({
      error: false,
      msg: '执行成功'
    });
  }
  return ctx.notFound({ error: true, errCode: 1007 });
};
