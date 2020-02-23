<template>
  <v-snackbar v-model="open" :color="color" :timeout="timeout" bottom right>
    <v-icon color="#ffffff">notification_important</v-icon>
    {{ mes }}
    <v-spacer></v-spacer>
    <v-btn text @click="open = false">Close</v-btn>
  </v-snackbar>
</template>
 
<script>
export default {
  name: "Snackbar",
  props: {},
  components: {},
  data() {
    return {
      icon: "",
      color: "error",
      open: false,
      mes: "",
      timeout: 5000
    };
  },
  created() {},
  methods: {
    info(mes) {
      //......
      this.color = "#2196F3";
      this.open = true;
      this.mes = mes;
    },
    error(mes) {
      //......
      this.color = "#F44336";
      this.open = true;
      this.mes = mes;
    },
    warning(mes) {
      //......
      this.color = "#FF9800";
      this.open = true;
      this.mes = mes;
    },
    success(mes) {
      //......
      this.color = "#4CAF50";
      this.open = true;
      this.mes = mes;
    }
  }
};
</script>

<style lang='scss'>
.v-snack {
  .v-snack__content {
    justify-content: flex-start;
    i {
      margin-right: 10px;
    }
  }
}
</style>