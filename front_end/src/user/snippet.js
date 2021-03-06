import React, {Component} from 'react';
import { List, Avatar, Input } from 'antd';
import { ClockCircleOutlined, CodeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { axiosGet } from '../common/axios';
import { SERVER_HOST } from '../common/config';
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
      snippetData: [],
      queryParams: '',
      searchOnload: false,
    };
  }

  componentDidMount () {
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/analyze/findAnalyze/getAllAnalyze').then(res => {
      const snippetData = res.data.msg.map(v => {
        try{
          v.snippet = JSON.parse(v.snippet);
        } catch(e) {
          console.log(JSON.parse(v.snippet), e)
        }
        return v;
      })
      this.setState({
        snippetData
      })
      if (this.props.changeLoading) this.props.changeLoading(false);
    })
  }

  renderHeader = () => {
    const onSearch = (name) => {
      this.setState({searchOnload: true});
      axiosGet('/analyze/findAnalyze/selectAnalyze', { name }).then(res => {
        const snippetData = res.data.msg.map(v => {
          v.snippet = JSON.parse(v.snippet);
          return v;
        })
        this.setState({
          snippetData
        })
      }).finally(() => {
        this.setState({
          searchOnload: false
        })
      })
    }
    return (
      <div>
        <Input.Search
          enterButton
          placeholder="搜索测试代码"
          onSearch={onSearch}
          loading={this.state.searchOnload}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="snippet-container">
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            showSizeChanger: false,
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
                    onError={e=> {
                      if(e && e.target && e.target.src)
                        e.target.src = SERVER_HOST + '/avatar/1588756245277_11.jpeg';
                      return false;
                    }}
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={avatar}
                  onError={e=> {
                    if(e && e.target && e.target.src)
                      e.target.src = SERVER_HOST + '/avatar/1588756245277_11.jpeg';
                    return false;
                  }}/>}
                  title={<NavLink to={`/snippet/${item.id}`}>{item.name}</NavLink>}
                  description={`测试网址: ${origin}`}
                />
                {item.content}
              </List.Item>
          )}}
          header={this.renderHeader()}
        />
      </div>
    );
  }
}

export default Snippet;