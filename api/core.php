<?php
if (isset($_POST['data'])) {
    extract($_POST);
    $d = $data[0];
    $newdata = array(
        "name" => $d['name'],
        "cca3" => $d['cca3'],
        "independent" => $d['independent'],
        "status" => $d['status'],
        "unMember" => $d['unMember'],
        "currencies" => $d['currencies'],
        "capital" => $d['capital'],
        "region" => $d['region'],
        "subregion" => $d['subregion'],
        "languages" => $d['languages'],
        "latlng" => $d['latlng'],
        "borders" => $d['borders'],
        "area" => $d['area'],
        "flag" => $d['flag'],
        "population" => $d['population'],
        "flags" => $d['flags'],
        "startOfWeek" => $d['startOfWeek']
    );
    echo (json_encode(["data" => $newdata]));
}
