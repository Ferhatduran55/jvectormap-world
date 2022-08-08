<?php
require_once __DIR__ . '/vendor/autoload.php';

use Workerman\Worker;
use PHPSocketIO\SocketIO;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
$http_port = $_ENV['WKM_HTTP_PORT'];
$io = new SocketIO($http_port);

$io->on('connection', function ($socket) use ($io) {
    echo "Connected. \n";
    $socket->on('ping', function ($event) use ($io) {
        $io->emit('server', $_ENV['HTTP_PORT']);
    });
});
Worker::runAll();
