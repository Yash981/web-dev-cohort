import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSockets:any = [];
wss.on("connection",(socket)=>{
  socket.on("message",(message)=>{
    const socketMsg = JSON.parse(message.toString())
    if (socketMsg.type === "join") {
      const roomId = socketMsg.payload.roomId;
      
      let room = allSockets.find((r:any)=>r.roomId === roomId)
      
      if (!room) {
        room = { roomId, sockets: []}
        allSockets.push(room)
      }
      console.log(allSockets,'alllcocketsg')

      if(!room.sockets.includes(socket)){
        room.sockets.push(socket)
        console.log(`Socket ${socket} joined room ${roomId}`);
      }
    }
    
    if(socketMsg.type == "chat"){
      const message = socketMsg.payload.message

      const room = allSockets.find((r:any)=>r.sockets.includes(socket))

      if(room){
        room.sockets.forEach((s:any)=>{
          if(s!== socket){
            s.send(JSON.stringify({type:"chat",message:message}))
          }
        })
        console.log(`Message sent to room ${room.roomId}:${message}`)
      } else {
        console.log(`Sovcket is not a part of any room`)
      }
    }
  })

  socket.on("close", () => {
    console.log('close ',allSockets)
    allSockets.forEach((room:any) => {
      const index = room.sockets.indexOf(socket);
      if (index !== -1) {
        room.sockets.splice(index, 1);
        console.log(`Socket left room ${room.roomId}`);
      }
    });
    console.log('aftre close',allSockets)

    allSockets = allSockets.filter((room:any) => room.sockets.length > 0);
  });
  
})
