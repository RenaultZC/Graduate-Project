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
  Table
} from 'antd';
import { actionIcon } from '../common/common'
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
        <Form
          {...layout}
          name="basic"
          layout="horizontal"
          onFinish={(v) => console.log(v)}
          hideRequiredMark
        >
          <Row>
            <Col span={16} offset={1}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '请输入运行名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="是否展示界面" name="headless">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否定时执行" name="headless">
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
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
};
