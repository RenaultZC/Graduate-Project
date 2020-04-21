import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet } from '../common/axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';


@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const { User } = this.props;
    axiosGet('/user/findUser/getInfo', { id: User && User.id})
      .then(res => {
        console.log(res);
      })
  }

  getDerivedStateFromProps() {
    // if (!this.props.User.id) {
    //   this.props.history.push('/login');
    // }
  }

  render() {
    return(
      <div className="snippet-container">
        UserCenter
      </div>
    );
  }
}

export default UserPage;