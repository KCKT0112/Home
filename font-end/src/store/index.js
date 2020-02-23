import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import statemsg from './statemsg';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    UPDATE_LOADING: false,
    UPDATE_OfflineShow: false,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    statemsg
  }
});
