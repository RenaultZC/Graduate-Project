import drop from '../../dao/drop';
import update from '../../dao/update';
import select from '../../dao/select';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';

export default async({ historyId, snippetId, headless }) => {
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
    return true;
  }
  return false;
};
