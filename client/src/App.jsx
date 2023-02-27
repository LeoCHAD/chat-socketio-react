import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const reciveMessages = (message) => {
    setMessages([...messages, message]);
  };
  useEffect(() => {
    socket.on("message", reciveMessages);
    socket.on("server:setdata", setMessages);
    console.log("1");
    return () => {
      console.log("0");
      socket.off("message", reciveMessages);
      socket.off("server:setdata", setMessages);
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(message === '' || message.length < 2) return
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

const handleChange = (e)=>{
  setMessage(e.target.value.slice(0, 25))
}

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-10 max-w-xs">
        <h1 className="text-2xl text-gray-800 font-bold my-2">Chat react Socket.io</h1>
        <ul
          id="list-messages"
          className="p-2 h-80 overflow-y-auto flex justify-end flex-col"
        >
          {messages &&
            messages.map((message, indx) => (
              <li
                key={indx}
                className={`text-sm p-2 my-1 rounded-md table max-w-sm animate__animated animate__fadeInLeft animate__faster ${
                  message.from === "Me" ? "bg-sky-700 ml-auto" : "bg-black"
                }`}
              >
                <p>
                  {message.from}: {message.body}
                </p>
              </li>
            ))}
        </ul>
        <input
          className="border-2 border-zinc-500 p-2 text-black w-full focus:outline-none rounded-md"
          type="text"
          value={message}
          onChange={e=>handleChange(e)}
          placeholder='escribe tu pensar'
        />
        <p className='animate__animated animate__pulse p-1 font-bold flex justify-center my-2 bg-green-500 rounded-full'>25 espacios para pensar</p>
      </form>
    </div>
  );
}

export default App;
