import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { Descriptions, Avatar, Empty, Tabs, BackTop, Button, Row, Col } from 'antd';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { CodeOutlined, UserOutlined } from '@ant-design/icons';
import { axiosGet, axiosPost } from '../common/axios';
import { SERVER_HOST } from '../common/config';
import { StatusBadge } from '../common/common';
import moment from 'moment';
import SnippetModal from '../component/snippetModal';
import '../style/historyPage.less';

const { TabPane } = Tabs;

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class HistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: null
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({id})
    this.props.changeLoading(true);
    axiosGet(`/history/findHistory/getHistory?id=${id}`).then(res => {
      const historyData = res.data.msg;
      historyData.snippet = JSON.parse(historyData.snippet).map((v, i) => {
        v.key = i;
        return v;
      }); 
      this.setState({
        historyData
      })
      console.log(historyData);
      this.props.changeLoading(false);
    })
  }

  renderCronTime (cronTime) {
    if (!cronTime) return '只执行一次';
    cronTime = cronTime.split(' ');
    const time = `${cronTime[2]}:${cronTime[1]}:${cronTime[0]}`;
    const days = cronTime[3].split(',');
    return (
      <React.Fragment>
        时间： {time}
        重复： {days.join(',')}
      </React.Fragment>
    );
  }

  render() {
    const { historyData } = this.state;
    if (!historyData) 
      return(
        <div className="snippet-container empty-container">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>
        </div>
      );
    const { 
      snippet,
      startTime,
      name,
      userData,
      status,
      snippetId,
      snippetName,
      endTime,
      successTemp,
      failTemp,
      delayTime,
    } = historyData;
    const url = new URL(snippet[0].value);
    const origin = url.origin;
    const src = userData.avatar ? '' : (SERVER_HOST + userData.avatar);
    return(
      <div className="snippet-container historyPage">
        <BackTop />
        <Descriptions title={name} 
          bordered
          layout="vertical"
          column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="运行名称">{name}</Descriptions.Item>
          <Descriptions.Item label="测试网址">
            <a href={origin} target="_blank">
              <Avatar shape="square" src={origin+'/favicon.ico'}/>{origin}
            </a>
          </Descriptions.Item>  
          <Descriptions.Item label="测试代码长度">{snippet.length}行</Descriptions.Item>
          <Descriptions.Item label="执行用户">
            <Avatar
              src={src}
              size="small"
              icon={<UserOutlined />}
              style={{backgroundColor: '#00a2ae', marginRight: '10px'}}
            />
            {userData.username}
          </Descriptions.Item>
          <Descriptions.Item label="运行代码">
            <NavLink to={`/history/${snippetId}`}>{snippetName}</NavLink>
          </Descriptions.Item>
          <Descriptions.Item label="运行状态">{StatusBadge[status]}</Descriptions.Item>
          <Descriptions.Item label="运行开始时间">{new Date(parseInt(startTime, 0)).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="运行结束时间">
            {endTime ? new Date(parseInt(endTime, 0)).toLocaleString() : '未执行完毕'}
          </Descriptions.Item>
          <Descriptions.Item label="运行耗时(ms)">{endTime ? endTime - startTime : '0'} ms</Descriptions.Item>
          <Descriptions.Item label="请求成功次数">{successTemp} 次</Descriptions.Item>
          <Descriptions.Item label="请求失败次数">{failTemp} 次</Descriptions.Item>
          <Descriptions.Item label="执行时延(ms)">{delayTime} ms</Descriptions.Item>
          <Descriptions.Item label="执行时机">
            {}
          </Descriptions.Item>
        </Descriptions>
        <Row className="historyPageButton">
          <Col offset={19} span={5}>
            <Button icon={<CodeOutlined/>} size="large" type="primary" shape="round">开始测试</Button>
          </Col>
        </Row>
        <Tabs
          type="card"
          animated={true}
          keyboard={true}
          className="histroyTabs"
        >
          <TabPane tab="Tab 1" key="1">
            Content of Tab 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab 3
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default HistoryPage;
