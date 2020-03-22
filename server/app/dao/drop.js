import { makePromiseForExecute, getParamsString } from './common';

/**
 * @method delete
 * @param {Object} params 参数
 * @param {String} table 表名
 * @return {Promise} 更新结果
 */
export default async(table, params) => {
  const query = `DELETE
    from ${table}
    WHERE ${getParamsString(params)}`;
  return makePromiseForExecute(query);
};
