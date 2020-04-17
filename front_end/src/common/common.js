import React from 'react';
import {
  LoginOutlined,
  LoadingOutlined,
  SelectOutlined,
  FileTextOutlined,
  EditOutlined,
  DownSquareOutlined,
  UploadOutlined,
  LogoutOutlined,
  DesktopOutlined
} from '@ant-design/icons';
import { Badge } from 'antd';

export const actionIcon = {
  'goto*': () => <div><LoginOutlined /> 前往</div>,
  'viewport*': () => <div><DesktopOutlined /> 视口</div>,
  'click': () => <div><SelectOutlined /> 点击</div>,
  'dblclick': () => <div><SelectOutlined /> 特殊点击</div>,
  'change': () => <div><FileTextOutlined /> 修改</div>,
  'keydown': () => <div><EditOutlined /> 键入</div>,
  'select': () => <div><DownSquareOutlined /> 选择</div>,
  'submit': () => <div><UploadOutlined /> 提交</div>,
  'load': () => <div><LoadingOutlined /> 载入</div>,
  'unload': () => <div><LogoutOutlined /> 卸载</div>
}

export const StatusBadge = {
  0: <Badge status="processing" text="运行中" />,
  1: <Badge status="success" text="测试成功" />,
  2: <Badge status="error" text="测试失败" />
};