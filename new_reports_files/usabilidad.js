//cargador para todo el sistema
var height_screen = window.screen.height;
var heigth_70 = ((parseInt(height_screen) * 65) / 100)
var heigth_80 = ((parseInt(height_screen) * 80) / 100)
$("#menu_principal>li").click(function(){
    var menu = $("#menu_principal li").index(this)
})

var server_ondemand = 'http://kdoceduca.cl/master/'
var cargador = '<center><img src="http://' + window.location.host + '/master/img/loading.gif"></center>'
var server = 'http://' + window.location.host + '/master/'
 $(window).resize(function() {
            var height_screen = window.screen.height;
    //$(".columna_right").css({height:height_screen+'px'});
    });

$(function() {

    // parpadear()
    setInterval('reloj()',1000);

    $(".columna_right").css({minHeight:height_screen+'px !important'});
    $(".preguntas_caja").css({minHeight:heigth_70+'px'});
    $(".preguntas").css({minHeight:heigth_70+'px'});
    $(".cronogramas").css({minHeight:heigth_80+'px'});

    $(".scroll_curriculum").css({minHeight:heigth_70+'px'});
    $("#notas_versiones").on('click', function() {
        bootbox.alert("Última Versión 1.1")
    })
	$("#ultima_actualizacion").on('click', function() {
		
		json = capsula( {path:'log_actualizacion/ajax', case:1} );
		var datos = JSON.parse(json.fuente)
		var html = "";
		html += "<table class='table table-stripe' >";
		html += "	<tr>";
		html += "		<th width='10%'>Tipo</th>";
		html += "		<th width='70%'>Detalle</th>";
		html += "		<th width='20%'>Fecha</th>";
		html += "	</tr>";
		if(datos.length > 0)
		{
			for(i = 0 ; i < ( (datos.length > 10 ) ? 10 : datos.length) ; i++)
			{
				fecha = datos[i].fecha_log_actualizacion.substring(0, 10).split("-");
				
				html += "	<tr>";
				html += "		<td width='10%' ><img src='"+ server +"img/"+ datos[i].tipo +".png' width='100%'> </td>";
				html += "		<td width='70%' >"+ datos[i].detalleLog_actualizacion +"</td>";
				html += "		<td width='20%' >"+ fecha[2]+"/"+fecha[1]+"/"+fecha[0] +"</td>";
				html += "	</tr>";
			}
		}
		else
		{
			html += "	<tr>";
			html += "		<td colspan='4' align='center'><h3>No se encuentran registros</h3></td>";
			html += "	</tr>";
		}
		html += "</table>";
		
        bootbox.alert(html);
    })
    //cargar paginacion en preguntas

    var ruta = window.location.hash
    if (ruta === "#pruebas") {
        $('.time').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false
        });
    }
    //activa el menu contextual
    $(window.location.hash).addClass('active')
    //verifica que el usuario tenga el email ingresado en el sistema
    //actualizar_email()
    //desactiva algunas operaciones del teclado al momento de trabajar con la aplicacion
    $(document).keydown(function(tecla) {

        //tecla esc
        if (tecla.keyCode == 27) {

            if (confirm("Esta seguro que quiere salir de esta aplicación?")) {
                var urlfinal = server + "/accesos/logout";
                document.location.href = urlfinal;
            }

        }
        //tecla return back
        else if (tecla.keyCode == 8) {
            //return false;
        }



    });

    $(".seleccion").on('click', function(e) {
        $("#menu_principal li a").removeClass('active_menu')
        console.log(e)
        $(this).addClass('active_menu')
        $(".sub_menu_principal").slideUp('fast')
        var sub = e.currentTarget.id

        $("#sub_" + sub).slideDown('fast')
    })

    //desabilita click derecho
    $(document).bind("contextmenu", function(e) {

        //bootbox.alert("Esta opción esta desabilitada")
        //return false

    });
    //abre popup soporte
    $("#soporte").on('click', function() {

        var form = '<h1>Soporte Técnico</h1>'
        form += '<table class="table">'
        form += ' <tr><td>Pagina Actual:</td><td>' + window.location + '<input type="hidden" id="url" value="' + window.location + '" /></td></tr>'
        form += ' <tr><td>'
        form += '	Asunto:</td> ' + '<td><input id="asunto" type="text" /></td></tr><tr>'
        form += ' <td>Mensaje:</td>'
        form += ' <td><textarea id="mensaje_soporte" rows="8"></textarea></td></tr>'
        form += ' </table>'

        bootbox.confirm(form, function(response) {

            if (response === true) {

                var mensaje = $("#mensaje_soporte").val()

                mensaje += '<h1>URL: ' + $("#url").val() + '</h1>'
                $.ajax({
                    url: server + 'ajax/',
                    type: 'post',
                    data: "asunto=" + encodeURIComponent($("#asunto").val()) + "&mensaje=" + encodeURIComponent(mensaje) + "&case=48",
                    success: function(result) {
                        var datos = JSON.parse(result)

                        if (datos === true) {
                            bootbox.alert("Su mensaje se envio exitosamente!")
                        } else {
                            bootbox.alert("Su mensaje no se logro enviar correctamente, por favor utilice las siguientes vias de comunicación: Telefono (02) 25994993, Celular: (09) 84178721, Email: soporte@kdoce.cl")
                        }

                    }
                })
            } else {

            }
        })
    })
})

