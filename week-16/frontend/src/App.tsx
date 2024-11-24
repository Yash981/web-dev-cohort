import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './App.css'
interface TextInputProps{
  username: string,
  message: string,
}
function App() {
  const [textInput, setTextInput] = useState<TextInputProps>({
    username:"",
    message:""
  })
  
  const socketRef = useRef<WebSocket | null>(null); 
  const [receivedData,setReceivedData] = useState<any>({})

  useEffect(()=>{
    const newSocket = new WebSocket('ws://localhost:8080')
    newSocket.onopen = () => {
      console.log('Connection established');
      newSocket.send(JSON.stringify({mymessage:'Hello Server!,This is client'}));
      return ;
    }
    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      setReceivedData(JSON.parse(message.data))
      return;
    }
    newSocket.onerror = (error) =>{
      console.log('Error connecting',error)
      return;
    }
    socketRef.current = newSocket
    return () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
          socketRef.current = null; 
    }

  },[])
  const handleChange = (e:ChangeEvent<HTMLInputElement>) =>{
    setTextInput({
      ...textInput,
      [e.target.name]:e.target.value
    })
  }
  const sendMessage = () =>{
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ username: textInput.username, message: textInput.message }));
    } else {
      console.error('WebSocket is not connected');
    }
  }
  return (
    <>
      <h1>Hello</h1>
      <input type="text" name="username" id="username" onChange={handleChange}/>
      <input type="text" name="message" id="message" onChange={handleChange}/>
      <button onClick={sendMessage}>send Message</button>
      {receivedData && 
        <div className="">
          <p>{textInput.username}</p>
          <p>{receivedData.message}</p>
        </div>
      }
    </>
  )
}

export default App
