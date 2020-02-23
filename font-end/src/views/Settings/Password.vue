<template>
  <v-card flat class="ma-auto cardh-autowidth">
    <v-card-text>
      <v-card class="mx-auto">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>修改密码</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>
              <v-text-field v-model="password" type="password" label="密码"></v-text-field>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>
              <v-text-field v-model="repassword" type="password" label="重复密码"></v-text-field>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item four-line>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn color="blue" text @click="repass()">更改密码</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { RePass } from "@/request/api";

export default {
  data() {
    return {
      password: "",
      repassword: ""
    };
  },
  methods: {
    //修改密码
    repass() {
      if (!this.password) {
        this.$snackbar.warning("请输入密码");
      } else if (!this.repassword) {
        this.$snackbar.warning("请再次输入密码");
      } else if (this.repassword != this.password) {
        this.$snackbar.warning("两次密码不一致");
      } else {
        RePass({
          password: this.password
        }).then(res => {
          if (res.code == 0) {
            this.$snackbar.success(res.message);
          } else {
            this.$snackbar.error(res.message);
          }
        });
      }
    }
  }
};
</script>
