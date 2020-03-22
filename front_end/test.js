/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
var getLeastNumbers = function(arr, k) {
  arr.sort();
  return arr.slice(0, k);
};

console.log(getLeastNumbers([0,1,2,1], 1));