$(function(){
    var _top = $(window).scrollTop();
    var _direction;
    $(window).scroll(function(){
        var _cur_top = $(window).scrollTop();
        if(_top < _cur_top)
        {
            _direction = 'down';

        }
        else
        {
            _direction = 'up';
        }
        _top = _cur_top;
        switch(_direction){
            case 'down': break;
            case 'up': break;
        }
    });
})

function menu_slide_out(){
    $(".span2").animate(
        {marginLeft:'-500px'},
        500
    )
    $(".span10").animate(

    )

    $("#nover").hide()
    $("#ver").show()
}
function menu_slide_in(){
    $(".span2").animate(
        {marginLeft:'0'},
        500
    )
    $(".span10").animate(
    )



    $("#ver").hide()
    $("#nover").show()

}

function reloj(){
    var a = new Date;
    if(a.getHours()<10){ var h = '0'+a.getHours()}else{var h = a.getHours()}
    if(a.getMinutes()<10){ var m = '0'+a.getMinutes()}else{var m = a.getMinutes()}
    if(a.getSeconds()<10){ var s = '0'+a.getSeconds()}else{var s = a.getSeconds()}
    var hora = h+':'+m+':'+s
    var fecha = a.toLocaleDateString();
    $(".reloj").html(hora)
}


function parpadear() {
    $('#notas_versiones').fadeIn(500).delay(250).fadeOut(500, parpadear)
}

function actualizar_email() {
    $.ajax({
        url: server + 'usuarios/ajax/',
        type: 'post',
        data: "case=9",
        success: function(resp) {

            var estado = JSON.parse(resp)
            if (estado === true) {} else {
                bootbox.confirm('<h1>Actualiza tu correo!</h1><p>Por favor, para lograr mantenerte informado de las novedades y actualizaciones del sistema, debes actualizar tu email.</p> Email: <input id="email_update" type="text" placeholder="nick@dominio"/>', function(resp) {
                    if (resp === true) {
                        var email = $("#email_update").val()
                        update_correo(email)
                    }

                })
            }
        }
    })

}

function update_correo(email) {
    $.ajax({
        url: 'http://' + window.location.host + '/master/usuarios/ajax/',
        type: 'post',
        data: "mail=" + email + "&case=10",
        success: function(resp) {
            var estado = JSON.parse(resp)
            if (estado === true) {
                bootbox.alert("Se actualizo tu perfil correctamente!")
            } else {
                actualizar_email()
            }
        }
    })
}

function convertir_fecha(UNIX_timestamp) {
    var a = new Date(parseInt(UNIX_timestamp) * 1000);
    console.log(a);
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();

    if (date < 10) {
        date = '0' + date
    } else {
        date = date
    }

    var time = date + '/' + month + '/' + year
    return time;
}

function tiempo_humano(param) {

    var procesar = $.ajax({
        url: server + 'alumno_evaluacion_prueba/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            fecha: param,
            case :17
        }
    })

    var fecha = procesar.responseText
    return fecha

}

function timeConverter(UNIX_timestamp) {
    var a = new Date(parseInt(UNIX_timestamp) * 1000);
    console.log(a)
    var date = a.getUTCDate();
    console.log(date)
    var month = a.getUTCMonth();
    console.log(month)
    var year = a.getUTCFullYear();

    var fecha = date + '/' + month + '/' + year;
    var fulldate = fecha
    return fulldate;
}

function invertir_fecha(fecha) {
    //format DD/MM/YYYY return YYYY/MM/DD
    var fecha = fecha.split(" ")
    var hora = fecha[1]
    fecha = fecha[0].split("/")
    fecha = fecha.reverse();
    fecha = fecha.join("-")
    fecha = fecha + ' ' + hora
    return fecha
}

