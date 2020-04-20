import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Dropdown, Typography, Modal } from 'antd';
import { connect } from 'react-redux';
import Loading from './component/loading';
import { SERVER_HOST } from './common/config';
import { axiosPost, axiosGet } from './common/axios';
import { USER_TYPE } from './common/common';
import {mapStateToProps, mapDispatchToProps} from './common/store';
const { Text } = Typography;

@connect(mapStateToProps, mapDispatchToProps)
class Head extends Component {

  componentDidMount() {
    if (!this.props.User.id) {
      axiosPost('/user/login')
      .then(response => {
        this.props.changeUser(response.data.msg);
      })
    }
  }

  loginOut = () => {
    axiosGet('/user/loginOut')
      .then(res => {
        Modal.success({
          title: '退出登录',
          content: res.data.msg,
          onOk: () => {
            this.props.changeUser({});
          },
          centered: true
        })
      })
  }
  renderUser() {
    const { avatar, username } = this.props.User;
    const src = avatar ? '' : (SERVER_HOST + avatar);
    const menu = () => (
      <Menu style={{background: 'url(/static/media/bg_purple.315b225d.png)'}}>
        <Menu.Item>
          <NavLink className="navbar-link"  activeClassName="link-active" to="/userCenter">
            个人中心
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <a  className="navbar-link" onClick={this.loginOut} >
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <NavLink activeClassName="link-active" to="/userCenter" title='进入个人中心'>
          <Avatar
            src={src}
            size="small"
            icon={<UserOutlined />}
            style={{backgroundColor: '#00a2ae', marginRight: '10px'}}
          />
          <Text strong className="navbar-link" style={{display: 'inline'}} >{username}</Text>
        </NavLink>
      </Dropdown>
    )
  }
  render() {
    return (
      <div className="stars">
          <div className="custom-navbar">
              <div className="brand-logo">
                  {
                    this.props.User.type === USER_TYPE.ADMIN && 
                    (<ul>
                      <li><NavLink exact activeClassName="link-active" to="/adminPage">管理员页</NavLink ></li>
                      <li><NavLink activeClassName="link-active" to="/snippetManage">代码管理</NavLink></li>
                      <li><NavLink activeClassName="link-active" to="/userManage">用户管理</NavLink></li>
                    </ul>)
                  }
              </div>
              <div className="navbar-links">
                  <ul>
                    <li><NavLink exact activeClassName="link-active" to="/">首页</NavLink ></li>
                    <li><NavLink activeClassName="link-active" to="/snippet">代码库</NavLink></li>
                    <li><NavLink activeClassName="link-active" to="/history">测试记录</NavLink></li>
                    <li>
                      {this.props.User.id
                        ? this.renderUser() 
                        : <NavLink to="/login" className="btn-request">登录/注册</NavLink>}
                    </li>
                  </ul>
              </div>
          </div>
          {this.props.loading ? <Loading /> : null}
      </div>
    );
  }
};

export default Head;