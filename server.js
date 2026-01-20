// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users: { socketId: username }
let users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle User Join
    socket.on('join', (username) => {
        users[socket.id] = username;
        // Broadcast updated user list to everyone
        io.emit('userList', users);
        // Announce user joined
        socket.broadcast.emit('message', {
            user: 'System',
            text: `${username} has joined the chat.`,
            type: 'system'
        });
    });

    // Handle Chat Message
    socket.on('chatMessage', (data) => {
        const { recipientId, message, image } = data;
        const senderName = users[socket.id];

        const payload = {
            user: senderName,
            text: message,
            image: image, // Base64 string
            type: 'chat',
            fromId: socket.id
        };

        if (recipientId === 'broadcast') {
            // MODE 1: Broadcast (Send to everyone)
            io.emit('message', payload);
        } else {
            // MODE 2: Unicast (Send to specific socket ID)
            // Send to recipient
            io.to(recipientId).emit('message', payload);
            // Also send back to sender so they see their own private message
            socket.emit('message', { ...payload, type: 'private-sent' });
        }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('userList', users);
        if (username) {
            io.emit('message', {
                user: 'System',
                text: `${username} has left the chat.`,
                type: 'system'
            });
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 