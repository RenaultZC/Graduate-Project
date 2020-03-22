import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink  } from 'react-router-dom';
import NotFound from './404';
import { Layout } from 'antd';
import './style/index.less';

const { Header, Content, Footer } = Layout;

export default class App extends Component {
  render () {
    return (
      <Layout>
        <Router>
          <Header>
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
          </Header>
          <Content>
              <Switch>
                <Route path="/" exact component={() => <div>1234</div>}>
                </Route>
                <Route path="*" component={NotFound}/>
              </Switch>
          </Content>
          <Footer>

          </Footer>
        </Router>
      </Layout>
    );
  }
}