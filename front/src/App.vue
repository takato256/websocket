<template>
  <div id="app">
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
</template>

<script>
import io from "socket.io-client";

export default {
  data: () => ({
    useName: "",
    joinType: 1,
    roomId: "",
    socket: io("http://localhost:3031")
  }),

  created() {
    this.socket.on("connect", () => {
      console.log("connected");
    });
  }
};
</script>