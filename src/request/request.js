import axios from "axios";
import router from "@/router";
import { Message } from "element-ui"; //引入axios

let instance = axios.create({
  baseURL:  "http://localhost:8080",
});
//http://localhost:8080
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = token; //请求头加上token
    } else {
      router.push("/login");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    //拦截响应，做统一处理
    if (response.data.code) {
      switch (response.data.code) {
        case 4004:
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("info");
          router.push("/login").catch((e) => {
            console.log(e);
          });
          break;

        case 4003:
          Message({
            showClose: true,
            message: "权限不足",
            type: "warning",
          });
          break;
      }
    }
    return response;
  },
  //接口错误状态处理，也就是说无响应时的处理
  (error) => {
    return Promise.reject(error.response.status); // 返回接口返回的错误信息
  }
);
export default instance;
