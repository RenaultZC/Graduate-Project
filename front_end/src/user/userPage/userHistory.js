import React, { Component } from 'react';
import { axiosGet, axiosPost } from '../../common/axios';
import { Spin, Table } from 'antd';

export default class UserHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      historyData: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.getUserHistory();
  }

  getUserHistory = () => {
    const { id } = this.state;
    // if (!id) return;
    this.setState({loading: true});
    axiosGet('/history/findHistory/selectUserHistory', {userId: 6})
      .then(res => {
        this.setState({historyData: res.data.msg, loading: false});
      })
      .finally(() => {
        this.setState({loading: false, request: false});
      })
  }

  render() {
    const { historyData } = this.state;
    return (
      <Spin spinning={this.state.loading} tip="加载中...">
        <Table dataSource={historyData}/>
      </Spin>
    );
  }
}