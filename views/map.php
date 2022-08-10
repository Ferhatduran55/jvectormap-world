<?php
$page_title = "World Map";
if(!isset($_SESSION['room']) && !isset($_GET['room'])){
    $_SESSION['room'] = random_int(100000, 999999);
}else if(isset($_GET['room'])  && $_GET['room'] >= 100000 && $_GET['room'] <= 999999){
    $_SESSION['room'] = $_GET['room'];
}
?>
<div id="map" class="map_cache"></div>
<script src="js/jvectormap/setting.js"></script>
<script data-group="socketio" id="old" src></script>
<script data-group="socketio" id="latest" src="node_modules/socket.io/client-dist/socket.io.js"></script>
<script data-group="socketio">
    var oldColor;
    var colors = [];
    $(document).ready(function() {
        var scriptSrc = {
            old: "node_modules/socket.io-client/dist/socket.io.js",
            latest: "node_modules/socket.io/client-dist/socket.io.js"
        }
        $("#latest").attr("src", scriptSrc.latest);
        const request = $.ajax({
            url: "api/port",
            type: "POST",
            dataType: "json",
            data: {
                ajax: true
            }
        });
        request.done(function(result) {
            const IO = {
                url: result.data.protocol + result.data.ip + result.data.port,
                id: "<?= md5(base64_encode("SocketIO") . session_id()) ?>",
                date: "<?= date("Y-m-d H:i:s") ?>",
                from: "<?= substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2) ?>",
                query: {},
                withCredentials: true,
                extraHeaders: {
                    "access": true
                }
            }
            IO.query = {
                id: IO.id,
                date: IO.date,
                from: IO.from,
                color: null,
                room: <?= $_SESSION['room'] ?>
            }
            var socket = io(IO.url, {
                query: IO.query
            });
            socket.emit('request-color', IO.query.id);
            socket.on('get-color', function(color) {
                IO.query.color = color;
                console.log(IO.query);
                oldColor = IO.query.color;
            });
            socket.on('disconnect', function() {
                console.log("Bağlantı koptu -> " + IO.query.id);
            });
            socket.on('log', function(data) {
                console.log(data);
            });
            $("body").on("click", "path", function() {
                var country = $(this).data("code");
                socket.emit('country-select', country);
            });
            socket.on('light-country', function(data) {
                data.forEach(element => {
                    if(colors.find(country => country.code === element.code)){
                        colors.find(country => country.code === element.code).color = element.color;
                    }else{
                        colors.push({code:element.code,color:element.color});
                    }
                    $("path[data-code='" + element.code + "']").attr("fill", element.color);
                });
            });
            const newColor = oldColor;
            $("script[data-group='socketio']").remove();
        });
        console.log(map.regions);
    });
</script>