import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { base64Decode, base64Encode } from "./utilities/handleB64";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("dark");

  const reciveMessage = (mess) => {
    console.log(mess, 'rec');
    const {from, body} = mess;
    const newMessage = {
      from, body: body
    }
    setMessages([...messages, newMessage]);
    console.log(messages.length);
  };
  const reciveData = (data) => {
    console.log(data);
    const newData = data.map(message=>{
      return {
        from: message.from,
        body: base64Decode(message.body)
      }
    })
    setMessages(newData);
  };


  useEffect(() => {
    socket.on("message", reciveMessage);
    socket.on("server:setdata", reciveData);
    console.log("1");
    return () => {
      console.log("0");
      socket.off("message", reciveMessage);
      socket.off("server:setdata", reciveData);
    };
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "" || message.length < 2) return;
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages([...messages, newMessage]);
    socket.emit("message", base64Encode(message));
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value.slice(0, 25));
  };

  const handleclickTheme=({target})=>{
    setTheme(target.dataset.themeName);
  }

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className={`${theme === 'dark' ? 'bg-black':'bg-white'} p-10 max-w-xs`}>
        <div className="flex justify-center items-center">
          <h1 className={`text-2xl ${theme === 'light' ? 'text-gray-800' : 'text-gray-500'} font-bold my-2`}>
            Chat Socket.io{" "}
          </h1>
          {theme === "light" ? (
            <span
              onClick={handleclickTheme}
              data-theme-name="dark"
              className={`material-symbols-outlined ${theme === 'light' ? 'text-gray-800' : 'text-gray-400'} ml-1 cursor-pointer select-none`}
            >
              dark_mode
            </span>
          ) : (
            <span
              onClick={handleclickTheme}
              data-theme-name="light"
              className={`material-symbols-outlined ${theme === 'light' ? 'text-gray-800' : 'text-gray-400'} ml-1 cursor-pointer select-none`}
            >
              light_mode
            </span>
          )}
        </div>
        <ul
          className={` relative p-2 h-80 overflow-y-auto flex justify-end flex-col ${theme=='dark' ? 'fade-black' : 'fade-white'}`}
        >
          {messages &&
            messages.map((m, indx) => (
              <li
                key={indx}
                className={`text-sm p-2 my-1 rounded-md table max-w-sm animate__animated animate__fadeInLeft animate__faster ${
                  m.from === "Me" ? "bg-sky-700 ml-auto" : "bg-zinc-700"
                }`}
              >
                <p>
                  {m.from}: {m.body}
                </p>
              </li>
            ))}
        </ul>
        <input
          className="border-2 border-zinc-500 p-2 text-black w-full focus:outline-none rounded-md"
          type="text"
          value={message}
          onChange={(e) => handleChange(e)}
          placeholder="escribe tu pensar"
        />
        <p
          className={`${
            message.length === 25 &&
            "animate__animated animate__pulse bg-red-500"
          } bg-green-500 p-1 font-bold flex justify-center text-sm my-2 rounded-full transition duration-300 ease-in-out`}
        >
          {25 - message.length} espacios para pensar
        </p>
      </form>
    </div>
  );
}

export default App;
