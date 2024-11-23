import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();

wss.on("connection", (socket: WebSocket) => {
  clients.add(socket);
  console.log("user connected", socket);
  socket.send(
    JSON.stringify({
      type: "system",
      message: "Welcome to the chat room",
      sender: "System",
    })
  );
  broadcastUserCount()
  socket.on("message", (rawMessage) => {
    console.log(JSON.parse(rawMessage.toString()), "message from client");
    try {
      const message = JSON.parse(rawMessage.toString());
      clients.forEach((client) => {
        //@ts-ignore
        if (client.readyState === WebSocket.OPEN) {
                    //@ts-ignore

          client.send(
            JSON.stringify({
              type: "chat",
              message: message.message,
              sender: message.username,
              timeStamp: new Date().toISOString(),
            })
          );
        }
      });
    } catch (error) {
      console.log("Error proccessing message:", error);
    }
  });
  socket.on("close", () => {
    console.log(clients,'clients bata1')
    clients.delete(socket);
    console.log("Client disconnected. Total clients:", clients.size);
    broadcastUserCount();
    console.log(clients,'clients bata2')
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

      if (client.readyState === WebSocket.OPEN) {
                //@ts-ignore
        client.send(message);
      }
    });
  }
});

console.log('WebSocket server is running on ws://localhost:8080');