import drop from '../../dao/drop';
import update from '../../dao/update';
import select from '../../dao/select';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';

module.exports = async ctx => {
  const { snippetId, historyId, headless } = ctx.request.query;
  if (!ctx.session.id)
    return ctx.unauthorized({ error: true, errCode: 1003 });

  await drop('consum', { historyId });
  await drop('screenshot', { historyId });

  let [res] = await select('snippet', { id: snippetId });
  const { snippet } = res[0];
  [res] = await update('history', {
    search: {
      id: historyId
    },
    value: {
      startTime: Date.now(),
      status: HISTORY_STATUS.RUNNING,
      endTime: '',
      successTemp: -1,
      failTemp: -1,
      analyzeFile: '',
      analyzeData: '',
    }
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
