<?php 
$page_title = "World Map"; 
?>

    <div id="map" class="map_cache"></div>
    <script data-group="socketio" id="old" src></script>
    <script data-group="socketio" id="latest" src="node_modules/socket.io/client-dist/socket.io.js"></script>
    <script data-group="socketio">
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
                    from: IO.from
                }
                var socket = io(IO.url, {
                    query: IO.query
                });
                socket.on('disconnect', function() {
                    console.log("Bağlantı koptu -> " + IO.query.id);
                });
                socket.on('log', function(data) {
                    console.log(data);
                });
                $("body").on("click", "path", function () {
                    var country = $(this).data("code");
                    socket.emit('country-select',country);
                });
                socket.on('light-country', function (country) {
                    $("path[data-code='"+country+"']").attr("fill","red");
                });
                $("script[data-group='socketio']").remove();
            });
        });
    </script>