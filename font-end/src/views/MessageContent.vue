<template>
  <with-app-bar>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">确定删除？</v-card-title>

        <v-card-text>信息删除后不可恢复</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">不了</v-btn>

          <v-btn color="red darken-1" text @click="Post_RemoveMsg()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-breadcrumbs :items="Link_items"></v-breadcrumbs>
    <v-card max-width="90%" class="mx-auto elevation-0" outlined>
      <v-card-title>{{ msg.msg_title }}</v-card-title>
      <v-card-subtitle v-if="msg.msg_type == 1">来自系统 - {{ msg.msg_sender }}</v-card-subtitle>
      <v-card-subtitle v-if="msg.msg_type == 2">来自管理员 - {{ msg.msg_sender }}</v-card-subtitle>
      <v-card-text>
        <Vue-Markdown :source="msg.msg_content"></Vue-Markdown>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text large color="error" @click="dialog = true">删除</v-btn>
      </v-card-actions>
    </v-card>
  </with-app-bar>
</template>

<script>
import VueMarkdown from "vue-markdown";
import { LoadMsg, RemoveMsg } from "../request/api";

export default {
  name: "MessageContent",
  data() {
    return {
      dialog: false,
      Link_items: [
        {
          text: "信息列表",
          disabled: false,
          href: "Message"
        }
      ],
      msg: [],
      mdcontent: ""
    };
  },
  components: {
    VueMarkdown
  },
  mounted() {
    if (this.$route.params.id) {
      this.getMsgContent(this.$route.params.id);
    } else {
      this.$snackbar.error("信息不存在");
      this.$router.push({ name: "message" });
    }
  },
  methods: {
    getMsgContent(id) {
      LoadMsg({
        msgid: id
      }).then(res => {
        this.msg = res.data;
        let link = [
          {
            text: "信息列表",
            disabled: false,
            href: "/Message"
          },
          {
            text: res.data.msg_title,
            disabled: true,
            href: "/"
          }
        ];
        this.Link_items = link;
      });
    },

    Post_RemoveMsg() {
      RemoveMsg({
        msgid: this.$route.params.id
      }).then(res => {
        if (res.code == 0) {
          this.$snackbar.success(res.message);
          this.dialog = false;
          this.$router.push("/Message");
        } else {
          this.$snackbar.error(res.message);
          this.dialog = false;
        }
      });
    }
  }
};
</script>