<template>
  <v-app-bar app color="white" light elevate-on-scroll scroll-target="#scrolling-techniques-7">
    <div class="d-flex align-center" @click="$router.push('/')">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
        transition="scale-transition"
        width="30"
      />

      <!-- <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        min-width="100"
        src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
        width="100"
      />-->
    </div>
    <v-app-bar-nav-icon color="blue" transition="scale-transition" @click.stop="onToggleDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title v-if="title != ''">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="!token">
      <v-btn text large dark color="blue" @click="jump('Login')">登入</v-btn>
      <v-btn depressed large dark color="blue" @click="jump('Register')">注册</v-btn>
    </div>
    <div v-else>
      <v-btn text icon color="blue" @click="$router.push('/Message')">
        <v-badge
          v-if="msg_state == true"
          :content="msg_num"
          color="red"
          offset-x="10"
          offset-y="12"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>mdi-bell</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      fav: true,
      menu: false,
      msg_menu: false,
      // msg_state: false,
      // msg_list: [],
      message: false,
      hints: true,
      drawer: this.value
    };
  },
  props: {
    replaceProfileWithMenu: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      msg_state: state => state.statemsg.data.msg_state,
      msg_num: state => state.statemsg.data.msg_num,
      avatar: state => state.user.avatar,
      username: state => state.user.username,
      email_verify: state => state.user.email_verify,
      token: state => state.user.token,
      mystate: state => state.user.mystate,
      usertype: state => state.user.usertype
    })
  },
  mounted() {},
  watch: {
    $$route() {}
  },
  methods: {
    jump(link) {
      if (this.$route.path != "/" + link) {
        this.$router.push({ path: "/" + link });
      }
      if (!link) {
        this.$router.push({ path: "/" });
      }
    },

    onToggleDrawer() {
      this.drawer = false;
      if (this.drawer === true) {
        this.drawer = false;
      } else {
        this.drawer = true;
      }
      this.$emit("input", this.drawer);
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
， #app {
  width: 100%;
  height: 100%;
}
</style>
