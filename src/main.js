import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from "qs";
import 'jquery';
// import "font-awesome/css/font-awesome.min.css"
import "element-ui/lib/theme-chalk/index.css"
import ElementUI from 'element-ui'

//导入自定义模块
import {
  getCurDate,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  toDecimal2,
} from "./common.js";
Vue.filter("toDecimal", function(value) {
  return toDecimal2(value);
});


Vue.use(ElementUI);
Vue.config.productionTip = false

// axios.defaults.baseURL = "http://81.70.252.138:8082/"; //将axios挂载到vue上，使用是就可以 this.$axios 这样使用了
axios.defaults.baseURL = "http://localhost:8082/";
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$getCurDate = getCurDate;
Vue.prototype.$setSessionStorage = setSessionStorage;
Vue.prototype.$getSessionStorage = getSessionStorage;
Vue.prototype.$removeSessionStorage = removeSessionStorage;
Vue.prototype.$setLocalStorage = setLocalStorage;
Vue.prototype.$getLocalStorage = getLocalStorage;
Vue.prototype.$removeLocalStorage = removeLocalStorage;

router.beforeEach(function(to, from, next) {
  let user = sessionStorage.getItem("user");
  // console.log("xxx"+user.userId);
  //除了登录、注册、首页、商家列表、商家信息之外，都需要判断是否登录了
  if (
    !(
      to.path == "/" ||
      to.path == "/index" ||
      to.path == "/userLogin" ||
      to.path == "/userRegister"||
      to.path == "/managerLogin"||
      to.path == "/manager"||
      to.path == "/userManage"||
      to.path == "/goodsManage"||
      to.path == "/orderManage"||
      to.path == "/messManage" ||
      to.path == "/goodsDetail"||
      to.path == "/goodsClass"||
      to.path == "/userDetail"||
      to.path == "/search"
    ) 
  ) {
    if (user == "null" || user == null) {
      // this.$message.error("请先登录");
      alert("请先登录！");
      router.push("/userLogin");
      location.reload();
    }
  }
  next();
});


new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
