import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import http from 'http';
import {Server as WebServerSocket} from 'socket.io'
import {PORT} from './config.js'
import {join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
  socket.on('message',(message)=>{
    socket.broadcast.emit('message',{
      body: message,
      from: socket.id.substring(0, 5)
    })
  })
}) 

app.use(express.static(join(__dirname,'../client/dist')))

server.listen(PORT, ()=>console.log('funcioando en el puerto', PORT))