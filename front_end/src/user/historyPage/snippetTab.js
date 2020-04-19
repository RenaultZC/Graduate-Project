import React, {Component} from 'react';
import ReactEcharts from "echarts-for-react";
import { actionIcon } from '../../common/common'
import { Descriptions, Table, Empty } from 'antd';

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
  },
  {
    title: '执行耗时',
    dataIndex: 'delay',
    render: text => `${text}ms`,
    align: 'center'
  }
];
export default class SnippetTab extends Component {
  expandedRowRender = (record) => {
    return (
      <React.Fragment>  
        <Descriptions bordered size="small">
          <Descriptions.Item label="校验方式">{record.check === 'element' ? '检查元素' : '校验输出'}</Descriptions.Item>
          <Descriptions.Item label="校验内容">{record.checkValue}</Descriptions.Item>
          <Descriptions.Item label="校验结果">{record.result ? '校验成功' : '校验失败'}</Descriptions.Item>
        </Descriptions>
      </React.Fragment>
    );
  }

  getOption(snippet) {
    const data = snippet.map(v => {
      return {
        name: v.action === 'goto*' ? `${v.action} ${(new URL(v.value)).origin}` : `${v.action} ${v.value}`,
        value: v.delay
      }
    })
    return{
      title: {
          left: 'center',
          text: '执行耗时分布',
      },
      tooltip: {
        formatter: function (info) {
          const { name, value } = info;
          return [
            '执行动作: &nbsp;&nbsp;' + name + '<br>',
            '执行耗时: &nbsp;&nbsp;' + value + 'ms<br>',
          ].join('');
        }
      },
        series: [{
          type: 'treemap',
          data,
        }]
    }
  }

  render () {
    const { snippet } = this.props;
    if (!snippet) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>;
    return (
      <React.Fragment>
        <ReactEcharts
        option={this.getOption(snippet)}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        />
        <br/>
        <Table
          style={{width: '100%'}}
          columns={columns}
          dataSource={snippet}
          footer={this.renderFooter}
          expandable={{
            expandedRowRender: this.expandedRowRender,
            rowExpandable: record => record.check,
          }}
          rowClassName={ rec => {
            switch (rec.result) {
              case true: 
                return 'snippet-success';
              case false:
                return 'snippet-error';
              default: return;
            }
          }}
        />
      </React.Fragment>
    );
  }
}