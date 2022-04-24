const express = require('express');
const router = express.Router();
const socketio = require('socket.io');
const path = require('path');
const url = require('url');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

router.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/chat.html'));
});

module.exports = router;