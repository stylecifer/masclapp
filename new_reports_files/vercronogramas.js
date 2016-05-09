String.prototype.toTitle = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var datos_user = usuario_actual();
$(function(){
crono_niveles()
	//var user = JSON.parse(usuario_actual())

$("#idcreador_update").val(user.id)
	$("#idcreador_perfil").val(user.idprefil)


	$(function(){
		$("[name='objetivo[]']").prop('checked', true)
	})

    $(document).on('click','.borrar_curri',function(){
    //$(document).on('click','.borrar_curr',function(){
     var div=""
     var dia_unico = $(this).parent().data('dia_unico')
     var fecha_dia_unix = $(this).parent().data('fecha_dia_unix')
     var idcurr = $(this).parent().data('idcurr')
     var id = $(this).parent().data('id')
     var idnivel = $(this).parent().data('idnivel')
     var resumen = $(this).parent().data('resumen')
     var semana = $(this).parent().data('semana')
    })

    $(document).on('click','.ver_clases',function(){
    	var idcurr = $(this).data('id')
    	var dia = $(this).data('dia')
    	var mes = $(this).data('mes')
    	var sem = $(this).data('semana')
    	traer_clases_idcurr(idcurr,dia,mes,sem)
    })

    $(document).on('click', '.option_clase',function(){
    	var op = $(this).val()
    	menu_option_plani(op,$(this).data('idclase'),$(this).data('mes'),$(this).data('sem'),$(this).data('pos'),$(this).data('niv'),$(this).data('asig'))

    	var datos = {clase:$(this).data('idclase'), mes:$(this).data('mes'), semana:$(this).data('sem'), dia:$(this).data('pos'),
				nivel:$(this).data('niv'), asignatura:$(this).data('asig'), path:'curriculum/ajax/', case:24}
				//nivel:$(this).data('niv'), asignatura:$(this).data('asig'), path:'clases/ajax/', case:1}
		var procesar = capsula(datos)

		$.each(procesar.json, function(){
			$("tr#indicador"+this.idindicador).css({backgroundColor:'rgba(154, 205, 50, 0.18)'})
			$("#indicador_"+this.idindicador).attr('checked', true)
		})

		var datos = {clase:$(this).data('idclase'),nivel:$(this).data('niv'), asignatura:$(this).data('asig'), path:'curriculum/ajax/', case:25}
		//var datos = {clase:$(this).data('idclase'),nivel:$(this).data('niv'), asignatura:$(this).data('asig'), path:'clases/ajax/', case:5}
		var procesar = capsula(datos)

		$.each(procesar.json, function(){
			$("tr#oft"+this.idcurr).css({backgroundColor:'rgba(154, 205, 50, 0.18)'})
			$("#oft_"+this.idcurr).attr('checked', true)
		})
    })
})
function traer_clases_idcurr(idcurr,dia,mes,sem)
{

	var idcrono = $("#id_crono_update").val()
	var asign = $("#idasig").val()
	var datos = [idcurr,dia,mes,sem,idcrono,asign, $("#idcreador_update").val()]
	var json = capsula({path:'curriculum/ajax', case:28, datos:datos})
	var proc_json = json.json
	var div='<table class="table table-bordered">'
	div+='<thead>'
	div+='<tr>'
	div+='<th>Id</th>'
	div+='<th>Nombre</th>'
	div+='<th>Curriculum</th>'
	div+='<th>Ver</th>'
	div+='<th>Anclar</th>'
	//div+='<th>Asociada</th>'
	div+='<th>Estado</th>'
	div+='<th>Ubicación<br>(dia-sem-mes)</th>'
	div+='</tr>'
	div+='</thead>'
	div+='<tbody>'
	var contador=0
	$.each(proc_json, function(){
		if($.isEmptyObject(this.clases_fijas)){

		}else{
			if(this.clases_fijas[0].estado == true)
			{
				$.each(this.clases_fijas,function(){
					//console.log(contador)
					if(contador == 0)
					{

						div+='<tr style="background-color:rgb(237, 232, 206)">'
						div+='<td>'+this.clase.id+'</td>'
						div+='<td>'+this.clase.nombre+'</td>'
						var string_curr=''
						$.each(this.curri, function(){
							string_curr+=this.resumen+this.orden+' '
						})
						div+='<td><b>'+string_curr+'</b></td>'
						div+='<td><button class="btn btn-mini btn-success" onclick="abrir_clase('+this.clase.id+','+mes+','+sem+','+dia+','+this.clase.idnivel+','+$("#idasig").val()+')"><i class="icon-white icon-search"></i></button></td>'
						div+='<td><button class="btn btn-mini btn-danger" onclick="desanclar_clase('+$("#id_crono_update").val()+','+this.clase.id+','+mes+','+sem+','+dia+','+this.clase.idnivel+','+$("#idasig").val()+')"><i class="icon-white icon-star-empty"></i></button></td>'
						div+='<td><span>Asignada</span></td>'
						div+='<td><span>'+dia+'-'+sem+'-'+mes+'</span></td>'
						div+='</tr>'
					}

				})
			}else
			{

			}
		}
		contador++
		div+='<tr>'
		if(typeof(this.asociado) != "undefined")
		{
			if(this.asociado.estado == false)
			{

			}else
			{
				div+='<td>'+this.clase.idclase+'</td>'
				div+='<td>'+this.detalle[0].detalleclase.nombre+'</td>'
			}
	        var curr_esp=''
			$.each(this.curri_espec, function(){
				curr_esp+='<b>'+this.resumen+''+this.orden+' </b><br>'
			})
			//div+='<td>'+this.detalle[0].curriclase[0].resumen+''+this.detalle[0].curriclase[0].orden+'</td>'
			if(this.asociado.estado == false)
			{

			}else{
				div+='<td>'+curr_esp+'</td>'
			div+='<td><button class="btn btn-mini btn-success" onclick="abrir_clase('+this.clase.idclase+','+mes+','+sem+','+dia+','+this.detalle[0].curriclase[0].idnivel+','+$("#idasig").val()+')"><i class="icon-white icon-search"></i></button></td>'
			}
			if(this.asociado.estado == false)
			{
				//div+='<td class="accion_anclaje_'+this.clase.idclase+'"><button class="btn btn-mini btn-danger" onclick="desanclar_clase('+idcrono+','+this.clase.idclase+','+mes+','+sem+','+dia+','+this.detalle[0].curriclase[0].idnivel+','+this.detalle[0].curriclase[0].idasignatura+')"><i class="icon-white icon-star-empty"></i></button></td>'
			}else
			{
				if(this.estado.estado)
				{
					div+='<td class="accion_anclaje_'+this.clase.idclase+'"><button class="btn btn-mini"><i class="icon-star"></button></i></td>'
				}else{
					div+='<td class="accion_anclaje_'+this.clase.idclase+'"><button class="btn btn-mini btn-warning" onclick="anclar_clase('+idcrono+','+this.clase.idclase+','+mes+','+sem+','+dia+','+this.detalle[0].curriclase[0].idnivel+','+this.detalle[0].curriclase[0].idasignatura+')"><i class="icon-white icon-star"></i></button></td>'
				}

			}

			if(this.asociado.estado == false)
			{
				//div+='<td class="asoc_'+this.clase.idclase+'"><span style="color:rgb(115, 11, 11)">Anclada</span></td>'
			}else{
				if(this.estado.estado)
				{
					div+='<td class="asoc_'+this.clase.idclase+'"><span style="color:rgb(124, 121, 121)">Utilizada</span></td>'
				}else
				{
					div+='<td class="asoc_'+this.clase.idclase+'"><span style="color:rgb(5, 94, 5)">Disponible</span></td>'
				}

			}

			if(this.estado.estado)
			{
				//div+='<td><i class="icon-ok"></i></td>'
				if(this.asociado.estado == false)
				{

				}else
				{
					div+='<td>'+this.estado.fecha_anclaje[0].posicion_dia+'-'+this.estado.fecha_anclaje[0].semana+'-'+this.estado.fecha_anclaje[0].mes+'</td>'
				}
			}else
			{
				//div+='<td></td>'
				div+='<td></td>'
			}
		}else{
			div+='</tr>'
		}
	})
	div+='<tr>'
	div+='<td><b>Mensaje:</b></td>'
	div+='<td colspan="7" class="mensaje_error"></td>'
	div+='</tr>'
	div+='</tbody>'
	div+='</table>'
	bootbox.alert(div, function(){

	})
}
function abrir_clase(id,mes,sem,dia,nivel,asign)
{
	var b = null
	var tot = 1
	param_url=''+id+'/'+mes+'/'+sem+'/'+dia+'/'+nivel+'/'+asign+''
	window.open(server+'clases/editarclase/'+param_url)
	window.onmessage = function (e) {
    if (e.data) {
        crono_listar(asign,b,tot, mes, $("#id_crono_update").val())
    } else {
    }
};
}
function crear_la_clase(mes,sem,dia,tipo,orden)
{

	var b = null
	var tot = 1
	var asig = $("#idasig").val()
	var niv = $("#idniv").val()
	var idcrono = $("#id_crono_update").val()
	param_url=''+mes+'/'+sem+'/'+dia+'/'+niv+'/'+asig+'/'+tipo+'/'+orden+'/'+idcrono+''
	window.open(server+'clases/crearclase/'+param_url)
	window.onmessage = function (e) {
    if (e.data) {
        crono_listar(asig,b,tot, $("#idcreador_update").val(),mes,$("#id_crono_update").val())
    } else {
    }
};
}

function anclar_clase(idcrono,idclase,mes,sem,dia,nivel,asign)
{
	var e = null
	var tot = 1
	var datos = [idcrono,idclase,mes,sem,dia]
	var json = capsula({path:'curriculum/ajax', case:18, datos:datos})
	var proc_json = json.json
	if(proc_json.estado)
	{
		$(".asoc_"+idclase+"").html('<i class="icon-star"></i>')
		$(".accion_anclaje_"+idclase+"").html('<button class="btn btn-mini btn-danger" onclick="desanclar_clase('+idcrono+','+idclase+','+mes+','+sem+','+dia+','+nivel+','+asign+')"><i class="icon-white icon-star-empty"></i></button>')
		$(".mensaje_error").html('<div class="alert alert-success fade in"><button type="button" class="close" data-dismiss="alert">×</button><strong>Good! </strong>'+proc_json.mensaje+'</div>')
		var a = parseInt($("#contador_asoc_"+mes+"_"+sem+"_"+dia+"").text())+1
		$("#contador_asoc_"+mes+"_"+sem+"_"+dia+"").text(a)
		var user = JSON.parse(usuario_actual())
		crono_listar($("#idasig").val(),e,tot, $("#idcreador_update").val(), mes, idcrono)
		$(".list_meses").removeClass('active')
		$(".grilla_meses").removeClass('active')
		$("#mes"+mes+"").addClass('active')
		$("#tab"+mes+"").addClass('active')
	}else
	{
		$(".mensaje_error").html('<div class="alert fade in"><button type="button" class="close" data-dismiss="alert">×</button><strong>Atención! </strong>'+proc_json.mensaje+'</div>')

	}
}

function desanclar_clase(idcrono,idclase,mes,sem,dia,nivel,asign)
{
	var e = null
	var tot = 1
	var datos = [idcrono,idclase,mes,sem,dia,nivel, asign]
	var json = capsula({path:'curriculum/ajax', case:19, datos:datos})
	var proc_json = json.json
	if(proc_json)
	{
		$(".accion_anclaje_"+idclase+"").html('<button class="btn btn-mini btn-warning" onclick="anclar_clase('+idcrono+','+idclase+','+mes+','+sem+','+dia+','+nivel+','+asign+')"><i class="icon-white icon-star"></i></button>')
		$(".asoc_"+idclase+"").html('')
		var a = parseInt($("#contador_asoc_"+mes+"_"+sem+"_"+dia+"").text())-1
		$("#contador_asoc_"+mes+"_"+sem+"_"+dia+"").text(a)
		crono_listar($("#idasig").val(),e,tot, $("#idcreador_update").val(), mes, idcrono)
		$(".list_meses").removeClass('active')
		$(".grilla_meses").removeClass('active')
		$("#mes"+mes+"").addClass('active')
		$("#tab"+mes+"").addClass('active')
	}else
	{

	}
}
function anclaje_key(iddia, propietario){
	var json = capsula({path:'curriculum/ajax', case:36, datos:iddia, propietario:propietario})
	var proc_json = json.json

	var table=''
	table+='<h3>Clase(s) ancladas en este dia</h3>'
		table+='<table class="table table-bordered">'
		table+='<thead><tr><th>Id Clase</th><th>Nombre</th><th>Curr</th><th></th>Desanclar</tr></thead>'
		table+='<tbody>'
		$.each(proc_json,function(){
			table+='<tr>'
			table+='<td>'+this.id+'</td>'
			table+='<td>'+this.nombre+'</td>'
			table+='<td>'+this.idida_crono+'</td>'
			table+='<td><button class="btn btn-mini btn-danger" onclick="desanclar_clase('+$("#id_crono_update").val()+','+this.id+','+this.mes+','+this.semana+','+this.posicion_dia+','+$("#idniv").val()+','+$("#idasig").val()+')"><i class="icon-white icon-star-empty"></i></button></td>'
			table+='</tr>'
		})
		table+='</tbody>'
		table+='</table>'

	bootbox.alert(table,function(){
	})


	//idcrono,idclase,mes,sem,dia,nivel,asign
}
function crono_niveles(id){
	var user = JSON.parse(usuario_actual())
	var datos = {path:'curriculum/ajax/', case:11, datos:user.id}
	var proc = capsula(datos)
	var data = JSON.parse(proc.fuente)
	var render = tmp_cronogramas(data, 'crono_asignatura')
	$(".crono").hide()
	$("#crono_niveles").html(render)
	$("#crono_niveles").fadeIn('fast')

    //limpiar breadcrumb
    $('#path_nivel').html('')
    $('#path_asignatura').html('')
    $('#path_creador').html('')
    
}