function fecha_entero(fecha) {
    var elem = fecha.split('/');
    dia = elem[0];
    mes = elem[1];
    ano = elem[2];

    if (dia < 10) {
        dia = '0' + dia
    } else {
        dia = dia
    }
    if (mes < 10) {
        mes = '0' + mes
    } else {
        mes = mes
    }

    var new_form_fecha = ano + "/" + mes + "/" + dia;
    var Epoch_mili = Date.parse(new_form_fecha);
    console.log(Epoch_mili)
    return (Epoch_mili / 1000);
    //eliminar los milisegundos

}

function fecha_full_entero(fecha) {
    var elem = fecha.split(' ');
    //separa la fecha

    dia = elem[0];
    mes = elem[1];
    ano = elem[2];
    var new_form_fecha = ano + "/" + mes + "/" + dia;
    console.log(new_form_fecha)
    var Epoch_mili = Date.parse(new_form_fecha);
    return (Epoch_mili / 1000);
    //eliminar los milisegundos
}

function img_medalla(valor) {
    var medalla = ''
    var imagen = ''
    if (valor > 0 && valor < 34) {
        medalla = 'plata.png';
        imagen = '<img src="' + server + 'img/' + medalla + '" title="Medalla de Plata">'
    } else if (valor > 33 && valor < 67) {
        medalla = 'bronce.png';
        imagen = '<img src="' + server + 'img/' + medalla + '" title="Medalla de Bronce">'
    } else if (valor > 66 && valor < 101) {
        medalla = 'oro.png';
        imagen = '<img src="' + server + 'img/' + medalla + '" title="Medalla de Oro">'
    } else {
        medalla = 'sin_medalla.png';
        imagen = '<img src="' + server + 'img/' + medalla + '" title="Sin Medalla">'
    }
    return imagen;
}

function foto_rand(maximo) {
    var numero = Math.floor((Math.random() * maximo) + 1);
    return numero
}

Array.max = function(array) {
    return Math.max.apply(Math, array);
};

// Function to get the Min value in Array
Array.min = function(array) {
    return Math.min.apply(Math, array);
};

function fecha_actual() {
    var fecha = $.ajax({
        url: server + 'simce/ajax',
        type: 'post',
        async: false,
        dataType: 'json',
        data: {
            case :36
        }
    })

    return fecha.responseText
}

function ahora() {
    var tiempo = fecha_actual()
    return tiempo
}

function check_todo(objeto) {
    var check = $("." + objeto.id)
    var total = check.length

    for (var i = 0; i < total; i++) {
        check[i].checked = true
    }


}

function uncheck_todo(objeto) {
    var check = $("." + objeto.id)
    var total = check.length

    for (var i = 0; i < total; i++) {
        check[i].checked = false
    }

}

function render_select(datos, id) {
    var sel = '<select id="' + id + '">'
    var total = datos.length
    for (var i = 0; i < total; i++) {
        sel += '<option value="' + datos[i].id + '">' + datos[i].nombre + '</option>'
    }
    sel += '</select>'

    return sel

}

function render_combobox(datos, id) {
    var sel = '<option value="0">--</option>'
    var total = datos.length
    for (var i = 0; i < total; i++) {
        sel += '<option value="' + datos[i].id + '">' + datos[i].nombre + '</option>'
    }

    $("#" + id).html(sel)

}

function bytesToSize(bytes, precision) {
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
        return bytes + ' B';
    }
}

function subir_foto() {
    var html = '<h3>Cambio de contraseña</h3>'
    html+='<div class="modal-header">'
    html+='</div>'
    html+='<div class="modal-body">'
    html+='<p class="lead" style="margin-top: 0px;"><i class="icon-pencil"></i> Contraseña</p>'
    html+='<span id="validate_msj" style="display:none"></span>'
    html+='<div class="form-inline">'
      html+='<input id="actual_pass" type="password" style="position:relative; left:5px" class="input-medium" placeholder="Contraseña actual" onblur="validate()">'
      html+='<input id="new_pass" type="password" style="position:relative; left:10px" class="input-medium" placeholder="Contraseña nueva" onblur="validate2()">'
      html+='<input id="repeat_pass" type="password" style="position:relative; left:15px" placeholder="Vuelva a escribir la contraseña" onblur="validate3()">'
      html+='<a style="position:relative; left:20px" class="btn btn-warning" onclick="change_pass()">Cambiar</a>'
    html+='</div>'
    html+='</div>'
    bootbox.confirm(html, function(resp) {

    })
}

