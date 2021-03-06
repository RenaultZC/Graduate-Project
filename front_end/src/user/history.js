import React, { Component } from 'react';
import { axiosGet } from '../common/axios';
import { mapDispatchToProps } from '../common/store';
import { List, Avatar, Input } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { StatusBadge } from '../common/common';
import { SERVER_HOST } from '../common/config';
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
      const historyData = res.data.msg.map(v => {
        v.snippet = JSON.parse(v.snippet);
        return v;
      })
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
        const historyData = res.data.msg.map(v => {
          v.snippet = JSON.parse(v.snippet);
          return v;
        })
        this.setState({
          historyData
        })
      }, err => {
        
      }).finally(() => {
        this.setState({
          searchOnload: false
        })
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
            showSizeChanger: false,
          }}
          dataSource={this.state.historyData}
          renderItem={item => {
            const time = new Date(parseInt(item.createTime, 0)).toLocaleDateString();
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
                    onError={e=> {
                      if(e && e.target && e.target.src)
                        e.target.src = SERVER_HOST + '/avatar/1588756245277_11.jpeg';
                      return false;
                    }}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatar} icon={<ChromeFilled />}
                    onError={e=> {
                      if(e && e.target && e.target.src)
                        e.target.src = SERVER_HOST + '/avatar/1588756245277_11.jpeg';
                      return false;
                    }}/>
                  }
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