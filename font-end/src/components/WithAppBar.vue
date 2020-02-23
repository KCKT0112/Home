<template>
  <div>
    <my-app-bar v-bind="$attrs" v-model="drawer"></my-app-bar>
    <v-navigation-drawer app v-model="drawer" disable-resize-watcher temporary>
      <template v-slot:prepend>
        <v-list-item class="pt-2">
          <v-avatar>
            <img :src="avatar" alt="avatar" />
          </v-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content v-if="!token">
            <v-list-item-title class="title">您好!</v-list-item-title>
            <v-list-item-subtitle>请登入</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-content v-else>
            <v-list-item-title class="title">{{ username }}</v-list-item-title>
            <v-list-item-subtitle>{{ mystate }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list nav v-if="!token">
        <v-list-item-group>
          <v-divider></v-divider>
          <v-list-item @click="jump()">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>home</v-icon>
            </v-list-item-icon>
            <span>主页</span>
          </v-list-item>

          <v-list-item @click="jump('Login')">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>perm_identity</v-icon>
            </v-list-item-icon>
            <span>登入</span>
          </v-list-item>

          <v-list-item @click="jump('Register')">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>person_add</v-icon>
            </v-list-item-icon>
            <span>注册</span>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list nav v-else>
        <v-list-item-group>
          <v-divider></v-divider>
          <div v-if="!email_verify" class="pt-1">
            <v-list-item @click="$router.push({ name: 'settings', params: { verify: true } })">
              <!-- $router.push({name: 'settings', query: {verify: true}} -->
              <v-list-item-icon class="ma-2 pt-1">
                <v-icon color="red">mdi-alert-circle-check</v-icon>
              </v-list-item-icon>
              <span class="red--text">验证你的邮箱地址</span>
            </v-list-item>
            <v-divider></v-divider>
          </div>
          <v-list-item @click="jump()">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>home</v-icon>
            </v-list-item-icon>
            <span>主页</span>
          </v-list-item>

          <v-list-item @click="jump('Profile')">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>perm_identity</v-icon>
            </v-list-item-icon>
            <span>简介</span>
          </v-list-item>

          <v-list-item @click="jump('Message')">
            <v-list-item-icon class="ma-2 pt-1">
              <v-icon>email</v-icon>
            </v-list-item-icon>
            <span>消息</span>
          </v-list-item>

          <div v-if="token" class="pt-1">
            <v-divider></v-divider>

            <v-list-item @click="jump('Settings')">
              <v-list-item-icon class="ma-2 pt-1">
                <v-icon>settings</v-icon>
              </v-list-item-icon>
              <span>设置</span>
            </v-list-item>

            <v-list-item @click="Logout()">
              <v-list-item-icon class="ma-2 pt-1">
                <v-icon>logout</v-icon>
              </v-list-item-icon>
              <span>登出</span>
            </v-list-item>
          </div>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="100%">
      <v-content>
        <slot />
      </v-content>
    </v-sheet>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getGravatarAddress } from "@/helpers/gravatar";

export default {
  inheritAttrs: true,
  data() {
    return {
      drawer: false
    };
  },
  computed: {
    ...mapState({
      email: state => state.user.email,
      username: state => state.user.username,
      mystate: state => state.user.mystate,
      usertype: state => state.user.usertype,
      email_verify: state => state.user.email_verify,
      token: state => state.user.token
    }),

    avatar() {
      return getGravatarAddress(this.email);
    }
  },
  methods: {
    jump(link) {
      if (this.$route.path != "/" + link) {
        this.$router.push({ path: "/" + link });
      }
      if (!link) {
        this.$router.push({ name: "home" });
      }
    },

    Logout() {
      localStorage.clear();
      this.$store.commit("clearstate");
      this.$router.push({ name: "home" });
    }
  }
};
</script>
