import React, { Component } from 'react';
import { 
  Modal,
  Form,
  Input,
  Button,
  Switch,
  Row,
  Col,
  TimePicker,
  Checkbox,
  Table,
  Select,
  InputNumber
} from 'antd';
import { actionIcon } from '../common/common'
import moment from 'moment';
import './index.less';

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

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

export default class SnippetModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displayTime: false,
      snippet: this.props.snippet
    };
  }

  switchOnChange = (displayTime) => {
    this.setState({displayTime});
  };

  rowRender = (record, index) => {
    return (
      <Form
        layout="inline"
        initialValues={record}
        onFinish={(value) => {
          const snippet = this.state.snippet;
          snippet[index] = Object.assign(snippet[index], value);
          this.setState({snippet});
        }}
        hideRequiredMark
      >
        <Row>
          <Col span={8}>
            <Form.Item
              label="校验方式"
              name="check"
              rules={[{ required: true, message: '请选择校验方式' }]}
            >  
              <Select defaultValue={record.check}>
                <Select.Option value="element">检查元素</Select.Option>
                <Select.Option value="console">校验输出</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={10} offset={1}>
            <Form.Item
              label="校验内容"
              name="checkValue"
              rules={[{ required: true, message: '请输入校验内容' }]}
            >
              <Input placeholder="请输入校验内容"/>
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item>
              <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>  
          </Col>
        </Row>
      </Form>
    );
  }

  render () {
    const { visible, confirmLoading, onOk, onCancel, title } = this.props;
    const { displayTime, snippet } = this.state;
    return (
      <Modal
        centered
        destroyOnClose
        title={title}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        confirmLoading={confirmLoading}
        footer={null}
        className="snippet-modal-container"
        width="80vw"
      >
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
          expandable={{
            expandedRowRender: this.rowRender,
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <Button size="small" onClick={e => onExpand(record, e)}>收起添加</Button>
              ) : (
                <Button size="small" onClick={e => onExpand(record, e)}>添加校验</Button>
              )
          }}
        />
        <Form
          {...layout}
          name="basic"
          layout="horizontal"
          initialValues={{
            time: moment(new Date(), 'HH:mm:ss'),
            delayTime: 0,
            ...this.state.defaultValue
          }}
          onFinish={(result) => {
            result.time = result.time.format('ss mm HH')
            const { time, days, cronTime, headless, name } = result;
            const params = {
              name,
              snippet: JSON.stringify(this.state.snippet),
              headless: headless ? true : false,
              cronTime: cronTime ? `${time} ${days.length ? days.join(',') : '*'} * *` : '',
            };
            onOk(params);
          }}
          hideRequiredMark
        >
          <Row>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入运行名称' }]}
              >
                <Input placeholder="输入运行代码名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="是否展示界面"
                name="headless"
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 8 }}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="是否定时执行"
                name="cronTime"
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 8 }}
              >
                <Switch onChange={this.switchOnChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{display: displayTime ? "flex": 'none'}}>
            <Col span={12}>
              <Form.Item label="选择时间" name="time">
                <TimePicker />
              </Form.Item>
            </Col>
            <Col  span={12}>
              <Form.Item name="days" wrapperCol={24}>
                <Checkbox.Group>
                  <Row>
                    <Col span={6}>
                      <Checkbox value="1" style={{ lineHeight: '32px' }}>
                        星期一
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="2" style={{ lineHeight: '32px' }}>
                        星期二
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="3" style={{ lineHeight: '32px' }}>
                        星期三
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="4" style={{ lineHeight: '32px' }}>
                        星期四
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="5" style={{ lineHeight: '32px' }}>
                        星期五
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="6" style={{ lineHeight: '32px' }}>
                        星期六
                      </Checkbox>
                    </Col>
                    <Col span={6}>
                      <Checkbox value="7" style={{ lineHeight: '32px' }}>
                        星期天
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="email"
                label="通知邮箱"
                rules={[
                  {
                    required: true,
                    pattern: /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,4},?)+$/,
                    message: '请输入正确的邮箱' 
                  }
                ]}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
              >
                <Input placeholder="输入通知邮箱以逗号分隔" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name="delayTime"
                label="执行时延"
                labelCol={{ span: 14 }}
                wrapperCol={{ span: 10}}
              >
                <InputNumber
                  min={0}
                  formatter={value => `${value}ms`}
                  parser={value => value.replace('ms', '')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              执行代码
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
};
