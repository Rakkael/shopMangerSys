import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './css/globalStyle.css'
import axios from 'axios'


Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  // Do something before request is sent
  console.log("Config:", config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
