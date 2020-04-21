import React, { Component } from 'react';
import { Button, Modal, Input, Select, Form } from 'antd';
import { axiosPost } from '../common/axios';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import errCode from '../common/errorCode';
import { decrypt, encrypt } from '../common/crypto';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const tailLayout = {
  wrapperCol: { offset: 9, span: 6 },
};


export default class ChangeUserModal extends Component {
  constructor(props) {
    super(props);
    const user = this.props.user || {};
    user.password = decrypt(user.password); 
    this.state = {
      visible: false,
      confirmLoading: false,
      user,
      avatar: null,
    }
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({visible: false});  
  }

  onFinish = (values) => {
    console.log(values);
    let path, params;
    const avatar = this.state.avatar
    const password = encrypt(values.password);
    const username = encrypt(values.username);
    const email = encrypt(values.email);
    if (this.props.user) {
      path = '/user/changeUser';
      params = {
        search: {
          id: this.state.id
        },
        value: {
          username,
          email,
          password,
          avatar
        }
      }
    } else {
      path = '/user/addUser';
      params = {
        username,
        email,
        password,
        avatar
      }
    }
  }

  render() {
    const { visible, confirmLoading, user } = this.state;
    return(
      <React.Fragment>
         <Button type="primary" icon={this.props.icon} shape={this.props.shape} size={this.props.size || 'small'} onClick={this.onClick}>{this.props.user ? '修改信息' : '添加用户'}</Button>
        <Modal
          centered
          destroyOnClose
          onCancel={this.onCancel}
          visible={visible}
          confirmLoading={confirmLoading}
          maskClosable={false}
          footer={null}
          width="60vw"
          className="changeUser"
        >
        <br/>
        <Form
          {...layout}
          name="basic"
          onFinish={this.onFinish}
          initialValues={user}
          className="login-form"
          hideRequiredMark
        >
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
            <Input prefix={<MailOutlined className="site-form-item-icon" />} />
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
          <Form.Item label="用户类型" name="type">
            <Select>
              <Select.Option value={0}>普通用户</Select.Option>
              <Select.Option value={1}>管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button className="login-button" type="primary" htmlType="login" danger shape="round" block>
              { this.props.user ? '更新用户数据' : '添加用户' }
            </Button>
          </Form.Item>
        </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