function crono_asignatura(nivel, e){
	if (typeof(e) != "undefined")
	{
		var nombre = e.target.dataset.nombre
		tmp_path({nombre:nombre, path:'path_nivel'}, 'crono_asignatura('+nivel+')') 
	}
	var user = JSON.parse(usuario_actual())
	var datos_cr = {user_id:user.id,nivel:nivel}
	var datos = {path:'curriculum/ajax/', case:12, datos:datos_cr}



	
	$("#crono_niveles").html(cargador)
	$("#crono_asignaturas").html(cargador)
	
	capsula_asincronica(datos, function(data){
		
		if(parseInt(user.idprefil) == 2 || parseInt(user.idprefil) == 1)

		{
			var render = tmp_cronogramas(data, 'listado_cronos')
		}else

		{
			var render = tmp_cronogramas(data, 'listado_cronos')
		}
		$(".crono").hide()
		$("#crono_asignaturas").html(render)
		$("#crono_asignaturas").fadeIn('fast')
		$("#idniv").val(nivel)

		//corregir breadcrumb
		$('#path_asignatura').html('')
		$('#path_creador').html('')
	})
}   

function listado_cronos(asignatura, e, total){
	user = JSON.parse(usuario_actual())
	var mes=3
	$("#idasig").val(asignatura)
	if(e != null)
	{
	var nombre = e.target.dataset.nombre
	tmp_path({nombre:nombre, path:'path_asignatura'}, '  listado_cronos2('+asignatura+',\''+nombre+'\','+total+')')
	}
	
	$("#crono_asignaturas").html(cargador);
	$("#listado_cronograma").html(cargador);
	var datos = {path:'curriculum/ajax/', case:35, id:asignatura, user:user.id}
	capsula_asincronica(datos, function(data){


		var render = tmp_cronogramas_list(data, 'crono_listar')
		if(e != null)




		{
			$(".crono").hide()
			$("#listado_cronograma").html(render)
			$("#listado_cronograma").fadeIn('fast')
		}else

		{
			$("#listado_cronograma").html(render)
		}


	})
}
function listado_cronos2(asignatura,nombre,total)
{
    user = JSON.parse(usuario_actual())
	var mes=3
	$("#idasig").val(asignatura)
	
	
	tmp_path({nombre:nombre, path:'path_asignatura'}, '  listado_cronos2('+asignatura+',\''+nombre+'\','+total+')')
		
	$("#mostrar_cronograma").html(cargador);
	$("#crono_asignaturas").html(cargador);
	var datos = {path:'curriculum/ajax/', case:35, id:asignatura, user:user.id}
	capsula_asincronica(datos, function(data){


		var render = tmp_cronogramas_list(data, 'crono_listar')




		
		$(".crono").hide()
		$("#listado_cronograma").html(render)
		$("#listado_cronograma").fadeIn('fast')

		$('#path_creador').html('')

	})
}
function tmp_cronogramas_list(obj,func)
{
	var html ='<ul class="bpruebas">'
	$.each(obj, function(){

		html+='<li data-nombre="'+this.crono.nombre+'" onclick="'+func+'('+this.crono.idasignatura+', event, '+this.crono.total+', '+this.crono.usuario+', 3, '+this.crono.idcrono+')">'
		html+='<div data-nombre="'+this.crono.nombre+'" class="titulo_tipo" style="background-color:rgb(27, 152, 12) !important;color:white !important; font-size:13px !important">"'+this.crono.nombrecrono+'"<br>'+this.crono.nombre+'</div>'
		html+='<div data-nombre="'+this.crono.nombre+'" class="total_pruebas">'+this.crono.total+'</div><br>'
		html+='<div data-nombre="'+this.crono.nombre+'" class="subtitulo" style="color: gray; margin-top: 10px;">Cronogramas</div>'
		html+='</li>'

	})
	html+='</ul>'
	return html
}

function crono_listar(asignatura, e, total, usuario, mes, cronog){
	$("#listado_cronograma").html(cargador)
	$("#tab_contenido_crono").html(cargador)
	//estos datos se almacena para capturarlos al momento de copiar un cronograma
	localStorage.setItem("asignatura"	, asignatura);
	localStorage.setItem("total"		, total);
	localStorage.setItem("usuario"		, usuario);
	localStorage.setItem("mes"			, mes);
	if(typeof(usuario) != "undefined")
	{
		$("#idcreador_update").val(usuario)
	}
	user = JSON.parse(usuario_actual())
	$("#idasig").val(asignatura)
	if(e != null)
	{
	var nombre = e.target.dataset.nombre
	var month = new Date()
	mes = month.getMonth()+1
	//tmp_path({nombre:nombre, path:'path_creador'}, 'crono_asignatura('+asignatura+')')
    tmp_path({nombre:nombre, path:'path_creador'}, '')
	}

	var datos = {path:'curriculum/ajax/', case:13, id:asignatura, user:user.id, propietario:usuario, mes:mes, cronog:cronog}
	capsula_asincronica(datos, function(data){
		var render = tmp_cronogramas_view(data, usuario, mes, cronog)
		if(e != null)
		{
			$(".crono").hide()
			$("#mostrar_cronograma").html(render)
			$("#mostrar_cronograma").fadeIn('fast')
		}else{
			$("#mostrar_cronograma").html(render)
		}
	})
}

function tmp_cronogramas(obj,func)
{
    user = JSON.parse(usuario_actual())
    $("#idcreador_update").val(user.id)
	var html ='<ul class="bpruebas">'
	$.each(obj, function(){

        html+='<li data-nombre="'+this.nombre+'" onclick="'+func+'('+this.id+', event, '+this.total_crono+','+user.id+',3 )">'
		html+='<div data-nombre="'+this.nombre+'" class="titulo_tipo" style="background-color:'+this.color+' !important;color:white !important;">'+this.nombre+'</div>'
		html+='<div data-nombre="'+this.nombre+'" class="total_pruebas">'+this.total_crono+'</div><br>'
		html+='<div data-nombre="'+this.nombre+'" class="subtitulo" style="color: gray; margin-top: 10px;">Cronogramas</div>'
		html+='</li>'

	})
	html+='</ul>'
	return html
}

function tmp_path(obj, func)
{
	var html=''
		html+='<a href="javascript:;" onclick="'+func+'">'+obj.nombre+'</a> '
		html+='<span class="divider">/</span>'
	$("#"+obj.path).html(html)
}
function crono_listar_pdf(idcrono, e){
	var form = '<h3>¿Que desea imprimir?</h3>'
	form +='<ul class="acciones">'
	form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="1" /> <i class="icon-search"></i>Imprimir Cronograma Anual Unidad</label></li>'
	form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="2" /> <i class="icon-pencil"></i>Imprimir Cronograma Mensual de Clases por Meses</label></li>'
	//form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="2" /> <i class="icon-pencil"></i>Imprimir Cronograma del Mes </label></li>'

	form+='</ul>'

	bootbox.confirm(form, function(resp){

		if(resp)
		{
			var opcion = $("input[name='opcion']:checked").val()

			switch(parseInt(opcion))
			{
				case 1:
					 var asig = $("#idasig").val()
  					 var caso = 1
  					 param_url =''+idcrono+'/'+asig+'/'+caso+'/'
  					 window.open(server+'curriculum/imprimir_crono/'+param_url)
				break;
				case 2:
				    var form = '<h3>¿Elija el Mes que desea Imprimir?</h3>'
					form +='<ul class="acciones">'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion1" value="1" /> <i class="icon-book"></i>ENERO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion2" value="2" /> <i class="icon-book"></i>FEBRERO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion3" value="3" /> <i class="icon-book"></i>MARZO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion4" value="4" /> <i class="icon-book"></i>ABRIL</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion5" value="5" /> <i class="icon-book"></i>MAYO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion6" value="6" /> <i class="icon-book"></i>JUNIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion7" value="7" /> <i class="icon-book"></i>JULIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion8" value="8" /> <i class="icon-book"></i>AGOSTO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion9" value="9" /> <i class="icon-book"></i>SEPTIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion10" value="10" /> <i class="icon-book"></i>OCTUBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion11" value="11" /> <i class="icon-book"></i>NOVIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion12" value="12" /> <i class="icon-book"></i>DICIEMBRE</label></li>'
					form+='</ul>'

					bootbox.confirm(form, function(resp){
					// var mes = $("input[name='opcion']:checked").val()
					var mes = new Array();
					//recorremos todos los checkbox seleccionados con .each
					$('input[name="opcion[]"]:checked').each(function() {
					//$(this).val() es el valor del checkbox correspondiente
					mes.push($(this).val());
					});
					//si todos los checkbox están seleccionados devuelve 1,2,3,4,5
					 var str = mes.toString()
					 var res = str.replace(/,/g , "/")
					 var asig = $("#idasig").val()
  					 var caso = 2



  					 param_url =''+idcrono+'/'+asig+'/'+caso+'/'+res+'/'
  					window.open(server+'curriculum/imprimir_crono/'+param_url)
					 })
				break;
				case 3:

					 var asig = $("#idasig").val()
  					 var caso = 3
  					 param_url =''+idcrono+'/'+asig+'/'+caso+'/'
  					 window.open(server+'curriculum/imprimir_crono/'+param_url)

				break;
			}
		}else{

		}
	})
}


