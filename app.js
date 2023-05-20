const express = require("express");
const { createServer } = require("http");
const { exit } = require("process");
const { Server } = require("socket.io");
const dotenv = require('dotenv').config();
const { Socket } = require("socket.io-client");
const Colors = require("./colors");

function colorize(text = "", ...options) {
    let opts = "";
    options = options ?? "white";
    options.forEach((opt) => {
        opts += Colors[opt] ?? Colors.white;
    });
    return `${opts}${text}${Colors.Reset}`;
}
function getEnv(properties, isInt = false) {
    const envValue = process.env[properties];
    if (envValue !== undefined) {
        return isInt ? parseInt(envValue) : envValue;
    }
    return null;
}
const env = {
    HOSTNAME: getEnv('HOSTNAME'),
    IP: getEnv('IP'),
    IO_pingInterval: getEnv('IO_PING_INTERVAL', true),
    IO_pingTimeout: getEnv('IO_PING_TIMEOUT', true),
    IO_connectTimeout: getEnv('IO_CONNECT_TIMEOUT', true),
    IO_allowUpgrades: getEnv('IO_ALLOW_UPGRADES'),
    IO_upgradeTimeout: getEnv('IO_UPGRADE_TIMEOUT', true),
    IO_maxHttpBufferSize: getEnv('IO_MAX_HTTP_BUFFER_SIZE', true),
    IO_httpCompression: getEnv('IO_HTTP_COMPRESSION'),
    IO_cors_origin: getEnv('IO_CORS_ORIGIN'),
    IO_cors_allowedHeaders: getEnv('IO_CORS_ALLOWED_HEADERS'),
    IO_cors_credentials: getEnv('IO_CORS_CREDENTIALS'),
    PROTOCOL: getEnv('PROTOCOL', true),
    IO_HTTPS_PORT: getEnv('IO_HTTPS_PORT', true),
    IO_HTTP_PORT: getEnv('IO_HTTP_PORT', true)
};
var url;
var port;
if (env.PROTOCOL == 1) {
    url = "https://" + env.HOSTNAME + ":" + env.IO_HTTPS_PORT;
    port = env.IO_HTTPS_PORT;
} else {
    url = "http://" + env.HOSTNAME + ":" + env.IO_HTTP_PORT;
    port = env.IO_HTTP_PORT;
}
const SocketIOUrl = url;
const SocketIOPort = port;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    pingInterval: env.IO_pingInterval,
    pingTimeout: env.IO_pingTimeout,
    connectTimeout: env.IO_connectTimeout,
    allowUpgrades: env.IO_allowUpgrades,
    upgradeTimeout: env.IO_upgradeTimeout,
    maxHttpBufferSize: env.IO_maxHttpBufferSize,
    httpCompression: env.IO_httpCompression,
    cors: {
        origin: env.IO_cors_origin,
        allowedHeaders: env.IO_cors_allowedHeaders,
        credentials: env.IO_cors_credentials
    }
});

var room = [];
var userTable = [];

io.on("connection", (socket) => {
    if (() => socket.handshake.query.id) {
        const authId = socket.handshake.query.id;
        var user;
        if (userTable.find(session => session.id === authId)) {
            user = userTable.find(session => session.id === authId);
            console.log(colorize('Tekrar bağlandı -> ', "cyan") + user.id);
            socket.emit('log', 'Tekrar bağlandı -> ' + user.id);
            if (room.find(room => room.id === user.room)) {
                socket.join(user.room);
                var addRoomSocket = room.find(room => room.id === user.room);
                addRoomSocket.sockets.push(user.id);
                io.to(user.room).emit('room-connected', addRoomSocket.sockets);
                console.log(colorize('Odaya bağlandı -> ', "cyan") + user.id + " -> " + colorize(user.room, "BgGreen"));
                var socketRoom = room.find(room => room.id === user.room);
                io.to(user.room).emit('light-country', socketRoom.colors);
            }
        } else {
            var list = {
                id: socket.handshake.query.id,
                date: socket.handshake.query.date,
                from: socket.handshake.query.from,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            }
            if (() => socket.handshake.query.room) {
                list.room = socket.handshake.query.room;
            }
            userTable.push(list);
            user = userTable.find(session => session.id === authId);
            console.log(colorize("Authentication accepted.", "green"));
            console.log(colorize('Bağlantı kuruldu -> ', "cyan") + user.id + " -> " + user.date);
            if (() => user.room) {
                var roomTemplate = {
                    id: user.room,
                    sockets: [],
                    colors: []
                }
                if (room.find(room => room.id === user.room)) {
                    socket.join(user.room);
                    var addRoomSocket = room.find(room => room.id === user.room);
                    addRoomSocket.sockets.push(user.id);
                    io.to(user.room).emit('room-connected', addRoomSocket.sockets);
                    console.log(colorize('Odaya bağlandı -> ', "cyan") + user.id + " -> " + colorize(user.room, "BgGreen"));
                    var socketRoom = room.find(room => room.id === user.room);
                    socket.to(user.room).emit('light-country', socketRoom.colors);
                } else {
                    room.push(roomTemplate);
                    if (room.find(room => room.id === user.room)) {
                        socket.join(user.room);
                        var addRoomSocket = room.find(room => room.id === user.room);
                        addRoomSocket.sockets.push(user.id);
                        io.to(user.room).emit('room-connected', addRoomSocket.sockets);
                        console.log(colorize('Odaya bağlandı -> ', "cyan") + user.id + " -> " + colorize(user.room, "BgGreen"));
                        var socketRoom = room.find(room => room.id === user.room);
                        io.to(user.room).emit('light-country', socketRoom.colors);
                    }
                }
            }
            socket.emit('log', 'Bağlantı kuruldu -> ' + user.id);
        }
        console.log(room);
        socket.on('request-color', function (id) {
            if (id === user.id) {
                if (() => user.color) {
                    socket.emit('get-color', user.color);
                }
            }
        });
        socket.on('country-select', (country) => {
            var socketRoom = room.find(room => room.id === user.room);
            if (() => country) {
                if (socketRoom.colors.find(Country => Country.code === country)) {
                    socketRoom.colors.find(Country => Country.code === country).color = user.color;
                } else {
                    socketRoom.colors.push({
                        code: country,
                        color: user.color
                    });
                }
                io.to(user.room).emit('light-country', socketRoom.colors);
            }
        });
        socket.on('disconnect', (reason) => {
            var currentRoom = room.find(room => room.id === user.room);
            if (currentRoom.sockets.indexOf(user.id) > -1) {
                currentRoom.sockets.splice(currentRoom.sockets.indexOf(user.id), 1);
            }
            io.to(user.room).emit('room-connected', currentRoom.sockets);
            console.log(colorize('Bağlantı sonlandırıldı -> ', "yellow") + user.id + colorize(' -> ', "yellow") + colorize(reason, "BgRed"));
        });
    } else {
        console.log(colorize("Authentication rejected.", "red"));
        socket.disconnect();
    }
});

httpServer.listen(SocketIOPort, () => {
    console.log(SocketIOUrl);
});