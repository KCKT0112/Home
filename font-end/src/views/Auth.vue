<template>
  <div class="Authback">
    <div class="ha-auto">
      <v-card-text class="elevation-1">
        <v-card-title>
          <h3>{{ title }}</h3>
        </v-card-title>
        <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
        <v-card-actions v-if="progress == true">
          <v-progress-linear indeterminate color="blue"></v-progress-linear>
        </v-card-actions>
      </v-card-text>
    </div>
  </div>
</template>

<script>
import { githubBack, gitlabBack } from "../request/api";

export default {
  name: "auth",
  data() {
    return {
      title: "认证中",
      subtitle: "请稍后...",
      progress: true,
      bind: localStorage.getItem("token") ? true : false,
      token: localStorage.getItem("token")
        ? localStorage.getItem("token")
        : null
    };
  },
  mounted() {
    switch (this.$route.params.auth) {
      case "github":
        this.githubAuth();
        break;
      case "gitlab":
        this.gitlabAuth();
        break;
    }
  },
  methods: {
    error(data) {
      this.title = data;
      this.subtitle = "3秒后返回...";
      this.progress = false;
      if (this.bind == true) {
        setTimeout(function() {
          location.href = "/Settings";
        }, 3000);
      } else {
        setTimeout(function() {
          location.href = "/Login";
        }, 3000);
      }
    },

    success(data) {
      this.title = data;
      this.subtitle = "正在返回网站...";
      this.progress = false;
      if (this.bind == true) {
        setTimeout(function() {
          location.href = "/Settings";
        }, 1000);
      } else {
        setTimeout(function() {
          location.href = "/Login";
        }, 1000);
      }
    },

    githubAuth() {
      githubBack({
        code: this.$route.query.code,
        state: this.$route.query.state,
        bind: this.bind,
        token: this.token
      }).then(res => {
        if (this.bind == true) {
          if (res.success == true) {
            this.success(res.message);
          } else {
            this.error(res.message);
          }
        } else {
          if (res.success == true) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.profile.data.username);
            this.success(res.message);
          } else {
            this.error(res.message);
          }
        }
      });
    },

    gitlabAuth() {
      gitlabBack({
        code: this.$route.query.code,
        state: this.$route.query.state,
        bind: this.bind,
        token: this.token,
      }).then(res => {
        if (this.bind == true) {
          if (res.success == true) {
            this.success(res.message);
          } else {
            this.error(res.message);
          }
        } else {
          window.console.log(res);
          if (res.success == true) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("username", res.data.profile.data.username);
            this.success(res.message);
          } else {
            this.error(res.message);
          }
        }
      });
    }
  }
};
</script>

<style>
.Authback {
  width: 100%;
  height: 100%;
  background-color: #03A9F4;
}

.ha-auto {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -25%;
  margin-top: -5%;
  width: 50%;
  background-color: #ffffff;
}
</style>