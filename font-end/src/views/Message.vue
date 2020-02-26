<template>
  <with-app-bar>
    <v-breadcrumbs :items="Link_items"></v-breadcrumbs>
    <v-list v-if="maxpage > 0">
      <template v-for="(item) in Msgitem">
        <v-list-item :key="item.msg_itle" @click="read(item._id)">
          <v-list-item-avatar>
            <v-badge
              v-if="item.msg_read === false"
              color="pink"
              dot
              bottom
              offset-x="8"
              offset-y="9"
            >
              <v-icon>email</v-icon>
            </v-badge>
            <v-icon v-else>email</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.msg_title"></v-list-item-title>
            <v-list-item-subtitle>{{ item.msg_content | ellipsis }}</v-list-item-subtitle>
            <v-divider></v-divider>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <div class="c-auto" v-else>
      <v-icon>mdi-package-variant</v-icon>暂无信息
    </div>

    <v-card v-if="maxpage > 1" class="elevation-0 pt-2 mx-auto">
      <v-pagination v-model="page" :length="maxpage"></v-pagination>
    </v-card>
  </with-app-bar>
</template>

<script>
import { LoadMsgList } from "../request/api";

export default {
  name: "Message",
  data() {
    return {
      page: 1,
      maxpage: 0,
      Link_items: [
        {
          text: "信息列表",
          disabled: true,
          href: "Message"
        }
      ],
      Msgitem: []
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 16) {
        return value.slice(0, 16) + "...";
      }
      return value;
    }
  },
  watch: {
    page() {
      this.getMessage();
    }
  },
  mounted() {
    this.getMessage();
  },
  methods: {
    getMessage() {
      this.loading = true;
      if (localStorage.getItem("token")) {
        LoadMsgList({
          page: this.page - 1
        }).then(res => {
          if (res.code == 0) {
            this.maxpage = res.maxpage;
            this.Msgitem = res.data;
          } else {
            this.$snackbar.error("拉取信息时出现问题");
          }
        });
      }
    },

    read(id) {
      this.$router.push({ name: "msgcontent", params: { id: id } });
    }
  }
};
</script>

<style>
.c-auto {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  font-size: 24px;
}
</style>