import React, {Component} from 'react';
import ReactZmage from 'react-zmage';
import { SERVER_HOST } from '../../common/config';
import { Empty, Card, Row, Col } from 'antd';
const { Meta } = Card;

export default class ScreenshotTab extends Component {
  render () {
    let screenshots = this.props.screenshots.map(v => ({
      src: SERVER_HOST + v.path
    }));
    if (!screenshots.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据"/>;
    screenshots = screenshots.map((v, i) => (
      <Col span={8} key={i}>
        <Card 
          hoverable={true}
          bordered={true}
          cover={<ReactZmage style={{height: 220}} src={v.src} set={screenshots} defaultPage={i} />}
          style={{boxSizing: 'border-box', margin: '5px'}}
        >
          <Meta title={'运行截图' + (i + 1)}/>
        </Card>
      </Col>
    ));
    const screenshotTab = [];
    while(screenshots.length) {
      const arr = [];
      for (let i = 0; i < 3 && screenshots.length; i++) {
        arr.push(screenshots.shift());
      }
      screenshotTab.push((
        <Row gutter={16} style={{marginTop: 10}} key={screenshotTab.length}>
          {arr}
        </Row>
      ))
    }
    return screenshotTab;
  }
}