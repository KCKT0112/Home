<template>
  <with-app-bar>
    <v-card-text class="brown">
      <v-sheet max-width="100%" max-height="100%" height="300px" class="mx-auto lrback"></v-sheet>
    </v-card-text>
    <v-row lign="center" justify="center" class="mx-auto">
      <v-col cols="12" sm="8" md="4">
        <v-card lign="center" justify="center" class="elevation-1 justify-center pa-2">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="username"
              name="username"
              label="用户名"
              required
              prepend-icon="person"
              @keydown.enter="recaptcha()"
            ></v-text-field>

            <v-text-field
              v-model="password"
              name="password"
              prepend-icon="lock"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              label="密码"
              required
              @click:append="show1 = !show1"
              @keydown.enter="recaptcha()"
            ></v-text-field>
            <v-card-actions class="pt-2 py-4">
              <v-btn text color="blue" class="mr-4" @click="recaptcha()">登入</v-btn>

              <v-btn text color="orange" dark class="mr-4" @click="go_register()">注册</v-btn>

              <v-btn text color="error" class="mr-4" @click="go_repass()">找回密码</v-btn>
            </v-card-actions>
          </v-form>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-content>
              <v-btn color="#24292e" class="white--text" @click="loginto('github')">
                <v-icon left>fab fa-github-square</v-icon>使用Github登入
              </v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-btn color="#e24329" class="white--text" @click="loginto('gitlab')">
                <v-icon left>fab fa-gitlab</v-icon>使用Gitlab登入
              </v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-card-subtitle>
            This site is protected by reCAPTCHA and the Google
            <a
              href="https://policies.google.com/privacy"
            >Privacy Policy</a> and
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </with-app-bar>
</template>

<script>
import { Login } from "../request/api";
export default {
  name: "Login",
  props: {
    source: String
  },
  data() {
    return {
      show1: false,
      username: "",
      password: "",
      tokentimestate: false,
      tokentime: 0
      //retoken: "",
    };
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  watch: {
    tokentimestate(val) {
      if (val == true) {
        this.tokentime = 1;
      }
    }
  },
  methods: {
    loginto(link) {
      switch (link) {
        case "github":
          location.href =
            process.env.VUE_APP_ApiUrl + "/api/auth/github/v2/login";
          break;
        case "gitlab":
          location.href =
            process.env.VUE_APP_ApiUrl +
            "/api/auth/gitlab/login?redirect_uri=http://10.0.0.123:8080/auth/gitlab";
          break;
      }
    },
    go_register() {
      this.$router.push("/Register");
    },
    go_repass() {
      this.$router.push("/RePass");
    },
    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded();
      // Execute reCAPTCHA with action "login".
      this.retoken = await this.$recaptcha("login");
      this.post_login();
    },
    post_login() {
      Login({
        username: this.username,
        password: this.password,
        retoken: this.retoken
      }).then(res => {
        if (res.data.success == true) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("username", res.data.data.username);
          this.$store.commit("pushprofile", res.data.data);
          this.$snackbar.success(res.data.message);
          if (this.$route.params.from) {
            this.$router.push(this.$route.params.from);
          } else {
            this.$router.push("/");
          }
        } else {
          this.$snackbar.success(res.message);
        }
      });
    }
  },
  template: '<button @click="recaptcha">Execute recaptcha</button>'
};
</script>