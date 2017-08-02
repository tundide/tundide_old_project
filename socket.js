let User = require('./models/user');

module.exports = function(server) {
    let io = require('socket.io')(server);

    io.use(function(socket, next) {
        let userId = socket.request._query['userId'];

        User.findOneAndUpdate({ shortId: userId }, { "$set": { "socketId": socket.id } }, function(err, doc) {
            if (err) return;
        });

        next();
    });

    io.sockets.on('connection', function(socket) {
        socket.on('sendMessage', (data) => {
            if (data.message === '') {
                io.to(socket.id).emit(`sendMessageResponse`, `El mensaje no puede estar vacio`);
            } else {
                User.findById(data.toSocketId, function(error, result) {
                    if (error) return;
                    let user = result;
                    io.to(user.socketId).emit(`sendMessageResponse`, data);
                });
            }
        });
    });
};