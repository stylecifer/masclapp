function option_selector(obj) {
    var div = '<option value="0">--</option>'

    $.each(obj, function() {
        div += '<option value="' + this.id + '">' + this.nombre + ' (' + this.total_preguntas + ')</option>'
    })
    return div
}

function selector_preguntas_nivel() {
    var proceso = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :52
        }
    })

    var obj = JSON.parse(proceso.responseText)
    var html = option_selector(obj)
    $("#nivel_pregunta").html(html)
    $("#nivel_pregunta_banco").html(html)

}

function selector_preguntas_asignaturas(nivel) {
    var proceso = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :53, nivel:
                nivel
        }
    })
    //console.log(proceso.responseText)
    var obj = JSON.parse(proceso.responseText, proceso.data)
    var html = option_selector(obj)
    $("#asignatura_pregunta").html(html)
    $("#asignatura_pregunta_banco").html(html)
    $("#asignatura").html(html)

}



//cambiar el estilo por titulo h3 + contenido en tablas
function selector_preguntas_curriculum() {
    var proceso = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :54, nivel:
                $("#nivel_pregunta").val(),
                asignatura: $("#asignatura_pregunta").val(),
                unidad: $("#unidad_pregunta").val()
        }
    })

    var obj = proceso.responseText
    obj = JSON.parse(obj)
    console.log(obj)

    var div = ''
    $.each(obj, function() {

        var obj_curr = this.curr


        if (obj_curr.length > 0) {

            div += '<h4>' + this.tipo.nombre + '</h4>'
            //ciclo para cargar curriculum
            div += '<table class="table table-condensed table-striped table-bordered">'
            div += '<tr>'
            div += '<td width="5%"></td>'
            div += '<td width="10%">Tipo</td>'
            //div+='<td width="10%">Preguntas</td>'
            div += '<td width="85%">Descripción</td>'
            div += '</tr>'
            $.each(obj_curr, function() {
                div += '<tr>'
                div += '<td><input type="checkbox" name="listar_curriculum[]" class="listar_curriculum" value="' + this.id + '" /></td>'
                div += '<td>' + abrv_curr(parseInt(this.idtipo)) + ' ' + this.orden + '</td>'
                //div+='<td>'+this.total_preguntas+'</td>'
                div += '<td>' + this.nombre + '</td>'
                div += '</tr>'
            })
            div += '</table>'
        }
    })

    $("#listar_curriculum").html(div)
}

function filtrar_tipo_pregunta(tipo) {
    var formularios = $(".tipo")

    $.each(formularios, function(e) {

        var form_tipo = $(this).data('tipo')

        if (parseInt(form_tipo) === parseInt(tipo)) {
            //carga el curriculum
            if (parseInt(tipo) === 5) {
                selector_preguntas_curriculum()
            }

            $(this).slideDown('fast')
            if (tipo === 5) {

            } else {

                switch (parseInt(tipo)) {
                    case 6:
                    case 8:
                    case 9:
                        //CAMBIAR ESTO PARA AGREGAR IFRAME POR JS
                        //$("#frame").append('<iframe src="' + server + 'evaluacion/post/" width="100%" frameborder="0" id="recibe_archivos"></iframe>')
                        $('#guardar_salir').attr({
                            onclick: 'guardar_pregunta(' + tipo + ');'
                        });
                        break;
                    default:
                        $('#guardar_salir').attr({
                            onclick: 'guardar_pregunta(' + tipo + ');'
                        });

                        break;
                }

            }
        } else {
            $(this).hide()

        }

    })

}

function ver_paso(id) {

    var pasos = $(".paso")

    $.each(pasos, function() {
        var paso = $(this).data('paso')

        if (parseInt(paso) === parseInt(id)) {
            //paso 3 carga el curriculum

            if (parseInt(id) === 3) {
                selector_preguntas_curriculum()
            } else {
                $(this).slideDown('fast')
            }


        } else {
            $(this).hide()
        }
    })
}

function buscador_de_preguntas(tipo) {
    var verificar = parseInt(tipo)
    var patron = $("#patron_pregunta").val()
    var nivel = $("#nivel_pregunta_banco").val()
    var asignatura = $("#asignatura_pregunta_banco").val()
    var unidad = $("#unidad_pregunta_banco").val()
    var curriculum = $("input[name='curr']:checked").val()

    switch (verificar) {
        case 0: //buscar preguntas por patron
            var verificar_patron = parseInt(patron)

            if (verificar_patron > 0) {
                var datos = {
                    patron: patron,
                    entero: 1
                }
            } else {
                var datos = {
                    patron: patron,
                    entero: 0
                }
            }

            break;
        case 1: //buscar por nivel
            var datos = {
                nivel: nivel
            }
            break;
        case 2: //buscar por asignatura
            var datos = {
                asignatura: asignatura
            }
            break;
        case 3: //buscar por unidad
            var datos = {
                unidad: unidad,
                asignatura: asignatura,
                nivel: nivel
            }
            break;
        case 5: //mis preguntas
            var datos = {}
            break;
    }

    var buscar = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            dato: datos,
            case :56,
            tipo:
                verificar
        }
    })

    var preguntas = JSON.parse(buscar.responseText)

    var html = tmp_preguntas(preguntas)
    $("#listar_preguntas_encontradas").html(html)

    if (preguntas.length > 0) {} else {
        bootbox.alert('El texto ingresado fue: <b>' + datos.patron + '</b> y No se encontraron preguntas')
    }

}

function tmp_preguntas(obj) {
    div = '<table class="table table-hovered table-condensed">'
    div += '<thead><tr>'
    div += '<th>Código</th>'
    div += '<th>Nombre</th>'
    div += '<th>Acciones</th>'
    div += '</tr></thead><tbody>'
    var total = obj.length
    $("span#preguntas_encontradas").text(total)
    $.each(obj, function() {

        div += '<tr id="pregunta_' + this.id + '">'
        div += '<td>' + this.id + '</td>'
        div += '<td>' + this.nombre + '</td>'
        div += '<td>'
        div += '<button class="btn btn-mini" onclick="ver_pregunta(' + this.id + ')"><i class="icon-search"></i></button> '
        div += '<button class="btn btn-mini" onclick="agregar_carro(' + this.id + ')"><i class="icon-shopping-cart"></i></button> '
        div += '<button class="btn btn-mini" onclick="borrar_pregunta(' + this.id + ')"><i class="icon-remove"></i></button>'
        div += '</td>'
        div += '</tr>'
    })
    div += '</tbody></table>'

    return div

}

function alerta_creacion_pregunta(id) {
    var div = '<div class="success">'
    div += '<button type="button" class="close" data-dismiss="success">&times;</button>'
    div += "<strong>Felicitaciones!</strong> ha creado una nueva pregunta en el sistema, el codigo de esta pregunta es: <b>" + id + " (<a href='javascript:;' onclick='ver_pregunta(" + id + ")'>ver la pregunta</a>)</b>."
    div += '</div>'

    $("form[name='preguntas']").after(div)

}

function agregar_terminos_pareados() {
    $("#termino_pareados").append('<div class="row-fluid termino_pareado"><textarea class="definicion span5" name="definicion" id="definicion" cols="30" rows="5" placeholder="Columna A: definicion."></textarea><textarea class="concepto span5" name="concepto" id="concepto" cols="30" rows="5" placeholder="Columna B: concepto."></textarea><label><input type="checkbox" id="distractor" name="distractor" class="distractor" value="1" /> Distractor</label></div>')
}

