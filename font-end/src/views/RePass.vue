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
              label="邮箱"
              v-model="email"
              name="email"
              prepend-icon="email"
              type="email"
            />

            <v-text-field
              id="password"
              v-model="password"
              label="新密码"
              name="password"
              prepend-icon="lock"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            />

            <v-text-field
              id="password2"
              v-model="password2"
              label="重复新密码"
              name="password2"
              prepend-icon="lock"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
            />

            <v-text-field
              id="code"
              v-model="code"
              label="验证码"
              name="code"
              prepend-icon="code"
              type="text"
            />
            <v-card-actions class="pt-2 py-4">
              <v-btn text color="blue" class="mr-4" @click="post_RePass()">更改密码</v-btn>

              <v-btn text color="red" dark class="mr-4" @click="post_SendRepassCode()">发送验证码</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </with-app-bar>
</template>

<script>
import { SendRePassCode, RePassVerify } from "../request/api";
export default {
  name: "RePass",
  props: {
    source: String
  },
  data() {
    return {
      show1: false,
      show2: false,
      email: "",
      password: "",
      password2: "",
      code: ""
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
    post_SendRepassCode() {
      if (!this.email) {
        this.$snackbar.warning("请输入邮箱");
      } else {
        SendRePassCode({
          email: this.email
        }).then(res => {
          if (res.code == 0) {
            this.$snackbar.success(res.message);
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    },
    post_RePass() {
      if (!this.email) {
        this.$snackbar.warning("请输入邮箱");
      } else if (!this.password) {
        this.$snackbar.warning("请输入密码");
      } else if (!this.password2) {
        this.$snackbar.warning("请再次输入密码");
      } else if (this.password2 != this.password) {
        this.$snackbar.warning("两次密码不一致");
      } else if (!this.code) {
        this.$snackbar.warning("请输入验证码");
      } else {
        RePassVerify({
          email: this.email,
          password: this.password,
          code: this.code
        }).then(res => {
          if (res.code == 0) {
            this.$snackbar.success(res.message);
            this.$router.push("/Login");
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    }
  }
};
</script>