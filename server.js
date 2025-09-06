const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const http = require('http');              
const { Server } = require('socket.io');    
const { Game } = require('./server/models/game')
const moveHandler = require('./server/sockets/move');

const app = express();
const PORT = 3033;

const server = http.createServer(app);      
const io = new Server(server);              


// ================== Express-Setup ==================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'geheimnisvoller-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: false,
  },
  rolling: true
}));


app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.username = req.session.username || null;
  next();
});

app.use('/', require('./server/routes/main')(io));

global.games = []
global.games[0] = new Game();
//console.log(global.games[0].field.points.filter(p => p.color == "green"));

// ================== Socket.IO-Logik ==================
io.on('connection', (socket) => {
    console.log(`[SOCKETIO] Client verbunden: ${socket.id}`);
    io.emit("backend_online", "testmsg")
    io.emit("field_baseinit", global.games[0])
    socket.on('reload_request', () => {
      socket.emit('reload_page');
    });
    moveHandler(io, socket);
    socket.on('disconnect', () => {
    console.log(`[SOCKETIO] Client getrennt: ${socket.id}`);
    });
});

// ================== Start ==================
server.listen(PORT, () => {
  console.log(`[STATUS--] Frontend server running at http://localhost:${PORT}`);
});
