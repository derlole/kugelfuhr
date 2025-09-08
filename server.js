const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const http = require('http');              
const { Server } = require('socket.io');    
const { Game } = require('./server/models/game')
const { initDefaultGame, initGlobals } = require('./ext/initGame')
const moveHandler = require('./server/sockets/move');
const loginHandler = require('./server/sockets/login');
const login = require('./server/sockets/login');

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

// ================== Globale Variablen ==================
global.games = []

initGlobals()
initDefaultGame(0)


// ================== Socket.IO-Logik ==================
io.on('connection', (socket) => {
    console.log(`[SOCKETIO] Client verbunden: ${socket.id}`);
    io.emit("backend_online", "testmsg")
    io.emit("who_are_you", null)
    if(!global.games.length == 0){
      io.emit("field_baseinit", global.games[0])
    }
    moveHandler(io, socket);
    loginHandler(io, socket);
    login
    socket.on('disconnect', () => {
    console.log(`[SOCKETIO] Client getrennt: ${socket.id}`);
    });
});

// ================== Start ==================
server.listen(PORT, () => {
  console.log(`[STATUS--] Frontend server running at http://localhost:${PORT}`);
});
