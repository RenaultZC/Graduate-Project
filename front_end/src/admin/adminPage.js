import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { Statistic, Card, Row, Col, Empty, Modal} from 'antd'; // , Button 
import errCode from '../common/errorCode';
import { UserOutlined, CodeOutlined, HistoryOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import { axiosGet} from '../common/axios'; // , axiosPost 
import { USER_TYPE } from '../common/common';
import { 
  getSnippetOption,
  getScreenShotOption,
  getConsumIdOption,
  getConsumStatusOption,
  getHistoryOption
} from './getOption';

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      screenShotData: null,
      consumData: null,
      snippetData: null,
      historyData: null,
      loading: true,
    }
  }

  componentDidMount() {
    if (this.props.User.type !== USER_TYPE.ADMIN ) this.props.history.push('/login');
    if (this.props.changeLoading) this.props.changeLoading(true);
    const PromiseAll = [
      axiosGet('/analyze/findAnalyze/getAllAnalyze'),
      axiosGet('/history/findhistory/getAllHistory'),
      axiosGet('/user/findUser/getAllUser'),
      axiosGet('/getAllData/getAllConsum'),
      axiosGet('/getAllData/getAllScreenshot')
    ]
    Promise.all(PromiseAll)
      .then(arr => {
        this.setState({
          loading: false,
          snippetData: arr[0].data.msg,
          historyData: arr[1].data.msg,
          userData: arr[2].data.msg,
          consumData: arr[3].data.msg,
          screenShotData: arr[4].data.msg,
        });
      }, err => {
        const content  = errCode[err.response.data.errCode];
        Modal.error({
          title: '获取数据失败',
          content,
          centered: true,
          onOk: () => { if (err.response.data.errCode === 1006) this.props.history.push('/login');}
        })
      }).finally(() => {
        if (this.props.changeLoading) this.props.changeLoading(false);
      })
  }
  // time = 1577863800000 ;
  // temp = 5;
  // radom = 5;
  // index = 6;
  // addSnippet = () => {
  //   const snippet = this.state.snippetData;
  //   const index = Math.floor(snippet.length * Math.random());
  //   const userData = this.state.userData;
  //   const userId = userData[Math.floor(userData.length * Math.random())].id;
  //   console.log(snippet[index])
  //   const params = {
  //     name: '运行测试test' + this.index,
  //     snippet: snippet[index].snippet,
  //     headless: false,
  //     cronTime: '',
  //     email: '1073294992@qq.com',
  //     delayTime: 100,
  //     snippetId: snippet[index].id,
  //     userId,
  //     createTime: this.time
  //   };
  //   console.log(params);
  //   axiosPost('/history/addHistory', params).then(()=> {
  //     if (this.temp === this.radom) {
  //       this.temp = 0;
  //       this.radom = Math.floor(Math.random() * 10) || 1;
  //     }
  //     this.time = this.time + Math.floor(24 * 60 * 60 * 1000 / this.radom);
  //     this.temp = this.temp + 1;
  //     this.index = this.index + 1;
  //     console.log(this.time, this.radom, this.temp, this.index, Math.floor(24 * 60 * 60 * 1000 / this.radom))
  //     if (this.time < 1609486200000){
  //       console.log(true);
  //       setTimeout(this.addSnippet, 10 * 1000)
  //     }
  //   })
  // }

  render() {
    const { loading, userData, consumData, snippetData, historyData, screenShotData } = this.state;
    if (loading) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>;
    return (
      <div className="snippet-container">
        {/* <Button onClick={this.addSnippet}>addSnippet</Button> */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="用户数量"
                value={userData.length}
                prefix={<UserOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="代码数量"
                value={snippetData.length}
                prefix={<CodeOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="运行历史数量"
                value={historyData.length}
                prefix={<HistoryOutlined />}
                suffix="个"
              />
            </Card>
          </Col>
        </Row>
        <br/>
        <Card hoverable title="代码数量统计">
          <ReactEcharts option={getSnippetOption(snippetData)}/>
        </Card>
        <br/>
        <Card hoverable title="运行数量统计">
          <ReactEcharts option={getHistoryOption(historyData)}/>
        </Card>
        <br/>
        <Row gutter={16}>
          <Col span={12}>
            <Card hoverable title="运行请求统计">
              <ReactEcharts option={getConsumIdOption(consumData)}/>
            </Card>
          </Col>
          <Col span={12}>
            <Card hoverable title="请求响应状态统计">
              <ReactEcharts option={getConsumStatusOption(consumData)}/>
            </Card>
          </Col>
        </Row>
        <br/>
        <Card hoverable title="运行截图统计">
          <ReactEcharts option={getScreenShotOption(screenShotData)}/>
        </Card>
      </div>
    );
  }
}

export default AdminPage;
