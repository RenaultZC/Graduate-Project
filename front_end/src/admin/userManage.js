import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet } from '../common/axios';
import { USER_TYPE } from '../common/common';
import { Table, Avatar, Popconfirm, Button, Row } from 'antd';
import { UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { SERVER_HOST } from '../common/config';
import UserChangeModal from './changeUser';
import { decrypt } from '../common/crypto';

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    }
  }

  componentDidMount() {
    // if (this.props.User.type !== USER_TYPE.ADMIN ) this.props.history.push('/login');
    this.getUserData();
  }

  getUserData = () => {
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/user/findUser/getAllUser')
      .then(res => {
        let userData = res.data.msg.filter(v => v.id !== this.props.User.id).map((v, i) => ({...v, key: i}));
        userData = userData.concat(userData);
        userData = userData.concat(userData);
        userData = userData.concat(userData);
        userData = userData.concat(userData);
        this.setState({ 
          userData
        });
      }).finally(() => {
        if (this.props.changeLoading) this.props.changeLoading(false);
      });
  }

  getColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        align: 'center'
      },
      {
        title: '用户头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: avatar => {
          const src = avatar ? '' : (SERVER_HOST + avatar);
          const radomColor = () => {
            const arr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
            let res = '#';
            for (let i = 0; i < 6; i ++) {
              res += arr[Math.floor(Math.random() * 15)];
            }
            return res;
          }
          return (
            <Avatar
              src={src}
              size="small"
              icon={<UserOutlined />}
              style={{backgroundColor: radomColor(), marginRight: '10px'}}
            />
          )
        },
        align: 'center'
      },
      {
        title: '用户邮箱',
        key: 'email',
        dataIndex: 'email',
        align: 'center'
      },
      {
        title: '用户类型',
        key: 'type',
        dataIndex: 'type',
        align: 'center',
        render: (type) => (USER_TYPE.ADMIN === type ? '管理员' : '普通用户'),
      },
      {
        title: '修改用户信息',
        render: data => (
          <UserChangeModal user={data} shape="round"/>
        ),
        align: 'center'
      },
      {
        title: '删除用户',
        render: text => (
          <Popconfirm title="确认删除?" onConfirm={() =>  this.deleteSnippet(text.id)}>
            <Button type="primary" shape="round" size="small">
              删除用户
            </Button>
          </Popconfirm>
        ),
        align: 'center'
      }
    ];
  }

  render () {
    const { userData } = this.state;
    return (
      <div className="snippet-container">
        <Row justify="end">
          <UserChangeModal size="large" shape="" icon={<PlusCircleOutlined />}/>
        </Row>
        <br/>
        <Table
          columns={this.getColumns()}
          dataSource={userData}
          pagination={{
            showSizeChanger: false,
            pageSize: 7,
          }}
        />
      </div>
    );
  }
}