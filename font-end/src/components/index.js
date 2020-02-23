import Vue from 'vue';
import MyAppBar from './MyAppBar.vue';
import EmailVerifyAlert from './MyAppBar.vue';
import CLoading from './CLoading.vue';
import WithAppBarShortcut from './WithAppBar.vue';

Vue.component('my-app-bar', MyAppBar);
Vue.component('email-verify-alert', EmailVerifyAlert);
Vue.component('component-loading-tips', CLoading);
Vue.component('with-app-bar', WithAppBarShortcut);
