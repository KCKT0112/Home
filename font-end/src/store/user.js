import { getGravatarAddress } from "@/helpers/gravatar";
import { md5 } from "@/helpers/md5";

export default {
  state: {
    token: "",
    username: "",
    email: "",
    usertype: "",
    email_verify: "",
    avatar: "",
    mystate: "",
    sex: "",
    myurl: [],
    oauth: []
  },
  mutations: {
    pushtoken(state, token) {
      state.token = token;
    },
    pushprofile(state, data) {
      if (data.token) {
        state.token = data.token;
      }
      state.username = data.username;
      state.email = data.email;
      state.email_verify = data.email_verify;
      state.usertype = data.usertype;
      state.avatar = "https://www.gravatar.com/avatar/" + data.avatar + "?s=400";
      state.mystate = data.mystate;
      state.sex = data.sex;
      state.myurl = data.myurl;
      state.oauth = data.oauth;
    },
    clearstate(state) {
      state.token = "";
      state.username = "";
      state.email = "";
      state.usertype = "";
      state.email_verify = NaN;
      state.avatar = "";
      state.mystate = "";
      state.sex = NaN;
      state.myurl = [];
      state.oauth = [];
    },
    updateEs(state) {
      state.email_verify = 1;
    },
    updateAvatarAddress(state, address) {
      state.avatar = address;
    },
    updateMyState(state, mystate) {
      state.mystate = mystate;
    },
    updateSex(state, sex) {
      state.sex = sex;
    },
    updateGithubBind(state, data) {
      state.oauth.github = data;
    },
    updateGitlabBind(state, data) {
      state.oauth.gitlab = data;
    }
  },
  actions: {
    async chooseBestAvatarAddress({ state, commit }) {
      commit("updateAvatarAddress", getGravatarAddress(md5(state.email)));
    },
  },
  getters: {}
};
