import React, {Component} from 'react';
import ReactEcharts from "echarts-for-react";
import { Table, Empty } from 'antd';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import RequestModal from '../../component/requestModal';

export default class RequestTab extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredInfo: null,
      sortedInfo: null,
    };
  }

  getOptions(consums) {
    const data = consums.map(v => ({
      name: new URL(v.url).origin,
      value: v.delay,
      status: v.status,
      method: v.method,
      id: v.id,
    }));
    return {
      title: {
          left: 'center',
          text: '请求响应耗时占比',
      },
      tooltip: {
          formatter: function (info) {
            const { id, name, method, status, value } = info.data;
              return [
                  'id: &nbsp;&nbsp;' + id + '<br>',
                  'URL: &nbsp;&nbsp;' + name + '<br>',
                  '方法: &nbsp;&nbsp;' + method + '<br>',
                  '响应码: &nbsp;&nbsp;' + status + '<br>',
                  '请求时长: &nbsp;&nbsp;' + value
              ].join('');
          }
      },
      series: [{
          name: 'ALL',
          top: 80,
          type: 'treemap',
          label: {
              show: true,
              formatter: "{b}",
              normal: {
                  textStyle: {
                      ellipsis: true
                  }
              }
          },
          itemStyle: {
              normal: {
                  borderColor: 'black'
              }
          },
          levels: [
              {
                color: [
                  '#c23531', '#314656', '#61a0a8', '#dd8668',
                  '#91c7ae', '#6e7074', '#61a0a8', '#bda29a',
                  '#44525d', '#c4ccd3'
                ],
                colorMappingBy: 'value',
                  itemStyle: {
                      borderWidth: 1,
                      borderColor: '#333',
                      gapWidth: 1
                  }
              }
          ],
          data
      }]
    };
  }

  getColumns = (requestStatusFilter, urlFilter) => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        filters: urlFilter,
        onFilter: (value, record) => record.url.includes(value),
        ellipsis: true,
        width: 170
      },
      {
        title: '响应状态',
        dataIndex: 'status',
        key: 'status',
        filters: requestStatusFilter,
        sorter: (a, b) => a.status - b.status,
        onFilter: (value, record) => record.status === value,
        width: 130,
        align: 'center'
      },
      {
        title: 'fromCache',
        dataIndex: 'fromCache',
        key: 'fromCache',
        render(text) {
          return text 
            ? <CheckCircleOutlined style={{color: '#52c41a'}} />
            : <CloseCircleOutlined style={{color: '#f5222d'}} />;
        },
        align: 'center',
        width: 80
      },
      {
        title: 'fromServiceWorker',
        dataIndex: 'fromServiceWorker',
        key: 'fromServiceWorker',
        render(text) {
          return text 
            ? <CheckCircleOutlined style={{color: '#52c41a'}} />
            : <CloseCircleOutlined style={{color: '#f5222d'}} />;
        },
        align: 'center',
        width: 120
      },
      {
        title: '详情',
        render(data) {
          return <RequestModal requestData={data} />;
        },
        width: 80,
        align: 'center'
      },
    ];
  }

  render () {
    let { consums } = this.props;
    if (!consums.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>;
    let requestStatusFilter = {}, urlFilter = {};
    consums = consums.map((v, i) => {
      const status = v.status;
      const remarks = JSON.parse(v.remarks);
      const url = new URL(remarks.url).origin;
      requestStatusFilter[status] = { text: status, value: status}; 
      urlFilter[url] = { text: url, value: url}; 
      return {
        ...v,
        key: i,
        ...remarks
      };
    });
    requestStatusFilter = Object.keys(requestStatusFilter).map(v => requestStatusFilter[v]);
    urlFilter = Object.keys(urlFilter).map(v => urlFilter[v]);
    return (
      <React.Fragment>
        <ReactEcharts option={this.getOptions(consums)} />
        <br/>
        <Table
          dataSource={consums}
          onChange={this.handleChange}
          pagination={{ showSizeChanger: false }}
          columns={this.getColumns(requestStatusFilter, urlFilter)}
        />
      </React.Fragment>
    )
  }
}