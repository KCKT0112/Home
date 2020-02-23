<template>
  <with-app-bar>
    <!-- <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item v-for="(slide, i) in slides" :key="i">
        <v-sheet tile :color="colors[i]" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">{{ slide }} Slide</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>-->

    <div
      style="width: 100%;height:200px;background-color: #03A9F4; text-align: center;color:#ffffff;"
    >
      <h1 style="padding-top: 70px;">Young</h1>
    </div>

    <div class="box">
      <v-card class="pa-0 mb-3 elevation-0 d-inline">
        <v-btn dark color="blue" @click.stop="$bus.emit('openArt', true)">发布主题</v-btn>

        <v-btn class="float-right" text icon color="blue">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </v-card>

      <v-row>
        <v-col :lg="4" :md="4" :sm="6">
          <v-card calss="pa-2">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>公告</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>222</v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>

        <v-col>
          <v-card calss="pa-2">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>全部主题</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="h()">
              <v-list-item-content>
                <v-list-item-title>Two-line item</v-list-item-title>
                <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="h()">
              <v-list-item-content>
                <v-list-item-title>Three-line item</v-list-item-title>
                <v-list-item-subtitle>Secondary line text Lorem ipsum dolor sit amet,</v-list-item-subtitle>
                <v-list-item-subtitle>consectetur adipiscing elit.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </with-app-bar>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      colors: ["blue", "warning", "pink darken-2", "red lighten-1", "green"],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
      sheet: this.artvalue
    };
  },
  methods: {
    AddArtBnt() {
      //todo
    }
  }
};
</script>

<style>
.box {
  width: 70%;
  margin: 20px auto;
}

@media screen and (max-width: 800px) {
  .box {
    width: 90%;
    margin: 20px auto;
  }
}
</style>