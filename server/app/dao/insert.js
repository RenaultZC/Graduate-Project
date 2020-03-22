import { makePromiseForExecute, getKeyOrValueString } from './common';

/**
 * @method create
 * @param {Object} params 参数
 * @param {String} table 表名
 * @return {Promise} 更新结果
 */
export default async(table, params) => {
  const query = `INSERT
    INTO ${table} (${getKeyOrValueString(params)})
    VALUES (${getKeyOrValueString(params, true)})`;
  return makePromiseForExecute(query);
};