function agregar_terminos_pareados_img() {
    $("#termino_pareados").append('<div class="row-fluid termino_pareado"><div class="col_img">Definicion: <br> <input type="file" multiple="multiple" name="definicion_img[]" placeholder="definicion"/></div><div class="col_img">Concepto: <br> <input type="file" multiple="multiple" name="concepto_img[]"></div><label><input type="checkbox" id="distractor" name="distractor" class="distractor" value="1" /> Distractor</label></div>')
}

function agregar_mas_alternativas() {
    $(".alternativas_mas").append('<div class="alternativa_nueva"><input type="text" id="alternativa" name="alternativa" placeholder="Alternativa..."><input type="checkbox" id="fraction" name="fraction" value="1"> Correcta</div>')
}

function agregar_mas_alternativas_img() {
    $(".alternativas_mas").append('<div class="alternativa_nueva"><input type="file" id="alternativaimg_[]" name="alternativa_img[]"> <input type="checkbox" id="fraction_img[]" name="fraction_img[]" value="1"> Correcta</div>')
}

function guardar_pregunta(tipo) {
    var tipo_evaluar = parseInt(tipo)
    //var multiple
    var alternativa = new Array
    var fraction = new Array
    //var pareados
    var definicion = new Array
    var concepto = new Array
    var distractor = new Array

    //variables generales
    var nivel = $("#nivel_pregunta").val()
    var asignatura = $("#asignatura_pregunta").val()
    var unidad = $("#unidad_pregunta").val()
    var nombre = $("#nombre_add_preg").val()
    var textopregunta = $("#texto_add_preg").val()
    var tipo = $("#tipo_pregunta").val()
    var dificultad = $("#dificultad_pregunta").val()

    var curr = new Array

    var check_curr = $(".listar_curriculum:checked")

    $.each(check_curr, function() {
        curr.push(this.value)
    })



    switch (tipo_evaluar) {
        case 1: //seleccion multiple

            var alternativas = $("input[name='alternativa']")
            var fractions = $("input[name='fraction']")

            $.each(alternativas, function() {

                if ($(this).val() != "") {
                    alternativa.push($(this).val())
                }

            })

            $.each(fractions, function() {

                if ($(this).val() != "") {

                    if (this.checked === true) {
                        fraction.push(1)
                    } else {
                        fraction.push(0)
                    }

                }

            })

            var datos = {
                nivel: nivel,
                asignatura: asignatura,
                unidad: unidad,
                nombre: nombre,
                textopregunta: textopregunta,
                tipo_pregunta: tipo_evaluar,
                alternativas: alternativa,
                fractions: fraction,
                curr: curr,
                dificultad: dificultad
            }

            break;
        case 2: //emparejamiento

            var definiciones = $("textarea[name='definicion']")
            var conceptos = $("textarea[name='concepto']")

            //cambiar valor de los distractores checked
            var list_check = $("input[name='distractor']:checked")
            $.each(list_check, function() {
                if ($(this).is(':checked')) {
                    $(this).val(1)
                } else {
                    $(this).val(0)
                }

            })

            var distractores = $(".distractor")

            $.each(distractores, function(r) {
                distractor.push($(this).val())
            })

            $.each(definiciones, function() {
                if ($(this).val() != "") {
                    definicion.push($(this).val())
                }
            })

            $.each(conceptos, function() {

                if ($(this).val() != "") {
                    concepto.push($(this).val())
                }

            })

            var datos = {
                nivel: nivel,
                asignatura: asignatura,
                unidad: unidad,
                nombre: nombre,
                textopregunta: textopregunta,
                tipo_pregunta: tipo_evaluar,
                definiciones: definicion,
                conceptos: concepto,
                distractor: distractor,
                curr: curr,
                dificultad: dificultad
            }

            break;
        case 3: //desarrollo
        case 7:

            var datos = {
                nivel: nivel,
                asignatura: asignatura,
                unidad: unidad,
                nombre: nombre,
                textopregunta: textopregunta,
                tipo_pregunta: tipo_evaluar,
                curr: curr,
                dificultad: dificultad
            }

            break;
        case 4: //verdadero o falso

            var respuesta = $("input[name='truefalse']:checked").val()
            var datos = {
                nivel: nivel,
                asignatura: asignatura,
                unidad: unidad,
                nombre: nombre,
                textopregunta: textopregunta,
                tipo_pregunta: tipo_evaluar,
                respuesta: respuesta,
                curr: curr,
                dificultad: dificultad
            }

            break;
        case 5: //curriculum
               
            break;
        case 6: //terminos pareados con imagenes
        case 8:
               
            break;
        default:
            break;
    }

    if (tipo_evaluar == 6 || tipo_evaluar === 8) {
        $("#frame").append('<iframe src="' + server + 'evaluacion/post/" width="100%" frameborder="0" name="recibe_archivos"></iframe>');
        var formulario = document.getElementById('crear_preguntas')
        formulario.submit();

    } else {

        
        var procesar = $.ajax({
            url: server + 'evaluacion/ajax',
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                pregunta: datos,
                case :55
            }
        })
        
        var respuesta = JSON.parse(procesar.responseText)
        if (respuesta > 0) {
            $("input").val('')
            $("textarea").val('').html('')
            $("input#fraction").val('1')
            ver_pregunta(respuesta)
        } else {
            bootbox.alert('<h3>No se logro guardar la pregunta.</h3>')
        }

    }
}

function ver_pregunta_mejorada(id) {

    var pregunta = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :57, id:
                id
        }
    })
    var preg = JSON.parse(pregunta.responseText)
    var pregunta_html = tmp_pregunta(preg)
    bootbox.alert(pregunta_html)
}

function ver_pregunta(id) {

    var pregunta = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :57, id:
                id
        }
    })


    var preg = JSON.parse(pregunta.responseText)
    console.log(preg)
    var pregunta_html = tmp_pregunta(preg)

    bootbox.dialog(pregunta_html, [{
        label: "Agregar al Carro",
        class: "btn-success",
        callback: function() {
            agregar_carro(preg.pregunta.id)
        }
    }, {
        label: "Editar",
        class: "btn-info",
        callback: function() {
            editar_ppregunta(preg.pregunta.id)
        }
    }, {
        label: "Eliminar",
        class: "btn-danger",
        callback: function() {
            eliminar_pregunta(preg.pregunta.id)
        }
    }, {
        label: "Cerrar",
        class: "btn-primary",
        callback: function(e) {

        }
    }])


    if (parseInt(preg.pregunta.idtipo) === 3) {
        $("#desarrollo_" + preg.pregunta.id).redactor({
            imageUpload: server + "scripts/image_upload.php",
            lang: 'es',
            minHeight: 100
        })
    }


}

