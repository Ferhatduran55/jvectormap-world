<?php
function Space($number){
    if($number > 0){
      return str_repeat('&nbsp;', $number);
    }
  }
?>
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="<?= substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2) ?>">

<?php if($customHead == false){ ?>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NJVM - <?=(isset($view) && $view!='') ? $view : '';?></title>
    <?php
    $vendor = [
        "bootstrap/dist/css/bootstrap.min.css",
        "jvectormap/jvectormap.css",
        "fontawesome/css/fontawesome.min.css",
        "main/style.css",
        "jvectormap/jvectormap.js",
        "jquery/dist/jquery.min.js",
        "jvectormap/jvectormap.min.js",
        "jvectormap/maps/world_mill.js",
        "main.js",
        "fontawesome/js/fontawesome.min.js",
        "bootstrap/dist/js/bootstrap.bundle.min.js"
    ];
    foreach($vendor as $key => $value){
        $n="";($key>0)?$n="\t":"";
        $extension=explode('.',$value);
        switch($extension[count($extension)-1]){
            case "js":
                if(file_exists("vendor/$value")){
                    echo "$n<script src=\"vendor/$value\"></script>\n";
                }elseif(file_exists("node_modules/$value")){
                    echo "$n<script src=\"node_modules/$value\"></script>\n";
                }elseif(file_exists("js/$value")){
                    echo "$n<script src=\"js/$value\"></script>\n";
                }
                break;
            case "css":
                if(file_exists("vendor/$value")){
                    echo "$n<link rel=\"stylesheet\" href=\"vendor/$value\">\n";
                }elseif(file_exists("node_modules/$value")){
                    echo "$n<link rel=\"stylesheet\" href=\"node_modules/$value\">\n";
                }elseif(file_exists("css/$value")){
                    echo "$n<link rel=\"stylesheet\" href=\"css/$value\">\n";
                }
                break;
        }
    }
    ?>
</head>
<?php } ?>
<?php if(isset($view) && $view!=''){?>
<body>
    <?php require_once('views/'.$view.'.php'); ?>

</body>
<?php } ?>
</html>