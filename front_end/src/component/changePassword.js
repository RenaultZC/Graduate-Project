import React, { Component } from 'react';
import { Button, Modal, Input, Form} from 'antd';
import { axiosPost } from '../common/axios';
import { LockOutlined } from '@ant-design/icons';
import errCode from '../common/errorCode';
import { encrypt } from '../common/crypto';

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
    this.state = {
      visible: false,
      confirmLoading: false,
      id: this.props.id,
    }
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({visible: false});  
  }

  onFinish = (values) => {
    const password = encrypt(values.password);
    this.setState({
      confirmLoading: true
    })
    const path = '/user/changeUser';
    const  params = {
      search: {
        id: this.state.id
      },
      value: {
        password,
      }
    };
    axiosPost(path, params)
      .then(res => {
        Modal.success({
          content: res.data.msg,
          centered: true,
          onOk: () => {
            this.setState({
              visible: false,
              confirmLoading: false
            });
          }
        })
      },
      err => {
        const content  = errCode[err.response.data.errCode];
        Modal.error({
          title: '修改用户信息出错',
          content,
          centered: true
        });
      }).finally(() => {
        this.setState({
          confirmLoading: false,
        })
      })
  }

  render() {
    const { visible, confirmLoading } = this.state;
    return(
      <React.Fragment>
        <Button icon={<LockOutlined />} onClick={this.onClick}>修改密码</Button>
        <Modal
          centered
          destroyOnClose
          onCancel={this.onCancel}
          visible={visible}
          confirmLoading={confirmLoading}
          maskClosable={false}
          footer={null}
          width="560px"
        >
          <br/>
          <Form
            {...layout}
            name="basic"
            onFinish={this.onFinish}
            hideRequiredMark
          >
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
              <Button type="primary" htmlType="login" shape="round" block>
                提交新密码
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
