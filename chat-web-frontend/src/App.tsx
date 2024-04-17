import { useEffect } from 'react';
import './App.css'
import { io } from "socket.io-client";

function App() {

  useEffect(() => {
    const socket = io("https://cp29bd07-8000.inc1.devtunnels.ms/");
    socket.on("connect", () => {
      console.log("Connected to server");
    });
}, []);

 

  return (
    <>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
