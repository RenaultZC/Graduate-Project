import React from 'react';
import { Spin } from 'antd';
import '../style/loading.less'

export default () => {
  return (
    <div className="loading-container">
      <Spin size="large" tip="Loading..."/>
    </div>
  );
}
