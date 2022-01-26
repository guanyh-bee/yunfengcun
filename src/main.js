import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import qs from "qs";
import * as echarts from "echarts";
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.prototype.$qs = qs;
Vue.prototype.$echarts = echarts;
import "./assets/css/base.less";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
