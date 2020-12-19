<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";

import "./App.css";

export default {
  data() {
    return {}
  },
  created() {
    this.initApp()
  },
  methods: {
    initApp() {
      const appID = process.env.VUE_APP_COMMETCHAT_APP_ID
      CometChat.init(appID).then(
        () => {
          console.log("Init app successfully")
        },
        error => {
          console.log("Init app failed with error:", error)
        }
      )
    }
  }
};
</script>
