import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Descriptions, Avatar, Empty } from 'antd';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet } from '../common/axios';
import '../style/snippetPage.less';


@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class SnippetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      snippet: null,
      name: null
    }
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.setState({id})
    this.props.changeLoading(true);
    axiosGet(`/analyze/findAnalyze/getAnalyze?id=${id}`).then(res => {
      const msg = res.data.msg;
      const { name, time } = msg;
      const snippet = JSON.parse(msg.snippet); 
      this.setState({
        name,
        time,
        snippet
      })
      this.props.changeLoading(false);
    })
  }

  render() {
    const { name, time, snippet } = this.state;
    console.log(this.state);
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
          column={{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
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
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1<br />
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default SnippetPage;