function traer_preguntas(id) {
    var pregunta = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :62, id:
                id
        }
    })


    var preg = JSON.parse(pregunta.responseText)
    console.log(preg)
    //menu de preguntas    
    var contador = 1
    var div = '<ul class="listado_preguntas"><div class="ver_intruccion"><i class="icon-search"></i> Instrucciones</div>'
    $.each(preg, function() {
        div += '<li class="menu_pregunta" id="preg_' + this.pregunta.id + '" onclick="ver_pregunta_prueba(' + this.pregunta.id + ', ' + this.pregunta.id + ')">P' + contador + '</li>'

        contador++
    })
    div += '</ul>'

    //vista grafica de las preguntas
    var lista_preguntas = ''
    var contador_lista = 1
    $.each(preg, function() {

        lista_preguntas += '<div id="' + this.pregunta.id + '" class="ocultar_pregunta" style="display: none;">'
        lista_preguntas += tmp_pregunta_prueba(this)
        lista_preguntas += '</div>'
        contador_lista++
    })

    $("#visor_preguntas").html(div)
    $(".caja_pregunta").html(lista_preguntas)
}

function tmp_pregunta(obj) {

    //render desde la plantilla
    var p = obj.pregunta
    var c = obj.complemento

    var div = ''
    //generico de las preguntas
    div += '<h4>Pregunta: ' + p.nombre + ' código: ' + p.id + '</h4>'


    //opciones depende de la pregunta

    switch (parseInt(p.idtipo)) {
        case 1: //multiple
            div += 'enunciado de la pregunta: (Seleccion múltiple)<br>'
            div += '<p>' + p.textopregunta + '</p>'
            var tabla = '<table class="table table-condensed table-bordered">'

            var contador = 1;
            $.each(c, function() {

                if (parseInt(this.estado) === 1) {
                    var color = 'style="background-color:yellowgreen;"'
                } else {
                    var color = ''
                }
                tabla += '<tr ' + color + '>'
                tabla += '<td><label><input type="radio" name="alternativa" id="alternativa" data-pregunta="' + p.id + '" value="' + this.id + '"/> ' + mostar_letra_alternativa(contador) + '</label></td>'

                tabla += '<td>' + this.respuesta + '</td>'
                tabla += '</tr>'
                contador++
            })
            tabla += '</table>'

            div += tabla

            break;
        case 2: //pareados
        case 6:
            //selector de conceptos
            div += 'enunciado de la pregunta: (Terminos pareados)<br>'
            div += '<p>' + p.textopregunta + '</p>'
            console.log(c)
            var conceptos = c.conceptos
            var definiciones = c.definiciones

            //valido si es imagenes
            if (parseInt(p.tipo) === 6) {



                var definiciones_lista = '<ul class="definiciones_lista">'
                $.each(definiciones, function() {

                    definiciones_lista += '<li><div class="pareado_imagenes_definicion">Concepto<br><img src="' + server + 'storage/preguntas/' + this.definicion + '" width="200"></div><div class="pareado_imagenes_conceptos">Respuesta<br>' + tmp_conceptos(conceptos, this.id) + '</div></li>'

                })

                definiciones_lista += '</ul>'
                tabla = definiciones_lista
            } else {
                var selector = '<select id="preg_' + p.id + '">'
                selector += '<option value="0">--</option>'
                $.each(conceptos, function() {
                    selector += '<option value="' + this.id + '">' + this.concepto + '</option>'
                })
                selector += '</select>'

                //estructura de las definiciones
                var tabla = '<table class="table table-striped table-condensed table-bordered">'
                tabla += '<thead><tr>'
                tabla += '<th width="60%">FILA A</th>'
                tabla += '<th width="40%">FILA B</th>'
                tabla += '</tr></thead><tbody>'
                $.each(definiciones, function() {
                    tabla += '<tr>'
                    tabla += '<td>' + this.definicion + '</td>'
                    tabla += '<td>' + selector + '</td>'
                    tabla += '</tr>'
                })
                tabla += '</tbody></table>'

            }

            //compilado de la pregunta	
            div += tabla
            break;
        case 3: //desarrollo
            div += 'enunciado de la pregunta: (Desarrollo)<br>'
            div += '<p>' + p.textopregunta + '</p>'

            div += '<p><textarea name="desarrollo_' + p.id + '" id="desarrollo_' + p.id + '" cols="30" rows="10"></textarea></p>'

            break;
        case 7: //desarrollo

            div += 'enunciado de la pregunta: (Desarrollo)<br>'
            div += '<p>' + p.textopregunta + '</p>'

            break;
        case 4: //vof

            div += 'enunciado de la pregunta: (Verdadero o Falso)<br>'
            div += '<p>' + p.textopregunta + '</p>'
            var tabla = '<table class="table table-striped table-condensed table-bordered">'
            tabla += '<tr>'
            tabla += '<td><label><input type="radio" name="vof_' + p.id + '" id="vof_' + p.id + '" data-pregunta="' + p.id + '" value="true"/> Verdadero</label></td>'
            tabla += '</tr>'
            //falso
            tabla += '<tr>'
            tabla += '<td><label><input type="radio" name="vof_' + p.id + '" id="vof_' + p.id + '" data-pregunta="' + p.id + '" value="false"/> Falso</label></td>'
            tabla += '</tr>'

            tabla += '</table>'
            //render vof
            div += tabla

            break;
        case 8:
        case 9:

            div += '<ul class="alternativas_img_radio">'
            div += '<p>' + p.textopregunta + '</p>'
            $.each(c, function() {
                if (parseInt(this.estado) === 1) {
                    var color = 'style="background-color:yellowgreen;"'
                } else {
                    var color = ''
                }

                div += '<li '+color+'>'
                div += '<label><img src="' + server + 'storage/preguntas/' + this.respuesta + '" alt="" width="140" />'
                div += '<input type="radio" value="' + this.id + '" name="respuesta_' + this.id + '" id="respuesta_' + this.id + '" style="display:none;" /></label>'
                div += '</li><br />'
            })

            div += '</ul>'

            break;
    }

    return div
}

