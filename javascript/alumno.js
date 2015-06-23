const SERVER="../php/connect.php";
var transicion=true;
var proyectosCargados=0;
var orden="Alumno";
var estadoOrden="todos";
var proyectos; 
var proyectosCargados=false;

function actualizarProgreso(){
	var url=document.URL;
	url=url.split("#");
	url=url[1];
	if(url!="Perfil"){
		var progreso;
		bootbox.prompt("Indica el progreso actual de tu proyecto", function(result) {                
	  		if (result === null) {                                             
	                                  
	  		} 
	  		else if(isNaN(parseInt(result)) || parseInt(result)>100 || parseInt(result)<0){
	  			bootbox.alert("Introduce un número entero entre 0 y 100", function(){actualizarProgreso();});
	  		}
	  		else {
	  			var ajax = new XMLHttpRequest();
	  			ajax.open("post",SERVER);
	  			ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				ajax.send("action=cambiarProgreso&progreso="+result);
				ajax.onreadystatechange=function() {
			 		if(ajax.readyState==4&&ajax.status==200){
			 			document.getElementById("barra").setAttribute("style","width:"+result+"%");
 						$("#barra").html(result+"%");
			 		}
			 	};
			}
		});
	}
	

}

function cargarPerfil () {
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=datosPerfil");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==1){
 				bootbox.alert("No estas registrado.", function(){window.location="../index.html"});
 			}
 			else{
 				document.getElementById("nombrePerfil").innerHTML+=request.nombre+" "+request.apellido1;
 				document.getElementById("nombreGrande").innerHTML=request.nombre+" "+request.apellido1;
 				$("#funcionPerfil").click(function(){
 					verPerfil();
 				})
 			}
 		}
 	};
}

function verPerfil () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax=new XMLHttpRequest();
	ajax.open("post","alumnoPerfil.html");
	ajax.send();
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4&&ajax.status==200){
			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
			rellenarPerfil();
		}
	};
}

function rellenarPerfil () {
	var profesor = new XMLHttpRequest();
	profesor.open("post",SERVER);
	profesor.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	profesor.send("action=getPerfil");
	profesor.onreadystatechange=function() {
 		if(profesor.readyState==4&&profesor.status==200){
 			var request=JSON.parse(profesor.responseText);
 			$("#nombre").val(request.nombre);
 			$("#apellido1").val(request.apellido1);
 			$("#apellido2").val(request.apellido2);
 			$("#password").val(request.password);
 			$("#dni").val(request.dni);
 			$("#ciclo").html(request.ciclo);
 			$("#email").val(request.email);
 			$("#idAlumno").val(request.id);
 			$("#idCiclo").val(request.idCiclo);
 			mostrarCapa();

 		}
 	};
}

function habilitarEdicionAlumno () {
	var idCiclo=document.getElementById("idCiclo").value;
	var formulario=document.getElementById("formAddAlumno");
	var selects=formulario.getElementsByTagName("select");
	formulario=formulario.getElementsByTagName("input");
	for(var i=0; i<formulario.length; i++){
		formulario[i].removeAttribute("disabled");
	}
	for (var i = 0; i < selects.length; i++) {
		selects[i].removeAttribute("disabled");
	};

	var ciclos = new XMLHttpRequest();
	ciclos.open("post",SERVER);
	ciclos.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ciclos.send("action=getNombreCiclos&idCiclo="+idCiclo);
	ciclos.onreadystatechange=function() {
 		if(ciclos.readyState==4&&ciclos.status==200){
 			var requestCiclos=JSON.parse(ciclos.responseText);
 			for(var i=0; i<requestCiclos.numCiclos; i++){
 				document.getElementById("cicloSelect").innerHTML+="<option value='"+requestCiclos[i]['id']+"'>"+requestCiclos[i]['nombre']+"</option>";
 			}
 		}
 	};

	$("#botonAplicar").fadeIn();
	$("#botonCancelar").fadeIn();
}

function retrocederAlumno(){
	window.location.reload();
}

