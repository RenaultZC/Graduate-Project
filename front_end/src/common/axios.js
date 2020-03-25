import axios from 'axios'
import { Modal } from 'antd';


let newAxios = axios.create({
    baseURL: "http://localhost:1000", // 这里是本地express启动的服务地址
    timeout: 5000 // request timeout
})

newAxios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  Modal.error({
    title: '请求失败',
    content: '服务器无响应',
    centered: true
  })
  return Promise.reject(error)
}
)

export const axiosGet = (url, params) => {
  return newAxios.get(url, { params });
};

export const axiosPost = (url, data) => {
  return newAxios.post(url, data);
};