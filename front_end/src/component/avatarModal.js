import React, { Component } from 'react';
import { Button, Modal, Upload, message, Row, Col } from 'antd';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import { axiosPost } from '../common/axios';
import errCode from '../common/errorCode';
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css"
import './avatarModal.less';

export default class AvatarModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      file: null,
      avatar: null,
      cropperSrc: null,
    };
    this.unmount = false;
  }

  onClick = () => {
    this.setState({visible: true});
  }

  onCancel = () => {
    this.setState({
      visible: false,
      confirmLoading: false,
      file: null,
      avatar: null,
      cropperSrc: null,
    });  
    this.unmount = true;
  }

  getUploadProps =() => ({
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJpgOrPng) {
        message.error('只允许上传JPG/PNG文件');
        return false;
      } else if (!isLt2M) {
        message.error('图片大小小于2MB');
        return false;
      }
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        const dataURL = e.target.result
        this.setState({cropperSrc: dataURL, file})
      }
      fileReader.readAsDataURL(file);
      return false;
    },
  });

  onOk = () => {
    this.setState({ confirmLoading: true });
    const filename = this.state.file.name;
    this.cropper.getCroppedCanvas().toBlob(async blob => {
      // 创造提交表单数据对象
      const formData = new FormData();
      // 添加要上传的文件
      formData.append('file', blob, filename);
      // 提示开始上传
      this.setState({submitting: true});
      // 上传图片
      axiosPost('/user/uploadAvatar', formData)
        .then(res => {
          if (!this.unmount) {
            this.props.setAvatar(res.data.msg.filePath);
            this.setState({
              visible: false,
              confirmLoading: false,
              file: null,
              avatar: null,
              cropperSrc: null,
            });
            this.unmount = true;
          }
        },
        err => {
          message.error(errCode[err.response.data.errCode]);
          this.setState({confirmLoading: false});
        })
      
    })
  }

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <React.Fragment>
        <Button icon={<UploadOutlined/>} onClick={this.onClick}>上传头像</Button>
        <Modal
          centered
          destroyOnClose
          onCancel={this.onCancel}
          visible={visible}
          confirmLoading={confirmLoading}
          maskClosable={false}
          okText="保存"
          cancelText="取消"
          width="450px"
          className="avatar-modal"
          onOk={this.onOk}
        >
          <br/>
          <Upload {...this.getUploadProps()}>
            <Button>
              <FileImageOutlined /> 选择图片
            </Button>
          </Upload>
          <br/>
          <br/>
          <Row justify="space-between">
            <Col>
              <Cropper
                src={this.state.cropperSrc}
                ref={cropper => this.cropper = cropper}
                viewMode={3}
                zoomable={true}
                aspectRatio={1}
                guides={true}
                className="cropper"
                preview='.cropper-preview'
              />
            </Col>
            <Col>
              <div className="cropper-preview"></div>
            </Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}