function comprobar_navegador() {
    /* Variables para cada navegador, la funcion indexof() si no encuentra la cadena devuelve -1,
las variables se quedaran sin valor si la funcion indexof() no ha encontrado la cadena. */
    var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome/') > -1;
    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox/') > -1;
    var is_ie = navigator.userAgent.toLowerCase().indexOf('msie ') > -1;
    var navegador = 0;
    /* Detectando  si es Safari, vereis que en esta condicion preguntaremos por chrome ademas, esto es porque el
la cadena de texto userAgent de Safari es un poco especial y muy parecida a chrome debido a que los dos navegadores
usan webkit. */

    if (is_safari && !is_chrome) {

        /* Buscamos la cadena 'Version' para obtener su posicion en la cadena de texto, para ello
utilizaremos la funcion, tolowercase() e indexof() que explicamos anteriormente */
        var posicion = navigator.userAgent.toLowerCase().indexOf('Version/');

        /* Una vez que tenemos la posición de la cadena de texto que indica la version capturamos la
subcadena con substring(), como son 4 caracteres los obtendremos de 9 al 12 que es donde
acaba la palabra 'version'. Tambien podraimos obtener la version con navigator.appVersion, pero
la gran mayoria de las veces no es la version correcta. */
        var ver_safari = navigator.userAgent.toLowerCase().substring(posicion + 9, posicion + 12);

        // Convertimos la cadena de texto a float y mostramos la version y el navegador
        ver_safari = parseFloat(ver_safari);

        navegador = 'safari'
    }

    //Detectando si es Chrome
    if (is_chrome) {
        var posicion = navigator.userAgent.toLowerCase().indexOf('chrome/');
        var ver_chrome = navigator.userAgent.toLowerCase().substring(posicion + 7, posicion + 11);
        //Comprobar version
        ver_chrome = parseFloat(ver_chrome);
        navegador = 'chrome'
    }

    //Detectando si es Firefox
    if (is_firefox) {
        var posicion = navigator.userAgent.toLowerCase().lastIndexOf('firefox/');
        var ver_firefox = navigator.userAgent.toLowerCase().substring(posicion + 8, posicion + 12);
        //Comprobar version
        ver_firefox = parseFloat(ver_firefox);
        navegador = 'firefox'
    }

    //Detectando Cualquier version de IE
    if (is_ie) {
        var posicion = navigator.userAgent.toLowerCase().lastIndexOf('msie ');
        var ver_ie = navigator.userAgent.toLowerCase().substring(posicion + 5, posicion + 8);
        //Comprobar version
        ver_ie = parseFloat(ver_ie);
        navegador = 'ie'
    }

    return navegador
}

function mostar_letra_alternativa(valor) {
    var verificar = parseInt(valor)
    switch (verificar) {
        case 1:
            var alternativa = 'a)'
            break;
        case 2:
            var alternativa = 'b)'
            break;
        case 3:
            var alternativa = 'c)'
            break;
        case 4:
            var alternativa = 'd)'
            break;
        case 5:
            var alternativa = 'e)'
            break;
        case 6:
            var alternativa = 'f)'
            break;
    }

    return alternativa
}

function abrv_curr(tipo) {
    switch (parseInt(tipo)) {
        case 1:
            var abrv = 'OA'
            break;
        case 2:
            var abrv = 'HA'
            break;
        case 3:
            var abrv = 'AE'
            break;
        case 4:
            var abrv = 'CMO'
            break;
        case 5:
            var abrv = 'IAC'
            break;
    }
    return abrv
}

function usuario_actual() {
    var user = $.ajax({
        url: server + 'usuarios/ajax',
        type: 'POST',
        dataType: 'json',
        async: false,
        data: {
            case :11
        }
    })
    return user.responseText
}

function capsula(obj) {

    var procesar = $.ajax({
        url: server + obj.path,
        type: 'post',
        dataType: 'json',
        async: false,
        data: obj
    })

    if(parseInt(procesar.readyState)===4){

        var resultado = {

           fuente: procesar.responseText,
           json: JSON.parse(procesar.responseText),
           obj:procesar
        }
        return resultado
    }else{
        var resultado = {

           obj:'error'
        }

    }


}


function capsula_version(obj) {

    var procesar = $.ajax({
        url: obj.path,
        type: 'post',
        dataType: 'json',
        async: false,
        data: obj,
    })

   return procesar.responseText

}

function validar_imagenes()
{
    $.ajaxSetup({async:false})

    var cantidad_error = new Array
    var cantidad_buenas = new Array
    var estados = new Array
    var imagenes = $('img')


    $.each(imagenes, function(){

       var datos = {path:this.src, case:1}
       var estado = $.getJSON(this.src)

       estados.push(estado.status)

       if(estado.status === 404)
       {
            cantidad_error.push(this.src)
       }else{
            cantidad_buenas.push(this.src)
       }
    })

    var result = {buenas:cantidad_buenas, malas:cantidad_error}
    return result
}

