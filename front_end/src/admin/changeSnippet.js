import React, { Component, useContext, useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Input, Row, Col, Typography, Form } from 'antd';
import { axiosPost } from '../common/axios';
import { actionIcon } from '../common/common';
import errCode from '../common/errorCode';
import '../style/changeSnippet.less';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default class ChangeSnippetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      id: this.props.snippetData.id,
      name: this.props.snippetData.name,
      snippet: this.props.snippetData.snippet.map((v, i) => ({ key: i, ...v })),
    }
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({visible: false});  
  }

  onChangeName= (e) => {
    this.setState({
      name: e.target.value
    })
  }

  handleDelete = key => {
    const dataSource = [...this.state.snippet];
    this.setState({
      snippet: dataSource.filter(item => item.key !== key),
    });
  };

  handleSave = row => {
    const newData = [...this.state.snippet];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      snippet: newData,
    });
  };

  getColumns = () => {
    return [
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
        },
        editable: true,
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
        editable: true,
        align: 'center'
      }
    ];
  }

  onChangeButtonClick = () => {
    const { name, id, snippet} = this.state;
    this.setState({
      confirmLoading: true,
    })
    axiosPost('/analyze/changeAnalyze', {
      value: {
        name,
        snippet: JSON.stringify(snippet)
      },
      search: {
        id
      }
    }).then(res => {
      this.setState({
        confirmLoading: false,
        visible: false
      })
      Modal.success({
        content: '修改成功',
        centered: true,
        onOk: () => {this.props.getSnippetData()}
      })
    },
    err => {
      const content  = errCode[err.response.data.errCode];
      Modal.error({
        title: '修改代码出错',
        content,
        centered: true
      });
    })
  }

  render() {
    const { visible, confirmLoading, name, snippet } = this.state;    
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.getColumns().map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <React.Fragment>
        <Button type="primary" shape="round" size="small" onClick={this.onClick}>修改代码</Button>
        <Modal
          centered
          destroyOnClose
          onCancel={this.onCancel}
          visible={visible}
          confirmLoading={confirmLoading}
          maskClosable={false}
          footer={null}
          width="80vw"
          className="changeSnippet"
        >
          <br/>
          <Row>
            <Col span={4}>
              <Typography.Title level={4} style={{textAlign: 'right'}}>
                代码名称:
              </Typography.Title>
            </Col>
            <Col offset={1} span={18}>
              <Input allowClear defaultValue={name} onChange={this.onChangeName}/>
            </Col>
          </Row>
          <Table
            style={{width: '100%'}}
            columns={columns}
            rowClassName={() => 'editable-row'}
            components={components}
            dataSource={snippet}
            pagination={{ showSizeChanger: false, pageSize: 8 }}
            locale={{
              filterTitle: '筛选',
              filterConfirm: '确定',
              filterReset: '重置',
              emptyText: '暂无数据',
            }}
            footer={this.renderFooter}
          />
          <Row justify="end"><Button size="large" type="primary" shape="round" onClick={this.onChangeButtonClick}>提交修改</Button></Row>
        </Modal>
      </React.Fragment>
    )
  }
}