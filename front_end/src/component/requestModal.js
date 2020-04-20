import React, { Component } from 'react';
import {Button, Modal, Descriptions, Typography, Tooltip } from 'antd';
import ReactJson from 'react-json-view';
import './requestModal.less';

const { Text  } = Typography;

const parseURL = (url) => {
  let a = new URL(url);
  return {
    source: url,
    protocol: a.protocol.replace(':', ''), 
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      var params = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          p;
      for (var i = 0; i < len; i++) {
        if (seg[i]) {
           p = seg[i].split('=');
           params[p[0]] = p[1];   
        }
      }
      return params;
   })(),
   hash: a.hash.replace('#', ''),
   path: a.pathname.replace(/^([^/])/, '/$1')
  };
}

export default class RequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({visible: false});  
  }

  render () {
    const { requestData } = this.props;
    const { visible } = this.state;
    const {
      url,
      method,
      status,
      fromCache,
      fromServiceWorker,
      delay
    } = requestData;
    const parseUrlRes = parseURL(url); 
    return (
      <React.Fragment>
        <Button type="primary" shape="round" size="small" onClick={this.onClick}>详情</Button>
        <Modal
          centered
          destroyOnClose
          title={requestData.id}
          onCancel={this.onCancel}
          visible={visible}
          maskClosable={false}
          footer={null}
          width="80vw"
          className="requestModal"
        >
          <Descriptions 
            bordered
            layout="vertical"
            column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="URL" span={[4, 2, 1]}>
              <Tooltip title={url} >
                <Text ellipsis style={{width:"70vw"}}>{url}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="使用协议">
              <Tooltip title={parseUrlRes.protocol} >
                <Text>{parseUrlRes.protocol}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="域名">
              <Tooltip title={parseUrlRes.host} >
                <Text>{parseUrlRes.host}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="路径">
              <Tooltip title={parseUrlRes.path || '——'} >
                <Text ellipsis className="textMax" >{parseUrlRes.path || '——'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="请求方法">
              <Tooltip title={method || '——'} >
                <Text>{method || '——'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="响应状态">
              <Tooltip title={status || '——'} >
                <Text>{status || '——'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="响应时长">
              <Tooltip title={delay ? delay + 'ms' : '——'} >
                <Text>{delay ? delay + 'ms' : '——'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="fromCache">
              <Tooltip title={fromCache ? 'true' : 'false'} >
                <Text>{fromCache ? 'true' : 'false'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="fromServiceWorker">
              <Tooltip title={fromServiceWorker ? 'true' : 'false'} >
                <Text>{fromServiceWorker ? 'true' : 'false'}</Text>
              </Tooltip>
            </Descriptions.Item>
            <Descriptions.Item label="请求参数" span={4}>
              <ReactJson src={parseUrlRes.params}/>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </React.Fragment>
    );
  }
}