function tmp_pregunta_prueba(obj) {

    //render desde la plantilla
    var p = obj.pregunta
    var c = obj.complemento

    var div = ''
    //generico de las preguntas
    div += '<h4>Pregunta: ' + p.nombre + ' código: ' + p.id + '</h4>'


    //opciones depende de la pregunta

    switch (parseInt(p.idtipo)) {
        case 1: //multiple
            div += 'enunciado de la pregunta: (Seleccion múltiple)<br>'
            div += '<p>' + p.textopregunta.replace('src="/master/storage', 'src="' + server + 'storage') + '</p>'
            var tabla = '<table class="table table-condensed table-bordered">'

            var contador = 1;
            $.each(c[0], function() {

                if (parseInt(this.estado) === 1) {
                    var color = 'style="background-color:yellowgreen;"'
                } else {
                    var color = ''
                }
                tabla += '<tr ' + color + '>'
                tabla += '<td><label><input type="radio" name="alternativa" id="alternativa" data-pregunta="' + p.id + '" value="' + this.id + '"/> ' + mostar_letra_alternativa(contador) + '</label></td>'

                tabla += '<td>' + this.respuesta + '</td>'
                tabla += '</tr>'
                contador++
            })
            tabla += '</table>'

            div += tabla

            break;
        case 2: //pareados
        case 6:
            //selector de conceptos
            div += 'enunciado de la pregunta: (Terminos pareados)<br>'
            div += '<p>' + p.textopregunta + '</p>'

            var conceptos = c[0].conceptos
            var definiciones = c[0].definiciones

            //valido si es imagenes
            if (parseInt(p.tipo) === 6) {



                var definiciones_lista = '<ul class="definiciones_lista">'
                $.each(definiciones, function() {

                    definiciones_lista += '<li><div class="pareado_imagenes_definicion">Concepto<br><img src="' + server + 'storage/preguntas/' + this.definicion + '" width="200"></div><div class="pareado_imagenes_conceptos">Respuesta<br>' + tmp_conceptos(conceptos, this.id) + '</div></li>'

                })

                definiciones_lista += '</ul>'
                tabla = definiciones_lista
            } else {
                var selector = '<select id="preg_' + p.id + '">'
                selector += '<option value="0">--</option>'
                $.each(conceptos, function() {
                    selector += '<option value="' + this.id + '">' + this.concepto + '</option>'
                })
                selector += '</select>'

                //estructura de las definiciones
                var tabla = '<table class="table table-striped table-condensed table-bordered">'
                tabla += '<thead><tr>'
                tabla += '<th width="60%">FILA A</th>'
                tabla += '<th width="40%">FILA B</th>'
                tabla += '</tr></thead><tbody>'
                $.each(definiciones, function() {
                    tabla += '<tr>'
                    tabla += '<td>' + this.definicion + '</td>'
                    tabla += '<td>' + selector + '</td>'
                    tabla += '</tr>'
                })
                tabla += '</tbody></table>'

            }

            //compilado de la pregunta  
            div += tabla
            break;
        case 3: //desarrollo
            div += 'enunciado de la pregunta: (Desarrollo)<br>'
            div += '<p>' + p.textopregunta + '</p>'

            div += '<p><textarea name="desarrollo_' + p.id + '" id="desarrollo_' + p.id + '" cols="30" rows="10"></textarea></p>'
            div += '<script type="text/javascript"> $("#desarrollo_' + p.id + '").redactor({imageUpload: server+"scripts/image_upload.php",lang:"es", minHeight: 100 }); </script>'

            break;
        case 7: //desarrollo

            div += 'enunciado de la pregunta: (Desarrollo)<br>'
            div += '<p>' + p.textopregunta + '</p>'

            break;
        case 4: //vof
            var resp = $.ajax({
                url: server + 'evaluacion/ajax',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    id: p.id,
                    case :83
                }
            });

            var valResp = parseInt(resp.responseText);
            var cV = '';
            var cF = '';

            if(valResp==1)
            {
                cV = 'style="background-color:yellowgreen;"';
                cF = '';
            }
            else if(valResp==0) 
            {
                cV = '';
                cF = 'style="background-color:yellowgreen;"';
            }

            div += 'enunciado de la pregunta: (Verdadero o Falso)<br>';
            div += '<p>' + p.textopregunta + '</p>';
            var tabla = '<table class="table table-striped table-condensed table-bordered">';
            tabla += '<tr '+cV+'>';
            tabla += '<td '+cV+'><label><input type="radio" name="vof_' + p.id + '" id="vof_' + p.id + '" data-pregunta="' + p.id + '" value="true"/> Verdadero</label></td>';
            tabla += '</tr>';
            //falso
            tabla += '<tr '+cF+'>';
            tabla += '<td '+cF+'><label><input type="radio" name="vof_' + p.id + '" id="vof_' + p.id + '" data-pregunta="' + p.id + '" value="false"/> Falso</label></td>';
            tabla += '</tr>';



            tabla += '</table>'
            //render vof
            div += tabla

            break;
        case 8:
        case 9:

            div += '<ul class="alternativas_img_radio">'
            div += '<p>' + p.textopregunta + '</p>'
            $.each(c[0], function() {
                if (parseInt(this.estado) === 1) {
                    var color = 'style="background-color:yellowgreen;"'
                } else {
                    var color = ''
                }

                div += '<li '+color+'>'
                div += '<label><img src="' + server + 'storage/preguntas/' + this.respuesta + '" alt="" width="140" />'
                div += '<input type="radio" value="' + this.id + '" name="respuesta_' + this.id + '" id="respuesta_' + this.id + '" style="display:none;" /></label>'
                div += '</li><br />'
            })

            div += '</ul>'

            break;
    }

    return div
}

function tmp_conceptos(conceptos, iddefinicion) {
    var conceptos_lista = '<ul class="opciones_imagenes">'

    $.each(conceptos, function() {
        if (this.definicion == iddefinicion)
            conceptos_lista += '<li style="background-color:yellowgreen;"><label><div class="opcion_select">';
        else
            conceptos_lista += '<li><label><div class="opcion_select">';
        conceptos_lista += '<img src="' + server + 'storage/preguntas/' + this.concepto + '" width="80"><br><input type="radio" name="imagen_concepto_' + iddefinicion + '" value="' + this.id + '" />'
        conceptos_lista += '</div></label></li>'
    })

    conceptos_lista += '</ul>'
    return conceptos_lista
}

function agregar_carro(id) {
    $("#pregunta_" + id).addClass('fila_agregada')

    var db = localStorage
    var carro = db.getItem('carro')
    if (carro) {

        var carro_array = JSON.parse(carro)
        var verificar_existencia = carro_array.indexOf(id)
        if (verificar_existencia === -1) {
            carro_array.push(id)
        } else {
            bootbox.alert('Su pregunta ya esta en el carro!')
        }

        //pasamos el carro al localstorage
        var carro_string = JSON.stringify(carro_array)
        db.setItem('carro', carro_string)

        mostrar_carro()

    } else {

        var carro = new Array
        carro.push(id)

        /*var carro_string = JSON.parse(carro)*/
        var carro_string = JSON.stringify(carro)
        db.setItem('carro', carro_string)

        mostrar_carro()


    }

}

function ver_preguntas_carro() {
    var db = localStorage
    var carro = db.getItem('carro')
    var carro_array = JSON.parse(carro)

    var procesar = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            preguntas: carro_array,
            case :58
        }
    })

    var preguntas = JSON.parse(procesar.responseText)
    var html_preguntas = tmp_preguntas_carro(preguntas)


    $(".mostrar_carro_preguntas").html(html_preguntas)
    $(".banco_preguntas").hide()
    $(".mostrar_carro_preguntas").slideDown('fast');
}

function volver_al_banco() {
    $(".banco_preguntas").slideDown()
    $(".mostrar_carro_preguntas").hide('fast');
}

function tmp_preguntas_carro(obj) {
    var div = '<h4>Carro de preguntas:</h4><ul class="carro_preguntas">'
    $.each(obj, function() {
        div += '<li id="p' + this.id + '"><span class="badge badge-info">' + this.id + '</span> ' + this.nombre + '</li>'
    })
    div += '</ul>'

    div += '<button class="btn" onclick="volver_al_banco()"><i class="icon-arrow-left"></i> Volver</button> '
    div += '<button class="btn" onclick="crear_prueba_nueva()"><i class="icon-plus"></i> Crear prueba nueva</button> '
    //div += '<button class="btn" onclick="usar_prueba_existente()"><i class="icon-plus"></i> Usar prueba existente</button> '
    return div

}

