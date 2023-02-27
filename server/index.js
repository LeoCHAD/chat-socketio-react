import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { Server as WebServerSocket } from 'socket.io';
import { fileURLToPath } from 'url';
import { PORT } from './config.js';
import { appendData, readData } from './services/txtManager.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const server = http.createServer(app);
const io = new WebServerSocket(server, {
  cors: {
    origin: '*'
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

server.listen(PORT, ()=>console.log('funcionando en el puerto', PORT))