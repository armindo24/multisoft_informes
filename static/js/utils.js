'use strict';

$.fn.dataTable.Api.register('processing()', function (show) {
    return this.iterator('table', function (ctx) {
        ctx.oApi._fnProcessingDisplay(ctx, show);
    });
});

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

var api = u.getApiUrl();
var numFormat = u.numFormatter;

u.dateFormat = function (date) {
    if (!date) return '';
    return date.split(/[\s]+/)[0];
};

u.parseVal = function (i) {
    var n = typeof i === 'string' ?
        parseFloat(i.replace(/[\$]/g, '')) :
        typeof i === 'number' ?
            i : 0;
    return n;
};

$.fn.dataTable.Api.register('sum()', function () {
    return this.flatten().reduce(function (a, b) {
        a = u.parseVal(a);
        b = u.parseVal(b);

        return a + b;
    }, 0);
});

u.hideNav = function () {
    $('#page-wrapper').css('margin-left', '0px');
    $('#my-left-menu').toggle(0);
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

u.spanish_dt = {
    "decimal": ",",
    "emptyTable": "Ningún dato disponible en esta tabla",
    "info": "Mostrando registros del _START_ al _END_ de _TOTAL_ registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
    "infoPostFix": "",
    "thousands": ".",
    "lengthMenu": "Mostrar _MENU_ registros",
    "loadingRecords": "Cargando...",
    "processing": "Cargando datos...",
    "search": "Buscar:",
    "zeroRecords": "No se encontraron resultados",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "aria": {
        "sortAscending": ": activar para ordenar la columna de manera ascendente",
        "sortDescending": ": activar para ordenar la columna de manera descendente"
    }
};

u.get_empresas = function (user_id, cb) {
    console.log("getempresas");
    Dajaxice.custom_permissions.get_permisos_empresa(permisos_empresas, {'usuario': user_id}, {'cb': cb});
};

u.numFormatter = $.fn.dataTable.render.number('.', ',', 0);
u.numFormat = u.numFormatter.display;

u.parseVal = function (i) {
    var n = typeof i === 'string' ?
        parseFloat(i.replace(/[\$]/g, '')) :
        typeof i === 'number' ?
            i : 0;
    //console.log(i, n);
    return n;
};

u.debug = function ($p, query) {
    if ($p) {
        $p.text(JSON.stringify(query));
    }
    console.log("debug", query);
};

u.defaultDatepicker = function () {
    $.extend(true, $.fn.datepicker.defaults, {
        language: "es",
        orientation: "bottom auto"
    });
};

u.defaultDT = function () {
    $.extend(true, $.fn.dataTable.defaults, {
        language: u.spanish_dt,
        deferRender: true,
        scrollY: 300,
        scrollX: '100%',
        scrollCollapse: true,
        scroller: {
            displayBuffer: 30,
            loadingIndicator: true
        },
        columnDefs: [
            {className: "price-value", targets: "price-label"},
            {render: u.numFormatter, targets: "price-label"},
            {className: "text-center", targets: "text-center"},
            {visible: false, targets: "grouping-col"}
        ],
        searching: false,
        ordering: false
    });
};

u.resetSelect = function ($select) {
    if (!$select) return;
    $select.disable();
    $select.clearOptions();
};

// para selects que se cargan una sola vez
u.softResetSelect = function ($select) {
    if (!$select) return;
    $select.disable();
    $select.clear();
};

u.convertir_rever = function (str) {
    var negativo = false;

    if (parseInt(str) < 0) {
        negativo = true;
        str = parseInt(str) * -1;
    }

    str = str + "";
    if (str == "") {
        //return '0,00'
        return "";
    }
    var vector = str.split(".");
    var parte_entera = vector[0];

    //var parte_decimal=(vector[1] == "" || vector[1] == null)? "00":((vector[1].length==1)? vector[1]+"0" : vector[1])
    var cont = 0;
    var nuevo = "";
    for (var i = parte_entera.length - 1; i >= 0; i--) {
        if (cont == 3) {
            nuevo = parte_entera[i] + "." + nuevo;
            cont = 0;
        } else {
            nuevo = parte_entera[i] + nuevo;
        }
        cont++;
    }

    if (negativo == true) {
        return ("-" + nuevo);
    } else {
        return (nuevo);
    }
};

u.hideTable = function ($table) {
    if (!$table) return;
    $table.css("position", "absolute").css("left", -9999);
};

u.showTable = function ($table) {
    if (!$table) return;
    $table.css("position", "relative").css("left", 0);
};