<?php
if (isset($_POST)) {
    echo json_encode(["result" => date("Y-m-d H:i:s")]);
}
