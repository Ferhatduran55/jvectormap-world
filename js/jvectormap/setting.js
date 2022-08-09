const infoBoxID = "info";
const infoBoxClass = "w-75 mx-2 mx-auto px-5 bg-dark bottom-0 position-absolute text-light rounded-top";
const infoBoxStyle = {
    left: "0",
    right: "0",
    position: "absolute",
    resize: "none",
    boxSizing: "border-box"
};
const infoBoxResizeTool = "<div class=\"infoBoxResizeTool\" data-key=\"resize\">.....</div>";
const infoBox = '<div id="' + infoBoxID + '"><div class="row"><div id="countryName" class="col-11 text-start">Select Country..</div><div id="close" class="col-1 text-end">&#x2715;</div></div></div>';
var map;
function pathAjax(country) {
    const request = $.ajax({
        url: "api/country",
        type: "POST",
        dataType: "json",
        data: {
            codes: country
        }
    });
    request.done(function (result) {
        var codeResult = result;
        const request = $.ajax({
            url: "api/core",
            type: "POST",
            dataType: "json",
            data: {
                data: codeResult
            }
        });
        request.done(function (result) {
            var coreResult = result.data;
            var name = coreResult.name.common;
            var countryName = Translate(name, language);
            console.log(countryName);
            $("#" + infoBoxID).data("code", coreResult.cca3).find("#countryName").text(name);
        });
        request.fail(function (e) {
            console.log(e);
        });
    });
    request.fail(function (e) {
        console.log(e);
    });
}
$(function () {
    setTimeout(function () {
        $(".infoBoxResizeTool").on("mousedown", function () {
            $("#info").addClass("Resize");
            $("body").addClass("UnSelectable");
            console.log("sasa");
            KeyDown = 1;
        });
        $(document).on("mouseup", function () {
            $("#info").removeClass("Resize");
            $("body").removeClass("UnSelectable");
            KeyDown = 0;
        });
        $(document).on("mousemove", function (Event) {
            if (KeyDown == 1 && $("#info").hasClass("Resize")) {
                var NewTop = (Event.pageY * 100) / window.innerHeight;
                if (NewTop > 5 && NewTop < 100) {
                    $("#info").css("top", NewTop + "%");
                }
            }
        });
    }, 500);
    var KeyDown;
    map = $("#map");
    map.vectorMap({
        map: 'world_mill',
        backgroundColor: 'transparent',
        container: $("#map"),
        series: {
            regions: [{
                attribute: 'fill'
            }]
        },
        regionStyle: {
            initial: {
                fill: 'white',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                fill: "lime",
                "fill-opacity": null,
                cursor: 'pointer'
            },
            selected: {
                //fill: 'none'
            },
            selectedHover: {
                //fill: 'none'
            }
        }
    }).append(infoBox);
    $("#" + infoBoxID).addClass(infoBoxClass).css(infoBoxStyle).append(infoBoxResizeTool);
    map.find("svg").css({
        width: "100%",
        height: "100%"
    });
    $("#info").css("top", "100%");
    $("body").on("click", "#close", function () {
        $("#info").css("top", "100%");
    });
    $("body").on("mouseenter", "path", function (e) {
        e.preventDefault();
        var pathColor;
        var country = $(this).data("code");
        $("path[data-code='" + country + "']").on("click", function () {
            pathColor = oldColor;//$("path[data-code='" + country + "']").attr("fill");
            console.log(pathColor);
            console.log(country);
            pathAjax(country);
        });
        $("path[data-code='" + country + "']").on("mouseleave", function () {
            $("path[data-code='" + country + "']").off("click");
            setTimeout(function () {
                $("path[data-code='" + country + "']").attr("fill", pathColor);
            }, 10);
        });
    });
});