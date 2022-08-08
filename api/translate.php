<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable("../");
$dotenv->load();
if (isset($_POST['text'])) {
  $language;
  if (isset($_POST['language'])) {
    $language = $_POST['language'];
  } else {
    $language = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
  }
  $url = "https://portal.ayfie.com/api/translate";
  $text = $_POST['text'];

  $curl = curl_init($url);
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

  $headers = array(
    "accept: application/json",
    "X-API-KEY: ".$_ENV['X_API_KEY'],
    "Content-Type: application/json",
  );
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

  $data = <<<DATA
    {
      "language": "$language",
      "text": "$text"
    }
    DATA;

  curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

  curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

  $resp = curl_exec($curl);
  curl_close($curl);

  print_r($resp);
}
