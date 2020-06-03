import React, { Component } from 'react';
import { axiosGet, axiosPost } from '../../common/axios';
import { Spin, Table, Button, Popconfirm, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import { StatusBadge } from '../../common/common';
import errCode from '../../common/errorCode';

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

  getColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '运行名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '运行状态',
        dataIndex: 'status',
        key: 'status',
        render: status => StatusBadge[status]
      },
      {
        title: '运行时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: time => (new Date(parseInt(time, 0)).toLocaleDateString())
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: time => (time ? new Date(parseInt(time, 0)).toLocaleDateString() : '——')
      },
      {
        title: '查看运行分析',
        render: data => (
          <NavLink to={`/history/${data.id}`}>
            <Button type="primary" shape="round" size="small">跳转</Button>
          </NavLink>
        )
      },
      {
        title: '删除运行记录',
        render: data => (
          <Popconfirm title="确认删除?" onConfirm={() =>  this.deleteHistory(data.id)}>
            <Button type="primary" shape="round" size="small">
              删除代码
            </Button>
          </Popconfirm>
        )
      },
    ];
  }

  deleteHistory = () => {
    this.setState({loading: true});
    axiosPost('/history/deleteHistory')
      .then(res => {
        Modal.success({
          content: res.data.msg,
          onOk: this.getUserHistory
        })
      },
      err => {
        Modal.error({
          title: '删除用户代码失败',
          content: errCode[err.response.data.errCode],
        });
      })
      .finally(() => {
        this.setState({lodaing: false});
      })
  }

  getUserHistory = () => {
    const { id } = this.state;
    if (!id) return;
    this.setState({loading: true});
    axiosGet('/history/findHistory/selectUserHistory', {userId: 6})
      .then(res => {
        const historyData = res.data.msg.map((v, i) => {
          return {
            ...v,
            key: i,
          }
        })
        this.setState({historyData, loading: false});
      })
      .finally(() => {
        this.setState({loading: false, request: false});
      })
  }

  render() {
    const { historyData } = this.state;
    return (
      <Spin spinning={this.state.loading} tip="加载中...">
        <Table
          dataSource={historyData}
          columns={this.getColumns()}
          pagination={{
            showSizeChanger: false,
            pageSize: 3,
          }}
        />
      </Spin>
    );
  }
}