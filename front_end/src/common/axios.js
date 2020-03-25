import axios from 'axios'
import { Modal } from 'antd';
import { SERVER_HOST } from './config';



let newAxios = axios.create({
    baseURL: SERVER_HOST, // 这里是本地express启动的服务地址
    timeout: 5000 // request timeout
})

newAxios.defaults.withCredentials = true; 

newAxios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (!error.response) {
    Modal.error({
      title: '请求失败',
      content: '服务器无响应',
      centered: true
    })
  }
  return Promise.reject(error)
}
)

export const axiosGet = (url, params) => {
  return newAxios.get(url, { params });
};

export const axiosPost = (url, data) => {
  return newAxios.post(url, data);
};