function crear_prueba_nueva() {
    var niveles = obtener_niveles()
    var plantilla_selector = tmp_niveles(niveles)
    var tipo = obtener_tipo_prueba()
    var plantilla_selector_tipo = tmp_niveles(tipo)
    var db = localStorage
    var carro = db.getItem('carro')
    var carro_array = JSON.parse(carro)


    var msn = '<h1>Creando una nueva prueba</h1>'
    msn += '<table class="table table-condensed table-hover"> '
    msn += '<tr>'
    msn += '<td>Tipo prueba:<br><select name="" id="tipo_prueba" >' + plantilla_selector_tipo + '</select></td>'
    var accion = "selector_preguntas_asignaturas(this.value)"
    msn += '<td>Nivel: <br> <select name="" id="nivel" onchange="' + accion + '">' + plantilla_selector + '</select></td>'
    msn += '</tr>'
    msn += '<tr>'
    msn += '<td>Asignatura: <br><select name="" id="asignatura"></select></td>'
    msn += '<td>Nombre de la prueba: <br><input type="text" id="nombre" placeholder="ABRV_PRUEBA_01" /> </td>'
    msn += '</tr>'
    msn += '<tr>'
    msn += '<td>% de exigencia: <br><select name="" id="exigencia">' + porcentaje_exigencia() + '</select></td>'
    msn += '<td>Intentos: <br><select name="" id="intentos">' + intentos_prueba() + '</select></td>'
    msn += '</tr>'
    /*msn+= '<tr>'
		msn+= '<td></td>'
		msn+= '<td></td>'
		msn+= '</tr>'*/
    msn += '</table>'

    bootbox.confirm(msn, function(resp) {
        if (resp) {

            var tipoprueba = $("#tipo_prueba").val()
            var nivel = $("#nivel").val()
            var asignatura = $("#asignatura").val()
            var nombre_prueba = $("#nombre").val()
            var exigencia = $("#exigencia").val()
            var intentos = $("#intentos").val()


            var crear_prueba = $.ajax({
                url: server + 'evaluacion/ajax',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    tipo: tipoprueba,
                    nivel: nivel,
                    asignatura: asignatura,
                    nombre: nombre_prueba,
                    exigencia: exigencia,
                    intentos: intentos,
                    preguntas: carro_array,
                    case :59
                }
            })

            var respuesta = JSON.parse(crear_prueba.responseText)

            if (respuesta.estado === true) {
                localStorage.removeItem('carro')

                bootbox.confirm('<h1>¡Felicitaciones!</h1>Estimado usuario has creado una nueva prueba en el sistema.', function(resp) {
                    if (resp) {
                        window.location.href = server + 'evaluacion/bancopruebas/#bancopruebas'
                    } else {
                        crear_prueba_nueva()
                    }
                })
            } else {
                bootbox.alert('No se logro crear la prueba. Por favor intente más tarde. Si el problema persiste informe a soporte técnico.')
            }

        } else {

        }
    })
}

function selectores_banco_prueba(clave, iddiv, tipo) {
    $.ajax({
        beforeSend: function() {
            $("#" + iddiv).html('<option>Cargando...</option>')
        },
        url: "http://" + window.location.host + "/master/ajax",
        type: 'post',
        data: "id=" + clave + "&tipo=" + tipo + "&div=" + iddiv + "&case=39",
        success: function(result) {
            $("#" + iddiv).html(result)
        }
    })
}

function porcentaje_exigencia() {
    var total = 10
    var div = '<option value="0">--</option>'
    for (var i = 0; i < total; i++) {
        var valor = (i + 1)
        if (valor === 6) {
            var sel = 'selected="selectd"'
        } else {
            var sel = ''
        }
        div += '<option value="' + valor + '0" ' + sel + '>' + valor + '0 %</option>'
    }

    return div
}

function intentos_prueba() {
    var total = 4
    var div = '<option value="0">--</option>'
    for (var i = 0; i < total; i++) {
        var valor = (i + 1)
        if (valor === 2) {
            var sel = 'selected="selectd"'
        } else {
            var sel = ''
        }
        div += '<option value="' + valor + '0" ' + sel + '>' + valor + ' Intentos.</option>'
    }

    return div
}

function nueva_prueba() {
    var niveles = obtener_niveles()
    var plantilla_selector = tmp_niveles(niveles)
    var tipo = obtener_tipo_prueba()
    var plantilla_selector_tipo = tmp_niveles(tipo)


    var msn = '<h1>Creando una nueva prueba</h1>'
    msn += '<table class="table table-condensed table-hover"> '
    msn += '<tr>'
    msn += '<td>Tipo prueba:<br><select name="" id="tipo_prueba" >' + plantilla_selector_tipo + '</select></td>'
    var accion = "selectores_banco_prueba(this.value, 'asignatura', 'asignatura')"
    msn += '<td>Nivel: <br> <select name="" id="nivel" onchange="' + accion + '">' + plantilla_selector + '</select></td>'
    msn += '</tr>'
    msn += '<tr>'
    msn += '<td>Asignatura: <br><select name="" id="asignatura"></select></td>'
    msn += '<td>Nombre de la prueba: <br><input type="text" id="nombre" placeholder="ABRV_PRUEBA_01" /> </td>'
    msn += '</tr>'
    msn += '<tr>'
    msn += '<td>% de exigencia: <br><select name="" id="exigencia">' + porcentaje_exigencia() + '</select></td>'
    msn += '<td>Intentos: <br><select name="" id="intentos">' + intentos_prueba() + '</select></td>'
    msn += '</tr>'
    /*msn+= '<tr>'
        msn+= '<td></td>'
        msn+= '<td></td>'
        msn+= '</tr>'*/
    msn += '</table>'

    bootbox.confirm(msn, function(resp) {
        if (resp) {

            var tipoprueba = $("#tipo_prueba").val()
            var nivel = $("#nivel").val()
            var asignatura = $("#asignatura").val()
            var nombre_prueba = $("#nombre").val()
            var exigencia = $("#exigencia").val()
            var intentos = $("#intentos").val()

            var crear_prueba = $.ajax({
                url: server + 'evaluacion/ajax',
                type: 'post',
                dataType: 'json',
                async: false,
                data: {
                    tipo: tipoprueba,
                    nivel: nivel,
                    asignatura: asignatura,
                    nombre: nombre_prueba,
                    exigencia: exigencia,
                    intentos: intentos,
                    case :43
                }
            })
            console.log(crear_prueba.responseText)
            var respuesta = JSON.parse(crear_prueba.responseText)

            if (respuesta.estado === true) {

                bootbox.confirm('<h1>¡Felicitaciones!</h1>Estimado usuario has creado una nueva prueba en el sistema. ¿Quieres agregar preguntas a esta prueba?', function(resp) {
                    if (resp) {
                        window.location.href = server + 'simce/agregarpreguntas/' + respuesta.id
                    } else {
                        nueva_prueba()
                    }
                })
            } else {
                bootbox.alert('No se logro crear la prueba. Por favor intente más tarde. Si el problema persiste informe a soporte técnico.')
            }

        } else {

        }
    })
}



function tmp_niveles(datos) {
    var total = datos.length
    var div = '<option value="0">--</option>'
    for (var i = 0; i < total; i++) {
        div += '<option value="' + datos[i].id + '">' + datos[i].nivel + '</option>'
    }

    return div
}


