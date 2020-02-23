<template>
  <v-card flat class="ma-auto cardh-autowidth">
    <v-card-text>
      <div v-if="email_verify != 1">
        <v-card class="mx-auto">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>验证邮箱</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field v-model="verify_code" type="text" label="验证码"></v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-btn color="blue" text @click="verify_email_post()">验证</v-btn>

                <v-btn
                  color="red"
                  text
                  @click="resend_verify_email()"
                >重发验证码</v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
      <div v-else>
        <v-card class="mx-auto" tile>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>更改邮箱</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field v-model="newemail" type="email" label="新邮箱"></v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-text-field v-model="verify_code" type="text" label="验证码"></v-text-field>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item four-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-btn color="blue" text @click="post_newemail_modify()">更改</v-btn>
                <v-btn color="red" text @click="post_newemail_code()">发送验证码</v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  VerifyEmail,
  ResendVerifyEmail,
  SendReEmailCode,
  ReEmail
} from "@/request/api";
import { mapState } from "vuex";

export default {
  data() {
    return {
      verify_code: "",
      newemail: ""
    };
  },
  computed: {
    ...mapState({
      email_verify: state => state.user.email_verify,
      email: state => state.user.email
    })
  },
  methods: {
    //验证邮件代码
    verify_email_post() {
      if (!this.verify_code) {
        this.$snackbar.warning("请输入验证代码");
      } else {
        VerifyEmail({
          email: this.email,
          code: this.verify_code
        }).then(res => {
          if (res.code == 0) {
            this.$snackbar.success(res.message);
            this.$store.commit("updateEs");
            this.$router.push({ name: "settings" });
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    },

    //重新发送验证邮件
    resend_verify_email() {
      ResendVerifyEmail({
        email: this.email
      }).then(res => {
        if (res.code == 0) {
          this.$snackbar.success(res.message);
        } else {
          this.$snackbar.error(res.message);
        }
      });
    },

    //发送修改邮件地址验证代码
    post_newemail_code() {
      if (!this.newemail) {
        this.$snackbar.warning("请输入新邮件地址");
      } else {
        SendReEmailCode({
          email: this.email,
          newemail: this.newemail
        }).then(res => {
          if (res.code == 0) {
            this.$snackbar.success(res.message);
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    },

    //修改邮件地址
    post_newemail_modify() {
      if (!this.verify_code) {
        this.$snackbar.warning("请输入验证代码");
      } else if (!this.newemail) {
        this.$snackbar.warning("请输入新邮件地址");
      } else {
        ReEmail({
          email: this.email,
          code: this.verify_code
        }).then(res => {
          if (res.code == 0) {
            this.verify_code = null;
            this.$snackbar.success(res.message);
            this.$router.push({ name: "settings" });
            //setTimeout(location.reload(), 3000);
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    }
  }
};
</script>
