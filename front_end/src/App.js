import React, { Component } from 'react';
import { Route, Switch, NavLink  } from 'react-router-dom';
import NotFound from './404';
import Login from './login';
import 'antd/dist/antd.css';
import './style/index.less';

export default class App extends Component {
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
                      <li><NavLink to="/snippet">代码库</NavLink></li>
                      <li><NavLink to="/history">历史记录</NavLink></li>
                      <li><NavLink to="/login" className="btn-request">登录/注册</NavLink></li>
                    </ul>
                </div>
            </div>
        </div>
        <Switch>
          <Route path="/" exact component={() => <div>1234</div>}/>
          <Route path="/login" exact component={Login} />
          <Route path="*" component={NotFound}/>
        </Switch>
      </React.Fragment>
    );
  }
}