function tmp_cronogramas_view(obj, user, mes, cronog)
{
	//Colores para las Unidades o Ejes
	var colores_eje =[]
	var color_clase = 0
	var arreglo_colores=["rgb(114, 194, 200)","rgb(80, 181, 218)","rgb(147, 167, 205)","rgb(216, 177, 177)","rrgb(110, 188, 211)"]
	var obje_colores =["rgb(37, 144, 152)","rgb(36, 131, 166)","rgb(106, 123, 157)","rgb(186, 121, 121)","rgb(66, 151, 176)"]
	var legend_colores =["rgba(74, 161, 166, 1)","rgba(49, 160, 200, 1)","rgba(122, 141, 178, 1)","rgba(199, 142, 142, 1)","rgba(83, 162, 186, 1)"]
	//

	$('#imprimir').val(obj[0].crono.id)
    var idcronito = obj[0].crono.id
	var meses=["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"]
	$('#id_crono_update').val(cronog)
	var html='<div id="crono_view">'
	html+='<ul class="nav nav-pills pull-right">'
	if(window.location.host === "nucleo.kdoceduca.cl"){
		html+='<li><button class="btn btn-info" onclick="modifica_crono('+cronog+','+$("#idasig").val()+')"><i class="icon-white icon-pencil"></i>Editar</button></li>'
	}
	//html+='<li><button class="btn btn-danger" onclick="eliminar_crono('+cronog+', '+obj[0].crono.creador+')"><i class="icon-white icon-trash"></i>Eliminar</button></li>'
	//html+='<li><button class="btn btn-warning" onclick="crono_listar_pdf('+cronog+')""><i class="icon-white icon-print"></i>Imprimir PDF</button></li>'
	html+='<li><button class="btn btn-warning" onclick="copiar_crono()""><i class="icon-white icon-print"></i>Copiar</button></li>'
	html+='</ul>'
	if((obj[0].crono.nombre) != null)
	{
		html+='<h3 style="text-align:center">'+obj[0].crono.nombre+'</h3>'
	}else{
		html+='<h3 style="text-align:center">Cronograma sin nombre</h3>'
	}

	html+='<div class="tabtable">'
	html+='<ul class="nav nav-tabs">'
	/*$.each(obj[0].cronologia, function(){
		if(this.mes == 3)
		{
			var estado='class="list_meses active"'
		}else
		{
			var estado='class="list_meses"'
		}
		if(parseInt(this.mes) > 1)
		{
			html+='<li '+estado+' id="mes'+(parseInt(this.mes))+'"><a href="#tab'+this.mes+'" data-toggle="tab">'+meses[this.mes-1]+'</a></li>'
		}

	})*/
	var countfor = 0
		for(countfor = 1; countfor<13;countfor++)
		{
			if(countfor == mes)
			{
				var estado='class="list_meses active"'
			}else
			{
				var estado='class="list_meses"'
			}
			if(parseInt(countfor) > 1)
			{
				html+='<li '+estado+' id="mes'+(parseInt(countfor))+'" onclick="crono_listar('+$("#idasig").val()+',null,1,'+user+','+countfor+','+cronog+')"><a href="#tab'+countfor+'" data-toggle="tab">'+meses[countfor-1]+'</a></li>'
			}
		}

	html+='</ul>'
	html+='<div class="tab-content">'
	$.each(obj[0].cronologia,function(){

		var mes_open = this.mes//obtengo el mes
		if(this.mes == mes)
		{
			var estado='active grilla_meses'
		}else
		{
			var estado='grilla_meses'
		}
		html+='<div class="tab-pane '+estado+'" id="tab'+this.mes+'">'
		html+='<table class="table table-bordered" id="tab_contenido_crono">'
		html+='<tr><td></td><td id="titulos_cronograma">Día 1</td><td id="titulos_cronograma">Día 2</td><td id="titulos_cronograma">Día 3</td><td id="titulos_cronograma">Día 4</td><td id="titulos_cronograma">Día 5</td></tr>'
		$.each(this.semana, function(){
			var sem_open = this.semana//obtengo la semana
			html+='<tr><td id="titulos_cronograma"><p>Semana '+this.semana+'<p></td>'
			var mes_actual = this.mes
				$.each(this.dias, function(){
					var pos_open = this.valor.posicion_dia//obtengo la posicion del dia
					var niv_open = this.valor.idnivel//obtengo el nivel
					var asig_open = this.valor.idasignatura//obtengo la asignatura
					var id_dia = this.valor.id//obtengo el id del dia
					if(this.valor.posicion_dia <6)
					{

							if((this.curriculum).length >0)
							{
								var curr =''
								var curri_de_clase=''
								$.each(this.curriculum, function(){
									curr+=this.valor.resumen+' '
									curriculum = this.idcurr
									idtipo = this.valor.idtipo
									if(this.valor.unidad > 5)
									{
										color_clase = colores_eje.indexOf("'"+this.valor.unidad+"'");
										if(color_clase == -1){colores_eje.push("'"+this.valor.unidad+"'"); };
										color_clase = colores_eje.indexOf("'"+this.valor.unidad+"'");
										if(color_clase > -1){color_clase = color_clase + 1}else{}
									}else
									{
										color_clase=this.valor.unidad
									}
								})
								if(this.check_dias.detalle != null)
								{
									var clase_open=this.check_dias.detalle[0].idclase//obtengo la clase
								}
								contar_clases=0
								if(parseInt(this.valor.mes) == parseInt(mes_actual))
								{
									if(this.check_dias.detalle != null)//1 sola clase
									{

										var class_tot = '</span><div class="tot_clases ver_clases" title="Anclaje de clase" data-id="'+this.curriculum[0].idcurr+'" data-dia="'+pos_open+'" data-mes="'+mes_open+'" data-semana="'+sem_open+'"><p><i class="icon-white icon-th-list"></i></p></div><div class="dispo_clases" title="Crear una clase" onclick="crear_la_clase('+mes_open+','+sem_open+','+pos_open+','+idtipo+','+curriculum+')"><p><i class="icon-white icon-plus"></i></p></div>'//Clases en el dia
										html+='<td style="width:20%" onmouseover="ver_options(this)" onmouseout="quitar_opciones(this)">'+class_tot+''
										
										
										var vl_nombreAsig = ""
										var vl_colorAsig = ""
										$.each(this.check_dias.indicadores,function(){
											
											vl_nombreAsig	= this.nombreAsignatura;
											vl_colorAsig	= this.color
											
										})
										$.each(this.check_dias.detalle,function(){
											var nombreClase = this.clase.nombre
											curri_de_clase=''
											$.each(this.curriculum, function(){
												curri_de_clase += this.resumen+''+this.orden+' '
											})
											
											if( niv_open > 2 )
											{
												html+='<div style="background-color:'+arreglo_colores[color_clase-1]+'!important" id="content_class" data-id="'+clase_open+'" data-mes="'+mes_open+'" data-sem="'+sem_open+'" data-pos="'+pos_open+'" data-niv="'+niv_open+'" data-asig="'+asig_open+'" onclick="ver_clase_crono('+this.clase.idclase+','+mes_open+','+sem_open+','+pos_open+','+niv_open+','+asig_open+')"><div><div id="content_oa" style="background-color:'+obje_colores[color_clase-1]+'!important"><p id="box_oas">'+curri_de_clase+'-'+vl_nombreAsig+'</p></div><p id="obj_clase_label">'+( ( nombreClase !="" )? nombreClase : 'Objetivo de la clase' )+'</p><div id="content_legend" style="background-color:'+legend_colores[color_clase-1]+'!important"><p id="text_obj_box">'+this.clase.objetivo+'</p></div></div></div>'
											}
											else
											{
												// traspaso del color a RGB para dejar los div hijos mas claros
												var R = hexToR(vl_colorAsig);
												var G = hexToG(vl_colorAsig)+30;
												var B = hexToB(vl_colorAsig)+30;
												
												R = ( R > 255 )? 255 : R;
												G = ( G > 255 )? 255 : G;
												B = ( B > 255 )? 255 : B;
												
												html+=	'<div style="background-color:'+vl_colorAsig+' !important;" id="content_class" data-id="'+clase_open+'" data-mes="'+mes_open+'" data-sem="'+sem_open+'" data-pos="'+pos_open+'" data-niv="'+niv_open+'" data-asig="'+asig_open+'" onclick="ver_clase_crono('+this.clase.idclase+','+mes_open+','+sem_open+','+pos_open+','+niv_open+','+asig_open+')">'+
															'<div>'+
																'<div id="content_oa" style="background-color:rgb('+R+', '+G+', '+B+') !important;">'+
																	'<p id="box_oas">'+curri_de_clase+'</p>'+
																'</div>'+
																	'<p id="obj_clase_label">'+( ( nombreClase !="" )? nombreClase : 'Objetivo de la clase' )+'</p>'+
																'<div id="content_legend" style="background-color:rgb('+R+', '+G+', '+B+') !important;">'+
																	'<p id="text_obj_box" >'+this.clase.objetivo+'</p>'+
																'</div>'+
															'</div>'+
														'</div>'
											}
										})
										if(this.check_dias.sin_uso == null)
										{

										}else
										{
											$.each(this.check_dias.sin_uso, function(){
												html+='<div style="margin-top:5px;" class="crono_curri_dia"><p class="curri_dia_content">'+this.resumen+'</p></div>'
											})
										}
										html+='</td>'
									}else
									{
										//html+='<td style="width:20%"><div class="tot_clases ver_clases" title="Anclaje de clase" data-id="'+this.curriculum[0].idcurr+'" data-dia="'+pos_open+'" data-mes="'+mes_open+'" data-semana="'+sem_open+'"><p><i class="icon-white icon-th-list"></i></i></p></div><div class="dispo_clases" title="Crear una clase" onclick="crear_la_clase('+mes_open+','+sem_open+','+pos_open+','+idtipo+','+curriculum+')"><p><i class="icon-white icon-plus"></i> </p></div><div id="content_class" data-id="'+clase_open+'" data-mes="'+mes_open+'" data-sem="'+sem_open+'" data-pos="'+pos_open+'" data-niv="'+niv_open+'" data-asig="'+asig_open+'" onclick="ver_clase_crono('+clase_open+','+mes_open+','+sem_open+','+pos_open+','+niv_open+','+asig_open+')"><div><div id="content_oa"><p id="box_oas">'+curr+'</p></div><p id="obj_clase_label">Objetivo de la clase</p><div id="content_legend"><p id="text_obj_box">'+this.check_dias.detalle[0].objetivo+'</p></div></div></td>'
										var curr2=''
										if(parseInt((this.curriculum).length) > 0)
										{
											var currid = 0
											var count = 0
											$.each(this.curriculum, function(){
												curr2+=this.valor.resumen+' '

													currid = this.idcurr
													idtipo = this.valor.idtipo

												++count
											})
											html+='<td  style="width:20%" onmouseover="ver_options(this)" onmouseout="quitar_opciones(this)"><div class="tot_clases ver_clases" title="Anclaje de clase" data-id="'+currid+'" data-mes="'+mes_open+'" data-semana="'+sem_open+'" data-dia="'+pos_open+'"><p><i class="icon-white icon-th-list"></i></p></div><div class="dispo_clases" title="Crear una clase" onclick="crear_la_clase('+mes_open+','+sem_open+','+pos_open+','+idtipo+','+currid+')"><p><i class="icon-white icon-plus"></i></p></div><div style="margin-top:5px;" class="crono_curri_dia"><p class="curri_dia_content">'+curr2+'</p></div><div></div></td>'
										}else{
											html+='<td><div><div></div><div></div></div></td>'
										}
									}

								}else
								{
									html+='<td style="width:20%;background-color: rgb(242, 237, 237) !important"><p></p></td>'
								}

								//html+='<td style="width:20%"><div id="content_class" data-id="'+clase_open+'" data-mes="'+mes_open+'" data-sem="'+sem_open+'" data-pos="'+pos_open+'" data-niv="'+niv_open+'" data-asig="'+asig_open+'" onclick="ver_clase_crono('+clase_open+','+mes_open+','+sem_open+','+pos_open+','+niv_open+','+asig_open+')"><div><div id="content_oa"><p id="box_oas">'+curr+'</p></div><p id="obj_clase_label">Objetivo de la clase</p><div id="content_legend"><p id="text_obj_box">'+this.check_dias.detalle[0].objetivo+'</p></div></div></td>'
							}
							else
							{
								if(parseInt(this.valor.mes) == parseInt(mes_actual))
								{
									html+='<td style="width:20%;";></td>'
								}else
								{
									html+='<td style="width:20%;background-color: rgb(242, 237, 237) !important"><p></p></td>'
								}

							}
					}
				})
			html+='</tr>'
		})
		html+='</table>'
		html+='</div>'
	})

	html+='</div>'
	return html
}
function tmp_cronogramas_final(obj){

    $('#id_crono_update').val(obj[0].crono.id)

	var html = '<div style="float:right" class="acciones_cronogramas">'
		html+='<button class="btn" onclick="volver_vista_crono()"><i class="icon-arrow-left"></i> Volver</a> '
		if(window.location.host === "nucleo.kdoceduca.cl"){
			html+='<button class="btn btn-info" onclick="modifica_crono('+obj[0].crono.id+','+obj[0].crono.idasignatura+')"><i class="icon-white icon-pencil"></i> Modificar cronograma</button>'
		}
		html+='</div>'
		html+= '<ul id="myTab" class="nav nav-tabs">'
	var contenido = new Array
	$.each(obj, function(){
		html+='<li class="active"><a href="#crono_'+this.crono.id+'" data-toggle="tab">Cronograma semestre '+this.crono.semestre+' <i class="icon-pencil"></i></a></li>'
		contenido.push(this)
	})
		html+='</ul>'
		html+=tmp_cronograma_contenido(contenido)
	return html

}


function tmp_cronograma_contenido(obj)
{
	var html = '<div id="myTabContent" class="tab-content">'

		//active 1
		$.each(obj, function(){
			var meses = ''
			html+='<div class="tab-pane fade in active" id="crono_'+this.crono.id+'">'
				//render de html por meses
				meses+= '<div class="tabbable tabs-left"><ul id="myTab" class="nav nav-tabs">'

				var contenido_mes = new Array
				var cont = 2
						$.each(this.cronologia, function(){

							if(cont===2){var color = 'active'}else{var color = ''}
							if(this.mes>1)
							{

							meses+='<li class="'+color+'"><a href="#mes_'+this.mes+'" data-toggle="tab">Mes de '+meses_texto(this.mes)+'</a></li>'
							cont++
							contenido_mes.push({mes:this.mes, sem:this.semana})
							}

						})

				var cont_mes = 2
				var dias = '<div id="myTabContent" class="tab-content">'
					$.each(contenido_mes, function(){
						if(cont_mes===2){var color = 'in active'}else{var color = ''}
						dias+='<div class="tab-pane fade '+color+'" id="mes_'+this.mes+'">'
								dias+=tmp_dias_semanas(this.sem)
								cont_mes++

						dias+='</div>'


					})
					dias+= '</div>'

					meses+='</ul>'
					meses+=dias
					meses+='</div>'
			html+= meses
			html+='</div>'
		})

		html+='</div>'

		return html
}

function tmp_dias_semanas(obj){
var html =''
var total = obj.length
if(total > 0){

	$.each(obj, function(){
		html+='<div class="caja_semana">'
		html+='<h4>Semana '+this.semana+'</h4>'
		html+= '<table class="table table-condensed">'
		//html+= '<table class="table table-condensed table-striped">'

		html+'<thead><tr>'
		html+='<th width="15%">Días</th>'
		html+='<th width="70%">Curriculum</th>'
		html+='</tr></thead><tbody>'

		$.each(this.dias, function(){
			if(parseInt(this.valor.posicion_dia)<6){
			html+'<tr>'
			html+='<td class="valores_dias"><b>Día '+this.valor.posicion_dia+'</b></td>'
			html+='<td>'
			var data_pos_dia=this.valor.posicion_dia
			var data_val_mes=this.valor.mes
			var data_val_sem=this.valor.semana
			var data_check_dias=this.check_dias
				if(this.curriculum.length>0)
				{
					html+='<table width="100%" class="table-bordered" style="font-size:12px">'
					$.each(this.curriculum, function(){
						html+='<tr>'
						html+='<td>'+this.valor.resumen+'</td>'
						html+='<td style="line-height:1.2">'+this.valor.descripcion+'</td>'
						html+='<td> Clases <br><p><span style="font-size:2.6em">'+this.clases.length+'</span></p></td>'
						if(data_check_dias.detalle[0].total > 0)
						{
							html+='<td>Asociado <br><p><span id="contador_asoc_'+data_val_mes+'_'+data_val_sem+'_'+data_pos_dia+'" style="font-size:2.6em">'+data_check_dias.detalle[0].total+'</span></p></td>'
						}else
						{
							html+='<td>Asociado <br><p><span id="contador_asoc_'+data_val_mes+'_'+data_val_sem+'_'+data_pos_dia+'" style="font-size:2.6em">'+data_check_dias.detalle[0].total+'</span></p></td>'
						}
						html+='<td>'
						html+='Ver<br><button class="btn btn-mini btn-success ver_clases" data-id="'+this.valor.idcurr+'" data-dia="'+data_pos_dia+'" data-mes="'+data_val_mes+'" data-semana="'+data_val_sem+'"><i class="icon-white icon-search"></i></button>'
						html+='</td>'
						html+='<td>'
						var resum = "'"+this.valor.resumen+"'"
						html+='Crear<br><button class="btn btn-mini btn-info crear_clases" onclick="crear_la_clase('+data_val_mes+','+data_val_sem+','+data_pos_dia+','+this.valor.idtipo+','+this.valor.orden+')"><i class="icon-white icon-plus"></i></button>'
						html+='</td>'
						html+='</tr>'
					})

					html+='</table>'

				}else{
					html+='Sin curriculum asociado'
				}

			html+='</td>'
			html+='</tr>'
			}

		})

		html+='</tbody></table>'
	html+='</div>'

	})

}else{
	html+='<h4>No hay semanas disponibles</h4>'
}

		return html
}


