<template>
  <with-app-bar>
    <v-card-text class="brown">
      <v-sheet max-width="100%" max-height="100%" height="300px" class="mx-auto lrback">
      </v-sheet>
    </v-card-text>
    <v-row lign="center" justify="center" class="mx-auto">
      <v-col cols="12" sm="8" md="4">
        <v-card lign="center" justify="center" class="elevation-1 justify-center pa-2">
          <v-form ref="form" lazy-validation>
            <v-text-field
              label="用户名"
              v-model="username"
              name="username"
              prepend-icon="person"
              type="text"
            />

            <v-text-field
              label="邮箱"
              v-model="email"
              name="email"
              prepend-icon="email"
              type="email"
            />

            <v-text-field
              id="password"
              v-model="password"
              label="密码"
              name="password"
              prepend-icon="lock"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            />

            <v-text-field
              id="repassword"
              v-model="repassword"
              label="重复输入密码"
              name="repassword"
              prepend-icon="lock"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              @keydown.enter="recaptcha()"
            />

            <v-card-actions class="pt-2 py-4">
              <v-btn text color="blue" class="mr-4" @click="recaptcha()">注册</v-btn>

              <v-btn text color="orange" class="mr-4" @click="go_login()">登入</v-btn>
            </v-card-actions>
          </v-form>
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
import { Register } from "../request/api";
export default {
  name: "Register",
  props: {
    source: String
  },
  data() {
    return {
      show1: false,
      show2: false,
      username: "",
      email: "",
      password: "",
      repassword: "",
      retoken: ""
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
    go_login() {
      this.$router.push("/Login");
    },
    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded();
      // Execute reCAPTCHA with action "login".
      this.retoken = await this.$recaptcha("register");
      this.post_Register();
    },
    post_Register() {
      if (!this.username) {
        this.$snackbar.warning("请输入用户名");
      } else if (!this.email) {
        this.$snackbar.warning("请输入邮箱");
      } else if (!this.password) {
        this.$snackbar.warning("请输入密码");
      } else if (!this.repassword) {
        this.$snackbar.warning("请再次输入密码");
      } else if (this.repassword != this.password) {
        this.$snackbar.warning("两次密码不一致");
      } else {
        Register({
          username: this.username,
          email: this.email,
          password: this.password,
          retoken: this.retoken
        }).then(res => {
          if (res.data.success == true) {
            this.$snackbar.success(res.data.message);
            this.$router.push("/Login");
          } else {
            this.$snackbar.error(res.data.message);
          }
        });
      }
    }
  }
};
</script>