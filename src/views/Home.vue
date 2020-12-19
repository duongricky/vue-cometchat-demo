<template>
  <div class="home">
     <div id="nav">
       <button class="btn btn-success" @click="logoutUser">Logout</button> 
    </div>
    <div id="callScreen"></div>
  </div>
</template>

<script>
  import { CometChat } from "@cometchat-pro/chat";
  export default {
    name: "home",
    data() {
    return {
        username: "",
        uid: "",
        session_id: "",
        receiver_id: null,
        error: false,
        showSpinner: false,
        incomingCall: false,
        ongoingCall: false
      }
    },
    created() {
      this.getLoggedInUser();
    },
    methods: {
      getLoggedInUser() {
        var user = CometChat.getLoggedinUser().then(
          user => {
            this.username = user.name;
            this.uid = user.uid;
          },
          error => {
            this.$router.push({ name: "homepage" });
          }
        );
      },
    }
  }
</script>