function aplicarEdicionAlumno () {
	formulario=new FormData(document.getElementById("formAddAlumno"));
	formulario.append("action","editarAlumno");
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(formulario);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			//alert(ajax.responseText);
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==0){
 				bootbox.alert("Alumno modificado correctamente", function(){
 					window.location.reload();
 				});
 			}
 			else{
 				bootbox.alert("Ha ocurrido algún error modificando los campos", function(){
 					window.location.reload();
 				});
 			}
 		}
 	};
 	return false;
}

function desconectar () {
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=desconectar");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			bootbox.alert("Te has desconectado", function(){
 				window.location="../index.html";
 			});
 		}
 	};
}

function fillProyecto () {
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=getProyectoAlumno");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			//alert(ajax.responseText);
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==0){
 				$("#botonesAlumno").show();
 				$("#titulo").html(request.titulo);
 				$("#idProyecto").val(request.idProyecto);
 				$("#tutor").html(request.tutor);
 				$("#ciclo").html(request.ciclo);
 				$("#materia").html(request.materia);
 				$("#fechaPresentacion").html(request.fecha);
 				document.getElementById("barra").setAttribute("style","width:"+request.progreso+"%");
 				$("#barra").html(request.progreso+"%");
 				var timeOut=setTimeout("actualizarProgreso()",1000);
 			}
 			else{
 				$("#titulo").html("No se ha asignado ningún proyecto");
 				$("#idProyecto").val("No se ha asignado ningún proyecto");
 				$("#tutor").html("No se ha asignado ningún proyecto");
 				$("#ciclo").html("No se ha asignado ningún proyecto");
 				$("#materia").html("No se ha asignado ningún proyecto");
 				$("#fechaPresentacion").html("No se ha asignado ningún proyecto");
 				//document.getElementById("barra").setAttribute("style","width:"+request.progreso+"%");
 				$("#barra").html("No se ha asignado ningún proyecto");
 			}
 		}
 	};
}


function cargarProyectos (estado) {
	document.getElementById("page-wrapper").style.display="none";
	var ordenCambiado="Alumno";
	if(document.getElementById("ordenProyectos")){
		ordenCambiado=document.getElementById("ordenProyectos").value;
	}
	if(estadoOrden!=estado || ordenCambiado!=orden){ //si se cambia el filtro ESTADO, se vuelve a hacer la peticion
		proyectosCargados=false;
	}
	if(proyectosCargados){ //cargar desde cache
		printProyectosCargados(estado);
	}
	else{
		orden=ordenCambiado;
		estadoOrden=estado;
		var ajax = new XMLHttpRequest();
		ajax.open("post",SERVER);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		ajax.send("action=profesorGetProyectos&orden="+orden+"&estado="+estado);
		ajax.onreadystatechange=function() {
	 		if(ajax.readyState==4&&ajax.status==200){
	 			//alert(ajax.responseText);
	 			proyectos=JSON.parse(ajax.responseText);
	 			proyectosCargados=true;
	 			if(proyectos.warning==2){
	 				bootbox.alert("No estas registrado como administrador", function(){window.location="../index.html"});
	 			}
	 			else{
	 				proyectosCargados+=9;
		 			printProyectosCargados(estado);
	 			}// else if warning==2
	 		}//if ajax.status == 200
	 	};
	 }//else cargados
	
}

