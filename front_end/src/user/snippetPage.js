import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Descriptions, Avatar, Empty, Table, Button, Modal } from 'antd';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { CodeOutlined } from '@ant-design/icons';
import { axiosGet, axiosPost } from '../common/axios';
import { actionIcon } from '../common/common';
import SnippetModal from '../component/snippetModal';
import errCode from '../common/errorCode';
import '../style/snippetPage.less';

const columns = [
  {
    title: '动作',
    dataIndex: 'action',
    align: 'center',
    render: (text) => {
      const Element = actionIcon[text];
      return <Element />;
    }
  },
  {
    title: '选择器',
    dataIndex: 'selector',
    align: 'center',
    render: (text) => {
      return text ? text : '——';
    }
  },
  {
    title: '标签名',
    dataIndex: 'tagName',
    align: 'center',
    render: (text) => {
      return text ? text : '——';
    }
  },
  {
    title: '内容',
    dataIndex: 'value',
    render: (text, record) => {
      if (record.action === 'goto*') {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            {new URL(text).origin}
          </div>
        )
      }
      if (typeof text === 'object') {
        text = JSON.stringify(text).toString();
      }
      return (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text ? text + '' : '——'}
        </div>
      )
    },
    align: 'center'
  }
];

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class SnippetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      snippet: null,
      name: null,
      visible: false,
      confirmLoading: false
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({id})
    this.props.changeLoading(true);
    axiosGet(`/analyze/findAnalyze/getAnalyze?id=${id}`).then(res => {
      const msg = res.data.msg;
      const { name, time } = msg;
      const snippet = JSON.parse(msg.snippet).map((v, i) => {
        v.key = i;
        return v;
      }); 
      this.setState({
        name,
        time,
        snippet
      })
      this.props.changeLoading(false);
    })
  }

  renderFooter = () => {
    const showModal = () => {
      if (!this.props.User.id) {
        return Modal.error({
          title: '运行测试代码出错',
          content: '未登录无权进行操作',
          okText: '登录',
          onOk: () => {
            this.props.history.push('/login');
          },
          centered: true
        });
      } 
      this.setState({
        visible: true
      });
    }
    const {visible, confirmLoading, name} = this.state;
    const onOk = (params) =>{
      this.setState({confirmLoading: true});
      axiosPost('/history/addHistory', {
        snippetId: this.state.id,
        ...params
      }).then(res => {
        this.setState({
          confirmLoading: false,
          visible: false
        });
        Modal.success({
          content: res.data.msg,
          centered: true
        });
      },
      err => {
        const content  = errCode[err.response.data.errCode];
        Modal.error({
          title: '重新执行测试代码',
          content,
          centered: true
        });
      })
    };
    return (
      <div>
        <Button type="primary" shape="round" icon={<CodeOutlined />} onClick={showModal}>开始测试</Button>
        <SnippetModal
          title={name}
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
          onOk={onOk}
          snippet={this.state.snippet}
        />
      </div>
    );
  }

  render() {
    const { name, time, snippet } = this.state;
    if (!snippet) 
      return(
        <div className="snippet-container empty-container">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>
        </div>
      );
    const url = new URL(snippet[0].value);
    const origin = url.origin;

    return(
      <div className="snippet-container">
        <Descriptions title={name} 
          bordered
          layout="vertical"
          column={{ xxl: 4, xl: 4, lg: 4, md: 4, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="代码名称">{name}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(parseInt(time, 0)).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="测试网址">
            <a href={origin} target="_blank">
              <Avatar shape="square" src={origin+'/favicon.ico'}/>{origin}
            </a>
          </Descriptions.Item>  
          <Descriptions.Item label="测试代码长度">{snippet.length}行</Descriptions.Item>
          <Descriptions.Item label="代码段">
            <Table
              style={{width: '100%'}}
              columns={columns}
              dataSource={snippet}
              locale={{
                filterTitle: '筛选',
                filterConfirm: '确定',
                filterReset: '重置',
                emptyText: '暂无数据',
              }}
              footer={this.renderFooter}
            />
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default SnippetPage;