module.exports = (io, socket) => {
    socket.on("move_sphere", (data) => {
        let game = global.games[0]; 
        if (!game) {
            io.emit('backend_error', { message: 'Kein Spiel gefunden', code: 1500 });
            return;
        }
        console.log("Move Sphere", data);
        io.emit("sphere_moved", data);
    });
};