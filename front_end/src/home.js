import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { HeartOutlined, AppstoreOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { axiosPost, axiosGet } from './common/axios';
import { Typography, Row, Col } from 'antd';
import homeImg from './static/home.png';
import './style/home.less';

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
          <Row style={{color: '#fff'}}>
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
      </div>
    );
  }
}

export default withRouter(Home);
