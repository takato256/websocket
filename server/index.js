const http = require("http").createServer();
const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:8080"],
    },
});

http.listen(3031);

const rooms = [];
const users = [];

io.on("connection", (socket) => {
    // 部屋を新しく建てる
    socket.on("create", (userName) => {
        // ランダムな部屋IDを生成
        const roomId = generateRoomId();

        // ユーザー・部屋の情報をそれぞれデータとして格納する
        const user = { id: socket.id, name: userName, roomId};
        const room = {
            id: roomId,
            users: [user],
            turnUserIdex: 0,
            posts: []
        };
        rooms.push(room);
        users.push(user);

        // 部屋に入る
        socket.join(roomId);

        // 部屋情報をクライアントに送る
        // emit()はSocket.IOのイベント送信処理
        io.to(socket.id).emit("updateRoom", room);
    });
});

// ランダムなroomId(1000-9999)を生成する
function generateRoomId() {
    const id = Math.floor(Math.random() * 8999 + 1000);
    // ランダムに生成したidが既に存在する場合は作り直す
    if (rooms.some((r) => r.id == id)) {
        return generateRoomId();
    }
    return id;
}