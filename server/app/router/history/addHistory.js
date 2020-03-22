import insert from '../../dao/insert';
import select from '../../dao/select';
import update from '../../dao/update';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';


module.exports = async ctx => {
  const { snippetId, name, headless } = ctx.request.query;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });
  let [res] = await select('snippet', { id: snippetId });
  if (!res.lenght) return ctx.badRequest({ error: true, errCode: 1009 });
  const { snippet } = res[0];
  const startTime =  Date.now();
  [res] = await insert('history', {
    userId: ctx.session.id,
    snippetId,
    startTime,
    status: HISTORY_STATUS.RUNNING,
    name,
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
        await update('history', {
          search: {
            id: historyId
          },
          value: {
            endTime: Date.now(),
            status: HISTORY_STATUS.SUCCESS,
            ...res
          }
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
