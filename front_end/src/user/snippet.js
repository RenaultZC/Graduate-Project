import React, {Component} from 'react';
import { List, Avatar, Empty } from 'antd';
import { ClockCircleOutlined, CodeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { axiosGet } from '../common/axios';
import '../style/snippet.less';

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const mapDispatchToProps = (dispatch) => {
  return {
    changeUser: (User) => {
      dispatch({type: 'CHANGE_USER', User})
    },
    changeLoading: (loading) => {
      dispatch({type: 'CHANGE_LOADING', loading})
    }
  }
}

@connect(null, mapDispatchToProps)
class Snippet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snippetData: []
    };
  }

  componentDidMount () {
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/analyze/findAnalyze/getAllAnalyze').then(res => {
      let snippetData = res.data.msg.map(v => {
        v.snippet = JSON.parse(v.snippet);
        return v;
      })
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      snippetData = snippetData.concat(snippetData);
      this.setState({
        snippetData
      })
      if (this.props.changeLoading) this.props.changeLoading(false);
      console.log(snippetData)
    })
  }

  render() {
    const { snippetData } = this.state;
    if (!snippetData.length) 
      return(
        <div className="snippet-container empty-container">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>
        </div>
      );
    return (
      <div className="snippet-container">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={this.state.snippetData}
          renderItem={item => {
            const time = new Date(parseInt(item.time, 0)).toLocaleString();
            const length = item.snippet.length;
            const origin = new URL(item.snippet[0].value).origin;
            const avatar = origin + '/favicon.ico';
            return (
              <List.Item
                key={time}
                actions={[
                  <IconText icon={ClockCircleOutlined} text={time} key="list-vertical-message" />,
                  <IconText icon={CodeOutlined} text={length} key="list-vertical-star-o" />,
                ]}
                extra={
                  <img
                    width={100}
                    alt="logo"
                    src={avatar}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatar} />}
                  title={<NavLink to={`/snippet/${item.id}`}>{item.name}</NavLink>}
                  description={`测试网址: ${origin}`}
                />
                {item.content}
              </List.Item>
          )}}
        />
      </div>
    );
  }
}

export default Snippet;