function meses_texto(id)
{
    var mes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
    var clave = parseInt(id)-1

    return mes[clave]
}

function traer_clalendario_anaual()
{
    var datos = {path:'curriculum/ajax/', case:9}
    var proceso = capsula(datos)
        proceso = proceso.json
    var html = render_calendario_primer_semestre(proceso)
        $("#mostrar_cronograma_mes").html(html)
    //return proceso
}

function render_calendario_primer_semestre(obj)
{
    var html = '<ul id="cronograma" class="nav nav-tabs">'
        html+='<li class="active"><a href="#seccion_febrero" data-toggle="tab" style="background-color: aliceblue;">FEB</a></li>'
        html+='<li class=""><a href="#seccion_marzo" data-toggle="tab" style="background-color: aliceblue;">MAR</a></li>'
        html+='<li class=""><a href="#seccion_abril" data-toggle="tab" style="background-color: aliceblue;">ABR</a></li>'
        html+='<li class=""><a href="#seccion_mayo" data-toggle="tab" style="background-color: aliceblue;">MAY</a></li>'
        html+='<li class=""><a href="#seccion_junio" data-toggle="tab" style="background-color: aliceblue;">JUN</a></li>'
        html+='<li class=""><a href="#seccion_julio" data-toggle="tab" style="background-color: rgba(127, 240, 255, 0.38)">JUL</a></li>'
        html+='<li class=""><a href="#seccion_agosto" data-toggle="tab" style="background-color: honeydew">AGO</a></li>'
        html+='<li class=""><a href="#seccion_septiembre" data-toggle="tab" style="background-color: honeydew">SEP</a></li>'
        html+='<li class=""><a href="#seccion_octubre" data-toggle="tab" style="background-color: honeydew">OCT</a></li>'
        html+='<li class=""><a href="#seccion_noviembre" data-toggle="tab" style="background-color: honeydew">NOV</a></li>'
        html+='<li class=""><a href="#seccion_diciembre" data-toggle="tab" style="background-color: honeydew">DIC</a></li>'
        var url = window.location.href
        if(url.search("crear_cronograma") >= 0)
        {
            var function_btn='guardar_cronograma()'
            html+='<div class="acciones_cronograma"><button class="btn btn-success" onclick="'+function_btn+'"><i class="icon-time icon-white"></i> Guardar</button></div>'
            html+= '</ul>'
        }else
        {
            var function_btn='volver_cronograma()'
            html+='<div class="acciones_cronograma"><button class="btn btn-success" onclick="'+function_btn+'"><i class="icon-arrow-left icon-white"></i> Volver</button></div>'
            html+= '</ul>'
        }

    html+= '<div id="myTabContent" class="tab-content">'
    //render meses
        html+=tmp_meses_cronograma('febrero', obj.febrero)
        html+=tmp_meses_cronograma('marzo', obj.marzo)
        html+=tmp_meses_cronograma('abril', obj.abril)
        html+=tmp_meses_cronograma('mayo', obj.mayo)
        html+=tmp_meses_cronograma('junio', obj.junio)
        html+=tmp_meses_cronograma('julio', obj.julio)
        html+=tmp_meses_cronograma('agosto', obj.agosto)
        html+=tmp_meses_cronograma('septiembre', obj.septiembre)
        html+=tmp_meses_cronograma('octubre', obj.octubre)
        html+=tmp_meses_cronograma('noviembre', obj.noviembre)
        html+=tmp_meses_cronograma('diciembre', obj.diciembre)


    html+='</div>'

    return html
}

