const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const http = require('http');              
const { Server } = require('socket.io');    
const { Game } = require('./server/models/game')
const { initDefaultGame, initGlobals, forcePlayableNoChecks } = require('./ext/initGame')
const moveHandler = require('./server/sockets/move');
const loginHandler = require('./server/sockets/login');

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
app.use('/logonGame', require('./server/routes/login')(io))
app.use('/requestData', require('./server/routes/requestData')(io))

// ================== Globale Variablen ==================
global.games = []
global.lifecycle = Math.random().toString(36).substr(2, 9);

// =================== Init of Testgame ===================
initGlobals()
initDefaultGame(0, global.lifecycle)
forcePlayableNoChecks(0)

// ================== Socket.IO-Logik ==================
io.on('connection', (socket) => {
    console.log(`[SOCKETIO] Client verbunden: ${socket.id}`);
    
    moveHandler(io, socket);
    loginHandler(io, socket);
    io.emit("lifecycle", {lfc: global.lifecycle}) // global for every game no differetial betwen gamIndex or Player, because the lfc is the same in every restartcycle of the server
    socket.on('disconnect', () => {
    console.log(`[SOCKETIO] Client getrennt: ${socket.id}`);
    });
});

function notifyShutdown() {
  io.emit("server_shutdown", { message: "Server is shutting down." });
  console.log("[STATUS--] Shutdown notification sent to clients.");
}

// Listen for termination signals
process.on('SIGINT', () => {
  notifyShutdown();
  setTimeout(() => process.exit(0), 500); // Wait 500ms before exiting
});

process.on('SIGTERM', () => {
  notifyShutdown();
  setTimeout(() => process.exit(0), 500); // Wait 500ms before exiting
});
// ================== Start ==================
server.listen(PORT, () => {
  console.log(`[STATUS--] Frontend server running at http://localhost:${PORT}`);
});
