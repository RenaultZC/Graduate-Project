import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { Descriptions, Avatar, Empty, Tabs, BackTop, Button, Row, Col, Tag, Modal } from 'antd';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { CodeOutlined, UserOutlined } from '@ant-design/icons';
import { axiosGet, axiosPost } from '../common/axios';
import { SERVER_HOST } from '../common/config';
import { StatusBadge } from '../common/common';
import errCode from '../common/errorCode';
import SnippetModal from '../component/snippetModal';
import SnippetTab from './historyPage/snippetTab';
import '../style/historyPage.less';

const { TabPane } = Tabs;

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class HistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: null,
      visible: false,
      confirmLoading: false,
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
      this.props.changeLoading(false);
    })
  }

  renderFooter = () => {
    const {visible, confirmLoading, historyData} = this.state;
    const { 
      snippet,
      name,
      userData,
      delayTime,
      cronTime,
      email
    } = historyData;
    const showModal = () => {
      if (!this.props.User.id) {
        return Modal.error({
          title: '运行测试代码出错',
          content: '未登录无权进行操作',
          okText: '登录',
          onOk: () => {
            this.props.history.push('/login');
          },
          centered: true
        });
      } else if (this.props.User.id !== userData.id) {
        return Modal.error({
          title: '运行测试代码出错',
          content: '不是创建人无权进行操作',
          centered: true
        });
      }
      this.setState({
        visible: true
      });
    }
    const onOk = (params) =>{
      this.setState({confirmLoading: true});
      axiosPost('/history/restartHistory', {
        historyId: this.state.id,
        ...params
      }).then(res => {
        this.setState({
          confirmLoading: false,
          visible: false
        });
        Modal.success({
          content: res.data.msg,
          centered: true
        });
      },
      err => {
        const content  = errCode[err.response.data.errCode];
        Modal.error({
          title: '重新执行测试代码',
          content,
          centered: true
        });
      })
    };
    return (
      <div>
        <Row className="historyPageButton">
          <Col offset={19} span={5}>
            <Button icon={<CodeOutlined/>} size="large" type="primary" shape="round"  onClick={showModal}>重新测试</Button>
          </Col>
        </Row>
        <SnippetModal
          title={name}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
          onOk={onOk}
          snippet={snippet}
          defaultValue={{
            cronTime,
            delayTime,
            name,
            email
          }}
        />
      </div>
    );
  }

  renderCronTime (cronTime) {
    if (!cronTime) return '只执行一次';
    cronTime = cronTime.split(' ');
    const time = `${cronTime[2]}:${cronTime[1]}:${cronTime[0]}`;
    const days = cronTime[3] === '*' ? [ 1 , 2, 3, 4, 5, 6, 7 ] : cronTime[3].split(',');
    const radomColor = () => {
      const arr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
      let res = '#';
      for (let i = 0; i < 6; i ++) {
        res += arr[Math.floor(Math.random() * 15)];
      }
      return res;
    }
    const day = {
      1: <Tag key="1" color={radomColor()}>星期一</Tag>,
      2: <Tag key="2" color={radomColor()}>星期二</Tag>,
      3: <Tag key="3" color={radomColor()}>星期三</Tag>,
      4: <Tag key="4" color={radomColor()}>星期四</Tag>,
      5: <Tag key="5" color={radomColor()}>星期五</Tag>,
      6: <Tag key="6" color={radomColor()}>星期六</Tag>,
      7: <Tag key="7" color={radomColor()}>星期天</Tag>,
    }
    return (
      <React.Fragment>
        <Row>
          <Col>
            执行时间： {time}
          </Col>
          <Col offset={1}>
            执行重复： {days.map(v => day[v])}
          </Col>
        </Row>
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
      cronTime,
    } = historyData;
    console.log(endTime)
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
            {this.renderCronTime(cronTime)}
          </Descriptions.Item>
        </Descriptions>
        {this.renderFooter()}
        <Tabs
          type="card"
          animated={true}
          keyboard={true}
          className="histroyTabs"
        >
          <TabPane tab="执行代码" key="1">
            <SnippetTab snippet={snippet} />
          </TabPane>
          <TabPane tab="执行分析" key="2">
            Content of Tab 2
          </TabPane>
          <TabPane tab="请求分析" key="3">
            Content of Tab 3
          </TabPane>
          <TabPane tab="性能分析" key="4">
            Content of Tab 4
          </TabPane>
          <TabPane tab="执行截图" key="5">
            Content of Tab 5
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default HistoryPage;
