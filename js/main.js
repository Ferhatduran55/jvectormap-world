var lng;
var language;
function getLang() {
    var result;
    $.ajax({
        url: "api/language",
        type: "POST",
        dataType: "json",
        data: {
            ajax: true
        }
    }).done(function (data) {
        output = data.result;
        result = output;
    }).fail(function (textStatus) {
        console.log(textStatus);
    });
    if (result != "") {
        return result;
    } else {
        return "en";
    }
}
lng = getLang();
if (lng != "") {
    language = lng;
}
function Translate(text, lang) {
    var result, output;
    $.ajax({
        url: "api/translate",
        type: "POST",
        data: {
            text: text,
            language: lang
        },
        dataType: "json"
    }).done(function (data) {
        output = data.result;
        result = output;
        return result;
    }).fail(function (textStatus) {
        console.log(textStatus);
    });
    return result;
}
function ajax(url, type, dataType, data, done = null) {
    const request = $.ajax({
        url: url,
        type: type,
        dataType: dataType,
        data: data,
    });
    if (done != null) {
        request.done;
    }
    request.fail(function (e) {
        console.log(e);
    });
}
var infoData = [];
const infoBoxID = "info";
const infoBoxClass = "w-75 mx-2 mx-auto px-5 bg-dark bottom-0 position-absolute text-light rounded-top";
const infoBoxStyle = {
    left: "0",
    right: "0",
    position: "absolute"
};
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
$(document).ready(function () {
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
                fill: 'lime',
                "fill-opacity": 0.6,
                cursor: 'pointer'
            },
            selected: {
                fill: 'red'
            },
            selectedHover: {
                fill: 'red'
            }
        }
    }).append(infoBox);
    $("#" + infoBoxID).addClass(infoBoxClass).css(infoBoxStyle);
    map.find("svg").css({
        width: "100%",
        height: "100%"
    });
    $("body").on("mouseenter", "path", function (e) {
        e.preventDefault();
        var pathColor;
        var country = $(this).data("code");
        $("path[data-code='" + country + "']").on("click", function () {
            pathColor = $(this).attr("fill");
            console.log(country);
            pathAjax(country);
        });
        $("path[data-code='" + country + "']").on("mouseleave", function () {
            $("path[data-code='" + country + "']").off("click");
            setTimeout(function(){
                $("path[data-code='" + country + "']").attr("fill", pathColor);
            },10);
        });
    });
});