function obtener_tipo_prueba() {
    var niveles = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            case :47
        }
    })

    //console.log(niveles.responseText)
    var resp = JSON.parse(niveles.responseText)
    return resp
}

function obtener_niveles() {
    var niveles = $.ajax({
        url: server + 'simce/ajax',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            case :46
        }
    })

    //console.log(niveles.responseText)
    var resp = JSON.parse(niveles.responseText)
    return resp
}

function mostrar_carro() {
    var db = localStorage
    var carro = db.getItem('carro')
    var carro_array = JSON.parse(carro)
    var total = carro_array.length

    $(".detalle_preguntas").text(total)
    $(".carro_preguntas").slideDown('fast')
}

function vaciar_carro() {
    var db = localStorage
    db.removeItem('carro')
    $(".carro_preguntas").slideUp('fast')
    $('.fila_agregada').removeClass('fila_agregada')
}

//editar pregunta

// borrar pregunta

function borrar_pregunta(id) {

    bootbox.confirm('<h1>Advertencia!</h1><p>Esta a punto de borrar la pregunta código: ' + id + ' del sistema si esta de acuerdo presione aceptar.</p>', function(resp) {

        if (resp) {
            var borrar = $.ajax({
                url: server + 'evaluacion/ajax',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: id,
                    case :60
                },
            })

            if (borrar.responseText) {
                $("#pregunta_" + id).hide()
            } else {

            }
        }


    })

}

function editar_ppregunta(id) {
    var datos = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :61, id:
                id
        }
    })

    var pregunta = datos.responseJSON
    modificar_pregunta(pregunta[0])
}

function modificar_pregunta(pregunta) {
    //dirigir a la vista de crear pregunta
    var menu_top = $("#menu_preguntas li")
    $("#menu_preguntas li").removeClass('active')
    $.each(menu_top, function() {

        if ($(this).data('contenido') === '#tab3') {
            $(this).addClass('active')
            $("div#tab2").removeClass('active')
            $("div#tab3").addClass('active')
        }
    })
    //cargar en el formulario los datos de la pregunta

    //nivel de la pregunta

    var option_nivel = $("#nivel_pregunta option")

    $.each(option_nivel, function() {
        if ($(this).val() === pregunta.pregunta.idnivel) {
            $(this).attr("selected", true);
        }

    })
    //cargar las asignaturas del nivel
    selector_preguntas_asignaturas(pregunta.pregunta.idnivel)

    //seleccionar la asignatura
    var option_asignatura = $("#asignatura_pregunta option")

    $.each(option_asignatura, function() {

        if ($(this).val() === pregunta.pregunta.idasignatura) {
            $(this).attr("selected", true);
        }

    })

    //seleccionar la unidad de la pregunta
    var option_unidad = $("#unidad_pregunta option")

    $.each(option_unidad, function() {

        if ($(this).val() === pregunta.pregunta.idunidad) {
            $(this).attr("selected", true);
        }

    })

    $("#nombre_add_preg").val(pregunta.pregunta.nombre)

    //coloco el texto de la pregunta
    var texto = pregunta.pregunta.textopregunta
    texto = texto.toString()
    console.log(texto)

    //usamos redactor para incrustar el texto en el editor
    $("#texto_add_preg").insertHtml(texto)

    //filtro el tipo de pregunta
    filtrar_tipo_pregunta(pregunta.pregunta.idtipo)
    //cargo el curriculum
    filtrar_tipo_pregunta(5)


    //checkeando la seleccion del curriculum
    var curriculo = $(".listar_curriculum")
    $.each(curriculo, function() {
        var valor = this
        $.each(pregunta.curr, function() {
            if ($(valor).val() === this.idcurr) {
                $(valor).atr('checked', true)
            }
        })
    })

    //cambiar el select usando el tipo de pregunta
    var tipo_pregunta = $("select#tipo_pregunta option")
    $.each(tipo_pregunta, function() {
        console.log($(this).val(), pregunta.pregunta.idtipo, pregunta)
        if ($(this).val() === pregunta.pregunta.tipo) {
            $(this).attr('selected', true)
            filtrar_tipo_pregunta(pregunta.pregunta.tipo)
        }
    })

    //cambiar funcion del boton guardar
    $('button#guardar_salir').text('Actualizar esta pregunta')

    //modifico el botton
    var accion = 'actualizar_pregunta(' + pregunta.pregunta.id + ')'
    $('button#guardar_salir').attr('onclick', accion)


    // carga de los formularios a partir del tipo de pregunta

}

//cargar pruebas

// movemos los tipos de pruebas del sistema para cargar los niveles
function ocultar_tipos(datos) {

    traer_niveles(datos)
    nav_bancopruebas('ocultar_tipos', datos, datos.tipo, datos.tipo.tipo, 'r_ocultar_tipos()')
    $(".bpruebas").addClass("animated bounceOutDown");
    $(".bpruebas").fadeOut('fast');
    $(".pruebas_niveles").addClass("animated bounceInUp");
}

function r_ocultar_tipos() {
    var datos = JSON.parse(localStorage.getItem('ocultar_tipos'))

    traer_niveles(datos.datos)

    nav_bancopruebas('ocultar_tipos', datos.datos, datos.datos.tipo, datos.datos.tipo.tipo, 'r_ocultar_tipos()')

    $(".bpruebas").addClass("animated bounceOutDown");
    $(".bpruebas").fadeOut('fast');
    $(".pruebas_niveles").addClass("animated bounceInUp");
}

function ocultar_nivel(datos) {
    //Remover los niveles y presentar las asignaturas
    $(".pruebas_niveles").addClass("animated bounceOutDown");
    //cargo el nav para modificar el acceso
    nav_bancopruebas('ocultar_nivel', datos, datos.tipo, datos.datos.nombre, 'r_ocultar_nivel()')
    $(".pruebas_niveles").fadeOut('slow', function() {})


    //cargamos las asignaturas
    var vector = {
        nivel: datos.datos,
        tipo: datos.tipo,
        case :34
    }
    var asignaturas = traer_asignaturas(vector)

    console.log(asignaturas)
    //renderizar asignaturas
    var render_res = tmp_bancopruebas(asignaturas, datos.tipo, 'asignaturas_niveles', 'demo', 'ocultar_asignaturas');
    //imprimir html
    $("#contenido_ptipos").html(render_res);
    //mostar las asignaturas
    $(".asignaturas_niveles").addClass("animated bounceInUp");

}

function r_ocultar_nivel() {
    var datos = JSON.parse(localStorage.getItem('ocultar_nivel'))
    var datos = datos.datos

    //Remover los niveles y presentar las asignaturas
    $(".pruebas_niveles").addClass("animated bounceOutDown");
    //cargo el nav para modificar el acceso
    nav_bancopruebas('ocultar_nivel', datos, datos.tipo, datos.datos.nombre, 'r_ocultar_nivel()')
    $(".pruebas_niveles").fadeOut('slow', function() {})


    //cargamos las asignaturas
    var vector = {
        nivel: datos.datos,
        tipo: datos.tipo,
        case :34
    }
    var asignaturas = traer_asignaturas(vector)

    console.log(asignaturas)
    //renderizar asignaturas
    var render_res = tmp_bancopruebas(asignaturas, datos.tipo, 'asignaturas_niveles', 'demo', 'ocultar_asignaturas');
    //imprimir html
    $("#contenido_ptipos").html(render_res);
    //mostar las asignaturas
    $(".asignaturas_niveles").addClass("animated bounceInUp");

}