function printProyectosCargados (estado) {
	var contenedor="";
	contenedor+="<div class='container-fluid'>";
		 			
		/* Menu superior para los filtros */
		contenedor+="<div id='menuSuperior'><img src='../img/back.png' class='img-responsive center-block pointer' height='70' width='70' alt='Atrás' title='Atrás' onclick='window.location.reload();'><br></div>";

		var contadorFilas=1;
		var abrirFila=true;
		for(var i=0; i<proyectos.numProyectos; i++){

			if(proyectos[i].estado==4){
					/* cada 3 elementos, fila nueva */
				if($(window).width() >= 992){
					if(abrirFila){
						contenedor+="<div class='row'>";
						abrirFila=false;
					}
				}
				

				contenedor+="<div class='col-sm-6 col-md-4 col-lg-4 bloqueProyecto'>";
				contenedor+="<div class='thumbnail minAlto' onmouseover='activarBarra("+i+")' onmouseleave='desactivarBarra("+i+")'><div class='caption'>";

				/* si la descripcion es demasiado larga se acorta */
				var descripcion = proyectos[i].descripcion;
					if(descripcion.length>50){ 
						var acortado=descripcion.substring(0,40);
						var posiblePalabra=descripcion.substring(40,50);
						var proxPalabra=posiblePalabra.split(" ");
						var proxPalabra=proxPalabra[0]; //primera palabra despues de cortar
						descripcion=acortado+""+proxPalabra+" ...";
					}

				contenedor+="<h3>"+descripcion+"</h3>";
				if(proyectos[i].apellido1=="" && proyectos[i].apellido2==""){
					contenedor+="<p><strong>Alumno: </strong>"+proyectos[i].nombre+"</p>";
				}
				else{
					contenedor+="<p><strong>Alumno: </strong>"+proyectos[i].apellido1+" "+proyectos[i].apellido2+", "+proyectos[i].nombre+"</p>";
				}
				if(proyectos[i].profeApe1=="" && proyectos[i].profeApe2==""){
					contenedor+="<p><strong>Tutor: </strong>"+proyectos[i].nombreProfe+"</p>";
				}
				else{
					contenedor+="<p><strong>Tutor: </strong>"+proyectos[i].profeApe1+" "+proyectos[i].profeApe2+", "+proyectos[i].nombreProfe+"</p>";
				}
				contenedor+="<p><strong>Ciclo: </strong>"+proyectos[i].ciclo+"</p>";
				contenedor+="<p><strong>Materia: </strong>"+proyectos[i].materia+"</p>";
				
				var porcentaje = (proyectos[i].estado==5)?"Sin acabar":proyectos[i].porcentaje+"%";

				/* Colores para la barra de progreso */
				if(proyectos[i].porcentaje==100){
					contenedor+='<p><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:100%">Completado</div></div></p>';
				}
				else if(proyectos[i].porcentaje>75){
					contenedor+='<p><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
				}
				else if(proyectos[i].porcentaje>35){
					contenedor+='<p><div class="progress"><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
					
				}
				else if(proyectos[i].porcentaje>1){
					contenedor+='<p><div class="progress"><div class="progress-bar progress-bar-danger progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
					
				}
				else{
					contenedor+='<p><div class="progress"><span style="margin-left:45%;color:black;text-align:center;font-size:12px;">0%</span><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:0%"></div></div></p>';
					
				}
				if((proyectos[i].estado==4 || proyectos[i].estado==5 || proyectos[i].porcentaje==100)){
					contenedor+="<p><strong>Nota: </strong>"+proyectos[i].nota+"</p>";
				}
				contenedor+='<p><a href="#verProyecto" class="btn btn-default botonProyectos" role="button" onclick="verOtrosArchivos('+proyectos[i].IDProyecto+')">Ver archivos</a></p>';
				contenedor+="</div></div></div>";
				
				if($(window).width() >= 992){
					if(contadorFilas%3==0 && contadorFilas!=1){
						contenedor+="</div>";
						abrirFila=true;
					}
				}
				
				contadorFilas++;
			}//if
			
			
		}//for

		contenedor+="</div>";
		document.getElementById('page-wrapper').innerHTML=contenedor;
		mostrarCapa(3);
}



