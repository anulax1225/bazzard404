module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`New media user connected ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`Media user disconnected ${socket.id}`)
        });
    })
}