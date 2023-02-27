import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const reciveMessages = (message) => {
    setMessages([...messages,message]);
  };
  useEffect(() => {
    socket.on("message", reciveMessages);
    console.log("1");
    return () => {
      console.log("0");
      socket.off("message", reciveMessages);
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    console.log(messages);
    setMessage("");
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
      <h1 className="text-2xl font-bold my-2">Chat react</h1>
        <ul className="h-80 overflow-y-auto">
          {messages.map((message, indx) => (
            <li
              key={indx}
              className={`text-sm p-2 my-2 rounded-md table ${
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
          className="border-2 border-zinc-500 p-2 text-black w-full"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
