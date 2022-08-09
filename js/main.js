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
$(function(){
    $("span.github").on("click", function () {
        window.open($(this).data("target"));
    });
});