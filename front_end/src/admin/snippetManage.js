import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet, axiosPost } from '../common/axios';
import { USER_TYPE } from '../common/common';
import { Table, Button, Modal, Popconfirm } from 'antd';
import ChangeSnippetModal from './changeSnippet';

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SnippetManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snippetData: null
    }
  }

  getSnippetData = () => {
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/analyze/findAnalyze/getAllAnalyze')
      .then(res => {
      let snippetData = res.data.msg.map((v, i) => {
        v.snippet = JSON.parse(v.snippet);
        v.key = i;
        return v;
      })
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      this.setState({
        snippetData
      })
      }).finally(() => {
        if (this.props.changeLoading) this.props.changeLoading(false);
      });
  }

  componentDidMount() {
    if (this.props.User.type !== USER_TYPE.ADMIN ) this.props.history.push('/login');
    this.getSnippetData();
  }

  deleteSnippet = id => {
    axiosPost('/analyze/deleteAnalyze', {id})
      .then(res => {
        Modal.success({
          content: '删除成功',
          centered: true,
          onOk: this.getSnippetData
        })
      })
  }

  getColumns = () => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '测试网址',
        dataIndex: 'snippet',
        key: 'snippet',
        render: text => new URL(text[0].value).origin,
        align: 'center'
      },
      {
        title: '测试代码行数',
        key: 'snippet',
        dataIndex: 'snippet',
        render: text => text.length,
        align: 'center'
      },
      {
        title: '修改代码',
        render: data => (
          <ChangeSnippetModal snippetData={data} getSnippetData={this.getSnippetData}/>
        ),
        align: 'center'
      },
      {
        title: '删除代码',
        render: text => (
          <Popconfirm title="确认删除?" onConfirm={() =>  this.deleteSnippet(text.id)}>
            <Button type="primary" shape="round" size="small">
              删除代码
            </Button>
          </Popconfirm>
        ),
        align: 'center'
      }
    ];
  }

  render () {
    const { snippetData } = this.state;
    return (
      <div className="snippet-container">
        <Table
          columns={this.getColumns()}
          dataSource={snippetData}
          pagination={{
            showSizeChanger: false,
            pageSize: 7,
          }}
        />
      </div>
    );
  }
}