//efecto visual para desaparecer las asignaturas
function ocultar_asignaturas(datos) {

	localStorage.setItem("id"		, datos.datos.id);
	localStorage.setItem("nombre"	, datos.datos.nombre);
	localStorage.setItem("tipo"		, datos.tipo);
	localStorage.setItem("estado"	, "true");
	
    $(".asignaturas_niveles").addClass("animated bounceOutDown");
    nav_bancopruebas('ocultar_asignaturas', datos, datos.tipo, datos.datos.nombre, 'r_ocultar_asignaturas()')
    $(".asignaturas_niveles").fadeOut('slow', function() {

    })
    //cargamos las pruebas
    var vector = {
        asignatura: datos.datos,
        tipo: datos.tipo,
        case :35
    }
    var pruebas = traer_pruebas(vector)
    var render_res = tmp_bancopruebas(pruebas, datos.tipo, 'listado_pruebas', 'demo', 'acciones_pruebas');
    //imprimir html
    $("#contenido_ptipos").html(render_res);
    //mostar las asignaturas
    $(".listado_pruebas").addClass("animated bounceInUp");
}

//efecto visual para desaparecer las asignaturas
/*
function r_ocultar_asignaturas() {
    var z = $('#ocultar_asignaturas').html()
    
    var datos = JSON.parse(localStorage.getItem('ocultar_asignatura'))
    var datos = datos.datos

    $(".asignaturas_niveles").addClass("animated bounceOutDown");
    nav_bancopruebas('ocultar_asignaturas', datos, datos.tipo, datos.datos.nombre, 'r_ocultar_asignaturas()')

    $(".asignaturas_niveles").fadeOut('slow', function() {

    })
    //cargamos las pruebas
    var vector = {
        asignatura: datos.datos,
        tipo: datos.tipo,
        case :35
    }
    var pruebas = traer_pruebas(vector)
    var render_res = tmp_bancopruebas(pruebas, datos.tipo, 'listado_pruebas', 'demo', 'acciones_pruebas');
    //imprimir html
    $("#contenido_ptipos").html(render_res);
    //mostar las asignaturas
    $(".listado_pruebas").addClass("animated bounceInUp");

    $('#ocultar_asignaturas').html(z)

}
*/

function r_ocultar_asignaturas() {
    
    var z = $('#ocultar_asignaturas').html()

    if (localStorage.getItem('ocultar_asignaturas')) {

        var datos = JSON.parse(localStorage.getItem('ocultar_asignaturas'))

        var data = datos.datos
        console.log('func', data)
        $(".asignaturas_niveles").addClass("animated bounceOutDown");
        nav_bancopruebas('ocultar_asignaturas', data, data.tipo, data.datos.nombre)
        $(".asignaturas_niveles").fadeOut('slow', function() {

        })
        //cargamos las pruebas
        var vector = {
            asignatura: data.datos,
            tipo: data.tipo,
            case :35
        }
        var pruebas = traer_pruebas(vector)
        var render_res = tmp_bancopruebas(pruebas, data.tipo, 'listado_pruebas', 'demo', 'acciones_pruebas');
        //imprimir html
        $("#contenido_ptipos").html(render_res);
        //mostar las asignaturas
        $(".listado_pruebas").addClass("animated bounceInUp");
    } else {
        a = false
    }

    $('#ocultar_asignaturas').html(z)
}

function volver_opciones_pruebas() {
    //llega a lista de pruebas
    var asignaturas = localStorage.getItem('ocultar_asignaturas')
    // llega al listado de asignaturas
    var nivel = localStorage.getItem('ocultar_nivel');
    //llega a los niveles
    var tipo = localStorage.getItem('ocultar_tipos');

    if (asignaturas) {
        //realizar funcion para ver pruebas
        //bootbox.alert(localStorage.getItem('ocultar_asignaturas'))
        r_ocultar_asignaturas()
    } else {
        if (nivel) {
            //realizar funcion para mostrar asignaturas
            //bootbox.alert(localStorage.getItem('ocultar_niveles'))
            r_ocultar_nivel()
        } else {
            if (tipo) {
                //realizar funcion para ver niveles
                //bootbox.alert(localStorage.getItem('ocultar_tipo'))
                r_ocultar_tipos()
            } else {
                bootbox.alert('No tienes seleccionada ninguna opción')
            }
        }
    }
}

//busco las pruebas a partir de JSON asignatura
function traer_pruebas(datos) {
    var data = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'post',
        async: false,
        dataType: 'json',
        data: {
            asignatura: datos.asignatura.id,
            tipo: datos.tipo,
            case :datos.
            case
        }
    })
    var vector = JSON.parse(data.responseText)
    return vector
}

// cargamos las secciones en el nav (breadcrumb) del banco de pruebas
function nav_bancopruebas(funct, datos, tipo, nombre, operacion) {

    var vector = {
        datos: datos,
        tipo: tipo
    }
    
    var vector = JSON.stringify(vector);
    localStorage.setItem(funct, vector);


    var valor = "'" + nombre + "'"
    if (localStorage.getItem(nombre)) {} 
        else {
        var tmp = '<a href="javascript:;" onclick="' + operacion + '" >' + nombre + '</a><span class="divider">/</span>'
        $("#" + funct).html(tmp)
    }

    //Ocultar secciones del bradcrumb según se requiera
    switch(funct)
    {
        case 'ocultar_tipos':
            $('#ocultar_nivel').html('')
            $('#ocultar_asignaturas').html('')    
        break;

        case 'ocultar_nivel':
            $('#ocultar_asignaturas').html('')
        break;
    }

}

//busco las asignaturas en la BD
function traer_asignaturas(datos) {
    var data = $.ajax({
        url: server + 'evaluacion/ajax',
        type: 'post',
        async: false,
        dataType: 'json',
        data: {
            nivel: datos.nivel.id,
            tipo: datos.tipo,
            case :datos.
            case
        }
    })

    var vector = JSON.parse(data.responseText)
    return vector


}

//Cargo la plantilla de los niveles a partir de JSON
function traer_niveles(datos) {

    var niveles = datos.pruebas_nivel
    var render_res = tmp_bancopruebas(niveles, datos.tipo.id, 'pruebas_niveles', 'demo', 'ocultar_nivel');
    $("#contenido_ptipos").html(render_res);

}
//plantilla para banco de pruebas
function tmp_bancopruebas(datos, tipo, classul, classli, funct) {
    var html = '<ul class="' + classul + '">'
    var total = datos.length
    for (var i = 0; i < total; i++) {

        if (datos[i].color) {
            var color = 'style="background-color:' + datos[i].color + '; color:white;"'
        } else {
            var color = 'style="color:gray;"'
        }

        var vector = {
            datos: datos[i],
            tipo: tipo
        }
        var vector = JSON.stringify(vector);
        var accion = "onclick='" + funct + "(" + vector + ")'"
        console.log(datos, tipo, classul, classli, funct)
        html += '<li ' + accion + ' >'
        html += '<div class="titulo_tipo" ' + color + '>' + datos[i].nombre + '</div>'
        html += '<div class="total_pruebas">' + datos[i].total_pruebas + '</div>'
        if (funct === 'acciones_pruebas') {
            html += '<div class="subtitulo" style="color: gray; margin-top: 30px;">Preguntas</div>'
        } else {
            html += '<div class="subtitulo" style="color: gray; margin-top: 30px;">Pruebas</div>'
        }

        html += '</li>'
    }
    html += '</ul>'
    return html;
}

