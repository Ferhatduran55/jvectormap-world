<?php
if (isset($_POST)) {
    echo json_encode(["result" => substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2)]);
}
