import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Modal, Tabs } from 'antd';
import { axiosGet, axiosPost } from '../common/axios';
import { SERVER_HOST, USERTYPE } from '../common/config';
import AvatarModal from '../component/avatarModal';
import ChangePasswordModal from '../component/changePassword';
import errCode from '../common/errorCode';
import '../style/userPage.less';
import UserHistory from './userPage/userHistory';
import UserSnippet from './userPage/userSnippet';
const { TabPane } = Tabs;

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    if (this.props.changeLoading) this.props.changeLoading(true);
    this.getUserInfo();
  }

  getUserInfo = () => {
    const { User } = this.props;
    const id = User && User.id;
    axiosGet('/user/findUser/getInfo', { id})
      .then(res => {
        if (this.props.changeLoading) this.props.changeLoading(false);
        this.setState({user: res.data.msg});
      })
  }

  setAvatar = (avatar) => {
    const path = '/user/changeUser';
    const params = {
      search: {
        id: this.state.user.id
      },
      value: {
        avatar,
      }
    };
    axiosPost(path, params)
      .then(res => {
        Modal.success({
          content: res.data.msg,
          centered: true,
          onOk: () => {
            this.getUserInfo();
          }
        })
      },
      err => {
        const content  = errCode[err.response.data.errCode];
        Modal.error({
          title: '修改用户头像出错',
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
    const user = this.state.user;
    const { avatar, username, email, type }= user;
    const id = this.props.User.id;
    const src = avatar ?  (SERVER_HOST + avatar) : '';
    return(
      <div className="snippet-container user-center">
        <div className="container-left">
          <div className="user-head">
            <div className="user-avatar">
              <Avatar
                src={src}
                size={90}
                icon={<UserOutlined />}
                shape="square"
              />
            </div>
            <div className="user-info">
              <div className="username">用户名: {username}</div>
              <div className="email"><MailOutlined /> 邮箱: {email}</div>
              <div className="type"><UserOutlined /> 用户类型: {type === USERTYPE.ADMIN ? '管理员' : '普通用户' }</div>
            </div>
            <div className="change-info">
              <AvatarModal user={user} setAvatar={this.setAvatar}/>
              <ChangePasswordModal />
            </div>
          </div>
          <div className="user-body">
            <Tabs defaultActiveKey="2">
              <TabPane tab="我的测试记录" key="1">
                <UserHistory id={id}/>
              </TabPane>
              <TabPane tab="我使用过的代码" key="2">
                <UserSnippet id={id}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default UserPage;