function acciones_pruebas(datos) {
    var usuario = JSON.parse(usuario_actual());
    var msn = '<div class="titulo_alerta"><h4>Prueba seleccionada: <br>' + datos.datos.nombre + '</h4></div>';
    msn += '<div style="clear: both; padding-left: 10px; margin-top: -10px; margin-bottom: -10px;">Estimado usuario usted tiene disponible las siguientes acciones para esta prueba.</div>';
    if (parseInt(usuario.idprefil) === 1) {
        //msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="1" type="radio" checked="checked"/> Asignar Prueba</label>'
        //msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="2" type="radio"/> Ver Reportes</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="3" type="radio"/> <i class="icon-pencil"></i> Editar Prueba</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="4" type="radio"/> <i class="icon-trash"></i> Eliminar Prueba</label>'
        //msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="5" type="radio"/> Agregar Preguntas</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="7" type="radio"/> <i class="icon-search"></i> Tabla de especificaciones</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="8" type="radio"/> <i class="icon-print"></i> Imprimir Prueba</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="9" type="radio"/> <i class="icon-move"></i> Ordenar Prueba</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="6" type="radio"/> <i class="icon-search"></i> Ver Prueba</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="11" type="radio"/> <i class="icon-folder-open"></i> Clasificar preguntas</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="10" type="radio"/> <i class="icon-download-alt"></i> Copiar a mis evaluaciones</label>'
    } else {
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="6" type="radio"/> <i class="icon-search"></i> Ver Prueba</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="10" type="radio"/> <i class="icon-download-alt"></i> Copiar a mis evaluaciones</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="7" type="radio"/> <i class="icon-search"></i> Ver tabla de especificaciones</label>'
        msn += '<label class="opcion_prueba"><input id="opcion_prueba" name="opcion_prueba" value="8" type="radio"/> <i class="icon-print"></i> Imprimir Prueba</label>'
    }

    bootbox.confirm(msn, function(res) {

        if (res) {
            var valor_escogido = $("input[name='opcion_prueba']:checked").val()
            var valor = parseInt(valor_escogido)
            var redireccion_url = opcion_prueba(valor, datos.datos.id)
            if (valor === 4) {
                //ACCIONES AL ELIMINAR LA PRUEBA DE LA BASE DE DATOS!
                bootbox.confirm('<h1>Advertencia</h1> Estimado usuarios esta apunto de eliminar esta prueba, si esta de acuerdo presiona "Aceptar"', function(resp) {
                    if (resp) {
                        var del = eliminar_prueba(datos.datos.id)
                        $(this).hide()
                        r_ocultar_asignaturas()
                    } else {
                        acciones_pruebas(datos)
                    }
                })
            } else if (valor === 8) {
                window.open(redireccion_url, '', '', '_new')
            } else if (valor === 10) { //copiar evaluacion
				
                localStorage.setItem('breadcrumb', $('#nav_bancopruebas').html())

				var prueba = $.ajax({
					url: server + 'evaluacion/ajax',
					type: 'POST',
					dataType: 'json',
					async: false,
					data: {case :63, id:datos.datos.id,nombre:datos.datos.nombre }
				})

				var respuesta = JSON.parse(prueba.responseText)
				if (respuesta != false) {
					bootbox.confirm('<h4>¡Felicitaciones!</h4>Se ha copiado correctamente la prueba, \xbfdesea ver la prueba copiada?', function(resp) {
						if (resp) {
							window.location.href = server + 'simce/mispruebas/'
						} else {}
					})
				}
			
            } else if (valor === 11) {
                window.open(redireccion_url, '', '', '_new')
            } else {
                window.open(redireccion_url, '', '', '_new')
            }

        }
    })
}

function eliminar_prueba(datos) {
    var accion = $.ajax({
        url: 'http://' + window.location.host + '/master/evaluacion/ajax/',
        type: 'post',
        data: "id=" + datos + "&case=22",
        async: false
    })
    console.log(accion.responseText)

    var resp = accion.responseText

    if (resp > 0) {
        return true;
    } else {
        return false;
    }
}

function opcion_prueba(opcion, prueba) {

    switch (opcion) {
        case 1:
            var url = server + 'evaluacion/asignarprueba/' + prueba
            break;
        case 2:
            var url = server + 'evaluacion/verreporte/' + prueba
            break;
        case 3:
            var url = server + 'evaluacion/editarprueba/' + prueba
            break;
        case 4:
            var url = server + 'evaluacion/eliminarprueba/' + prueba
            break;
        case 5:
            var url = server + 'evaluacion/agregarpreguntas/' + prueba
            break;
        case 6:
            var url = server + 'evaluacion/prueba/' + prueba
            break;
        case 7:
            var url = server + 'evaluacion/fichatecnica/' + prueba
            break;
        case 8:
            //var url = server+'evaluacion/imprimirprueba/'+prueba
            var url = server + 'prueba_pdf/print_pdf/' + prueba + '/pdf'
            break;
        case 9:
            var url = server + 'evaluacion/ordenarprueba/' + prueba
            break;
        case 11:
            var url = server + 'evaluacion/preguntas_curriculum/' + prueba
            break;
    }
    return url
}

//SELECTORES DE ALUMNOS
function sel_alumnos_repo(curso) {
    $.ajax({
        url: "http://" + window.location.host + "/master/pruebas/ajax",
        type: 'post',
        data: "curso=" + curso + "&case=14",
        success: function(resultado) {

            $("#alumnos_repo").html(resultado)
        }
    })

}

function ver_reporte_final() {
    var asignatura = $("#asignatura_eva_repo").val()
    var nivel = $("#nivel_eva_repo").val()
    var curso = $("#cursos_repo").val()
    var alumno = $("#alumnos_repo").val()
    var prueba = $("#pruebas_repo").val()
    var informe = $("#tipo_repo").val()

    $.ajax({
        beforeSend: function() {
            $("#reporte_final").html('<center><h3>Recolectando Información</h3><br><img src="http://' + window.location.host + '/master/img/loading_dance.gif" width="30%" /></center>')
        },
        url: "http://" + window.location.host + "/master/pruebas/ajax",
        type: 'post',
        data: "asignatura=" + asignatura +
            "&nivel=" + nivel +
            "&curso=" + curso +
            "&alumnos=" + alumno +
            "&prueba=" + prueba +
            "&informe=" + informe +
            "&case=16",
        success: function(resultado) {

            $("#reporte_final").html(resultado)
            $("#myTable").tablesorter(

            );
        }
    })

}
//SELECTORES DE PRUEBAS
function sel_pruebas_repo(curso) {
    $.ajax({
        url: "http://" + window.location.host + "/master/pruebas/ajax",
        type: 'post',
        data: "asignatura=" + curso + "&case=15",
        success: function(resultado) {

            $("#pruebas_repo").html(resultado)
        }
    })

}
