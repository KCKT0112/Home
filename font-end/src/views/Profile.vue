<template>
  <with-app-bar :relpaceProfileWithMenu="isMe()">
    <div id="profile">
      <v-overlay :value="onLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <div class="card blue">
        <v-row align="center" justify="center" class="pa-12 mx-auto d-block">
          <div align="center" justify="center" class="pa-12 mx-auto">
            <v-badge
              v-if="online == true"
              bordered
              bottom
              color="green"
              dot
              offset-x="22"
              offset-y="22"
            >
              <v-avatar size="128">
                <img :src="avatar" alt="avatar" />
              </v-avatar>
            </v-badge>
            <v-badge v-else bordered bottom color="red" dot offset-x="22" offset-y="22">
              <v-avatar size="128">
                <img :src="avatar" alt="avatar" />
              </v-avatar>
            </v-badge>
          </div>
          <div align="center" justify="center" class="pa-4 mx-auto white--text">
            <p class="display-1">{{ username }}</p>
            <p class="subtitle-1">{{ mystate }}</p>

            <p class="subtitle-1">{{ online ? '在线' : '离线' }}</p>

            <p calss="subtitle-1"><v-icon></v-icon></p>
          </div>
        </v-row>
      </div>
      <v-tabs fixed-tabs background-color="blue" dark>
        <v-tab>{{this.isMe() ? "你的主题" : "主题"}}</v-tab>
        <v-tab>{{this.isMe() ? "你的收藏" : "收藏"}}</v-tab>
      </v-tabs>
    </div>
  </with-app-bar>
</template>

<script>
import { mapState } from "vuex";
import { GetProfileID } from "../request/api";
import { getGravatarAddress2 } from "@/helpers/gravatar";

export default {
  name: "profile",
  data() {
    return {
      remoteProfile: {
        isProfileUsable: false,
        username: "",
        avatar: "",
        usertype: "",
        mystate: "",
        online: false,
        myurl: []
      },
      onFailure: false,
      onLoading: true
    };
  },
  watch: {},
  computed: {
    ...mapState({
      selfAvatar: state => state.user.avatar,
      selfUsername: state => state.user.username,
      selfState: state => state.user.mystate,
      selfType: state => state.user.usertype,
      selfToken: state => state.user.token,
      selfMyurl: state => state.user.myurl
    }),
    avatar() {
      return this.isMe() ? this.selfAvatar : this.remoteProfile.avatar;
    },
    username() {
      return this.isMe() ? this.selfUsername : this.remoteProfile.username;
    },
    mystate() {
      return this.isMe() ? this.selfState : this.remoteProfile.mystate;
    },
    online() {
      return this.isMe() ? true : this.remoteProfile.online;
    },
    usertype() {
      return this.isMe() ? this.selfType : this.remoteProfile.usertype;
    },
    myurl() {
      return this.isMe() ? this.selfMyurl : this.remoteProfile.myurl;
    }
  },
  mounted() {
    // window.console.log(`isMe()? ${this.isMe()}`);
    if (!this.isMe()) {
      this.requestProfile(this.$route.params.id)
        .then(this.callOnRequestProfileDone)
        .catch(this.callOnRequestProfileFailure);
    } else {
      this.onLoading = false;
    }
    setInterval(this.callOnProfileUpdater, 10 * 1000);
    //window.console.log(this.$route.path);
  },
  methods: {
    async requestProfile(id, force = false) {
      // window.console.log(`requestProfile(${id})`);
      if (this.remoteProfile.username.isProfileUsable && !force) {
        // window.console.log(
        //   "requestProfile(): found remoteProfile, skip request"
        // );
        return this.remoteProfile;
      }
      let response = await GetProfileID({
        username: id // this.$route.params.id
      });
      let newObj = {}; // bad hack. TODO: make it depends on a class
      if (response.code == 0) {
        newObj.username = response.data.username;
        //newObj.avatar = getGravatarAddress(response.data.email);
        newObj.avatar = getGravatarAddress2(response.data.avatar);
        newObj.online = response.data.online;
        newObj.usertype = response.data.usertype;
        newObj.mystate = response.data.mystate;
        newObj.online = response.data.online;
        newObj.myurl = response.data.myurl;
        return newObj;
      } else {
        throw new Error(response.message);
      }
    },

    setRemoteProfile(profile) {
      this.remoteProfile.username = profile.username;
      this.remoteProfile.avatar = profile.avatar;
      this.remoteProfile.usertype = profile.usertype;
      this.remoteProfile.mystate = profile.mystate;
      this.remoteProfile.online = profile.online;
      this.remoteProfile.myurl = profile.myurl;
      this.remoteProfile.isProfileUsable = true;
    },

    isMe() {
      let targetId = this.$route.params.id;
      return (
        targetId === undefined ||
        targetId === null ||
        targetId == this.selfUsername
      );
    },

    callOnRequestProfileFailure(reason) {
      this.$snackbar.error(reason.message);
      // window.console.log(reason.message);
      // this.$router.push({name: 'profile'});
    },

    callOnRequestProfileDone(profile) {
      this.onLoading = false;
      // window.console.log(`requestProfile() done.`);
      this.setRemoteProfile(profile);
    },

    callOnProfileUpdater() {
      if (
        this.$route.path == "/Profile/" + this.$route.params.id &&
        localStorage.getItem("token")
      ) {
        let targetId = this.isMe() ? this.selfUsername : this.$route.params.id;
        this.requestProfile(targetId, true).then(this.callOnRequestProfileDone);
      }
    }
  }
};
</script>