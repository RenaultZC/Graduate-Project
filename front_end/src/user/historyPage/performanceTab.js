import React, { Component } from 'react';
import { SERVER_HOST } from '../../common/config';
import { Empty, Row, Col, Typography, Button, Spin } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';

const performanceName = {
  cache: '读取缓存时间',
  dns: 'DNS解析耗时',
  tcp: 'TCP连接耗时',
  req: '网络请求耗时',
  res: '数据传输耗时',
  dom: 'DOM解析耗时',
  readycb: 'domContentLoaded回调函数耗时',
  fasrt: '首屏异步资源加载耗时',
  loadcb: 'load回调函数耗时',
  ready: '白屏时间',
  load: '页面完全加载时间'
};

export default class PerformanceTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }
  getOption(analyzeData) {
    const data = Object.keys(analyzeData).map(v => ({
      value: analyzeData[v],
      name: performanceName[v],
    })).filter(v => v.value > 0);
    return {
      backgroundColor: '#2c343c',
      title: {
        text: '页面加载耗时',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      visualMap: {
        show: false,
        min: 0,
        max: 10000,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '操作耗时',
          type: 'pie',
          radius: '55%',
          center: ['50%', '55%'],
          data: data.sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    }
  }

  render () {
    if (!this.props.analyzeData) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>;
    const analyzeFile = SERVER_HOST + '/analyzeFile' + this.props.analyzeFile;
    const analyzeData = JSON.parse(this.props.analyzeData);
    return(
      <React.Fragment>
        <Row align="middle" justify="end">
          <Col>
            <Typography.Text type="danger">如果加载失败请点击下载按钮下载文件然后拖入分析</Typography.Text>
          </Col>
          <Col  offset={3}>
            <Button type="primary" shape="round" icon={<DownloadOutlined /> } href={analyzeFile} target="_blank">Download</Button>
          </Col>
        </Row>
        <br/>
        <ReactEcharts option={this.getOption(analyzeData)}/>
        <Spin spinning={this.state.loading}  tip="加载中..." size="large">
          <iframe
            onLoad={()=>{this.setState({loading: false})}}
            className="performanceIframe"
            src={`https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=${analyzeFile}`}
          />
        </Spin>
      </React.Fragment>
    );
  }
}