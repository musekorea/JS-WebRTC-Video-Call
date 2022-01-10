import express from 'express';
import { render } from 'express/lib/response';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const sokcetServer = new Server(httpServer);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/public/views');

app.get('/', (req, res) => {
  return res.render('index.ejs');
});
app.get('/*', (req, res) => {
  return res.redirect('/');
});

sokcetServer.on('connect', (socket) => {
  socket.onAny((event) => {
    console.log(event);
  });
  socket.on('joinRoom', async (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcomeRoom');
  });
  socket.on('offer', (offer, roomName) => {
    console.log(`offer comes`, offer);
    socket.to(roomName).emit('offer', offer);
  });
  socket.on('answer', (answer, roomname) => {
    console.log('answer comes', answer);
    socket.to(roomname).emit('answer', answer);
  });
  socket.on('ice', (ice, roomname) => {
    console.log('Sent ICE Candidate');
    socket.to(roomname).emit('ice', ice);
  });
});

httpServer.listen(8080, () => {
  console.log(`Server is listening on Port 8080`);
});
