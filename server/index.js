const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./userHelper');
const formatMessage = require('./addTime');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    
    socket.on('joinRoom', ({username, room}) => {
        const user = newUser(socket.id, username, room);
        socket.join(user.room);

        socket.broadcast.to(user.room).emit('message', formatMessage('System',`${user.username} joined the room`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
    });


    socket.on('chatMessage', (msg) => {
        const user = getActiveUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });


    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage('System',`${user.username} has left the room`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));