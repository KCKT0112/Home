<template>
  <with-app-bar>
    <v-row align="center" justify="center" class="mx-auto d-block">
      <div class="card blue">
        <v-row align="center" justify="center" class="pa-12 mx-auto d-block">
          <div align="center" justify="center" class="pa-12 mx-auto">
            <v-avatar size="128">
              <img :src="avatar" alt="avatar" />
            </v-avatar>
          </div>
          <div align="center" justify="center" class="pa-4 mx-auto white--text">
            <p class="display-1">{{ username }}</p>
            <p class="subtitle-1">{{ mystate }}</p>
          </div>
        </v-row>
      </div>
      <v-tabs fixed-tabs background-color="blue" dark v-model="tab">
        <v-tab v-for="p in pages" :key="p.mark">{{p.title}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="p in pages" :key="p.mark">
          <div :is="p.mark"></div>
        </v-tab-item>
      </v-tabs-items>
    </v-row>
  </with-app-bar>
</template>

<script>
import { mapState } from "vuex";
import { pages } from "./Settings/index";

let pages2components = pages => {
  let newObj = {};
  for (let p of pages) {
    newObj[p.mark] = p.component;
  }
  return newObj;
};

//window.console.log(pages2components(pages));

export default {
  name: "settings",
  data() {
    return {
      tab: 0,
      onlyVerify: false,
      pages
    };
  },
  computed: {
    ...mapState({
      avatar: state => state.user.avatar,
      username: state => state.user.username,
      mystate: state => state.user.mystate,
      email_verify: state => state.user.email_verify,
      oauth: state => state.user.oauth
    })
  },
  mounted() {
    if (this.$route.params.verify !== undefined) {
      this.onlyVerify = true;
    }
  },
  methods: {},
  components: {
    ...pages2components(pages)
  }
};
</script>