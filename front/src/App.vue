<template>
  <div id="app">
    <!--入室済みの場合(部屋の情報を表示)-->
    <div v-if="isJoined">
      <div>{{ userName }}さん</div>
      部屋番号: {{ roomId }}
    </div>

    <!--未入室の場合(部屋を作る or 部屋に入る)-->
    <div v-else>
      <div>名前: <input v-model="userName" type="text" /></div>

      <input type="radio" v-model="joinType" value="1" />新しく部屋を作る
      <input type="radio" v-model="joinType" value="2" />友達の部屋に入る

      <div v-if="joinType == 1">
        <input type="button" value="部屋を作る" @click="createRoom" />
      </div>

      <div v-if="joinType == 2">
        部屋番号: <input v-model="roomId" type="text" />
        <input type="button" value="入室" @click="enterRoom" />
      </div>
    </div>

    <div style="color: red">
      {{ message }}
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data: () => ({
    useName: "",
    joinType: 1,
    roomId: "",
    isJoined: false,
    socket: io("http://localhost:3031"),
    message: ""
  }),

  created() {
    this.socket.on("connect", () => {
      console.log("connected");
    });
  },

  methods: {
    createRoom() {
      this.socket.emit("create", this.userName);
      this.message = "";
    },
    enterRoom() {
      this.socket.emit("enter", this.userName, this.roomId);
      this.message = "";
    }
  },

  mounted() {
    this.socket.on("updateRoom", (room) => {
      this.isJoined = true;
      this.roomId = room.id;
      this.message = "";
    });

    this.socket.on("notifyError", (error) => {
      this.message = error;
    });
  }
};
</script>