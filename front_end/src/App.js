import React, { Component } from 'react';
import { Route, Switch, NavLink  } from 'react-router-dom';
import { Avatar, Typography, Menu, Dropdown, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { axiosPost, axiosGet } from './common/axios';
import NotFound from './404';
import Login from './user/login';
import Home from './home';
import {SERVER_HOST} from './common/config';
import 'antd/dist/antd.css';
import './style/index.less';

const { Text } = Typography;

const mapStateToProps = (state) => {
  return {
    User: state.User
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeUser: (User) => {
      dispatch({type: 'CHANGE_USER', User})
    }
  }
}

class App extends Component {
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
          }
        })
      })
  }

  renderUser() {
    const { avatar, username } = this.props.User;
    const src = avatar ? '' : (SERVER_HOST + avatar);
    const menu = () => (
      <Menu style={{background: 'url(/static/media/bg_purple.315b225d.png)'}}>
        <Menu.Item>
          <NavLink className="navbar-link"  activeClassName="link-active" to="/User">
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
        <NavLink activeClassName="link-active" to="/User" title='进入个人中心'>
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

  render () {
    return (
      <React.Fragment>
        <div className="stars">
            <div className="custom-navbar">
                <div className="brand-logo">
                    
                </div>
                <div className="navbar-links">
                    <ul>
                      <li><NavLink exact activeClassName="link-active" to="/">首页</NavLink ></li>
                      <li><NavLink activeClassName="link-active" to="/snippet">代码库</NavLink></li>
                      <li><NavLink activeClassName="link-active" to="/history">历史记录</NavLink></li>
                      <li>
                        {this.props.User.id
                          ? this.renderUser() 
                          : <NavLink to="/login" className="btn-request">登录/注册</NavLink>}
                      </li>
                    </ul>
                </div>
            </div>
        </div>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={Login} />
          <Route path="*" component={NotFound}/>
        </Switch>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
