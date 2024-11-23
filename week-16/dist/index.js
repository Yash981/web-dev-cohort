"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const clients = new Set();
wss.on("connection", (socket) => {
    clients.add(socket);
    console.log("user connected", socket);
    socket.send(JSON.stringify({
        type: "system",
        message: "Welcome to the chat room",
        sender: "System",
    }));
    broadcastUserCount();
    socket.on("message", (rawMessage) => {
        console.log(rawMessage, "message from client");
        try {
            const message = JSON.parse(rawMessage.toString());
            clients.forEach((client) => {
                //@ts-ignore
                if (client.readyState === ws_1.WebSocket.OPEN) {
                    //@ts-ignore
                    client.send(JSON.stringify({
                        type: "chat",
                        message: message.message,
                        sender: message.username,
                        timeStamp: new Date().toISOString(),
                    }));
                }
            });
        }
        catch (error) {
            console.log("Error proccessing message:", error);
        }
    });
    socket.on("close", () => {
        clients.delete(socket);
        console.log("Client disconnected. Total clients:", clients.size);
        broadcastUserCount();
    });
    socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        clients.delete(socket);
    });
    function broadcastUserCount() {
        const message = JSON.stringify({
            type: "users",
            count: clients.size,
        });
        clients.forEach((client) => {
            //@ts-ignore
            if (client.readyState === ws_1.WebSocket.OPEN) {
                //@ts-ignore
                client.send(message);
            }
        });
    }
});
console.log('WebSocket server is running on ws://localhost:8080');
