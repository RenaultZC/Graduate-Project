import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet } from '../common/axios';

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
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/user/findUser/getAllUser')
      .then(res => {
        this.setState({ userData: res.data.msg.filter(v => v.id !== this.props.User.id) });
        if (this.props.changeLoading) this.props.changeLoading(false);
      });
  }

  render () {
    return (
      <div className="snippet-container">
        UserManage
      </div>
    );
  }
}