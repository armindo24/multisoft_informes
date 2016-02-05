'use strict';

var u = {
    api: {
        port: 3000,
        path: '/api/v1/'
    }
};

u.getApiUrl = function () {
    var url = window.location;
    return 'http://' + url.hostname + ':' + u.api.port + u.api.path;
};

u.eByName = function (name) {
    return document.getElementsByName(name);
};

u.initSelect = function (opt) {
    $(".chosen-select").chosen({
        disable_search_threshold: 0,
        no_results_text: "No hay resultados disponibles.",
        width: "200px",
        allow_single_deselect: true
    });
};

u.createSelect = function (selectName, data, op_val, op_text) {
    var select = u.eByName(selectName)[0];
    u.remover(select);
    console.log(data.data.length);
    if (data.data.length > 0) {
        for (var i = 0; i < data.data.length; i++) {
            var option = document.createElement("option");
            option.value = data.data[i][op_val];
            option.text = data.data[i][op_text];
            select.add(option);
        }
        u.SelectElement(data.data[0][op_val], selectName);
    } else {
        console.log('vacio');
    }
};

u.remover = function (selectbox) {
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
};

u.SelectElement = function (value, name) {
    var element = u.eByName(name)[0];
    element.value = value;
};

u.addCommas = function (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
};