'use strict';

var u = {
    api: {
        port: 3000,
        path: '/api/v1/'
    }
};

u.hideNav = function () {
    $('#page-wrapper').css('margin-left', '0px');
    $('#my-left-menu').toggle(0);
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


//TODO: check default behavior
u.createSelect = function (selectName, data, op_val, op_text, ninguno) {
    var select = u.eByName(selectName)[0];
    u.remover(select);
    console.log(data.data.length);
    if (data.data.length > 0) {
        if (ninguno) {
            var option = document.createElement("option");
            option.value = '';
            option.text = 'Vacio';
            select.add(option);
        }

        for (var i = 0; i < data.data.length; i++) {
            var option = document.createElement("option");
            option.value = data.data[i][op_val];
            option.text = data.data[i][op_text];
            select.add(option);
        }
        u.SelectElement(ninguno ? '' : data.data[0][op_val], selectName);
        $('[name=' + selectName + ']').trigger('change');
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

u.addCommas = function (num) {
    var nStr = (Math.round(num * 100) / 100).toString()
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

var spanish = {
    closeText: 'Cerrar',
    prevText: '<Ant',
    nextText: 'Sig>',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dateFormat: 'yy/mm/dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};

u.translate = function () {
    $.datepicker.setDefaults(spanish);
};

var permisos_empresas = function (data, args) {
    if (data.length > 0) {
        var vector = []
        for (var a = 0; a < data.length; a++) {
            vector.push("'" + data[a].empresa + "'")
        }
        var str = JSON.stringify({empresas: vector});
        $.ajax(api + "empresa/inin/select", {
            method: 'POST',
            contentType: 'application/json',
            data: str
        }).done(function (d) {
                if (args.cb) args.cb(d);
            }
        );
    }
};

u.get_empresas = function (user_id, cb) {
    console.log("getempresas");
    Dajaxice.custom_permissions.get_permisos_empresa(permisos_empresas, {'usuario': user_id}, {'cb': cb});
};