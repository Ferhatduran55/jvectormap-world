<?php
require_once '../vendor/autoload.php';

use Dotenv\Dotenv;

if (isset($_POST)) {
    $dotenv = Dotenv::createImmutable("../");
    $dotenv->load();
    echo json_encode(["data" => array(
        "protocol" => ($_ENV['PROTOCOL'] == 1) ? 'https://' : 'http://',
        "hostname" => $_ENV['HOSTNAME'],
        "ip" => ($_SERVER['SERVER_ADDR']=='::1')?'127.0.0.1':$_SERVER['SERVER_ADDR'], //$_ENV['IP']
        "port" => ($_ENV['PROTOCOL'] == 1) ? ':'.$_ENV['IO_HTTPS_PORT'] : ':'.$_ENV['IO_HTTP_PORT']
    )]);
}
