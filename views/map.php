<?php
$page_title = "World Map";
if (!isset($_SESSION['room']) && !isset($_GET['room'])) {
    $_SESSION['room'] = random_int(100000, 999999);
} else if (isset($_GET['room'])  && $_GET['room'] >= 100000 && $_GET['room'] <= 999999) {
    $_SESSION['room'] = $_GET['room'];
}
?>
<span class="socket">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
        <path d="M480 288H32c-17.62 0-32 14.38-32 32v128c0 17.62 14.38 32 32 32h448c17.62 0 32-14.38 32-32v-128C512 302.4 497.6 288 480 288zM352 408c-13.25 0-24-10.75-24-24s10.75-24 24-24s24 10.75 24 24S365.3 408 352 408zM416 408c-13.25 0-24-10.75-24-24s10.75-24 24-24s24 10.75 24 24S429.3 408 416 408zM480 32H32C14.38 32 0 46.38 0 64v128c0 17.62 14.38 32 32 32h448c17.62 0 32-14.38 32-32V64C512 46.38 497.6 32 480 32zM352 152c-13.25 0-24-10.75-24-24S338.8 104 352 104S376 114.8 376 128S365.3 152 352 152zM416 152c-13.25 0-24-10.75-24-24S402.8 104 416 104S440 114.8 440 128S429.3 152 416 152z" />
    </svg>
    <span class="socket-size"></span>
</span>
<span class="tools">
    <span class="tools-leave-before">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 576 512">
            <path d="M560 448H480V50.75C480 22.75 458.5 0 432 0h-288C117.5 0 96 22.75 96 50.75V448H16C7.125 448 0 455.1 0 464v32C0 504.9 7.125 512 16 512h544c8.875 0 16-7.125 16-16v-32C576 455.1 568.9 448 560 448zM384 288c-17.62 0-32-14.38-32-32s14.38-32 32-32s32 14.38 32 32S401.6 288 384 288z" />
        </svg>
    </span>
    <span class="tools-leave-after">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 576 512">
            <path d="M560 448H512V113.5c0-27.25-21.5-49.5-48-49.5L352 64.01V128h96V512h112c8.875 0 16-7.125 16-15.1v-31.1C576 455.1 568.9 448 560 448zM280.3 1.007l-192 49.75C73.1 54.51 64 67.76 64 82.88V448H16c-8.875 0-16 7.125-16 15.1v31.1C0 504.9 7.125 512 16 512H320V33.13C320 11.63 300.5-4.243 280.3 1.007zM232 288c-13.25 0-24-14.37-24-31.1c0-17.62 10.75-31.1 24-31.1S256 238.4 256 256C256 273.6 245.3 288 232 288z" />
        </svg>
    </span>
</span>
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
            socket.on('room-connected', function(data) {
                $(".socket-size").text(data.length);
            });
            $("body").on("click", "path", function() {
                var country = $(this).data("code");
                socket.emit('country-select', country);
            });
            socket.on('light-country', function(data) {
                data.forEach(element => {
                    if (colors.find(country => country.code === element.code)) {
                        colors.find(country => country.code === element.code).color = element.color;
                    } else {
                        colors.push({
                            code: element.code,
                            color: element.color
                        });
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