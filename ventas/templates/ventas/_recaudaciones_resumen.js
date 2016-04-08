if (d.data.length > 0) {
    //console.log(d.data)
    var atable_id = [];
    var aplanilla = [];
    var aplanilla_moneda = [];
    var aplanilla_moneda_agrupacion = [];
    var aplanilla_moneda_agrupacion_operador = [];
    var aplanilla_moneda_agrupacion_operador_tpp = [];
    var nro_planilla = 0;
    var aorder_ren = sortJSON(d.data, 'nroplanilla');
    for (var a = 0; a < aorder_ren.length; a++) {
        if (aorder_ren[a].nroplanilla != nro_planilla) {
            var sdiv_planilla = '<hr><div id="pla_' + aorder_ren[a].nroplanilla + '">' +
                '<h4>PLANILLA DE RECAUDACIONES - CONSOLIDADA - ' + aorder_ren[a].nroplanilla + ' - ';
            if (aorder_ren[a].estado == 'CE') {
                sdiv_planilla += 'CERRADO';
            } else {
                sdiv_planilla += 'ABIERTO';
            }
            sdiv_planilla += '</h4>' +
                '</div>';
            $('#bodytab').append(sdiv_planilla);
            aplanilla.push(aorder_ren[a].nroplanilla);
            nro_planilla = aorder_ren[a].nroplanilla;
        }
    }
    var aorder_pla = sortJSON(d.data, 'codmoneda');
    for (var a = 0; a < aplanilla.length; a++) {
        var moneda = "";
        for (var b = 0; b < aorder_pla.length; b++) {
            if (aplanilla[a] == aorder_pla[b].nroplanilla) {
                if (moneda != aorder_pla[b].codmoneda) {
                    var sdiv_moneda = '<div id="pla_mon_' + aplanilla[a] + '_' + aorder_pla[b].codmoneda + '">';
                    if (aorder_pla[b].codmoneda == "GS") {
                        cambio = (aorder_pla[b].fact_cambio).toString().split('.');
                        sdiv_moneda += '<h5>&nbsp;&nbsp;&nbsp;&nbsp;GUARANIES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Factor Cambio: ' + cambio[0] + '</h5>';
                    } else {
                        cambio = (aorder_pla[b].fact_cambio).toString().split('.');
                        sdiv_moneda += '<h5>&nbsp;&nbsp;&nbsp;&nbsp;DOLARES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Factor Cambio: ' + convertir_rever(cambio[0]) + '</h5>';
                    }
                    sdiv_moneda += '</div>';
                    $('#pla_' + aplanilla[a]).append(sdiv_moneda);
                    aplanilla_moneda.push({
                        'pla': aplanilla[a],
                        'mon': aorder_pla[b].codmoneda
                    });
                    moneda = aorder_pla[b].codmoneda;
                }
            }
        }
    }
    var aorder_agr = sortJSON(d.data, 'agrupacion');
    for (var a = 0; a < aplanilla_moneda.length; a++) {
        var agrupacion = null;
        for (var b = 0; b < aorder_agr.length; b++) {
            if (aplanilla_moneda[a].pla == aorder_agr[b].nroplanilla && aplanilla_moneda[a].mon == aorder_agr[b].codmoneda) {
                if (agrupacion != aorder_agr[b].agrupacion) {
                    var sdiv_operacion = '<div id="pla_mon__agr' + aplanilla_moneda[a].pla + '_' + aplanilla_moneda[a].mon + '_' + (aorder_agr[b].agrupacion).toString().split(' ').join('').split('.').join('') + '">' +
                        '<b>' + aorder_agr[b].agrupacion + '</b>' +
                        '<table id="tpla_mon__agr' + aplanilla_moneda[a].pla + '_' + aplanilla_moneda[a].mon + '_' + (aorder_agr[b].agrupacion).toString().split(' ').join('').split('.').join('') + '" class="table table-striped table-bordered nowrap tpla_mon_' + aplanilla_moneda[a].pla + '_' + aplanilla_moneda[a].mon + ' tpla_' + aplanilla_moneda[a].pla + '" cellspacing="0" width="100%">' +
                        '<thead><tr>' +
                        '<th style="width:60%">Tipo</th>' +
                        '<th style="width:10%">Ajustes / Aplicaciones</th>' +
                        '<th style="width:10%">Ingresos</th>' +
                        '<th style="width:10%">Egresos</th>' +
                        '<th style="width:10%">Total</th>' +
                        '</tr></thead>' +
                        '<tbody>' +
                        '</tbody>' +
                        '<tfoot>' +
                        '</tfoot>' +
                        '</table></div>';
                    $('#pla_mon_' + aplanilla_moneda[a].pla + '_' + aplanilla_moneda[a].mon).append(sdiv_operacion);
                    aplanilla_moneda_agrupacion.push({
                        'pla': aplanilla_moneda[a].pla,
                        'mon': aplanilla_moneda[a].mon,
                        'agr': aorder_agr[b].agrupacion,
                    });
                    agrupacion = aorder_agr[b].agrupacion;
                    atable_id.push('tpla_mon__agr' + aplanilla_moneda[a].pla + '_' + aplanilla_moneda[a].mon + '_' + (aorder_agr[b].agrupacion).toString().split(' ').join('').split('.').join(''));
                }
            }
        }
    }
    var aorder_ope = sortJSON(d.data, 'operador');
    for (var a = 0; a < aplanilla_moneda_agrupacion.length; a++) {
        var operador = "";
        for (var b = 0; b < aorder_ope.length; b++) {
            if (aplanilla_moneda_agrupacion[a].pla == aorder_ope[b].nroplanilla &&
                aplanilla_moneda_agrupacion[a].mon == aorder_ope[b].codmoneda &&
                aplanilla_moneda_agrupacion[a].agr == aorder_ope[b].agrupacion) {
                if (operador != aorder_ope[b].operador) {
                    aplanilla_moneda_agrupacion_operador.push({
                        'pla': aplanilla_moneda_agrupacion[a].pla,
                        'mon': aplanilla_moneda_agrupacion[a].mon,
                        'agr': aplanilla_moneda_agrupacion[a].agr,
                        'ope': aorder_ope[b].operador,
                    });
                    operador = aorder_ope[b].operador
                }
            }
        }
    }

    var aorder_tpp = sortJSON(d.data, 'cod_tp_pago');
    for (var a = 0; a < aplanilla_moneda_agrupacion_operador.length; a++) {
        var tp_pago = "";
        for (var b = 0; b < aorder_tpp.length; b++) {
            if (aplanilla_moneda_agrupacion_operador[a].pla == aorder_tpp[b].nroplanilla &&
                aplanilla_moneda_agrupacion_operador[a].mon == aorder_tpp[b].codmoneda &&
                aplanilla_moneda_agrupacion_operador[a].agr == aorder_tpp[b].agrupacion &&
                aplanilla_moneda_agrupacion_operador[a].ope == aorder_tpp[b].operador) {
                if (tp_pago != aorder_tpp[b].cod_tp_pago) {
                    aplanilla_moneda_agrupacion_operador_tpp.push({
                        'pla': aplanilla_moneda_agrupacion_operador[a].pla,
                        'mon': aplanilla_moneda_agrupacion_operador[a].mon,
                        'agr': aplanilla_moneda_agrupacion_operador[a].agr,
                        'ope': aplanilla_moneda_agrupacion_operador[a].ope,
                        'tpp': aorder_tpp[b].cod_tp_pago,
                    });
                    tp_pago = aorder_tpp[b].cod_tp_pago
                }
            }
        }
    }
    for (var a = 0; a < aplanilla_moneda_agrupacion_operador_tpp.length; a++) {
        var tp_pago = "";
        var t_aa = 0;
        var t_i = 0;
        var t_e = 0;
        var tt = 0;
        var tt_aa = 0;
        var tt_i = 0;
        var tt_e = 0;
        var ttt = 0;
        var ttp = 0;
        var tttt = 0;
        for (var b = 0; b < aorder_tpp.length; b++) {
            if (aplanilla_moneda_agrupacion_operador_tpp[a].pla == aorder_tpp[b].nroplanilla &&
                aplanilla_moneda_agrupacion_operador_tpp[a].mon == aorder_tpp[b].codmoneda) {
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "P" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        tt_aa += parseInt(aorder_tpp[b].importe);
                    } else {
                        tt_aa += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "P") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        ttp += parseInt(aorder_tpp[b].importe);
                    } else {
                        ttp += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        tt_i += parseInt(aorder_tpp[b].importe);
                    } else {
                        tt_i += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        tt_e += parseInt(aorder_tpp[b].importe);
                    } else {
                        tt_e += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].ttp = 'AP') {
                        ttt += 0;
                    } else {
                        if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                            ttt += parseInt(aorder_tpp[b].importe);
                        } else if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N") {
                            ttt += 0;
                        }
                    }
                } else {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].ttp = 'AP') {
                        ttt += 0;
                    } else {
                        if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                            ttt += parseFloat(aorder_tpp[b].importe);
                        } else if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N") {
                            ttt += 0;
                        }
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I" ||
                        aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D" ||
                        aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                        aplanilla_moneda_agrupacion_operador_tpp[a].ope == "P" ||
                        aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                        tttt += parseInt(aorder_tpp[b].importe);
                    } else if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N") {
                        tttt += 0;
                    }
                } else {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].ttp = 'AP') {
                        tttt += 0;
                    } else {
                        if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                            aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                            tttt += parseFloat(aorder_tpp[b].importe);
                        } else if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N") {
                            tttt += 0;
                        }
                    }
                }
            }
            if (aplanilla_moneda_agrupacion_operador_tpp[a].pla == aorder_tpp[b].nroplanilla &&
                aplanilla_moneda_agrupacion_operador_tpp[a].mon == aorder_tpp[b].codmoneda &&
                aplanilla_moneda_agrupacion_operador_tpp[a].agr == aorder_tpp[b].agrupacion &&
                aplanilla_moneda_agrupacion_operador_tpp[a].ope == aorder_tpp[b].operador) {
                if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                    tt += parseInt(aorder_tpp[b].importe);
                } else {
                    tt += parseFloat(aorder_tpp[b].importe);
                }
            }
            if (aplanilla_moneda_agrupacion_operador_tpp[a].pla == aorder_tpp[b].nroplanilla &&
                aplanilla_moneda_agrupacion_operador_tpp[a].mon == aorder_tpp[b].codmoneda &&
                aplanilla_moneda_agrupacion_operador_tpp[a].agr == aorder_tpp[b].agrupacion &&
                aplanilla_moneda_agrupacion_operador_tpp[a].ope == aorder_tpp[b].operador &&
                aplanilla_moneda_agrupacion_operador_tpp[a].tpp == aorder_tpp[b].cod_tp_pago) {
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "N" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "A" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "P" ||
                    aplanilla_moneda_agrupacion_operador_tpp[a].ope == "J") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        t_aa += parseInt(aorder_tpp[b].importe);
                    } else {
                        t_aa += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "I") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        t_i += parseInt(aorder_tpp[b].importe);
                    } else {
                        t_i += parseFloat(aorder_tpp[b].importe);
                    }
                }
                if (aplanilla_moneda_agrupacion_operador_tpp[a].ope == "D") {
                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        t_e += parseInt(aorder_tpp[b].importe);
                    } else {
                        t_e += parseFloat(aorder_tpp[b].importe);
                    }
                }
            }
        }
        for (var b = 0; b < aorder_tpp.length; b++) {
            if (aplanilla_moneda_agrupacion_operador_tpp[a].pla == aorder_tpp[b].nroplanilla &&
                aplanilla_moneda_agrupacion_operador_tpp[a].mon == aorder_tpp[b].codmoneda &&
                aplanilla_moneda_agrupacion_operador_tpp[a].agr == aorder_tpp[b].agrupacion &&
                aplanilla_moneda_agrupacion_operador_tpp[a].ope == aorder_tpp[b].operador &&
                aplanilla_moneda_agrupacion_operador_tpp[a].tpp == aorder_tpp[b].cod_tp_pago) {
                if (tp_pago != aorder_tpp[b].cod_tp_pago) {
                    var sbody = '<tr>' +
                        '<td>' + aorder_tpp[b].Descrip + '</td>';
                    if (aorder_tpp[a].codmoneda == "GS") {
                        sbody += '<td style="text-align: right;">' + convertir_rever(t_aa) + '</td>';
                    } else {
                        sbody += '<td style="text-align: right;">' + addCommas(parseFloat(t_aa).toFixed(2)) + '</td>';
                    }
                    if (aorder_tpp[a].codmoneda == "GS") {
                        sbody += '<td style="text-align: right;">' + convertir_rever(t_i) + '</td>';
                    } else {
                        sbody += '<td style="text-align: right;">' + addCommas(parseFloat(t_i).toFixed(2)) + '</td>';
                    }
                    if (aorder_tpp[a].codmoneda == "GS") {
                        sbody += '<td style="text-align: right;">' + convertir_rever(t_e) + '</td>';
                    } else {
                        sbody += '<td style="text-align: right;">' + addCommas(parseFloat(t_e).toFixed(2)) + '</td>';
                    }
                    sbody += '<td></td>' +
                        '</tr>';

                    var stt = "";
                    var stt_aa = "";
                    var stt_i = "";
                    var stt_e = "";
                    var sttt = "";
                    var sttp = "";
                    var stttt = "";

                    if (aplanilla_moneda_agrupacion_operador_tpp[a].mon == "GS") {
                        stt = convertir_rever(tt);
                        stt_aa = convertir_rever(tt_aa);
                        stt_i = convertir_rever(tt_i);
                        stt_e = convertir_rever(tt_e);
                        sttt = convertir_rever(ttt);
                        sttp = convertir_rever(ttp);
                        stttt = convertir_rever(tttt);
                    } else {
                        stt = addCommas(parseFloat(tt).toFixed(2));
                        stt_aa = addCommas(parseFloat(tt_aa).toFixed(2));
                        stt_i = addCommas(parseFloat(tt_i).toFixed(2));
                        stt_e = addCommas(parseFloat(tt_e).toFixed(2));
                        sttt = addCommas(parseFloat(ttt).toFixed(2));
                        sttp = addCommas(parseFloat(ttp).toFixed(2));
                        stttt = addCommas(parseFloat(tttt).toFixed(2));
                    }

                    var sfoot = '<tr><th></th><th></th><th></th><th></th><th></th></tr></th></tr><tr><th colspan="4" >TOTAL</th><th style="text-align: right;">' + stt + '</th></tr>';
                    $('#tpla_mon__agr' + aplanilla_moneda_agrupacion_operador_tpp[a].pla + '_' + aplanilla_moneda_agrupacion_operador_tpp[a].mon + '_' + (aplanilla_moneda_agrupacion_operador_tpp[a].agr).toString().split(' ').join('').split('.').join('') + ' tfoot').empty();
                    $('#tpla_mon__agr' + aplanilla_moneda_agrupacion_operador_tpp[a].pla + '_' + aplanilla_moneda_agrupacion_operador_tpp[a].mon + '_' + (aplanilla_moneda_agrupacion_operador_tpp[a].agr).toString().split(' ').join('').split('.').join('') + ' tfoot').html(sfoot);
                    $('#tpla_mon__agr' + aplanilla_moneda_agrupacion_operador_tpp[a].pla + '_' + aplanilla_moneda_agrupacion_operador_tpp[a].mon + '_' + (aplanilla_moneda_agrupacion_operador_tpp[a].agr).toString().split(' ').join('').split('.').join('') + ' tbody').append(sbody);
                    tp_pago = aorder_tpp[b].cod_tp_pago;

                    var ssfoot = '<tr><th>TOTALES</th>' +
                        '<th style="text-align: right;">' + stt_aa + '</th>' +
                        '<th style="text-align: right;">' + stt_i + '</th>' +
                        '<th style="text-align: right;">' + stt_e + '</th>' +
                        '<th style="text-align: right;">' + sttt + '</th>' +
                        '</tr>';
                    var sssfot = '<tr>' +
                        '<th>MAS APLICACIONES</th>' +
                        '<th style="text-align: right;">' + sttp + '</th>' +
                        '<th colspan="2"></th>' +
                        '<th style="text-align: right;">' + stttt + '</th>' +
                        '</tr>';
                    $('.tpla_mon_' + aplanilla_moneda_agrupacion_operador_tpp[a].pla + '_' + aplanilla_moneda_agrupacion_operador_tpp[a].mon + ' tfoot').last().append(ssfoot);
                    $('.tpla_' + aplanilla_moneda_agrupacion_operador_tpp[a].pla + ' tfoot').last().append(sssfot);
                }
            }
        }
    }
    for (var c = 0; c < atable_id.length; c++) {
        $('#' + atable_id[c]).DataTable().destroy();
        $('#' + atable_id[c]).DataTable({
            searching: false,
            language: u.spanish_dt,
            paging: false,
            ordering: false,
            info: false,
            scrollCollapse: true,
            scrollY: 300,
            scrollX: '100%'
        });
    }
} else {
    $('#bodytab').html('<h1>No hay datos disponibles</h1>');
}