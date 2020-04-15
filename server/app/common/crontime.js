import cron from 'node-cron';
import { makePromiseForQuery } from '../dao/common';
import restartAnalyze from '../router/history/restartAnalyze';

class Corn {
  constructor() {
    this.cronList = new Map();
  }

  init() {
    const query = 'SELECT * FROM history WHERE cronTime IS NOT NULL';
    makePromiseForQuery(query).then(([res]) => {
      if (!res.length) return;
      res.forEach(v => {
        this.start(v.id, v.cronTime, v);
      });
    });
  }

  start(id, cronTime, params) {
    if (this.cronList.has(id)) this.stop(id);
    if (!cronTime) return;
    this.cronList.set(id, cron.schedule(cronTime, () => {
      restartAnalyze(params);
    }));
  }

  stop(id) {
    if (!this.cronList.has(id)) return;
    this.cronList.get(id).destroy();
    this.cronList.delete(id);
  }
}

const CronClass = new Corn();

export default CronClass;
