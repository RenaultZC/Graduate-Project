import { makePromiseForQuery, getParamsString, getKeyOrValueString } from './common';

/**
 * @method find
 * @param {Object} params 参数
 * @param {String} table 表名
 * @param {boolean} flag 是否模糊查询
 * @return {Promise} 更新结果
 */
export default async(table, params, flag) => {
  let query = `SELECT *
    from ${table}`;
  if (params) {
    query = `SELECT *
      from ${table}
      WHERE ${getParamsString(params)}`;
  }
  if (flag) {
    query = `SELECT *
    from ${table}
    WHERE ${getKeyOrValueString(params)} like '%${getKeyOrValueString(params, true, true)}%'`;
  }
  return makePromiseForQuery(query);
};