function verMensajesProyecto () {
	var idProyecto=document.getElementById("idProyecto").value;
	var lobo="<button class='btn btn-success colorBotones' style='float:right;display:none;' id='addMensajeBoton' onclick='addMensajeProyecto("+idProyecto+"); unResizeText();'>Añadir mensaje</button><br/></div>";
	var contenedor="<div class='container-fluid'><div class='row' style='margin-bottom:10px;'>";
	contenedor+="<div class='input-group transition'>";
  	contenedor+="<span class='input-group-addon transition' id='basic-addon1'>Añadir comentario</span>";
  	contenedor+="<textarea class='form-control transition' maxlength='240' id='addMensajeText' onfocus='resizeText();' placeholder='Añade un nuevo comentario ...' aria-describedby='basic-addon1'></textarea>";
	contenedor+="</div>";
	contenedor+=lobo;
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=verMensajesProyecto&idProyecto="+idProyecto);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			//alert(ajax.responseText);
 			var request=JSON.parse(ajax.responseText);
 			

 			contenedor+="<div class='fullWidth'>";
 			
			for(var i=0; i<request.numMensajes; i++){
				contenedor+="<div class='thumbnail fullWidth'><div class='caption'>";
				contenedor+="<h3>"+request[i].fecha+"</h3>";
				contenedor+="<p><strong>Tutor: </strong>"+request[i].profesor+"</p>";
				contenedor+="<p><strong>Mensaje: </strong>"+request[i].descripcion+"</p>";
				contenedor+="<p><strong>Alumno: </strong>"+request[i].alumno+"</p>";
				contenedor+="</div></div>";
			}
			if(!(request.numMensajes)){
				contenedor+="<div class='thumbnail fullWidth'><div class='caption'>";
				contenedor+="<h3 style='text-align:center;'>No hay ningún mensaje</h3>";
				contenedor+="</div></div>";
			}

			
			bootbox.dialog({ 
	
			    title: 'Mensajes',
			    message: contenedor,
			    buttons: {
			    	"Cerrar": {
					    className: "btn-danger",
					    callback: function() {
					    	
					    }
					}

			    }

			});
 		}
 	};

}

function subirArchivo () {
	var archivo;
	if ( archivo = document.getElementById('archivo').files[0] ) {
		var idProyecto = document.getElementById('idProyecto').value;
		var ajax = new XMLHttpRequest();
		ajax.upload.addEventListener("progress", progressHandler, false);
		ajax.addEventListener("load", completeHandler, false);
		ajax.open("POST",SERVER+"?action=subirArchivo&id="+idProyecto);
		ajax.setRequestHeader("Cache-Control", "no-cache");
		ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		ajax.setRequestHeader("X-File-Name", archivo.name);
		ajax.send(archivo);
		bootbox.hideAll();	
	}
	else{
		bootbox.hideAll();	
		bootbox.alert("Selecciona un archivo",function(){verArchivos();});
	}

	

}

function progressHandler(event){
	document.getElementById("envoltorio").style.display="inherit";
	document.getElementById("capaBarra").style.display="inherit";
	document.body.style.overflow="hidden";
	var percent = (event.loaded / event.total) * 100;
	
	var bprogreso = document.getElementById('barraint');
	bprogreso.style.width=percent+"%";
	
}

function completeHandler(event){
		bootbox.alert("Informe añadido correctamente.",function(){
		document.getElementById("envoltorio").style.display="none";
		document.getElementById("capaBarra").style.display="none";
		document.body.style.overflow="auto";
		bootbox.hideAll();			
		verArchivos();
	});
	
}

function verArchivos () {
	archivos="<div style='min-height:200px;'>";
	archivos+="<div class='input-group'><label class='input-group-addon' for='archivo'>Adjuntar archivo:</label><input class='btn btn-default' type='file' id='archivo'></div>";
	archivos+="<div id='loadArchivos'></div>";
	archivos+="<div id='espaciado'></div>";
	archivos+="<div class='abajo'><button class='subirArchivo btn btn-success center-block' onclick='subirArchivo();'>Subir archivo</button></div>"
	archivos+="</div>";

	bootbox.dialog({ 
	
	    title: 'Documentos',
	    message: archivos,
	    buttons: {
	    	"Cerrar": {
			    className: "btn-danger",
			    callback: function() {
			    	$(".modal-body").removeClass("paddeado");
			    }
			}

	    }

	});
	$(".modal-body").addClass("paddeado");
	mostrarArchivos();
}