function modifica_crono(idcrono, idasignatura){
	//colores para el curriculum
	var c_unidad =["#FFD5D5","#FCE1C4","#B8F0D5","#CECEF6","#E6E6E6"]
    var comodin=0
    $('#idasig').val(idasignatura);
	traer_calendario_anual()
	cargar_cobertura_local(comodin)
	$('.breadcrumb').parent().hide('fast') ;
	$('.crono').hide('fast');
	$('.span2').hide('fast');
	var datos={idcrono:idcrono, idasignatura:idasignatura}
	var procesar = capsula({path:'curriculum/ajax/', case:31, datos:datos})

 	var json_proc = procesar.json
 	$.each(json_proc, function(){
 		fecha = this.fecha_dia
 		fecha_split= fecha.split("-")
 		dia_split = fecha_split[2].split(" ")

 		if(parseInt(fecha_split[1]) < 10 )
 		{
 			mes = "0"+fecha_split;
 		}
 		if(parseInt(dia_split[0]) < 10)
 		{
 			dia = "0"+dia_split[0];
 		}
 		var cadena = "'"+fecha_split[1]+"_"+dia_split[0]+"_"+this.posicion_dia+"_"+this.semana+"'"
 		var div=''
 		if(this.unidad > 5 || this.unidad ==null || this.unidad==0)
 		{
 			//Cuando el curriculum sea por eje
 			var colorear = $("#colorear_"+this.unidad).data('color')
 		}else{
 			//Cuando el curriculum sea por unidad
 			var colorear = c_unidad[this.unidad-1]
 		}
 		div+=' <li id="drag_'+this.idcurr+'" data-dia_unico='+this.dia_unico+' data-fecha_dia_unix='+this.fecha_dia+' data-id='+this.id+' data-idnivel='+this.idnivel+' data-asignatura ='+this.idasignatura+' data-semana='+this.semana+' data-idcurr="'+this.idcurr+'" data-resumen="'+this.resumen+'" style="background-color:'+colorear+'">'+this.resumen+''
 		div+=' <i class="icon-trash borrar_curri" onclick="borrar_curri('+this.idcurr+' , '+cadena+')"></i></li> '
 		$('#curr_crono_'+fecha_split[1]+'_'+dia_split[0]+'').append(div)


 	})
 	var cont='<button class="btn btn-success" onclick="volver_cronograma()"><i class="icon-white icon-arrow-left"></i> Volver</button>'
	$('.acciones_cronograma').html(cont)


}
function volver_cronograma()
{
	$('#mostrar_cronograma_mes').hide('fast');
	$('#mostrar_curriculum').hide('fast');
	$('#crono_asignaturas').hide();
	$('#mostrar_cronograma').show();
	$('#mostrar_curriculum').hide('fast');
	$('.span2').show();
	$('.span8').show();
	$("#mostrar_cronograma_edit").hide()
}

function ver_clase_crono(idclase,mes,sem,pos,niv,asig)
{
	$("#mes_update").val(mes)
	$("#sem_update").val(sem)
	$("#pos_update").val(pos)
	var datos = {
		idclase:idclase,
		mes:mes,
		semana:sem,
		posicion_dia:pos,
		idnivel:niv,
		idasignatura:asig,
        crono:$("#id_crono_update").val()
	}
	var json = capsula({path:'curriculum/ajax', case:23, datos:datos});
    var json_unidades = capsula({path:'curriculum/ajax', case: 40, datos:datos});
    var json_hab_tax = capsula({path:'curriculum/ajax', case:41, datos:datos});
    var json_actividad = capsula({path:'curriculum/ajax', case:42, idclase:idclase});
	
	
	var unidades = json_unidades.json;
	var lista_unidades;
    var habilidad = json_hab_tax.json;
	var hab_tax = '';
	var cont = 0;
	$.each(unidades, function(){
		if(cont==0){ lista_unidades='<strong>Unidad '+this.unidad+'</strong>'; cont++;}
		else{ lista_unidades+= '&nbsp;, <strong>Unidad '+this.unidad+'</strong>'; }
	})

    $.each(habilidad, function(){
		hab_tax+='&nbsp;'+this.descripcion;	
	})
    //var json = capsula({path:'clases/ajax', case:6, datos:datos})
	var obj = json.json

	var html='<ul class="nav nav-pills pull-right">'
	html+='<li><button class="btn" onclick="volver_vista_crono()"><i class="icon-arrow-left"></i> Volver</button></li>'
	if(window.location.host === "nucleo.kdoceduca.cl"){
		html+='<li class="dropdown">'
		html+='<a class="dropdown-toggle" id="drop4" role="button" data-toggle="dropdown" href="#">Opciones <b class="caret"></b></a>'
		html+='<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">'
		html+='<li role="presentation" class="option_clase" value="1" data-idclase="'+idclase+'" data-mes="'+mes+'" data-sem="'+sem+'" data-pos="'+pos+'" data-niv="'+niv+'" data-asig="'+asig+'"><a role="menuitem" tabindex="-1" href="#">Imprimir</a></li>'
		html+='<li role="presentation" class="option_clase" value="2" data-idclase="'+idclase+'" data-mes="'+mes+'" data-sem="'+sem+'" data-pos="'+pos+'" data-niv="'+niv+'" data-asig="'+asig+'"><a role="menuitem" tabindex="-1" href="#">Editar</a></li>'
		html+='</ul>'
		html+='</li>'
	}
	/*user = JSON.parse(usuario_actual())
	if(parseInt(user.idprefil) == 1)
	{
		html+='<li class="dropdown">'
		html+='<a class="dropdown-toggle" id="drop4" role="button" data-toggle="dropdown" href="#">Opciones <b class="caret"></b></a>'
		html+='<ul id="menu1" class="dropdown-menu" role="menu" aria-labelledby="drop4">'
		html+='<li role="presentation" class="option_clase" value="1" data-idclase="'+idclase+'" data-mes="'+mes+'" data-sem="'+sem+'" data-pos="'+pos+'" data-niv="'+niv+'" data-asig="'+asig+'"><a role="menuitem" tabindex="-1" href="#">Imprimir</a></li>'
		html+='<li role="presentation" class="option_clase" value="2" data-idclase="'+idclase+'" data-mes="'+mes+'" data-sem="'+sem+'" data-pos="'+pos+'" data-niv="'+niv+'" data-asig="'+asig+'"><a role="menuitem" tabindex="-1" href="#">Editar</a></li>'
		html+='<li role="presentation" class="option_clase" value="3" data-idclase="'+idclase+'" data-mes="'+mes+'" data-sem="'+sem+'" data-pos="'+pos+'" data-niv="'+niv+'" data-asig="'+asig+'"><a role="menuitem" tabindex="-1" href="#">Quitar del cronograma</a></li>'
		html+='</ul>'
		html+='</li>'
	}*/
	html+='</ul>';
	html+='<table class="table table-bordered">';
	html+='<tr>';
	html+='<td ><h2 class="titulos">'+obj.clase[0].nombre+'</h2></td>';
	html+='<td> '+obj.clase[0].nombrenivel+'<br /> '+obj.clase[0].nombreasig+'<br />'+lista_unidades+'<br/>';
	html+='<strong>Habilidades Taxonomicas&nbsp;:&nbsp;</strong>';
	if(hab_tax=='')
	{
		html+='No se ha ingresado<br />'
	}
	else
	{
		html+=hab_tax+'<br />'
	}

	//BUSCAR EN LAS ACTUALIZACIONES LA VALIDACIÓN
	$.each(obj.modificaciones,function mostrarValidacion(){
		if(mostrarValidacion.stop){ return; }
		if (this.tipo_operacion == 'validar'){
			var fecha = this.fecha.substr(0,10).split('-');
			fecha = fecha[2]+'/'+fecha[1]+'/'+fecha[0]; 
			html+='<b>Clase validada el día '+fecha+' por '+this.nombre+'</b>';
			mostrarValidacion.stop = true;
		}
	});

	html+='</td>';
	html+='</tr>';
	/*html+='<tr>'
	html+='<td>Nivel<br>Asignatura<br>Unidad<br></td>'
	html+='<td> '+obj.clase[0].nombrenivel+'<br> '+obj.clase[0].nombreasig+'<br> '+obj.clase[0].nombrenivel+'<br></td>'
	html+='</tr>'*/
	html+='<tr>'
	html+='<td><h4 class="titulos">Objetivo de la clase</h4><p>'+obj.clase[0].objetivo+'</p></td>'
	//======================
	var filtros = [/Salud/, /Artes/, /Cientifico/]
	//======================
	if((obj.clase[0].nombreasig).search(filtros[1]) > -1 || (obj.clase[0].nombreasig).search(filtros[0]) > -1 || (obj.clase[0].nombreasig).search(filtros[2]) > -1)
	{

	}

	if(niv < 13 && niv > 2)
	{
		if(((obj.clase[0].nombreasig).search(filtros[1]) > -1 || (obj.clase[0].nombreasig).search(filtros[0]) > -1 || (obj.clase[0].nombreasig).search(filtros[2]) > -1) && niv > 10)
		{
			html+='<td><ul>'
		}else
		{
			html+='<td><h4 class="titulos">Indicadores de Evaluación</h4><ul>'
		}

	}else if(niv > 2)
	{
		if(((obj.clase[0].nombreasig).search(filtros[1]) > -1 || (obj.clase[0].nombreasig).search(filtros[0]) > -1 || (obj.clase[0].nombreasig).search(filtros[2]) > -1) && niv > 10)
		{
			html+='<td><ul>'
		}else
		{
			html+='<td><h4 class="titulos">Objetivos Fundamentales Verticales</h4><ul>'
		}

	}else
	{
		if(((obj.clase[0].nombreasig).search(filtros[1]) > -1 || (obj.clase[0].nombreasig).search(filtros[0]) > -1 || (obj.clase[0].nombreasig).search(filtros[2]) > -1) && niv > 10)
		{
			html+='<td><ul>'
		}else
		{
			html+='<td><h4 class="titulos">Ejemplos de Desempeño</h4><ul>'
		}
	}
	$.each(obj.indi,function(){
			html+='<li>'+this.indicador+'</li>'
	})
	if(obj.indi.length < 1  )
	{
		if(((obj.clase[0].nombreasig).search(filtros[1]) > -1 || (obj.clase[0].nombreasig).search(filtros[0]) > -1 || (obj.clase[0].nombreasig).search(filtros[2]) > -1) && niv > 10)
		{
			html+='<li>Para este programa de estudio <b>no se encuentran indicadores disponibles</b> segun MINEDUC.</li>'
		}else
		{

		}

	}else
	{

	}
	html+='</ul>'
	html+='</td>'
	html+='</tr>'
	html+='<tr>'
	html+='<td  style="width:50%"><h4 class="titulos">Etapas de la clase</h4>'
	html+='<div class="accordion justify" id="accordion2">'
		html+='<div class="accordion-group">'
		html+='<div class="accordion-heading">'
		html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseInicio">Inicio</a>'
		html+='</div>'
		html+='<div id="collapseInicio" class="accordion-body collapse in">'
		html+='<div class="accordion-inner">'+obj.clase[0].inicio+'</div>'
		html+='</div>'
		html+='</div>'
		html+='<div class="accordion-group">'
		html+='<div class="accordion-heading">'
		html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseDesarrollo">Desarrollo</a>'
		html+='</div>'
		html+='<div id="collapseDesarrollo" class="accordion-body collapse">'
		html+='<div class="accordion-inner">'+obj.clase[0].desarrollo+'</div>'
		html+='</div>'
		html+='</div>'
		html+=' <div class="accordion-group">'
		html+='<div class="accordion-heading">'
		html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseCierre">Cierre</a>'
		html+='</div>'
		html+='<div id="collapseCierre" class="accordion-body collapse">'
		html+='<div class="accordion-inner">'+obj.clase[0].cierre+'</div>'
		html+='</div>'
		html+='</div>'
		html+=' <div class="accordion-group">'
		html+='<div class="accordion-heading">'
		html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseEvaluacion">Evaluación</a>'
		html+='</div>'
		html+='<div id="collapseEvaluacion" class="accordion-body collapse">'
		html+='<div class="accordion-inner">'+obj.clase[0].evaluacion+'</div>'
		html+='</div>'
		html+='</div>'
		html+='</div>'
	html+='</div>'
	html+='</td>'
	html+='<td><h4 class="titulos">Curriculum</h4>'
	html+='<div class="accordion" id="accordion3">'//1
	var count = 1
	$.each(obj.curri, function(){
		if(count == 1){var active='in'}else{var active=''}
		if((this.detalle).length > 0)
		{
			html+='<div class="accordion-group">'//2
			html+='<div class="accordion-heading">'//3
			html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion3" href="#collapse'+this.resumen+'">'+this.nombre+'</a>'
			html+='</div>'//3
			html+='<div id="collapse'+this.resumen+'" class="accordion-body collapse '+active+'">'//4
			html+='<div class="accordion-inner">'//5
			html+='<table class="table table-bordered">'//6

				$.each(this.detalle,function(){
					var concat=this.valor.resumen+''+this.valor.orden
					html+='<tr>'
					html+='<td><b>'+concat+'</b></td>'
					//html+='<td><b>'+this.valor.resumen+'</b></td>'
					html+='<td>'+this.valor.descripcion+'</td>'
					html+='<tr>'
				})

			html+='</table>'
			html+='</div>'//cierrra 6
			html+='</div>'//cierrra 5
			html+='</div>'//cierrra 4
		}
		count++
	})
	//////////////////////////////////////////////////////////////
	html+='</div>'//cierrra 2
	html+='</div>'//1
	if((obj.oft).length>0)
	{
		html+='<div class="accordion" id="accordion4">'
		html+='<div class="accordion-group">'
		html+='<div class="accordion-heading">'
		html+='<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion4" href="#collapse'+this.idtipo+'">Objetivos Fundamentales Transversales</a>'
		html+='</div>'//3
		html+='<div id="collapse'+this.idtipo+'" class="accordion-body collapse">'//4
		html+='<div class="accordion-inner">'//5
		html+='<table class="table table-bordered">'//6
		$.each(obj.oft, function(){
			html+='<tr>'
					html+='<td><b>OFT'+this.orden+'</b></td>'
					html+='<td>'+this.descripcion+'</td>'
					html+='<tr>'
		})
		html+='</table>'
		html+='</div>'
		html+='</div>'
		html+='</div>'
		html+='</div>'//cierrra 2
		html+='</div>'//1
	}
	html+='</td>'
	html+='</tr>'
	html+='<tr>'
	html+='<td><h4 class="titulos">Recursos</h4>'+obj.clase[0].recursos;
	if (obj.clase[0].idEvaluacion != 0){
		if( typeof obj.evaluacion != "undefined" && obj.evaluacion.length > 0 )
			html+='<br /><h4 class="titulos">Evaluación</h4><a href="#" onclick="acciones_pruebas({datos:{id:'+obj.evaluacion[0].id+',nombre:'+"'"+obj.evaluacion[0].nombre+"'"+',total_pruebas:30},tipo:2}); return false;">'+obj.evaluacion[0].nombre+'</a>';
	}
	html+='</td>';
	html+='<td><h4 class="titulos">Anexos</h4>'
	html+='<ul>'
	$.each(obj.anexos, function(){
		html+='<li><span><i class="icon-file"></i></span><a href="'+server+'storage/material/'+this.archivo+'" target="_blank">  '+this.nombre+'</a></li>'
	})
	html+='</ul>'
	//actividades
	html+='</br>'
	html+='<h4 class="titulos">Actividades</h4>'
	html+='<ul>'
	$.each(json_actividad.json, function(){
		
		html+='<li><a onClick=" ver_actividad('+this.id+'); " style="cursor: pointer">  '+this.nombre+'</a></li>'
	})
	html+='</ul>'
	//fin actividades
	html+='</td>'
	html+='</tr>'
	html+='</table>'
	$("#mostrar_clases").html(html)
	$("#edit_clases").fadeOut()
	$("#mostrar_cronograma").fadeOut(400, function(){
		$("#mostrar_clases").fadeIn(400)
	})
}
function ver_actividad(idactividad)
{
	var actividad  = capsula({path: 'curriculum/ajax', case: 43, idactividad: idactividad})
	var datos = JSON.parse(actividad.fuente)

	var html = '<h2>Vista Previa</h2>'
	html+='<ul class="selecciones"><div><strong>Nombre&nbsp;:</strong></div></ul>'	
	html+='<p>'+datos["actividad"][0].nombre+'</p>'	

	html+='<ul class="selecciones"><div><strong>Tipo&nbsp;:</strong></div></ul>'	
	html+='<p>'+datos["actividad"][0].tipo+'</p>'	

	//<label ><i class="icon-plus-sign"></i></label>

	html+='<ul class="selecciones"><div><strong><!--<button class="btn btn-mini btn-info" onclick="manejar_vista_actividad(\'instruccion_general_'+idactividad+'\')"><i class="icon-white icon-plus-sign"></i></button>&nbsp;-->Instrucci&oacute;n General&nbsp;:</strong></div></ul>' 
	html+='<div style="display:inline;" id="instruccion_general_'+idactividad+'">'+datos["actividad"][0].instruccion_general+'</div><br />'	

	html+='<ul class="selecciones"><div><strong><!--<button class="btn btn-mini btn-info" onclick="manejar_vista_actividad(\'instruccion_especifica_'+idactividad+'\')"><i class="icon-white icon-plus-sign"></i></button>&nbsp;-->Instrucci&oacute;n Espec&iacute;fica&nbsp;:</strong></div></ul>'	
	html+='<div style="display:inline;" id="instruccion_especifica_'+idactividad+'">'+datos["actividad"][0].instruccion_especifica+'</div><br />'	

	var x;

	//productos
	html+='<ul id="productos_lab"><div><strong>Productos Seleccionados&nbsp;:</strong></div>'
	for(x=0;x<datos["productos"].length;x++)
	{
		html+='<li><img src="'+server+'img/lab/'+datos["productos"][x].path+'/'+datos["productos"][x].imagen+'" title="'+datos["productos"][x].nombre+'" width="178"/>'+datos["productos"][x].nombre+'</li>&nbsp;<strong>Cantidad&nbsp;:&nbsp;</strong>'+datos["productos"][x].cantidad+'<br/>'
	}
	html+='</ul>'

	//objetivos
	html+='<ul class="selecciones"><div><strong>Objetivos&nbsp;:</strong></div>'
	for(x=0;x<datos["objetivos"].length;x++)
	{
		html+='<li class="objetivos" id="'+datos["objetivos"][x].id+'"><span class="badge">OA'+datos["objetivos"][x].orden+'</span> '+datos["objetivos"][x].descripcion+'</li>'
	}
	html+='</ul>'

	//indicadores
	html+='<ul class="selecciones"><div><strong>Indicadores&nbsp;:</strong></div>'
	for(x=0;x<datos["indicadores"].length;x++)
	{
		html+='<li class="indicadores" id="'+datos["indicadores"][x].id+'"><span class="badge">U'+datos["indicadores"][x].idunidad+'</span> '+datos["indicadores"][x].indicador+'</li>'
	}
	html+='</ul>'

	//fundamentales
	html+='<ul class="selecciones"><div><strong>Fundamentales&nbsp;:</strong></div>'
	for(x=0;x<datos["fundamentales"].length;x++)
	{
		html+='<li class="fundamentales" id="'+datos["fundamentales"][x].id+'"><span class="badge">OT'+datos["fundamentales"][x].orden+'</span> '+datos["fundamentales"][x].descripcion+'</li>'
	}
	html+='</ul>'

	bootbox.alert(html)
}
function cargar_cobertura_local(comodin)
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

    if(parseInt($('#idniv').val()) < 3 && comodin==1)
    {
    	asignatura=$("#cod_asig").val()
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
    var html = tmp_cobertura_local(data, datos.nivel)
    $("#mostrar_curriculum").show()
    $("#mostrar_cronograma_mes").show()
    $("#mostrar_curriculum").html(html)

   }
