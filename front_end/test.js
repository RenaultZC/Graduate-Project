/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let ans = 0, st = [];    
  for (let i = 0; i < height.length; i++)
  {
      while (st.length && height[st[st.length - 1]] < height[i])
      {
          const cur = st.pop();
          if (!st.length) break;
          const l = st[st.length - 1];
          const r = i;
          const h = Math.min(height[r], height[l]) - height[cur];
          ans += (r - l - 1) * h;
      }
      st.push(i);
  }
  return ans;
};

console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));