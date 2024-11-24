"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// const clients = new Set();
// wss.on("connection", (socket: WebSocket) => {
//   clients.add(socket);
//   console.log("user connected", socket);
//   socket.send(
//     JSON.stringify({
//       type: "system",
//       message: "Welcome to the chat room",
//       sender: "System",
//     })
//   );
//   broadcastUserCount()
//   socket.on("message", (rawMessage) => {
//     console.log(JSON.parse(rawMessage.toString()), "message from client");
//     try {
//       const message = JSON.parse(rawMessage.toString());
//       clients.forEach((client) => {
//         //@ts-ignore
//         if (client.readyState === WebSocket.OPEN) {
//                     //@ts-ignore
//           client.send(
//             JSON.stringify({
//               type: "chat",
//               message: message.message,
//               sender: message.username,
//               timeStamp: new Date().toISOString(),
//             })
//           );
//         }
//       });
//     } catch (error) {
//       console.log("Error proccessing message:", error);
//     }
//   });
//   socket.on("close", () => {
//     // console.log(clients,'clients bata1')
//     clients.delete(socket);
//     console.log("Client disconnected. Total clients:", clients.size);
//     broadcastUserCount();
//     // console.log(clients,'clients bata2')
//   });
//   socket.on("error", (error) => {
//     console.error("WebSocket error:", error);
//     clients.delete(socket);
//   });
//   function broadcastUserCount() {
//     const message = JSON.stringify({
//       type: "users",
//       count: clients.size,
//     });
//     clients.forEach((client) => {
//                 //@ts-ignore
//       if (client.readyState === WebSocket.OPEN) {
//                 //@ts-ignore
//         client.send(message);
//       }
//     });
//   }
// });
// console.log('WebSocket server is running on ws://localhost:8080');
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const socketMsg = JSON.parse(message.toString());
        if (socketMsg.type === "join") {
            const roomId = socketMsg.payload.roomId;
            let room = allSockets.find((r) => r.roomId === roomId);
            if (!room) {
                room = { roomId, sockets: [] };
                allSockets.push(room);
            }
            console.log(allSockets, 'alllcocketsg');
            if (!room.sockets.includes(socket)) {
                room.sockets.push(socket);
                console.log(`Socket ${socket} joined room ${roomId}`);
            }
        }
        if (socketMsg.type == "chat") {
            const message = socketMsg.payload.message;
            const room = allSockets.find((r) => r.sockets.includes(socket));
            if (room) {
                room.sockets.forEach((s) => {
                    if (s !== socket) {
                        s.send(JSON.stringify({ type: "chat", message: message }));
                    }
                });
                console.log(`Message sent to room ${room.roomId}:${message}`);
            }
            else {
                console.log(`Sovcket is not a part of any room`);
            }
        }
    });
    socket.on("close", () => {
        console.log('why close ', allSockets);
        // Remove the socket from all rooms
        allSockets.forEach((room) => {
            const index = room.sockets.indexOf(socket);
            if (index !== -1) {
                room.sockets.splice(index, 1);
                console.log(`Socket left room ${room.roomId}`);
            }
        });
        console.log('aftre close', allSockets);
        // Clean up empty rooms
        allSockets = allSockets.filter((room) => room.sockets.length > 0);
    });
});
