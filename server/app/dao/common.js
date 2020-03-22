const lodash = require('lodash');
const mysql = require('mysql2');
const dbConfig = require('../config/db');

let pool;
const getConnectionPool = () => {
  if (pool === undefined) {
    pool = mysql.createPool(lodash.merge({ connectionLimit: 10 }, dbConfig));
    pool = pool.promise();
  }
  return pool;
};

/**
 * @method makePromiseForQuery
 * @param {String} query 查询语句
 * @param {Array} params 查询参数
 * @return {Promise} 查询结果
 */
export const makePromiseForQuery = async(query, params = []) => {
  const connection = getConnectionPool();
  try {
    return await connection.query(query, params);
  } catch (e) {
    console.log(`Execute: ${query}, params: ${params}, error: ${e}`);
    throw e;
  }
};

/**
 * @method makePromiseForExecute
 * @param {String} query 更新语句
 * @param {Array} params 更新参数
 * @return {Promise} 更新结果
 */
export const makePromiseForExecute = async(query, params = []) => {
  const connection = getConnectionPool();
  try {
    return await connection.execute(query, params);
  } catch (e) {
    console.log(`Execute: ${query}, params: ${params}, error: ${e}`);
    throw e;
  }
};

/**
 * @method getKeyOrValueString
 * @param {Object} params 参数
 * @param {Boolean} flag key/value
 * @param {Boolean} notCode key/value
 * @return {String} 结果
 */
export const getKeyOrValueString = (params, flag, notCode) => {
  let string = '';
  if (flag) {
    string = Object.keys(params).map(value =>
      (notCode ? `${params[value]}` : `'${params[value]}'`)
    ).join(',');
  } else {
    string = Object.keys(params).join(',');
  }
  return string;
};

/**
 * @method getParamsString
 * @param {Object} params 参数
 * @return {String} 结果
 */
export const getParamsString = (params, flag) => {
  const string = flag ? Object.keys(params).map(value =>
    `${value}='${params[value]}'`
  ).join(',') : Object.keys(params).map(value =>
    `${value}='${params[value]}'`
  ).join(' AND ');
  return string;
};
