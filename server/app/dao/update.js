import { makePromiseForExecute, getParamsString } from './common';

/**
 * @method update
 * @param {Object} params 参数
 * @param {String} table 表名
 * @return {Promise} 更新结果
 */
export default async(table, params) => {
  const query = `UPDATE ${table}
    SET ${getParamsString(params.value, true)}
    WHERE ${getParamsString(params.search)}`;
  return makePromiseForExecute(query);
};
