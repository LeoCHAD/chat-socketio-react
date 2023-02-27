import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import http from 'http';
import {Server as WebServerSocket} from 'socket.io'
import {PORT} from './config.js'
import {join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { appendData, readData } from './services/txtManager.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app);
const io = new WebServerSocket(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

app.use(cors());
app.use(morgan('dev'));

io.on('connection',(socket)=>{ 
  readData().then((data)=>{
    socket.emit('server:setdata', data);
  })
  socket.on('message',(message)=>{
    const newMessage = {
      body: message,
      from: socket.id.substring(0, 5)
    }
    appendData(newMessage);
    socket.broadcast.emit('message',newMessage)
  })
})

app.use(express.static(join(__dirname,'../client/dist')));

server.listen(PORT, ()=>console.log('funcioando en el puerto', PORT))