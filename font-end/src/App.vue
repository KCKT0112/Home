<template>
  <v-app>
    <!-- <v-sheet id="scrolling-techniques-7" class="overflow-y-auto" max-height="100%">
      <v-content>
        <router-view />
      </v-content>
    </v-sheet>-->
    <router-view />
    <v-overlay :value="loading_state">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-footer absolute class="font-weight-medium" padless app>
      <v-col class="text-center" cols="12">
        © {{ new Date().getFullYear() }} —
        <strong>Vuetify</strong>
      </v-col>
    </v-footer>

    <v-bottom-sheet v-model="sheet" inset>
      <v-sheet height="auto">
        <v-card class="elevation-0 pa-2" max-width="100%">
          <v-btn color="blue" dark @click="PostArticle()">发布</v-btn>
          <v-btn class="float-right" color="blue" dark text icon @click="sheet = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card>
        <v-card class="pa-2 elevation-0 mx-auto" max-width="100%">
          <v-text-field prepend-icon="title" label="标题" v-model="ArtTitleValue" :rules="ArtTitle"></v-text-field>
          <v-combobox
            v-model="ArtTags"
            :items="TagItem"
            chips
            clearable
            label="标签(可输入)"
            multiple
            prepend-icon="tag"
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="removeTag(item)"
              >
                <strong>{{ item }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-combobox>
        </v-card>
        <mavon-editor v-model="ArtContent" />
      </v-sheet>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import { GetProfile, StateMsg, AddArticle, SiteConfig } from "./request/api";
import { autoMeasureBestOne } from "@/helpers/gravatar";

export default {
  name: "App",
  data() {
    return {
      ArtTitle: [
        value => !!value || "标题不能为空",
        value => (value || "").length <= 40 || "标题最长40个字符"
      ],
      TagItem: [],
      ArtTitleValue: "",
      ArtTags: "",
      ArtContent: "",
      sheet: false
    };
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      offline_state: state => state.UPDATE_OfflineShow,
      loading_state: state => state.UPDATE_LOADING
    })
  },
  mounted() {
    SiteConfig().then(res => {
      this.TagItem = res.data[0].tags;
    });

    this.$bus.on("openArt", data => {
      if (localStorage.getItem("token")) {
        this.sheet = data;
      } else {
        this.$snackbar.info("请先登入后再操作");
        this.$router.push("/Login");
      }
    });
    // this.requestMessage();
    // setInterval(this.requestMessage, 10 * 1000);
    if (localStorage.getItem("token")) {
      this.$store.commit("pushtoken", localStorage.getItem("token"));
      GetProfile().then(res => {
        localStorage.setItem("username", res.data.username);
        this.$store.commit("pushprofile", res.data);
      });
    }
  },
  sockets: {
    connect() {
      window.console.log("连接成功");
    },
    disconnect() {
      window.console.log("断开链接");
      this.$socket.client.open();
    }, //检测socket断开链接
    reconnect() {
      window.console.log("重新链接");
    },
    state(data) {
      let obj = {
        msg_state: data.data.noread,
        msg_num: data.data.num
      };
      this.$store.commit("pushstate", obj);
    }
  },
  watch: {
    $$route() {},
    token(val) {
      if (!val) {
        this.$socket.client.close();
      } else {
        this.$socket.client.emit("state", val);
      }
    }
  },
  created() {
    autoMeasureBestOne().then(result => {
      window.console.log(
        `Auto Measure Best Gravatar Server: ${result[0]}, ${result[1]}`
      );
    });
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

    requestMessage() {
      if (localStorage.getItem("token")) {
        StateMsg().then(res => {
          if (res.code == 0) {
            if (res.data.noread == true) {
              let data = {
                msg_state: true,
                msg_num: res.data.num
              };
              this.$store.commit("pushstate", data);
            } else {
              let data = {
                msg_state: false
              };
              this.$store.commit("pushstate", data);
            }
          } else {
            this.$snackbar.error("拉取信息时出现问题");
          }
        });
      }
    },

    PostArticle() {
      AddArticle({
        title: this.ArtTitleValue,
        tag: this.ArtTags,
        content: this.ArtContent
      }).then(res => {
        if (res.success == true) {
          this.$snackbar.success(res.message);
          this.ArtTitleValue = null;
          this.ArtTags = null;
          this.ArtContent = null;
          this.sheet = false;
        } else {
          this.$snackbar.error(res.message);
        }
      });
    },

    removeTag(data) {
      this.ArtTags.splice(this.ArtTags.indexOf(data), 1);
      this.ArtTags = [...this.ArtTags];
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
}

.lrback {
  background: url(./assets/back.jpg) no-repeat center;
  background-size: cover;
  width: 100%;
  height: 100%;
}

@media screen and (max-width: 300px) {
  .cardh-autowidth {
    width: 100%;
  }

  .form-w {
    width: 100%;
  }

  .ht-auto {
    margin-top: 25%;
  }
}

@media screen and (min-width: 900px) {
  .cardh-autowidth {
    width: 70%;
  }

  .form-w {
    width: 400px;
  }

  .ht-auto {
    position: relative;
    top: 50%;
  }
}
</style>