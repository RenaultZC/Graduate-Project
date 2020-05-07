import drop from '../../dao/drop';
import update from '../../dao/update';
import runAnalyze from './runAnalyze';
import { HISTORY_STATUS } from '../../config/common';
import Cron from '../../common/crontime';

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
      successTemp: 0,
      failTemp: 0,
      analyzeFile: '',
      analyzeData: '',
    }
  });
  if (res.affectedRows) {
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
        console.log('success', historyId);
        res.endTime = Date.now();
        await update('history', {
          search: {
            id: historyId
          },
          value: res
        });
      }, async(e) => {
        console.log('failed', historyId, e);
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
        } else {
          Cron.stop(historyId);
        }
      });
    return true;
  }
  return false;
};
