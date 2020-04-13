import drop from '../../dao/drop';
import update from '../../dao/update';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';

export default async({ name, historyId, snippet, delayTime, email, headless, cronTime }) => {
  await drop('consum', { historyId });
  await drop('screenshot', { historyId });

  const [res] = await update('history', {
    search: {
      id: historyId
    },
    value: {
      startTime: Date.now(),
      status: HISTORY_STATUS.RUNNING,
      snippet,
      cronTime,
      name,
      delayTime,
      email,
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