function tmp_cobertura_local(obj, nivel){
	var html=''
	if(parseInt(nivel) < 3)
	{
		var asig_json = capsula({path:'curriculum/ajax', case:8, nivel:nivel})
		html+='<select id="cod_asig" onchange=cargar_cobertura_local(1)>'
        html+='<option value="0">--</option>'
		$.each(asig_json.json, function(){
			html+='<option value="'+this.id+'">'+this.nombre+'</option>'
		})
		html+='</select>'
	}
    html += '<ul id="myTab" class="nav nav-tabs">'
    var contenido = new Array
    var count=1
    //Constante definida para poner 'active' el primer elemento (OA,AE,CMO)
    var CONSTANTE=0
    $.each(obj, function(){
        var resumen = this.tipo.resumen
        var clave = parseInt(this.tipo.id)
        var total = parseInt(this.detalle.length)

        if(total > 0)
        {
        	if(CONSTANTE != 0){}else{CONSTANTE=count}

            if(CONSTANTE == count){var accion='active';}else{var accion = ''}
            html+='<li class="'+accion+'"><a href="#seccion_'+resumen+'_'+clave+'" data-toggle="tab">'+this.tipo.nombre+'</a></li>'
            //contenido de la cobertura
            contenido.push(tmp_cobertura_curriculum_local(this.detalle, resumen, clave, accion, nivel, this.valor, this.count))
                                                                    //OA   //1   //active  //9
        }
        count++
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

function tmp_cobertura_curriculum_local(obj, resumen, clave, accion, nivel, valor,countador){
	var c_unidad =["#FFD5D5","#FCE1C4","#B8F0D5","#CECEF6","#E6E6E6"]
	if($.isEmptyObject(obj))
	{
		var html=''
		return html
	}else
	{
		var html ='<div class="tab-pane fade in '+accion+'" id="seccion_'+resumen+'_'+clave+'">'
		//Pestañas laterales derecha
        html+= '<div class="tabbable tabs-right"><ul id="myTab1" class="nav nav-tabs tab-interior">'
	    var count=0
	    $.each(obj, function(){

	        if(parseInt(this.valor) === 1)
	        {
	        	var accion='active'
	        }else{
	        	//this.valor contiene el nombre del eje a diferencia de la unidad que es un numero
	        	//comparo el tipo de variable para diferenciarlo
	        	if(typeof(this.valor) == 'string')
        		{
        			if(count == 0)
        			{
        				var accion='active'
        			}else
        			{
        				var accion=''
        			}
        		}else{
	        		var accion = ''
        		}
	        }
	        //7mo y 8vo trabajan por ejes a diferencia de los demas niveles, se procede a comparar por nivel
	        if(parseInt(nivel)>2 && parseInt(nivel) <=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
	            html+='<li class="'+accion+'"><a href="#unidad_'+resumen+'_'+this.valor+'" data-toggle="tab" style="background-color:'+c_unidad[count]+'">Unidad '+this.valor+'</a></li>'//class="'+accion+'"
	        }else{
	            html+='<li class="'+accion+'" id="colorear_'+this.ideje+'" data-color="'+c_unidad[count]+'"><a href="#eje_'+resumen+'_'+count+'" data-toggle="tab" style="background-color:'+c_unidad[count]+'">Eje '+this.valor.replace(/[_]/g, ' ')+'</a></li>' //class="'+accion+'"
	        }
	        count++
	    })
	        html+= '</ul>'
	        html+='<div id="myTab1Content" class="tab-content">'
	    count=0
	    count2=0
	    var contador_color=0
	    //Contenido de cada pestaña
	    $.each(obj, function(){


	        if(parseInt(this.valor) === 1)
	        {
	        	var active_e='active';

	        }else{
	        	//this.valor contiene el nombre del eje a diferencia de la unidad que es un numero
	        	//comparo el tipo de variable para diferenciarlo
	        	if(typeof(this.valor) == 'string')
        		{
        			if(count2 == 0)
        			{
        				//Solo va a activar la primera pestaña del curriculum
        				var active_e='active'
        			}else
        			{
        				var active_e=''
        			}
        		}else{
	        		var active_e = ''
        		}
	        }
	        //7mo y 8vo trabajan por ejes a diferencia de los demas niveles, se procede a comparar por nivel
	        if(parseInt(nivel)>2 && parseInt(nivel)<=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
	            html+='<div class="tab-pane fade in scroll_curriculum '+active_e+'" id="unidad_'+resumen+'_'+this.valor+'">'//'+accion+'
	            html+=tmp_cobertura_unidad_local(this.curr, resumen, this.valor, this.titulo,nivel, this,contador_color)
	            contador_color++

	        }else{
	            html+='<div class="tab-pane fade in scroll_curriculum '+active_e+'" id="eje_'+resumen+'_'+count2+'">'//'+accion+'
	            html+=tmp_cobertura_unidad_local(this.curr, resumen, this.valor, this.titulo ,nivel, this,contador_color)
	            contador_color++
	        }


	        html+='</div>'
	        count2++
	    })
	    count2=0
	    html+='</div></div></div>'

	    return html
	}

}
function tmp_cobertura_unidad_local(obj, resumen, unidad,titulo, nivel, eje,color){
	var c_unidad =["#FFD5D5","#FCE1C4","#B8F0D5","#CECEF6","#E6E6E6"]
    var html ='<ul class="curriculum_listado">'

    if(parseInt(nivel)>2 && parseInt(nivel) <=8 || parseInt(nivel)>10 && parseInt(nivel) <=14){
        html+='<h3>Unidad '+unidad+'</h3>'
    }else{
        html+='<h3>Eje: '+titulo.replace(/[_]/g, ' ')+'</h3>'
		var unidad=eje.ideje
    }
    $.each(obj, function(){
            html+='<li data-color="'+color+'"id="curr_'+this.id+'_'+unidad+'" data-unidad="'+unidad+'" data-id="'+this.id+'" data-resumen="'+resumen+''+this.orden+'" class="mover_curriculum" draggable="true" ondragstart="drag(event)" title="Arrastrame"><span class="titulo_curr" style="background-color:'+c_unidad[color]+'"><i class="icon-move" title="Debes arrastrarme a un día de la semana"></i> '+resumen+''+this.orden+'</span>'
            html+='<div class="texto_curriculum">'+this.descripcion+'</div>'

            html+='</li>'

        })
    html+='</ul>'
    return html
}

function volver_vista_crono()
{
	$("#mostrar_cronograma_edit").hide()
	$("#mostrar_clases").fadeOut(400, function(){
		$("#mostrar_cronograma").fadeIn(400)
	})
}
function volver_view_clase()
{
	$("#edit_clases").fadeOut(400, function(){
		$("#mostrar_clases").fadeIn(400)
	})
}
function menu_option_plani(op, clase, mes, sem, pos, niv, asig)
{
	switch(parseInt(op))
	{
		case 1://Print
			window.open(server+'curriculum/imprimir_clase/'+clase+'/'+mes+'/'+sem+'/'+pos+'/'+niv+'/'+asig+'/'+$("#id_crono_update").val())
			//window.open(server+'curriculum/imprimir_clase/'+clase+'/'+mes+'/'+sem+'/'+pos+'/'+niv+'/'+asig+'/')
		break;
		case 2://Edit
			edit_plani(clase, mes, sem, pos, niv, asig)
		break;
		case 3://Delete
		break;
	}
}
function edit_plani(clase, mes, sem, pos, niv, asig)
{
	$("#idclase_update").val(clase)
	var datos ={
		clase:clase,
		mes:mes,
		semana:sem,
		dia_unico:pos,
		nivel:niv,
		asignatura:asig,
		crono: $("#id_crono_update").val()
		//asignatura:asig
	}
	var json_clase = capsula({path:'curriculum/ajax', case:20, datos:datos})
	var json_curri = capsula({path:'curriculum/ajax', case:21, datos:datos})
	var json_mate = capsula({path:'curriculum/ajax', case:22, datos:datos})
    
    var habilidad = json_clase.json.habilidad
	var json_habilidades = capsula({path:'curriculum/ajax', case:38, datos:{}})
	var habilidades = ''
	
	$.each(json_habilidades.json, function()
	{
		if(habilidad==this.id)
		{
			habilidades+='<option value="'+this.id+'" selected>'+this.descripcion+'</option> \n'
		}
		else
		{
			habilidades+='<option value="'+this.id+'">'+this.descripcion+'</option> \n'
		}
	})

	var html='<div id="list_errors"></div>'
		html+='<div id="buttons_action">'
		html+='<ul class="nav nav-pills pull-right">'
		html+='<li><button class="btn" onclick="volver_view_clase()"><i class="icon-arrow-left"></i> Volver</button><button class="btn btn-success" onclick="guardar_edit_clase()"><i class="icon-white icon-ok"></i> Guardar cambios</button></li>'
		html+='</ul>'
		html+='</div>'
		html+='<div class="edicion_clase_crono">'
		html+='<ul id="edicion_clase_Tab" class="nav nav-tabs">'
		html+='<li class="active"><a href="#descripcion" data-toggle="tab">Descripcion de la clase</a></li>'
		html+='<li class=""><a href="#curriculum" data-toggle="tab">Curriculum</a></li>'
		html+='<li class=""><a href="#material" data-toggle="tab">Material adjunto</a></li>'
		html+='</ul>'
		html+='<div id="myTabContent" class="tab-content">'
		html+='<div class="tab-pane fade active in" id="descripcion">'
		html+='<table>'
		html+='<tr>'
		html+='<td><p><span class="badge badge-warning">1</span> <b>Nombre de la clase</b></p> <input type="text" id="nomclase_edit" value="'+json_clase.json.nombre+'"></td>'
		html+='<td><p><span class="badge badge-warning">2</span> <b>Palabras clave </b></p><input type="text" id="claveclase_edit" value="'+json_clase.json.claves+'"></td>'
		html+='</tr>'
		html+='<tr>'
		html+='<td colspan="2">'+editor_texto("objetivo_clase",json_clase.json.objetivo, 100,3,"Objetivo de la clase")+'</td>'
		html+='</tr>'
		html+='<tr>'
		html+='<td>'+editor_texto("inicio_clase",json_clase.json.inicio, 100,4,"Inicio de la clase")+'</td>'
		html+='<td>'+editor_texto("desarrollo_clase",json_clase.json.desarrollo, 100,5,"Desarrollo de la clase")+'</td>'
		html+='</tr>'
		html+='<tr>'
		html+='<td>'+editor_texto("cierre_clase",json_clase.json.cierre, 200,6,"Cierre de la clase")+'</td>'
		html+='<td>'+editor_texto("evaluacion_clase",json_clase.json.evaluacion, 100,7,"Evaluación de la clase")+'</td>'
		html+='</tr>'
		html+='<tr>'
		html+='<td colspan="2">'+editor_texto("recurso_clase",json_clase.json.recursos, 100,8,"Recursos de la clase")+'</td>'
		html+='</tr>'
		html+='</table>'
		html+='</div>'
		html+='<div class="tab-pane fade" id="curriculum">'
		html+='<h4>Curriculum asociado a la clase</h4>'
		html+='<table class="table table-bordered">'
		$.each(json_curri.json, function(){
			html+='<tr>'
			html+='<td><p><b>'+this.curr.resumen+'</b></p></td>'
			html+='<td><p>'+this.curr.descripcion+'<input type="checkbox" name="objetivo[]" value="'+this.curr.idcurr+'" style="display:none" checked="checked"></p></td>'
			html+='<tr>'
		})
		html+='</table>'
		if(niv < 13 && niv > 2)
		{
			html+='<h4 class="titulos">Indicadores de Evaluación</h4>'
		}else if(niv > 2)
		{
			html+='<h4 class="titulos">Objetivos Fundamentales Verticales</h4>'
		}else
		{
			html+='<h4 class="titulos">Ejemplos de desempeño</h4>'
		}
		html+='<table class="table table-bordered table-condensed">'
		$.each(json_curri.json, function(){
			$.each(this.indicadores,function(){
				html+='<tr>'
				html+='<td><p><input type="checkbox" id="indicador_'+this.id+'" name="indicador[]" class="indicadores" value="'+this.id+'"></p></td>'
				html+='<td><p><b>Unidad'+this.idunidad+'</b></p></td>'
				html+='<td><p>'+this.indicador+'</p></td>'
				html+='<tr>'
			})
		})
		html+='</table>'
		html+='</table>'
		html+="<h4>OFT's</h4>"
		html+='<table class="table table-bordered table-condensed">'
		$.each(json_curri.json, function(){
			$.each(this.ofts,function(){
				if(parseInt(this.idnivel)>10)
				{
					html+='<tr>'
					html+='<td><p><input type="checkbox" id="oft_'+this.id+'" name="ofts[]" class="indicadores" value="'+this.id+'"></p></td>'
					html+='<td><p><b>OFT</b></p></td>'
					html+='<td><p>'+this.descripcion+'</p></td>'
					html+='<tr>'
				}
				else
				{
					$.each(this.detalle,function(){
						html+='<tr>'
						html+='<td><p><input type="checkbox" id="oft_'+this.id+'" name="ofts[]" class="indicadores" value="'+this.id+'"></p></td>'
						html+='<td><p><b>Unidad'+this.idunidad+'</b></p></td>'
						html+='<td><p>'+this.descripcion+'</p></td>'
						html+='<tr>'
					})
				}
			})
		})
		html+='</table>'
		html+='</div>'
		html+='<div class="tab-pane fade" id="material">'
		html+='<div class="span7">'
		html+='<table class="table table-bordered" id="tabla_anexos">'
		html+='<div id="anexos_msj"></div>'
		html+='<h4>Lista de anexos</h4>'
		html+='<thead>'
		html+='<tr>'
		html+='<th>Nombre del archivo</th>'
		html+='<th>Descargar</th>'
		html+='<th>Eliminar</th>'
		html+='</tr>'
		html+='</thead>'
		$.each(json_curri.json[0].anexos, function(){
			html+='<tr id="tr_anx_'+this.id+'">'
			html+='<td>'+this.nombre+'</td>'
			html+='<td><a href="'+server+'storage/material/'+this.archivo+'" class="btn btn-success"><i class="icon-white icon-download-alt"></i></td>'
			html+='<td><button class="btn btn-warning" onclick="borrar_anexo('+this.id+')"><i class="icon-white icon-trash"></i></button></td>'
			html+='</tr>'
		})
		html+='</table>'
		html+='</div>'
		html+='<div class="span3">'//formulario
			html+='<form action="'+server+'curriculum/subir_anexos" method="post" target="upload_file" enctype="multipart/form-data">'
			//html+='<form action="'+server+'clases/subir_anexos" method="post" target="upload_file" enctype="multipart/form-data">'
				html+='<table class="table">'
					html+='<tr>'
						html+='<td>'
							html+='<input type="file" name="file_to_upload" id="fileupload">'
							html+='<input type="hidden" id="idclase" value="">'
						html+='</td>'
					html+='</tr>'
					html+='<tr>'
						html+='<td>'
							html+='<button class="btn" type="submit"><i class="icon-upload"></i>Subir anexo</button>'
						html+='</td>'
					html+='</tr>'
				html+='</table>'
				html+='<iframe name="upload_file" id="upload_file" style="display:none"></iframe>'
			html+='</form>'
		html+='</div>'
		html+=''
		html+=''
		html+=''
		html+=''
		html+='</div>'
		html+='</div>'
	$("#edit_clases").html(html)
	$("#mostrar_clases").fadeOut(400, function(){
		$("#edit_clases").fadeIn(400)
	})
}
function print_plani()
{

}
function editor_texto(nombre, texto, altura, indice, titulo)
{
	var html=''
	html+='<p><span class="badge badge-warning">'+indice+'</span> <b>'+titulo+'</b><br>'
	html+='<textarea name="" id="'+nombre+'" style="width: 90%; display: none;" rows="5">'+texto+'</textarea>'
	html+='<script type="text/javascript">'
	html+="$('#"+nombre+"').redactor({"
	html+=' imageUpload: server + "scripts/image_upload.php",'
	html+='minHeight: '+altura+','
	html+='imageUploadCallback: function(image, json) {'
	html+='}'
	html+='});'
	html+='</script>'
	html+='</p>'
	return html
}
function guardar_edit_clase()
{
	var errors = []
	if($("#nomclase_edit").val().length <1)
	{
		errors.push("Indique un <b>nombre</b> para la clase")
	}
	if($("#objetivo_clase").val().length <1)
	{
		errors.push("Indique un <b>objetivo</b> para la clase")
	}
	if($("#inicio_clase").val().length <1)
	{
		errors.push("Indique un <b>inicio</b> para la clase")
	}
	if($("#desarrollo_clase").val().length <1)
	{
		errors.push("Indique un <b>desarrollo</b> para la clase")
	}
	if($("#cierre_clase").val().length <1)
	{
		errors.push("Indique un <b>cierre</b> para la clase")
	}
	if($("#evaluacion_clase").val().length <1)
	{
		errors.push("Indique un <b>evaluacion</b> para la clase")
	}
	/*if($("[name='indicador[]']").is(':checked') == false)
	{
		errors.push("Seleccione un <b>indicador</b> como minimo para la clase")
	}
	if($("[name='ofts[]']").is(':checked') == false)
	{
		errors.push("Seleccione al menos un <b>Objetivo fundamental transversal</b> para la clase")
	}*/
	var msj=''
	if(errors.length > 0)
	{
		$.each(errors, function(){
			msj+='<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><span>'+this+'</span><p></p></div>'
		})
		$("#list_errors").html(msj)
	}else
	{
		var indicadores = new Array
		var ofts = new Array
		var material = new Array
		var indicador = $("input[name='indicador[]']:checked")
		var oft = $("input[name='ofts[]']:checked")
		var anexo = $("#anexos_files span")
			var array_anexo = []
			if(anexo != null)
			{
				$.each(anexo, function(){
					array_anexo.push($(this).text())
				})
			}

		$.each(indicador, function() {
			indicadores.push(this.value)
		});
		$.each(oft, function() {
			ofts.push(this.value)
		});
		var datos = {
			clase:$("#idclase_update").val(),
			nombre:$("#nomclase_edit").val(),
			claves:$("#claveclase_edit").val(),
			inicio:$("#inicio_clase").val(),
			desarrollo:$("#desarrollo_clase").val(),
			cierre:$("#cierre_clase").val(),
			evaluacion:$("#evaluacion_clase").val(),
			recursos:$("#recurso_clase").val(),
			objetivo:$("#objetivo_clase").val(),
			path:'clases/ajax/',
			anexos:array_anexo,
			case:2,
			indicadores:indicadores,
			ofts: ofts,
			nivel:$("#idniv").val(),
			asignatura:$("#idasig").val()
		}
		datos = JSON.stringify(datos)

		if($("[name='file_to_upload']").val().length <=0)
		{
			var procesar = capsula({datos:datos, path:'curriculum/ajax/', case:26})
			//var procesar = capsula({datos:datos, path:'clases/ajax/', case:2})
			if(procesar.json)
			{
				ver_clase_crono($("#idclase_update").val(),$("#mes_update").val(),$("#sem_update").val(),$("#pos_update").val(),$("#idniv").val(),$("#idasig").val() )
				var div='<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button><span>Se han <b>guardado</b> los cambios!</span><p></p></div>'
			    $("#list_errors").html(div)
                $("#anexos_files").html('')
			    var e = null
				var tot = 1
			    crono_listar($("#idasig").val(),e,tot, $("#idcreador_update").val(),$("#mes_update").val())
			}else
			{
				var div='<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><span><b>No se han podido guardar</b> los cambios!</span><p></p></div>'
			    $("#list_errors").html(div)
			}
		}else
		{
			bootbox.confirm("<h3>Atención</h3>Ha cargado un anexo, pero aun no se ha subido, si desea continuar presione <b>Aceptar</b>, de lo contrario presione <b>Cancelar</b> y suba el anexo realizando <b>'click'</b> sobre el boton <b>'Subir anexo'</b> en la pestaña <b>Material adjunto</b>.",function(confirm){
				if(confirm)
				{
					var procesar = capsula({datos:datos, path:'clases/ajax/', case:2})
					if(procesar.json)
					{
						ver_clase_crono($("#idclase_update").val(),$("#mes_update").val(),$("#sem_update").val(),$("#pos_update").val(),$("#idniv").val(),$("#idasig").val() )
						var div='<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button><span>Se han <b>guardado</b> los cambios!</span><p></p></div>'
					    $("#list_errors").html(div)
                        $("#anexos_files").html('')
					}else
					{
						var div='<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><span><b>No se han podido guardar</b> los cambios!</span><p></p></div>'
					    $("#list_errors").html(div)
					}
				}else
				{

				}
			})
		}
	}

}
function borrar_anexo(anexo)
{

	var procesar = capsula({datos: anexo, path:'curriculum/ajax', case:27})
	if(procesar.json.estado)
	{
		var div='<div class="alert alert-success"><button type="button" class="close" data-dismiss="alert">×</button><span>'+procesar.json.mensaje+'</span><p></p></div>'
		$("#tr_anx_"+anexo+"").fadeOut(1500)
        $("#anexos_msj").html(div)
        ver_clase_crono($("#idclase_update").val(),$("#mes_update").val(),$("#sem_update").val(),$("#pos_update").val(),$("#idniv").val(),$("#idasig").val() )
        $("#edit_clases").fadeIn()
        $("#mostrar_clases").hide();
    }else
    {
    	var div='<div class="alert alert-warning"><button type="button" class="close" data-dismiss="alert">×</button><span>'+procesar.json.mensaje+'</span><p></p></div>'
    	$("#anexos_msj").html(div)
    }
}
function borrar_curri(clave, dia){

    var url = window.location.href

    if(url.search('crear_cronograma()') >= 0)
    {
    	var datos = dia.split('_');

        $("#curr_crono_"+datos[0]+"_"+datos[1]+" #drag_"+clave).remove()
    }
    else
    {
    var datos = dia.split('_');
    var dia_unico = parseInt(datos[1]);
    var mes = parseInt(datos[0]);
    var posicion_del_dia = parseInt(datos[2]);
    var seman = parseInt(datos[3]);
    var claves = [clave,dia_unico,mes,posicion_del_dia, seman, $("#id_crono_update").val()]
    var procesar = capsula({path:'curriculum/ajax/', case:32, datos:claves})
    var json_proc = procesar.json
        if(json_proc.estado == true){

        	$("#curr_crono_"+datos[0]+"_"+datos[1]+" #drag_"+clave).remove();
        	crono_listar($("#idasig").val(),null,1,$("#idcreador_update").val(),mes,$("#id_crono_update").val())
       	}else
       	{

       	}
    }
}
 function traer_calendario_anual()
{
    var datos = {path:'curriculum/ajax/', case:9}
    var proceso = capsula(datos)
        proceso = proceso.json
    var html = render_calendario_primer_semestre_local(proceso)
        $("#mostrar_cronograma_mes").html(html)
        var month = new Date()
        month = month.getMonth()+1
        $(".m"+month).addClass('active')
        var nom_mes=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
        $("#seccion_"+nom_mes[month-1]).addClass('active in')
    //return proceso
}

function render_calendario_primer_semestre_local(obj)
{
	var html='<div style="display:none" id="msj_change"></div>'
		html+='<label>Nombre </label><input type="text" id="nomb_crono">&nbsp;<button style="vertical-align:top" class="btn btn-warning" onclick="change_name_crono('+$("#id_crono_update").val()+')">Cambiar</button>'
    	html+= '<ul id="cronograma" class="nav nav-tabs">'
        html+='<li class="m2"><a href="#seccion_febrero" data-toggle="tab" style="background-color: aliceblue;">FEB</a></li>'
        html+='<li class="m3"><a href="#seccion_marzo" data-toggle="tab" style="background-color: aliceblue;">MAR</a></li>'
        html+='<li class="m4"><a href="#seccion_abril" data-toggle="tab" style="background-color: aliceblue;">ABR</a></li>'
        html+='<li class="m5"><a href="#seccion_mayo" data-toggle="tab" style="background-color: aliceblue;">MAY</a></li>'
        html+='<li class="m6"><a href="#seccion_junio" data-toggle="tab" style="background-color: aliceblue;">JUN</a></li>'
        html+='<li class="m7"><a href="#seccion_julio" data-toggle="tab" style="background-color: rgba(127, 240, 255, 0.38)">JUL</a></li>'
        html+='<li class="m8"><a href="#seccion_agosto" data-toggle="tab" style="background-color: honeydew">AGO</a></li>'
        html+='<li class="m9"><a href="#seccion_septiembre" data-toggle="tab" style="background-color: honeydew">SEP</a></li>'
        html+='<li class="m10"><a href="#seccion_octubre" data-toggle="tab" style="background-color: honeydew">OCT</a></li>'
        html+='<li class="m11"><a href="#seccion_noviembre" data-toggle="tab" style="background-color: honeydew">NOV</a></li>'
        html+='<li class="m12"><a href="#seccion_diciembre" data-toggle="tab" style="background-color: honeydew">DIC</a></li>'
        var url = window.location.href
        if(url.search("crear_cronograma") >= 0)
        {
            var function_btn='guardar_cronograma()'
        }else
        {
            var function_btn='actualizar_cronograma()'
        }
        html+='<div class="acciones_cronograma"><button class="btn btn-success" onclick="'+function_btn+'"><i class="icon-time icon-white"></i> Guardar</button></div>'
        html+= '</ul>'

    html+= '<div id="myTabContent" class="tab-content">'
    //render meses
        html+=tmp_meses_cronograma_local('febrero', obj.febrero)
        html+=tmp_meses_cronograma_local('marzo', obj.marzo)
        html+=tmp_meses_cronograma_local('abril', obj.abril)
        html+=tmp_meses_cronograma_local('mayo', obj.mayo)
        html+=tmp_meses_cronograma_local('junio', obj.junio)
        html+=tmp_meses_cronograma_local('julio', obj.julio)
        html+=tmp_meses_cronograma_local('agosto', obj.agosto)
        html+=tmp_meses_cronograma_local('septiembre', obj.septiembre)
        html+=tmp_meses_cronograma_local('octubre', obj.octubre)
        html+=tmp_meses_cronograma_local('noviembre', obj.noviembre)
        html+=tmp_meses_cronograma_local('diciembre', obj.diciembre)


    html+='</div>'

    return html
}

function tmp_meses_cronograma_local(mes, obj){


    var html='<div class="tab-pane fade" id="seccion_'+mes+'">'
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
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="1" '+color+'><span class="dia_cronograma lunes">Lun</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===2){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="2" '+color+'><span class="dia_cronograma martes">Mar</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===3){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="3" '+color+'><span class="dia_cronograma miercoles">Mie</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===4){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="4" '+color+'><span class="dia_cronograma jueves">Jue</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===5){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="5" '+color+'><span class="dia_cronograma viernes">Vie</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===6){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="6" '+color+'><span class="dia_cronograma sabado">Sab</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else if(n===7){
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="7" '+color+'><span class="dia_cronograma domingo">Dom</span><ul id="curr_crono_'+this.mes+'_'+this.dia_unico+'" class="curr_crono"></ul></li>'
                }else{
                    html+='<li ondrop="dropi(event)" ondragleave="limpiar_drop(event)" id="'+this.mes+'_'+this.dia_unico+'" ondragover="allowDrop(event)" class="dia_programa" data-posicion="'+n+'" data-dia="'+this.dia+'" data-mes="'+this.mes+'" data-dia_unico="'+this.dia_unico+'"  data-unix="'+this.unix+'" data-semana="'+this.semana+'" data-orden="0" '+color+'><span class="dia_cronograma"></span></li>'
                }

            }

        })

        html+='</ul>'
    html+='</div>'
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

function dropi(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");

    //datos del id que recibe el elemento
    var iddrop = ev.target.id
    $("li#"+iddrop).removeClass('sobre_drop')

    //captura datos del evento en movimiento
    var id = $("#"+data).data('id')
    var resumen = $("#"+data).data('resumen')
    var unidad = $("#"+data).data('unidad')
    var color = $("#"+data).data('color')
    var dia = $("#"+iddrop).data('dia_unico')
    var semanita = $("#"+iddrop).data('semana')
    var posicion_del_dia = $("#"+iddrop).data('posicion')
    //render del elemento para agregar
    var diddrop = "'"+iddrop+"_"+posicion_del_dia+"_"+semanita+"'"
    var c_unidad =["#FFD5D5","#FCE1C4","#B8F0D5","#CECEF6","#E6E6E6"]

    var html = '<li id="drag_'+id+'" data-idcurr="'+id+'" data-unidad="'+unidad+'" data-resumen="'+resumen+'" style="background-color:'+c_unidad[color]+'">'+resumen+' <i class="icon-trash borrar_curr" onclick="borrar_curri('+id+', '+diddrop+')"></i></li>'
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
                var update_curr = [id_crono_update, diddrop[0], dia, id, resumen, unidad, semanita, posicion_del_dia,$("#id_crono_update").val()];
                var procesar = capsula({path:'curriculum/ajax/', case:16, datos:update_curr})
                var json_proc = procesar.json

                $("#"+iddrop+" > .curr_crono").append(html)
                crono_listar($("#idasig").val(),null,1,$("#idcreador_update").val(),diddrop[0],$("#id_crono_update").val())
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
function editar_crono(user)
{
	if(typeof(user) == "undefined")
	{
		var userjson = JSON.parse(usuario_actual())
		var user = userjson.id
	}
	var asignatura = $("#idasig").val()
	var datos = {path:'curriculum/ajax/', case:13, id:asignatura, user:user}
	var proc = capsula(datos)
	var data = JSON.parse(proc.fuente)
	var render = tmp_cronogramas_final(data)
	$(".crono").hide()
	$("#mostrar_cronograma_edit").html(render)
	$("#mostrar_cronograma_edit").fadeIn('fast')
}
function eliminar_crono(crono, creador)
{
	bootbox.confirm('<h3>¿Esta seguro de eliminar el cronograma?</h3>',function(confirm){
		if(confirm)
		{
			var dat = {crono:crono, creador:creador}
			var datos = capsula({path:'curriculum/ajax/', case:34, datos:dat})
			if(datos.json.estado)
			{
				bootbox.alert('<h3>'+datos.json.mensaje+'</h3>')
				window.location.href = server+"curriculum/ver_cronogramas";
			}else
			{
				bootbox.alert('<h3>'+datos.json.mensaje+'!!</h3>')
				window.location.href = "";
			}
		}else
		{

		}
	})

}
function crono_listar_pdf(idcrono, e){

	if($('#idniv').val() > 2)
	{
		var form = '<h3>¿Que desea imprimir?</h3>'
		form +='<ul class="acciones">'
		form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="1" /> <i class="icon-search"></i>Imprimir Cronograma Anual Unidad</label></li>'
		//form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="3" /> <i class="icon-pencil"></i>Imprimir Cronograma Anual Clases</label></li>'
		form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="2" /> <i class="icon-pencil"></i>Imprimir Cronograma Clases por Mes</label></li>'
		form+='</ul>'

	}
	else{

		var form = '<h3>¿Que desea imprimir?</h3>'
		form +='<ul class="acciones">'
		form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="3" /> <i class="icon-search"></i>Imprimir Cronograma Anual Unidad</label></li>'
		//form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="3" /> <i class="icon-pencil"></i>Imprimir Cronograma Anual Clases</label></li>'
		form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="4" /> <i class="icon-pencil"></i>Imprimir Cronograma por Mes</label></li>'

		form+='</ul>'
	}

	bootbox.confirm(form, function(resp){

		if(resp)
		{
			var opcion = $("input[name='opcion']:checked").val()

			switch(parseInt(opcion))
			{
				case 1:
					 var asig = $("#idasig").val()
  					 var caso = 1
  					 param_url =''+idcrono+'/'+asig+'/'+caso+'/'
  					 window.open(server+'curriculum/imprimir_crono/'+param_url)
				break;
				case 2:
				    var form = '<h3>¿Elija el Mes que desea Imprimir?</h3>'
					form +='<ul class="acciones">'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion1" value="1" /> <i class="icon-search"></i>ENERO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion2" value="2" /> <i class="icon-pencil"></i>FEBRERO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion3" value="3" /> <i class="icon-pencil"></i>MARZO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion4" value="4" /> <i class="icon-search"></i>ABRIL</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion5" value="5" /> <i class="icon-pencil"></i>MAYO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion6" value="6" /> <i class="icon-pencil"></i>JUNIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion7" value="7" /> <i class="icon-search"></i>JULIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion8" value="8" /> <i class="icon-pencil"></i>AGOSTO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion9" value="9" /> <i class="icon-pencil"></i>SEPTIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion10" value="10" /> <i class="icon-search"></i>OCTUBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion11" value="11" /> <i class="icon-pencil"></i>NOVIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion12" value="12" /> <i class="icon-pencil"></i>DICIEMBRE</label></li>'
					form+='</ul>'

					bootbox.confirm(form, function(resp){
					// var mes = $("input[name='opcion']:checked").val()
					var mes = new Array();
					//recorremos todos los checkbox seleccionados con .each
					$('input[name="opcion[]"]:checked').each(function() {
					//$(this).val() es el valor del checkbox correspondiente
					mes.push($(this).val());
					});
					//pagina de ayudaaaaaaaaaaaaaaaaaaaa
					//si todos los checkbox están seleccionados devuelve 1,2,3,4,5
					 var str = mes.toString()
					 var res = str.replace(/,/g , "/")
					 var asig = $("#idasig").val()
  					 var caso = 2

  					 param_url =''+idcrono+'/'+asig+'/'+caso+'/'+res+'/'
  					window.open(server+'curriculum/imprimir_crono/'+param_url)
					 })
				break;
				case 3:
					var niv = $('#idniv').val()
					var asig = $("#idasig").val()
  					var caso = 1
  					param_url =''+idcrono+'/'+asig+'/'+niv+'/'+caso+'/'
  					window.open(server+'curriculum/imprimir_crono_kinder/'+param_url)
				break;
				case 4:


				   var form = '<h3>¿Elija el Mes que desea Imprimir?</h3>'
					form +='<ul class="acciones">'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion1" value="1" /> <i class="icon-search"></i>ENERO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion2" value="2" /> <i class="icon-pencil"></i>FEBRERO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion3" value="3" /> <i class="icon-pencil"></i>MARZO </label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion4" value="4" /> <i class="icon-search"></i>ABRIL</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion5" value="5" /> <i class="icon-pencil"></i>MAYO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion6" value="6" /> <i class="icon-pencil"></i>JUNIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion7" value="7" /> <i class="icon-search"></i>JULIO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion8" value="8" /> <i class="icon-pencil"></i>AGOSTO</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion9" value="9" /> <i class="icon-pencil"></i>SEPTIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion10" value="10" /> <i class="icon-search"></i>OCTUBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion11" value="11" /> <i class="icon-pencil"></i>NOVIEMBRE</label></li>'
					form+='<li data-accion="crear"> <label><input type="checkbox" name="opcion[]" id="opcion12" value="12" /> <i class="icon-pencil"></i>DICIEMBRE</label></li>'
					form+='</ul>'

					bootbox.confirm(form, function(resp){
					// var mes = $("input[name='opcion']:checked").val()
					var mes = new Array();
					//recorremos todos los checkbox seleccionados con .each
					$('input[name="opcion[]"]:checked').each(function() {
					//$(this).val() es el valor del checkbox correspondiente
					mes.push($(this).val());
					});
					//pagina de ayudaaaaaaaaaaaaaaaaaaaa
					//si todos los checkbox están seleccionados devuelve 1,2,3,4,5
					 var str = mes.toString()
					 var res = str.replace(/,/g , "/")
					 var asig = $("#idasig").val()
					 var niv = $('#idniv').val()
  					 var caso = 2

  					 param_url =''+idcrono+'/'+asig+'/'+niv+'/'+caso+'/'+res+'/'
  					window.open(server+'curriculum/imprimir_crono_kinder/'+param_url)
					 })
			}
		}else{

		}
	})
}
function change_name_crono(crono)
{
	var json = capsula({path:'curriculum/ajax', case:37, crono:crono, nombre: $("#nomb_crono").val()})
	if(json.json)
	{
		$("#msj_change").append('<div class="alert alert-success fade in"><button type="button" class="close" data-dismiss="alert">×</button><strong>Se cambio el nombre</strong></div>')
		$("#msj_change").show()
		$("#nomb_crono").val('')
	}else
	{
		$("#msj_change").append('<div class="alert alert-danger fade in"><button type="button" class="close" data-dismiss="alert">×</button><strong>No se ha podido cambiar el nombre</strong></div>')
		$("#msj_change").show()
		$("#nomb_crono").val('')
	}
}

function obtener_listado_profesores()
{

	var datos = {path:'crono/ajax',case:55}
	var procesar = $.ajax({
		url: server+datos.path,
		type: 'post',
		dataType: 'json',
		async:false,
		data: datos
	})

	var data = JSON.parse(procesar.responseText)
	return data
}

function marcar_checkbox(idcheck)
{
	if($('#'+idcheck).prop('checked'))
	{
		$('#'+idcheck).prop('checked',false)
	}
	else
	{
		$('#'+idcheck).prop('checked',true)
	}
}

function mostrar_listado_profesores(valor)
{
	if(valor=='institucional')
	{
		$('#div_lista_profesores').css('display','inline')
	}
	else
	{
		$('#div_lista_profesores').css('display','none')
	}
}

function copiar_crono()
{
	////////// verificar si ya está copiado el cronograma institucional //////////

	var crono_catalogo = $("#id_crono_update").val()
	var datos_user = JSON.parse(usuario_actual())
	var idperfil = datos_user.idprefil

	
			/////////////////////////////////////////////////
			
			/*
			var json = capsula({path:'migracion/ajax', case:1, cronograma:$("#id_crono_update").val()})
			if(json.json)
			{
				bootbox.alert("<h3>Se ha copiado el cronograma!</h3>")
			}
			*/
			
			var form = '<h3>¿Que desea copiar?</h3>'
			//form += '<div id="tipo_copia">'
			form +='<ul class="acciones2">'
			form+='<li data-accion="crear" style="width: 90% !important;">'
			
			if(idperfil==2) //solo para administrador jefe_tecnico, jefe_utp, etc
			{
				form+='<label style="font-size:20px; margin-bottom: 15px;" ><input type="radio" name="opcion_copiar" id="option_copiar" value="3" checked="checked" />&nbsp;Copiar Cronograma Institucional</label>'
			}

			form+='<label style="font-size:18px; margin-bottom: 15px;" ><input type="radio" name="opcion_copiar" id="option_copiar" value="1" />&nbsp;Copiar el cronograma completo</label>'
			form+='<label style="font-size:18px; margin-bottom: 15px;" ><input type="radio" name="opcion_copiar" id="option_copiar" value="2" />&nbsp;Copiar solo las clases</label></li>'
			//form+='<li data-accion="crear"> <label><input type="radio" name="opcion" id="opcion" value="3" /><i class="icon-search"></i>Imprimir Cronograma Anual Clases</label></li>'
			//form+='<li data-accion="crear"> <label><input type="radio" name="opcion_copiar" id="option_copiar" value="2" /> <i class="icon-pencil"></i>Copiar solo las clases</label></li>'

			form+='</ul>'
			//form += '</div>'
			
			bootbox.confirm(form,function(confirm)
			{
				var option = $("input[name='opcion_copiar']:checked").val()
				if(confirm)
				{
					
					if(parseInt(option)==1 || parseInt(option)==3) //COPIAR CRONOGRAMA COMPLETO 
					{	
						
						capsula_asincronica({path:'migracion/ajax', case:3, cronograma:$("#id_crono_update").val() }, function(data){

						if(data==0) //NO se ha copiado un crono institucional 
						{
							var tipo_crono = 'normal'
							var select_tipo = '' 
							var lista = ''
							
							if(idperfil==2) //solo para administrador jefe_tecnico, jefe_utp, etc
							{
								//select_tipo='<tr><td><strong>Tipo</strong></td><td><strong>&nbsp;:&nbsp;</strong></td><td><select id="tipo_crono" name="id_crono"><option value="normal">Normal</option><option value="institucional">Institucional</option></select></td></tr>'
								select_tipo='<tr><td><strong>Tipo</strong>&nbsp;</td><td><input type="radio" id="tipo_crono_1" name="id_crono" value="normal" checked="checked">&nbsp;Normal&nbsp;<input type="radio" id="tipo_crono_1" name="id_crono" value="institucional">&nbsp;Institucional</td></tr>'

								lista += '<div id="div_lista_profesores" style="display:none;">'
								lista += '<h3>Listado de profesores</h3>'
								lista += '<table id="tabla_profesores_encabezado" class="table table-condensed table-striped">'
								lista += '<tr>'
								lista += '<th><strong>Rut</strong></th>'
								lista += '<th><strong>Nombre</strong></th>'
								lista += '<th><strong>&nbsp;</strong></th>'
								lista += '</tr>'
								lista += '</table>'
								lista += '<div id="div_profesores_agregados" class="div_lista_profesores">'
								lista += '<table id="tabla_profesores_listado" class="table table-condensed texto_min">'

								var lista_profesores = obtener_listado_profesores()
								
								$.each(lista_profesores, function(){

									var check = '<input id="profesoresBox'+this.id+'" type="checkbox" name="profesoresBox[]" value="'+this.id+'" />'
									lista += '<tr class="fila_profesores cursor_mano"><td onclick="marcar_checkbox(\'profesoresBox'+this.id+'\')">'+this.usuario+'</td><td onclick="marcar_checkbox(\'profesoresBox'+this.id+'\')">'+this.nombre+'</td><td>'+check+'</td></tr>'
								})

								lista += '</table>'
								lista += '</div>'
								lista += '</div>'
							}
								

								if(parseInt(option)==3) //CRONOGRAMA INSTITUCIONAL
								{

									var nombre_crono = 'Institucional';
									localStorage.setItem("nombre_crono", nombre_crono );
									
									bootbox.dialog(cargador)
									var checkboxValues = new Array();

									if(idperfil==2)
									{
										//tipo_crono = $('input:radio[name=id_crono]:checked').val()
										tipo_crono = 'institucional'


										//recorremos todos los checkbox seleccionados con .each
										/*
										$('input[name="profesoresBox[]"]:checked').each(function() {
											//$(this).val() es el valor del checkbox correspondiente
											checkboxValues.push($(this).val());
										});
										*/
									}
																			
									capsula_asincronica({path:'migracion/ajax', case:1, cronograma:$("#id_crono_update").val(), nombre:nombre_crono, tipo:tipo_crono, listado_profesores: checkboxValues }, function(data)
									{
										parent.bootbox.hideAll()
										if(data)
										{
											bootbox.confirm("<h3>Se ha copiado el cronograma!</h3><p>Si desea ir a sus cronogramas presione <b>Aceptar</b></p>", function(confirm){
												if(confirm)
												{
													
													localStorage.setItem("idniv"			, $('#idniv').val());
													localStorage.setItem("estado"			, "true");
													window.location = server+'crono/ver_cronogramas'
												}
											})
										}
									}) //capsula asincronica
									

								}
								else if(parseInt(option)==1) //CRONOGRAMA COMPLETO
								{

									bootbox.confirm('<h3>&#191;Cual ser&aacute; el nombre del cronograma?</h3><table><tr><td><strong>Nombre</strong>&nbsp;</td><td><input type="text" id="nombre_crono" class="texto_min"></td></tr><tr><td colspan="2">'+lista+'</td></tr></table>',function(confirm){
								

									if(confirm)
									{
												var nombre_crono = $("#nombre_crono").val();
												localStorage.setItem("nombre_crono", nombre_crono );
												
												bootbox.dialog(cargador)
												var checkboxValues = new Array();

												if(idperfil==2)
												{
													//tipo_crono = $('input:radio[name=id_crono]:checked').val()
													tipo_crono = 'normal'


													//recorremos todos los checkbox seleccionados con .each
													/*
													$('input[name="profesoresBox[]"]:checked').each(function() {
														//$(this).val() es el valor del checkbox correspondiente
														checkboxValues.push($(this).val());
													});
													*/
												}
																						
												capsula_asincronica({path:'migracion/ajax', case:1, cronograma:$("#id_crono_update").val(), nombre:nombre_crono, tipo:tipo_crono, listado_profesores: checkboxValues }, function(data)
												{
													parent.bootbox.hideAll()
													if(data)
													{
														bootbox.confirm("<h3>Se ha copiado el cronograma!</h3><p>Si desea ir a sus cronogramas presione <b>Aceptar</b></p>", function(confirm){
															if(confirm)
															{
																
																localStorage.setItem("idniv"			, $('#idniv').val());
																localStorage.setItem("estado"			, "true");
																window.location = server+'crono/ver_cronogramas'
															}
														})
													}
												}) //capsula asincronica
											}
										}) //confirm

								}

								
						}
						else if(data>0) //SI se ha copiado un crono institucional 
						{
							if(idperfil==2) //usuario con perfil de administrador, se copian solo las clases
							{
								bootbox.dialog(cargador);
								capsula_asincronica({path:'migracion/ajax', case:4, cronograma:$("#id_crono_update").val()}, function(data){
									parent.bootbox.hideAll()
									if(data)
									{
										bootbox.alert('<strong>No se puede copiar el cronograma</strong><br/><br/>Ya existe un cronograma institucional para el mismo nivel y asignatura, <br/>sin embargo se han copiado las clases nuevas correspondientes al nivel y asignatura del cronograma.')
									}
								})
							}
							if(idperfil==3) //profesor
							{
								bootbox.alert('<strong>No se puede copiar el cronograma</strong><br/><br/>Ya existe un cronograma institucional para el mismo nivel y asignatura.')			
							}
					
						}})

					}

					if(parseInt(option)==2) // COPIAR CLASES 
					{
							bootbox.dialog(cargador);
							capsula_asincronica({path:'migracion/ajax', case:2, cronograma:$("#id_crono_update").val()}, function(data){
								parent.bootbox.hideAll()
								if(data)
								{
									bootbox.alert("<h3>Se han copiado las clases!</h3>")
								}
							})
					}	
					
				}

			})

			/////////////////////////////////////////////////
		
		
	


	////////////////////////////////////////////////////////////////

	
}

function editar_crono()
{
	var asignatura = $("#idasig").val()
	var datos = {path:'curriculum/ajax/', case:13, id:asignatura}
	var proc = capsula(datos)
	var data = JSON.parse(proc.fuente)
	var render = tmp_cronogramas_final(data)
	$(".crono").hide()
	$("#mostrar_cronograma_edit").html(render)
	$("#mostrar_cronograma_edit").fadeIn('fast')
}
function ver_options(obj)
{
	return false;
	$(obj).children('.tot_clases').attr('style','visibility:visible;opacity:1;transition-delay:0s;');
	$(obj).children('.dispo_clases').attr('style','visibility:visible;opacity:1;transition-delay:0s;');
}
function quitar_opciones(obj)
{
	return false;
	$(".tot_clases").removeAttr('style');
	$(".dispo_clases").removeAttr('style');
}
