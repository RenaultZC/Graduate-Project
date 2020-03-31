import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { 
  HeartOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  AreaChartOutlined,
  CodeOutlined,
  GithubOutlined,
  CodepenOutlined
} from '@ant-design/icons';
import { Typography, Row, Col, Button } from 'antd';
import homeImg from '../static/home.png';
import analyzeImg from '../static/analyzeFile.jpg';
import runCode from '../static/runCode.gif';
import '../style/home.less';

const { Title, Text } = Typography;

class Home extends Component {
  render() {
    return (
      <div className="home-body">
        <img className="home-head" src={homeImg} alt="标题"/>
        <Title className="home-text home-title" level={2} >简化前端测试人员的工作</Title>
        <Title className="home-text" level={4} >第一步Chrome安装扩展程序</Title>
        <Text className="home-code" code>>_访问Chrome扩展程序商店安装Chrome扩展程序，进行录制测试代码，录制结束进行代码上传   </Text>
        <Title className="home-text" level={4} >第二步进入管理后台运行相关代码</Title>
        <Text className="home-code" code>>_访问管理后台网址，进入代码库中，找到上传的测试代码，运行测试代码生成测试信息   </Text>
        <div className="home-feature">
          <Row>
            <Col span={8}>
              <div className="home-feture-icon"><HeartOutlined /></div>
              <Title className="home-feature-text" level={4}>开源免费</Title>
            </Col>
            <Col span={8}>
              <div className="home-feture-icon"><AppstoreOutlined /></div>
              <Title className="home-feature-text" level={4}>功能丰富</Title>
            </Col>
            <Col span={8}>
              <div className="home-feture-icon"><UsergroupAddOutlined /></div>
              <Title className="home-feature-text" level={4}>社区活跃</Title>
            </Col>
          </Row>
        </div>
        <div className="home-detail">
          <Row style={{color: '#fff'}}>
            <Col span={8} className="detail-center">
              <div className="detail-icon"><AreaChartOutlined /></div>
              <Title className="detail-title" level={4}>分析数据</Title>
              <Text className="detail-title" level={4}>通过运行录制代码， 生成分析文件，根据数据生成分析图表</Text>
            </Col>
            <Col span={1}/>
            <Col span={15}>
              <img className="detail-img" src={analyzeImg} alt="分析数据"/> 
            </Col>
          </Row>
        </div>
        <div className="home-detail">
          <Row style={{color: '#fff'}}>
            <Col span={15}>
              <img className="detail-img" src={runCode} alt="代码执行"/> 
            </Col>
            <Col span={1}/>
            <Col span={8} className="detail-center">
              <div className="detail-icon"><CodeOutlined /></div>
              <Title className="detail-title" level={4}>执行测试代码</Title>
              <Text className="detail-title" level={4}>通过录制用户操作，生成可执行代码，通过后台复现用户操作</Text>
            </Col>
          </Row>
        </div>
        <div className="home-normal">
          <Title className="normal-title" level={2}>关注我们</Title>
          <Text className="normal-text" level={4}>可以通过以下渠道关注我们，及时获得更多最新动态</Text>
          <br/>
          <Button className="normal-button" type="primary" shape="round" href="https://github.com/RenaultZC/Graduate-Project">
            <GithubOutlined />GitHub
          </Button>
          <Button className="normal-button" type="danger" shape="round" href="https://codepen.io/">
            <CodepenOutlined />CodePen
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
