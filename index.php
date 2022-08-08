<?php
if (isset($_GET['view']) && $_GET['view'] != '') {
    extract($_GET);
}else{
    $view = 'map';
}
$customHead = false;
require_once("layouts/index.php");
