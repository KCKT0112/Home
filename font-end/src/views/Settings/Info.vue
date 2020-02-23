<template>
  <v-card flat class="ma-auto cardh-autowidth">
    <v-card-text>
      <v-card class="mx-auto">
        <v-alert color="primary" dark icon="mdi-emoticon" border="left" prominent>
          <p>想要更改头像？</p>
          <p>
            我们从Gravatar同步您的头像，如果您想更改您的头像：
            <br />
            点击按钮，使用{{ email }}注册Gravatar并上传您的头像
          </p>
          <v-col class="shrink">
            <v-btn @click="go_gravatar()">Go Gravatar</v-btn>
          </v-col>
        </v-alert>
      </v-card>

      <v-card>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>个人信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>用户名</v-list-item-title>
            <v-list-item-subtitle>{{ username }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title>邮箱</v-list-item-title>
            <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
            <v-list-item-subtitle v-if="email_verify == 1">(已验证)</v-list-item-subtitle>
            <v-list-item-subtitle v-else>(未验证)</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item four-line>
          <v-list-item-content>
            <v-list-item-title>用户类型</v-list-item-title>
            <v-list-item-subtitle>{{ usertype }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card class="mt-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>其他信息</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-text-field :value="mystate" @change="callOnMyStateChanged" type="text" label="签名"></v-text-field>
          </v-list-item-content>
        </v-list-item>

        <v-list-item three-line>
          <v-list-item-content>
            <v-select
              @change="callOnSexChanged"
              :items="sexitems"
              :value="sex"
              item-text="label"
              item-value="value"
              label="性别"
            ></v-select>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text color="blue" @click="change_profile()">更新</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card class="mt-4">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>OAuth管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-card-text>
              <v-btn
                v-if="!oauth.github"
                color="#24292e"
                class="mx-auto white--text"
                @click="bind('github')"
              >
                <v-icon left>fab fa-github-square</v-icon>绑定GitHub
              </v-btn>

              <v-btn v-else color="#24292e" class="mx-auto white--text" @click="unbind('github')">
                <v-icon left>fab fa-github-square</v-icon>解绑GitHub
              </v-btn>

              <v-btn
                v-if="!oauth.gitlab"
                color="#e24329"
                class="mx-auto white--text ml-2"
                @click="bind('gitlab')"
              >
                <v-icon left>fab fa-gitlab</v-icon>绑定GitLab
              </v-btn>

              <v-btn
                v-else
                color="#e24329"
                class="mx-auto white--text ml-2"
                @click="unbind('gitlab')"
              >
                <v-icon left>fab fa-gitlab</v-icon>解绑GitLab
              </v-btn>
            </v-card-text>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import sexdata from "@/helpers/sex";
import { mapState, mapMutations } from "vuex";
import { ChangeProfile, githubUnbind, gitlabUnbind } from "@/request/api";

export default {
  data() {
    return {
      sexitems: sexdata
    };
  },
  computed: {
    ...mapState({
      avatar: state => state.user.avatar,
      username: state => state.user.username,
      email: state => state.user.email,
      email_verify: state => state.user.email_verify,
      usertype: state => state.user.usertype,
      mystate: state => state.user.mystate,
      sex: state => state.user.sex,
      oauth: state => state.user.oauth
    })
  },
  methods: {
    //更新个人资料
    change_profile() {
      // if (!this.autograph) {
      //   this.$snackbar.warning("请输入签名内容");
      // } else if (this.autograph == this.mystate) {
      //   this.$snackbar.warning("签名内容一致，无需更改");
      // } else {
      ChangeProfile({
        mystate: this.mystate,
        sex: this.sex
      }).then(res => {
        if (res.code != 0) {
          this.$snackbar.error(res.message);
        } else {
          this.$snackbar.success(res.message);
        }
      });
    },

    callOnMyStateChanged(state) {
      this.updateMyState(state);
    },

    callOnSexChanged(sex) {
      this.updateSex(sex);
    },

    go_gravatar() {
      window.location.href = "https://gravatar.com";
    },

    ...mapMutations(["updateMyState", "updateSex"]),

    bind(link) {
      switch (link) {
        case "github":
          location.href = "http://10.0.0.123:3003/api/auth/github/v2/login";
          break;
        case "gitlab":
          location.href =
            "http://10.0.0.123:3003/api/auth/gitlab/login?redirect_uri=http://10.0.0.123:8080/auth/gitlab";
          break;
      }
    },

    unbind(data) {
      switch (data) {
        case "github":
          githubUnbind().then(res => {
            if (res.success == true) {
              this.$snackbar.success(res.message);
              this.$store.commit("updateGithubBind", null);
            } else {
              this.$snackbar.error(res.message);
            }
          });
          break;
        case "gitlab":
          gitlabUnbind().then(res => {
            if (res.success == true) {
              this.$snackbar.success(res.message);
              this.$store.commit("updateGitlabBind", null);
            } else {
              this.$snackbar.error(res.message);
            }
          });
          break;
      }
    }
  }
};
</script>