function tmp_meses_cronograma(mes, obj){
    if(mes === 'febrero')
    {
        var active = 'active in'
    }else{
        var active = ''
    }

    var html='<div class="tab-pane fade '+active+' " id="seccion_'+mes+'">'
        html+='<ul class="mes dias '+mes+'">'
        localStorage.removeItem('semana')
        $.each(obj, function(){
            var n = parseInt(this.dia_posicion)
            var semana = localStorage.getItem('semana')
            if(semana)
            {
                if(parseInt(semana) === parseInt(this.semana)){
                    var title = ''
                }else{
                    var semana = parseInt(this.semana)
                    localStorage.setItem('semana', semana)
                    var semana = localStorage.getItem('semana')
                    var title = '<h5>Semana '+semana+' </h5>'
                }

            }else{
                var semana = parseInt(this.semana)
                localStorage.setItem('semana', semana)
                var semana = localStorage.getItem('semana')
                var title = '<h5>Semana '+semana+' </h5>'
            }
                html+=title
            if(semana>0)
            {
                if(this.nombre_dia === 'Sat'){var color = 'style="background-color: rgba(128, 128, 128, 0.08);border: 1px solid rgba(113, 0, 255, 0.17);"'}
                else if(this.nombre_dia === 'Sun'){var color = 'style="background-color: rgba(128, 128, 128, 0.08);border: 1px solid rgba(113, 0, 255, 0.17);"'}
                else{var color=''}
                if(n===1)
                {
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="1" '+color+'><span class="dia_cronograma lunes">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===2){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="2" '+color+'><span class="dia_cronograma martes">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===3){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="3" '+color+'><span class="dia_cronograma miercoles">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===4){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="4" '+color+'><span class="dia_cronograma jueves">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===5){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="5" '+color+'><span class="dia_cronograma viernes">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===6){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="6" '+color+'><span class="dia_cronograma sabado">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===7){
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="7" '+color+'><span class="dia_cronograma domingo">'+this.nombre_dia+' <br> '+this.dia_unico+'</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else{
                    html+='<li ondrop="drop(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="0" '+color+'><span class="dia_cronograma"></span></li>'
                }

            }

        })

        html+='</ul>'
    html+='</div>'
    return html
}
function cargar_cobertura()
{
    var asignatura =$("#asignatura").val()
    if(asignatura == null)
    {
        asignatura= $('#idasig').val()
    }
    var nivel_1 =$("#nivel").val()
    if(nivel_1 == null)
    {
        nivel_1= $('#idniv').val()
    }


    var datos =
     {
        nivel:nivel_1,
        asignatura:asignatura,
        path:'curriculum/ajax/',
        case:7
     }

    var procesar = capsula(datos)
    var data = procesar.json
    var html = tmp_cobertura(data, datos.nivel)
    console.log(data)
    $("#mostrar_curriculum").show()
    $("#mostrar_cronograma_mes").show()
    $("#mostrar_curriculum").html(html)

   }
function tmp_cobertura(obj, nivel){
    var html = '<ul id="myTab" class="nav nav-tabs">'
    var contenido = new Array
    console.log(obj)
    $.each(obj, function(){

        var resumen = this.tipo.resumen
        var clave = parseInt(this.tipo.id)
        var total = parseInt(this.detalle.length)

        if(true)
        {

            if(clave === 1){var accion='active';}else{var accion = ''}
            html+='<li class="'+accion+'"><a href="#seccion_'+resumen+'_'+clave+'" data-toggle="tab">'+this.tipo.nombre+'</a></li>'
            //contenido de la cobertura
            contenido.push(tmp_cobertura_curriculum(this.detalle, resumen, clave, accion, nivel))
                                                                    //OA   //1   //active  //9
        }
    })
        html+= '</ul>'

    //marcar contenido
    html+= '<div id="myTabContent" class="tab-content">'
    $.each(contenido, function(){
        html+=this
    })
    html+='</div>'

    return html
}
function tmp_cobertura_curriculum(obj, resumen, clave, accion, nivel){

    var html ='<div class="tab-pane fade in '+accion+'" id="seccion_'+resumen+'_'+clave+'">'
        html+= '<div class="tabbable tabs-right"><ul id="myTab" class="nav nav-tabs tab-interior">'
    var count=0
    $.each(obj, function(){

        if(parseInt(this.valor) === 1)
            {var accion='active'}else{var accion = ''}
        if(parseInt(nivel)>2 && parseInt(nivel) <=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
            html+='<li class="'+accion+'"><a href="#unidad_'+resumen+'_'+this.valor+'" data-toggle="tab">Unidad '+this.valor+'</a></li>'//class="'+accion+'"
        }else{
            html+='<li class="'+accion+'"><a href="#eje_'+resumen+'_'+count+'" data-toggle="tab">Eje '+this.valor.replace(/[_]/g, ' ')+'</a></li>' //class="'+accion+'"
        }
        count++
    })
        html+= '</ul>'
        html+='<div id="myTabContent" class="tab-content">'
    count=0
    count2=0
    $.each(obj, function(){

        if(parseInt(this.valor) === 1)
        {accion='active'; console.log('aqui')}else{var accion = ''}
        if(parseInt(nivel)>2 && parseInt(nivel)<=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
            html+='<div class="tab-pane fade in '+accion+' scroll_curriculum" id="unidad_'+resumen+'_'+this.valor+'">'//'+accion+'
            html+=tmp_cobertura_unidad(this.curr, resumen, this.valor, this.titulo,nivel)

        }else{
            html+='<div class="tab-pane fade in '+accion+' scroll_curriculum" id="eje_'+resumen+'_'+count2+'">'//'+accion+'
            html+=tmp_cobertura_unidad(this.curr, resumen, this.valor, this.titulo ,nivel)
        }


        html+='</div>'
        count2++
    })
    count2=0
    html+='</div></div></div>'

    return html
}
function tmp_cobertura_unidad(obj, resumen, unidad,titulo, nivel){
    var html ='<ul class="curriculum_listado">'

    if(parseInt(nivel)>2 && parseInt(nivel) <=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
        html+='<h3>Unidad '+unidad+'</h3>'
    }else{
        html+='<h3>Eje: '+titulo.replace(/[_]/g, ' ')+'</h3>'
    }

    $.each(obj, function(){
            html+='<li id="curr_'+this.id+'" data-id="'+this.id+'" data-resumen="'+resumen+''+this.orden+'" class="mover_curriculum" draggable="true" ondragstart="drag(event)" title="Arrastrame"><span class="titulo_curr"><i class="icon-move" title="Debes arrastrarme a un día de la semana"></i> '+resumen+''+this.orden+'</span>'
            html+='<div class="texto_curriculum">'+this.descripcion+'</div>'

            html+='</li>'

        })
    html+='</ul>'
    return html
}
function allowDrop(ev) {
    ev.preventDefault();
    var id = ev.target.id
    $("li#"+id).addClass('sobre_drop')
   // clear()
}

function drag(ev){
    //formatear el html para el drop
    ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");

    //datos del id que recibe el elemento
    var iddrop = ev.target.id
    $("li#"+iddrop).removeClass('sobre_drop')

    //captura datos del evento en movimiento
    var id = $("#"+data).data('id')
    var resumen = $("#"+data).data('resumen')
    var dia = $("#"+iddrop).data('dia_unico')
    //render del elemento para agregar
    var diddrop = "'"+iddrop+"'"
    var html = '<li id="drag_'+id+'" data-idcurr="'+id+'" data-resumen="'+resumen+'">'+resumen+' <i class="icon-trash borrar_curr" onclick="borrar_curr('+id+', '+diddrop+')"></i></li>'
    //validacion del proceso
    var list = $("#curr_crono_"+iddrop+" > li#drag_"+id).data('idcurr')

        if(parseInt(list) === parseInt(id)){
            //ya existe
            $("#"+iddrop).append('<div class="alert fade in alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>Ya existe!</strong></div>')

        }else
        {
            var id_crono_update = $('#id_crono_update').val()
            var url = window.location.href
            if(url.search('crear_cronograma') < 0)
            {

                diddrop = diddrop.split("_")
                diddrop[0] = parseInt(diddrop[0].replace("'",""))
                var update_curr = [id_crono_update, diddrop[0], dia, id, resumen];
                console.log(update_curr)
                var procesar = capsula({path:'curriculum/ajax/', case:16, datos:update_curr})
                var json_proc = procesar.json


                $("#"+iddrop+" > .curr_crono").append(html)
            }
            else
            {
                $("#"+iddrop+" > .curr_crono").append(html)
            }
        }
}

function limpiar_drop(ev){
    var id = ev.target.id
    $("li#"+id).removeClass('sobre_drop')
}

function borrar_curr(clave, dia){
    var url = window.location.href
    console.log()
    if(url.search('crear_cronograma') >= 0)
    {
        $("#curr_crono_"+dia+" #drag_"+clave).remove()
    }
    else
    {

    var datos = dia.split('_');
    var dia_unico = parseInt(datos[1]);
    var mes = parseInt(datos[0]);
    console.log(clave,dia_unico,mes)
    var claves = [clave,dia_unico,mes]
    var procesar = capsula({path:'curriculum/ajax/', case:15, datos:claves})
    var json_proc = procesar.json
        if(json_proc == true){

        $("#curr_crono_"+dia+" #drag_"+clave).remove();
       }else
       {

       }

     }
 }

 function tmp_alert(obj){
    var html ='<div class="'+obj.clase+'">'
        html+='<button type="button" class="close" data-dismiss="alert">&times;</button>'
        html+='<strong>'+obj.titulo+'</strong>'+obj.mensaje+'.'
        html+='</div>'
    return html
 }
function change_pass()
{
    var act = $("#actual_pass").val()
    var neu = $("#new_pass").val()
    var rep = $("#repeat_pass").val()
    var mensaje=''
    if(act.length > 1)
    {
        $("#actual_pass").removeClass('fail_password')
        $("#actual_pass").addClass('ok_password')
        if(neu.length >= 8 && neu.length <= 15 && neu.search(" ") < 0)
        {
            $("#new_pass").removeClass('fail_password')
            $("#new_pass").addClass('ok_password')
            if(rep === neu)
            {
                var obj= capsula({path:'usuarios/ajax', case:26, actual:act, nueva:neu, repetida:rep})
                $("#repeat_pass").removeClass('fail_password')
                $("#repeat_pass").addClass('ok_password')
                $("#new_pass").removeClass('fail_password')
                $("#new_pass").addClass('ok_password')

                if(obj.json.estado)
                {
                    $("#validate_msj").html('<div class="alert fade in alert-success"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+obj.json.mensaje+'</strong></div>')
                    $("#validate_msj").show()
                    $("#actual_pass").removeClass('ok_password')
                    $("#new_pass").removeClass('ok_password')
                    $("#repeat_pass").removeClass('ok_password')
                    $("#actual_pass").removeClass('fail_password')
                    $("#new_pass").removeClass('fail_password')
                    $("#repeat_pass").removeClass('fail_password')
                    $("#actual_pass").val('')
                    $("#new_pass").val('')
                    $("#repeat_pass").val('')
                }else
                {
                    $("#validate_msj").html('<div class="alert fade in alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+obj.json.mensaje+'</strong></div>')
                    $("#validate_msj").show()
                }
            }else
            {
                mensaje='Las contraseñas no coinciden!'
                $("#validate_msj").html('<div class="alert fade in alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+mensaje+'</strong></div>')
                $("#validate_msj").show()
                $("#repeat_pass").removeClass('ok_password')
                $("#repeat_pass").addClass('fail_password')
                $("#new_pass").removeClass('ok_password')
                $("#new_pass").addClass('fail_password')
            }
        }else
        {
            mensaje='La contraseña debe contener entre 8 a 15 caracteres y no puede contener espacios en blanco!'
            $("#validate_msj").html('<div class="alert fade in alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+mensaje+'</strong></div>')
            $("#validate_msj").show()
            $("#new_pass").removeClass('ok_password')
            $("#new_pass").addClass('fail_password')
            $("#repeat_pass").removeClass('ok_password')
            $("#repeat_pass").addClass('fail_password')
        }
    }else
    {
        mensaje='Debe ingresar su contraseña actual para realizar el cambio!'
        $("#validate_msj").html('<div class="alert fade in alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>'+mensaje+'</strong></div>')
        $("#validate_msj").show()
        $("#actual_pass").removeClass('ok_password')
        $("#actual_pass").addClass('fail_password')
    }
}

function capsula_asincronica(obj, onSuccess){
    $.ajax({
        url: server + obj.path,
        type: 'post',
        dataType: 'json',
        async: true,
        data: obj,
        success: function(result,status,xhr){
            onSuccess(result);
        }
    });
}

function capsula_asincronica_html(obj, onSuccess){
    $.ajax({
        url: server + obj.path,
        type: 'post',
        dataType: 'html',
        async: true,
        data: obj,
        success: function(result,status,xhr){
            onSuccess(result);
        }
    });
}
/* Este se utiliza para poder enviar datos FILE por ajax */
function capsula_file_file(obj, onSuccess){
    $.ajax({
        
		url:server + obj.path,
		type:'POST',
		contentType:false,
		data: obj.data,
		processData:false,
		cache:false,
        success: function(result,status,xhr){
            onSuccess(result);
        }
    });
}
var alter_select = function(dropdown, selectedValue) {
    var options = $(dropdown).find("option");
    var matches = $.grep(options,function(n){ return $(n).val() == selectedValue; });
    $(matches).attr("selected", "selected");
};
function hexToR(h)
{
	return parseInt((cutHex(h)).substring(0,2),16)
}
function hexToG(h)
{
	return parseInt((cutHex(h)).substring(2,4),16)
}
function hexToB(h)
{
	return parseInt((cutHex(h)).substring(4,6),16)
}
function cutHex(h)
{
	return (h.charAt(0)=="#") ? h.substring(1,7):h
}
String.prototype.toTitle = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function estilo_menu_hover(nombre)
{
    $('#'+nombre).removeClass(nombre);
    $('#'+nombre).addClass(nombre+'-blanco');
}
function estilo_menu_normal(nombre)
{
    $('#'+nombre).removeClass(nombre+'-blanco');
    $('#'+nombre).addClass(nombre);
}
function validarEmail( email ) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test( email ) )
        return false;
    else
        return true;
}