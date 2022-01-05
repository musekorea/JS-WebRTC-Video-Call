import express from 'express';
import { render } from 'express/lib/response';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = http.createServer(app);
const sokcetServer = new Server(httpServer);

app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/public/views');

app.get('/', (req, res) => {
  return res.render('index.ejs');
});
app.get('/*', (req, res) => {
  return res.redirect('/');
});

httpServer.listen(8080, () => {
  console.log(`Server is listening on Port 8080`);
});
