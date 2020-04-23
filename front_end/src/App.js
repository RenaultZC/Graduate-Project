import React, { Component } from 'react';
import { Route, Switch  } from 'react-router-dom';
import NotFound from './404';
import Home from './user/home';
import Login from './user/login';
import Snippet from './user/snippet';
import SnippetPage from './user/snippetPage';
import History from './user/history';
import HistoryPage from './user/historyPage';
import UserPage from './user/userPage';
import AdminPage from './admin/adminPage';
import SnippetManage from './admin/snippetManage';
import UserManage from './admin/userManage';
import Head from './head';
import 'antd/dist/antd.css';
import './style/index.less';


class App extends Component {
  render () {
    return (
      <React.Fragment>
        <Head/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={Login} />
          <Route path="/snippet" exact component={Snippet} />
          <Route path="/snippet/:id" exact component={SnippetPage} />
          <Route path="/history" exact component={History} />
          <Route path="/history/:id" exact component={HistoryPage} />
          <Route path="/userCenter" exact component={UserPage} />
          <Route path="/adminPage" exact component={AdminPage} />
          <Route path="/snippetManage" exact component={SnippetManage} />
          <Route path="/userManage" exact component={UserManage} />
          <Route path="*" component={NotFound}/>
        </Switch>
        <div className="footer-container">
          Made with  
          <span style={{color: 'rgb(255, 255, 255)', padding:'0 6px'}}>❤</span>
           by
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/RenaultZC" style={{paddingLeft:'6px'}}>
            RenaultZC
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