function mostrarArchivos () {
	var layer=document.getElementById("loadArchivos");
	var idProyecto = document.getElementById('idProyecto').value;
	//alert(idProyecto);
	var ajax = new XMLHttpRequest();
	var contenedor="";
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=mostrarArchivos&idProyecto="+idProyecto);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var archivos=JSON.parse(ajax.responseText);
 			for(var i=0; i<archivos.numArchivos; i++){
 				var extension=archivos[i].nombre.split(".");
 				extension=extension[extension.length-1];
 				if(extension=="pdf"){
 					contenedor+="<a class='archivoMostradoPDF' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else if(extension=="doc" || extension=="docx"){
 					contenedor+="<a class='archivoMostradoWORD' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else if(extension=="sql"){
 					contenedor+="<a class='archivoMostradoSQL' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else{
 					contenedor+="<a class='archivoMostradoOTRO' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 			}
 			layer.innerHTML=contenedor;
 		}
 	};
}


function resizeText () {
	$("#addMensajeText").addClass("resize");
	$("#addMensajeBoton").fadeIn();
}

function unResizeText () {
	$("#addMensajeText").removeClass("resize");
	$("#addMensajeBoton").fadeOut("fast");
	
}

function addMensajeProyecto (id) {
	var mensaje=document.getElementById("addMensajeText").value;
	if(mensaje.length>250){
		bootbox.alert("El mensaje no puede tener más de 250 caracteres");
	}
	else{
		var ajax = new XMLHttpRequest();
		ajax.open("post",SERVER);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		ajax.send("action=addMensajeProyecto&proyecto="+id+"&mensaje="+mensaje);
		ajax.onreadystatechange=function() {
	 		if(ajax.readyState==4&&ajax.status==200){
	 			//alert(ajax.responseText);
	 			var request=JSON.parse(ajax.responseText);
	 			if(request.warning==0){
	 				bootbox.alert("Mensaje añadido correctamente", function(){
	 					bootbox.hideAll();	
	 					verMensajesProyecto();
	 				});
	 			}
	 			else{
	 				bootbox.alert("Ha habido un error",function(){
	 					bootbox.hideAll();	
	 					verMensajesProyecto();
	 				});
	 			}
	 		}
	 	};
	}//else
		
}

function verOtrosArchivos (id) {
	var archivos="<div style='min-height:200px;'>";
	archivos+="<div id='loadArchivos'></div>";
	archivos+="<div id='espaciado'></div>";
	archivos+="</div>";

	bootbox.dialog({ 
	
	    title: 'Documentos',
	    message: archivos,
	    buttons: {
	    	"Cerrar": {
			    className: "btn-danger",
			    callback: function() {
			    	$(".modal-body").removeClass("paddeado");
			    }
			}

	    }

	});
	$(".modal-body").addClass("paddeado");
	mostrarOtrosArchivos(id);
}

function mostrarOtrosArchivos (id) {
	var layer=document.getElementById("loadArchivos");
	var idProyecto = id;
	var ajax = new XMLHttpRequest();
	var contenedor="";
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=mostrarArchivos&idProyecto="+idProyecto);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var archivos=JSON.parse(ajax.responseText);
 			for(var i=0; i<archivos.numArchivos; i++){
 				var extension=archivos[i].nombre.split(".");
 				extension=extension[extension.length-1];
 				if(extension=="pdf"){
 					contenedor+="<a class='archivoMostradoPDF' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else if(extension=="doc" || extension=="docx"){
 					contenedor+="<a class='archivoMostradoWORD' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else if(extension=="sql"){
 					contenedor+="<a class='archivoMostradoSQL' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 				else{
 					contenedor+="<a class='archivoMostradoOTRO' href='../files/"+archivos[i].nombre+"' >"+archivos[i].nombre+"</a>";
 				}
 			}
 			layer.innerHTML=contenedor;
 		}
 	};
}




/**
 * Muestra la capa pasada por parametro con una transicion distinta para monitores mayores
 * de 768, y para monitores menores de esa resolucion.
 * Ademas comprueba que la transicion este activada o no.
 * @param  {int} capa numero de la capa a activar
 */
function mostrarCapa () {
	
	if($(window).width() <= 768){
		if(transicion){
			$("#page-wrapper").show("slide"); //efecto móviles
		}
		else{
			document.getElementById("page-wrapper").style.display="inherit";
		}
		
	}
	else{
		if(transicion){
			$("#page-wrapper").fadeIn(); //efecto ordenador
		}
		else{
			document.getElementById("page-wrapper").style.display="inherit";
		}
	}
	transicion=true;

}








