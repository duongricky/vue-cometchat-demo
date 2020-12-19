<template>
  <div class="home">
     <div id="nav">
       <button class="btn btn-success" @click="logoutUser">Logout</button>
    </div>
    <div class="form-group">
      <div class="form-group">
        <p>Welcome <b>{{ this.username }}</b>, your UID is <b>{{ this.uid }}</b> <br>
          Enter the receiver Id to start a chat </p>
        <p v-if="error">
          <b class="text-danger">Receiver ID is required</b>
        </p>
        <input type="text" class="form-control" placeholder="Enter receiver UID" v-model="receiver_id">
      </div>

      <div v-if="incomingCall">
        <button class="btn btn-success mr-2" @click="acceptCall">Accept Call</button>
        <button class="btn btn-danger" @click="rejectCall">Reject Call</button> 
      </div>
      <div v-else-if="ongoingCall">
        <button class="btn btn-secondary">Ongoing Call ...</button>
      </div>
      <div v-else>
        <button  @click="startVideoChat" class="btn btn-secondary">
          Start Call <span v-if="showSpinner" class="fa fa-spin fa-spinner"></span>
        </button>
      </div>
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
    this.getLoggedInUser()
    let globalContext = this;
    var listnerID = "UNIQUE_LISTENER_ID";

    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived(call) {
          console.log("Incoming call:", call);
          globalContext.incomingCall = true;
          globalContext.session_id = call.sessionId;
        },
        onOutgoingCallAccepted(call) {
          console.log("Outgoing call accepted:", call);
          globalContext.ongoingCall = true;
          CometChat.startCall(
            call.sessionId,
            document.getElementById("callScreen"),
            new CometChat.OngoingCallListener({
              onUserJoined: user => {
                console.log("User joined call:", user);
              },
              onUserLeft: user => {
                console.log("User left call:", user);
              },
              onCallEnded: call => {
                globalContext.ongoingCall = false;
                globalContext.incomingCall = false;
                console.log("Call ended:", call);
              }
            })
          );
        },
        onOutgoingCallRejected(call) {
          console.log("Outgoing call rejected:", call);
          this.incomingCall = false;
          this.ongoingCall = false;
          this.receiver_id = "";
        },
        onIncomingCallCancelled(call) {
          console.log("Incoming call calcelled:", call);
        }
      })
    );
    },
    methods: {
      getLoggedInUser() {
        CometChat.getLoggedinUser().then(
          user => {
            console.log(user)
            this.username = user.name
            this.uid = user.uid
          },
          error => {
            console.log(error)
            this.$router.push({ name: "homepage" })
          }
        )
      },
      logoutUser() {
       CometChat.logout().then(
          success => {
            console.log(success);
            this.$router.push({ name: "homepage" });
          },
          error => {
            console.log("Logout failed with error:", error);
          }
        )
      },
      startVideoChat() {
        if (!this.receiver_id) this.error = true
        this.showSpinner = true
        var receiverID = this.receiver_id
        var callType = CometChat.CALL_TYPE.VIDEO
        var receiverType = CometChat.RECEIVER_TYPE.USER
        var call = new CometChat.Call(receiverID, callType, receiverType)
        
        CometChat.initiateCall(call).then(
          outGoingCall => {
            this.showSpinner = false;
            console.log("Init call success", outGoingCall)
          },
          error => {
            console.log("Init call failed with error:", error)
          }
        )
      },
      acceptCall() {
        let globalContext = this
        this.ongoingCall = true
        this.incomingCall = false
        CometChat.acceptCall(this.session_id).then(
          call => {
            console.log("Call accepted successfully:", call)
            console.log("call accepted now....")
            console.log(globalContext.ongoingCall)
            CometChat.startCall(
              call.sessionId,
              document.getElementById("callScreen"),
              new CometChat.OngoingCallListener({
                onUserJoined: user => {
                  console.log("User joined call:", user)
                },
                onUserLeft: user => {
                  console.log("User left call:", user)
                },
                onCallEnded: call => {
                  console.log("Call ended:", call)
                  globalContext.ongoingCall = false
                  globalContext.incomingCall = false
                }
              })
            )
          },
          error => {
            console.log("Call acceptance failed with error", error)
          }
        );
      },
      rejectCall() {
        var globalContext = this;
        var status = CometChat.CALL_STATUS.REJECTED;
        CometChat.rejectCall(this.session_id, status).then(
          call => {
            console.log("Call rejected successfully", call)
            globalContext.incomingCall = false
            globalContext.ongoingCall = false
            globalContext.receiver_id = ""
          },
          error => {
            console.log("Call rejection failed with error:", error)
          }
        )
      } 
    }
  }
</script>
