const express = require("express");
const { createServer } = require("http");
const { exit } = require("process");
const { Server } = require("socket.io");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const dotenv = require('dotenv').config();
const isset = require('isset-php');
const Colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};
function colorize(text = "", ...options) {
    let opts = "";
    options = options ?? "white";
    options.forEach((opt) => {
        opts += Colors[opt] ?? Colors.white;
    });
    return `${opts}${text}${Colors.Reset}`;
}
function getEnv(properties, isInt = false) {
    var output;
    var arr = Object.entries(process.env);
    arr.forEach(element => {
        if (Array.isArray(element)) {
            let num = 0;
            element.forEach(element2 => {
                if (element2 == properties || num >= 1) {
                    num += 1;
                    if (num == 2) {
                        if (isInt) {
                            output = parseInt(element2);
                            exit;
                        } else {
                            output = element2;
                            exit;
                        }
                    }
                }
            });
        }
    });
    return output;
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

var userTable = [];

io.on("connection", (socket) => {
    if (() => socket.handshake.query.id) {
        const authId = socket.handshake.query.id;
        var user;
        if (userTable.find(session => session.id === authId)) {
            user = userTable.find(session => session.id === authId);
            console.log(colorize('Tekrar bağlandı -> ', "cyan") + user.id);
            socket.emit('log', 'Tekrar bağlandı -> ' + user.id);
        } else {
            var list = {
                id: socket.handshake.query.id,
                date: socket.handshake.query.date,
                from: socket.handshake.query.from,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            }
            userTable.push(list);
            user = userTable.find(session => session.id === authId);
            console.log(colorize("Authentication accepted.", "green"));
            console.log(colorize('Bağlantı kuruldu -> ', "cyan") + user.id + " -> " + user.date);
            socket.emit('log', 'Bağlantı kuruldu -> ' + user.id);
        }
        socket.on('request-color', function (id) {
            if (id === user.id) {
                if (() => user.color){
                    socket.emit('get-color',user.color);
                }
            }
        });
        socket.on('country-select', (country) => {
            io.emit('light-country', country, user.color);
        });
        socket.on('disconnect', (reason) => {
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