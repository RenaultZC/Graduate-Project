import React, { Component } from 'react';
import { axiosGet } from '../common/axios';
import { mapDispatchToProps } from '../common/store';
import { List, Avatar, Input } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { StatusBadge } from '../common/common';
import { ChromeFilled } from '@ant-design/icons';

@connect(null, mapDispatchToProps)
@withRouter
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: []
    }
  }

  componentDidMount() {
    this.props.changeLoading(true);
    axiosGet(`/history/findhistory/getAllHistory`).then(res => {
      let historyData = res.data.msg.map(v => {
        v.snippet = JSON.parse(v.snippet);
        return v;
      })
      historyData = historyData.concat(historyData);
      historyData = historyData.concat(historyData);
      historyData = historyData.concat(historyData);
      historyData = historyData.concat(historyData);
      this.setState({
        historyData
      })
      if (this.props.changeLoading) this.props.changeLoading(false);
    })
  }

  renderHeader = () => {
    const onSearch = (name) => {
      this.setState({searchOnload: true});
      axiosGet('/history/findHistory/selectHistory', { name }).then(res => {
        let historyData = res.data.msg.map(v => {
          v.snippet = JSON.parse(v.snippet);
          return v;
        })
        historyData = historyData.concat(historyData);
        historyData = historyData.concat(historyData);
        historyData = historyData.concat(historyData);
        historyData = historyData.concat(historyData);
        this.setState({
          historyData,
          searchOnload: false
        })
      }, err => {
        
      })
    }
    return (
      <div>
        <Input.Search
          enterButton
          placeholder="搜索测试结果"
          onSearch={onSearch}
          loading={this.state.searchOnload}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="snippet-container">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 3,
          }}
          dataSource={this.state.historyData}
          renderItem={item => {
            const time = new Date(parseInt(item.startTime, 0)).toLocaleDateString();
            const length = item.snippet.length;
            const origin = new URL(item.snippet[0].value).origin;
            const avatar = origin + '/favicon.ico';
            return (
              <List.Item
                key={time}
                actions={[
                  `创建时间：${time}`,
                  `代码长度：${length}`,
                  StatusBadge[item.status]
                ]}
                extra={
                  <Avatar
                    style={{width: '100px', height: '100px'}}
                    alt="logo"
                    src={avatar}
                    icon={<ChromeFilled />} 
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatar} icon={<ChromeFilled />} />}
                  title={<NavLink to={`/history/${item.id}`}>{item.name}</NavLink>}
                  description={`测试网址: ${origin}`}
                />
              </List.Item>
          )}}
          header={this.renderHeader()}
        />
      </div>
    );
  }
}

export default History;