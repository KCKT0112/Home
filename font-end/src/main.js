import Vue from 'vue';
import md5 from 'js-md5';
import jwtDecode from 'jwt-decode';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueMarkdown from 'vue-markdown';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import snackbar from './components/Snackbar/int';
import '@/components';
import './registerServiceWorker';
import VueBus from 'vue-bus';

Vue.prototype.$snackbar = snackbar;
Vue.config.productionTip = false;
Vue.prototype.$md5 = md5;

Vue.prototype.$jwtDecode = jwtDecode;

Vue.use(VueBus);

Vue.use(mavonEditor);

Vue.use(VueMarkdown);
Vue.use(VueReCaptcha, {
  siteKey: process.env.VUE_APP_reCAPTCHA_siteKey,
  loaderOptions: {
    useRecaptchaNet: process.env.VUE_APP_reCAPTCHA_useRecaptchaNet,
    autoHideBadge: process.env.VUE_APP_reCAPTCHA_autoHideBadge
  }
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.role == true) {//判断是否需要登录
    if (localStorage.getItem('token')) {
      if (to.meta.admin == true) {
        const decoded = jwtDecode(localStorage.getItem('token'));
        if (decoded.usertype == 0) {
          next("/");
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next({
        name: "login",
        params: {
          from: to.fullPath
        }
      });
    }

  } else {
    next();
  }
});

const socket = io(process.env.VUE_APP_ApiUrl);

Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');
