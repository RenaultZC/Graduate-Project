import React, { Component } from 'react';
import { axiosGet } from '../../common/axios';
import { Spin, Table, Button } from 'antd';
import { NavLink } from 'react-router-dom';
import { StatusBadge } from '../../common/common';

export default class UserHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      snippetData: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.getUserSnippet();
  }

  getColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: '代码名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
        render: time => (new Date(parseInt(time, 0)).toLocaleDateString()),
        align: 'center'
      },
      {
        title: '代码地址',
        dataIndex: 'snippet',
        key: 'snippet',
        render: snippet => (new URL(snippet[0].value).origin),
        align: 'center'
      },
      {
        title: '代码长度',
        dataIndex: 'snippet',
        key: 'snippet',
        render: snippet => (snippet.length),
        align: 'center'
      },
      {
        title: '查看代码',
        render: data => (
          <NavLink to={`/snippet/${data.id}`}>
            <Button type="primary" shape="round" size="small">跳转</Button>
          </NavLink>
        ),
        align: 'center'
      }
    ];
  }
  getUserSnippet = () => {
    const { id } = this.state;
    if (!id) return;
    this.setState({loading: true});
    const PromiseAll = [
      axiosGet('/history/findHistory/selectUserHistory', { userId: id }),
      axiosGet('/analyze/findAnalyze/getAllAnalyze')
    ];
    Promise.all(PromiseAll)
      .then(res => {
        const id = {};
        const historyData = res[0].data.msg;
        let snippetData = res[1].data.msg;
        historyData.forEach(v => id[v.snippetId] = true);
        snippetData = snippetData.filter(v => id[v.id]).map((v, i) => ({
          ...v,
          snippet: JSON.parse(v.snippet),
          key: 1,
        }));
        snippetData.push(...snippetData);
        snippetData.push(...snippetData);
        snippetData.push(...snippetData);
        snippetData.push(...snippetData);
        this.setState({snippetData, loading: false});
      })
      .finally(() => {
        this.setState({loading: false, request: false});
      })
  }

  render() {
    const { snippetData } = this.state;
    return (
      <Spin spinning={this.state.loading} tip="加载中...">
        <Table
          dataSource={snippetData}
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