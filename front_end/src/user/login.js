import React, { Component } from 'react';
import classnames from 'classnames';
import { Form, Input, Button, Typography, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosPost } from '../common/axios';
import { encrypt } from '../common/crypto';
import errCode from '../common/errorCode';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps} from '../common/store';
import '../style/login.less';

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 9, span: 6 },
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rigetPanelActive: false,
    }
  }

  changeClick = (e) => {
    const targetId = e && e.target && e.target.id;
    if (targetId === 'signUp' && !this.state.rigetPanelActive) {
      this.setState({rigetPanelActive: true}); 
    } else {
      this.setState({rigetPanelActive: false}); 
    }
    this.signUpRef.resetFields();
    this.signInRef.resetFields();
  }

  onSignUpFinish = values => {
    values = encrypt(values);
    this.props.changeLoading(true);
    axiosPost('/user/login', values)
    .then(response => {
      this.props.changeUser(response.data.msg);
      Modal.success({
        content: '登录成功',
        onOk: () => {
          this.props.history.push('/');
        },
        centered: true
      });
    })
    .catch(error => {
      const content  = errCode[error.response.data.errCode];
      Modal.error({
        title: '登录失败',
        content,
        centered: true
      })
    }).finally(() => {
      const res = this.signUpRef
      res.resetFields();
      this.props.changeLoading(false);
    });
  };

  onSignInFinish = values => {
    values = encrypt(values);
    this.props.changeLoading(true);
    axiosPost('/user/addUser', values)
    .then(response => {
      Modal.success({
        content: '注册成功，跳转登录',
        onOk: () => {
          this.changeClick();
        },
        centered: true
      });
    })
    .catch(error => {
      const content  = errCode[error.response.data.errCode];
      Modal.error({
        title: '注册失败',
        content,
        centered: true
      })
    }).finally(() => {
      this.signInRef.resetFields();
      this.props.changeLoading(false);
    });
  };

  render() {
    const { rigetPanelActive } = this.state;
    const containerClass = classnames({
      'login-container': true,
      'login-right-panel-active': rigetPanelActive,
    })
    return (
      <div className={containerClass} id="container">
        <div className="login-form-container login-sign-up-container">
          <Form
            {...layout}
            name="basic"
            onFinish={this.onSignInFinish}
            className="login-form"
            hideRequiredMark
            ref={el => (this.signInRef = el)}
          >
            <Title level={3} style={{textAlign: 'center'}}>注册</Title>
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})$/,
                  message: '4-16位字母,数字,汉字,下划线',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
              label="邮 箱"
              name="email"
              rules={[
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-zA-Z])+$/i,
                  message: '请输入正确的邮箱！',
                },
              ]}
            >
              <Input prefix={<MailOutlined  className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
              label="密 码"
              name="password"
              rules={[
                {
                  required: true,
                  pattern: /^[a-zA-Z]\w{5,17}/,
                  message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button className="login-button" type="primary" htmlType="login" danger shape="round" block>
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="login-form-container login-sign-in-container">
          <Form
            {...layout}
            name="basic"
            onFinish={this.onSignUpFinish}
            className="login-form"
            hideRequiredMark
            ref={el => (this.signUpRef = el)}
          >
            <Title level={3} style={{textAlign: 'center'}}>登录</Title>
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  pattern: /^([a-zA-Z0-9_\u4e00-\u9fa5]{4,16})|(([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+.([a-zA-Z])+)$/i,
                  message: '请输入正确的用户名或邮箱！',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
              label="密 码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button className="login-button" type="primary" htmlType="login" danger shape="round" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="login-overlay-container">
          <div className="login-overlay">
            <div className="login-overlay-panel login-overlay-left">
              <h1 className="login-h1">欢迎回来</h1>
              <p className="login-p">为了保持我们之间的连接请登录你的账号</p>
              <button className="login-button login-ghost" id="signIn" onClick={this.changeClick}>登录</button>
            </div>
            <div className="login-overlay-panel login-overlay-right">
              <h1 className="login-h1">你好我的朋友</h1>
              <p className="login-p">输入你的个人信息来开始我们的旅程吧</p>
              <button className="login-button login-ghost" id="signUp" onClick={this.changeClick}>注册</button>
            </div>
          </div>
        </div>
      </div>
    ); 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
