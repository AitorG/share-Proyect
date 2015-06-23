const SERVER="../php/connect.php";

var proyectosCargados=0;
var orden="Alumno";
var estadoOrden="todos";
var transicion=true;
var proyectos; 			 	 // eficiencia: se accede a los datos de un proyecto de forma local
var proyectosCargados=false; // una vez que cargan todos los proyectos, al darle a ver proyecto se accede a una parte 
         				 	 // de los datos ya cargados y almacenados en una variable JSON.
function comprobarAdmin(){
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=comprobarAdmin");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==1){
 				bootbox.alert("No estas registrado como administrador", function(){window.location="../index.html"});
 			}
 		}
 	};
}

function cargarInicio () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax = new XMLHttpRequest();
	ajax.open("post","inicio.html");
	ajax.send();
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById('page-wrapper').innerHTML=ajax.responseText;
 			mostrarCapa(1);
 		}
 	};
}

function cargarMisAlumnos () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=profesorGetAlumnos");
	var contenedor="";
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==2){
 				bootbox.alert("No estas registrado como administrador", function(){window.location="../index.html"});
 			}
 			else{
 				contenedor+="<div class='container-fluid'>";
	 			contenedor+="<table class='table table-hover'>";
	 			contenedor+="<thead><tr><th>Alumno</th><th>Proyecto</th><th>Progreso</th><th class='ver'>Ver</th></tr></thead>";
	 			contenedor+="<tbody>";
	 			if (request.numAlumnos>0) {
	 				for(var i=0; i<request.numAlumnos; i++){
		 				contenedor+="<tr onmouseover='activarBarra("+i+")' onmouseleave='desactivarBarra("+i+")'>";
		 				contenedor+="<td>"+request[i].Apellido1+" "+request[i].Apellido2+", "+request[i].Nombre+"</td>";
		 				var descripcion = request[i].descripcion;
		 				if(descripcion.length>40){ //si la descripcion es demasiado larga se acorta
		 					var acortado=descripcion.substring(0,30);
		 					var posiblePalabra=descripcion.substring(30,40);
		 					var proxPalabra=posiblePalabra.split(" ");
		 					var proxPalabra=proxPalabra[0]; //primera palabra despues de cortar
		 					descripcion=acortado+""+proxPalabra+" ...";
		 				}
		 				contenedor+="<td id='celdaDescripcion'>"+descripcion+"</td>";
		 				if(request[i].porcentaje==100){
	 					contenedor+='<td><div class="progress noMargin"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:100%">Completado</div></div></td>';
		 				}
						else if(request[i].porcentaje>75){
		 					contenedor+='<td><div class="progress noMargin"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+request[i].porcentaje+'%">'+request[i].porcentaje+'%</div></div></td>';
		 				}
		 				else if(request[i].porcentaje>35){
		 					contenedor+='<td><div class="progress noMargin"><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+request[i].porcentaje+'%">'+request[i].porcentaje+'%</div></div></td>';
		 				
		 				}
		 				else if(request[i].porcentaje>1){
		 					contenedor+='<td><div class="progress noMargin"><div class="progress-bar progress-bar-danger progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+request[i].porcentaje+'%">'+request[i].porcentaje+'%</div></div></td>';
		 				
		 				}
		 				else{
		 					contenedor+='<td><div class="progress noMargin"><span style="margin-left:45%;color:black;text-align:center;font-size:12px;">0%</span><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:0%"></div></div></td>';
		 				
		 				}
		 				
		 				contenedor+="<td class='ver'><img src='../img/view.png' class='imagenVerProyecto ver' onclick='verAlumno("+request[i].IDAlumno+")'></td>";
		 				contenedor+="</tr>";
		 			}
	 			}
	 			else{
	 				contenedor+="<tr>";
	 				contenedor+="<td colspan='4' style='text-align:center;'><em>No tienes ningún alumno con un proyecto activo</em></td>"
	 				contenedor+="</tr>";
	 			}
	 			
	 			contenedor+="</table>";
	 			contenedor+="</div>";
	 			document.getElementById('page-wrapper').innerHTML=contenedor;
				mostrarCapa(2);
	 		}//else if warning == 2
 			
 		}// if ajax status == 200
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
		contenedor+="<div id='menuSuperior'></div>";

		var contadorFilas=1;
		var abrirFila=true;
		for(var i=0; i<proyectos.numProyectos; i++){
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
				contenedor+='<p><div class="progress noMargin"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:100%">Completado</div></div></p>';
			}
			else if(proyectos[i].porcentaje>75){
				contenedor+='<p><div class="progress noMargin"><div class="progress-bar progress-bar-success progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
			}
			else if(proyectos[i].porcentaje>35){
				contenedor+='<p><div class="progress noMargin"><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
				
			}
			else if(proyectos[i].porcentaje>1){
				contenedor+='<p><div class="progress noMargin"><div class="progress-bar progress-bar-danger progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:'+proyectos[i].porcentaje+'%">'+porcentaje+'</div></div></p>';
				
			}
			else{
				contenedor+='<p><div class="progress noMargin"><span style="margin-left:45%;color:black;text-align:center;font-size:12px;">0%</span><div class="progress-bar progress-bar-warning progress-bar-striped" id="barra'+i+'" role="progressbar" style="width:0%"></div></div></p>';
				
			}
			if((proyectos[i].estado==4 || proyectos[i].estado==5 || proyectos[i].porcentaje==100)){
				contenedor+="<p><strong>Nota: </strong>"+proyectos[i].nota+"</p>";
			}
			contenedor+='<p><a href="#verProyecto" class="btn btn-default botonProyectos" role="button" onclick="verProyecto('+proyectos[i].IDProyecto+')">Ver proyecto</a></p>';
			contenedor+="</div></div></div>";
			
			if($(window).width() >= 992){
				if(contadorFilas%3==0 && contadorFilas!=1){
					contenedor+="</div>";
					abrirFila=true;
				}
			}
			
			contadorFilas++;
			
		}//for

		contenedor+="</div>";
		document.getElementById('page-wrapper').innerHTML=contenedor;
		cargarFiltrosProyectos();
		marcarFiltroEstado(estado);
		document.getElementById(orden).setAttribute("selected","selected");
		mostrarCapa(3);
}

function cargarFiltrosProyectos () {
	var contenedor="";
	contenedor="<div class='row'>";
	contenedor+="<div class='col-sm-4 selectResponsive'>";
	contenedor+="<div class='input-group'>";
	contenedor+="<label class='input-group-addon' for='orden'>Ordenar por:</label><select id='ordenProyectos' class='form-control' name='orden'  onchange='desactivarAnimacion(); cargarProyectos("+'"'+estadoOrden+'"'+");'>";
	contenedor+="<option id='Alumno'>Alumno</option>";
	contenedor+="<option id='Tutor'>Tutor</option>";
	contenedor+="<option id='Ciclo'>Ciclo</option>";
	contenedor+="<option id='Convocatoria'>Convocatoria</option>";
	contenedor+="</select>";
	contenedor+="</div>";
	contenedor+="</div>";

	contenedor+="<div class='botonesEstado col-sm-8'>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='sinAsignarLabel'>";
  	contenedor+="<input type='radio' name='estado' id='sinAsignar' value='sinAsignar' onchange='desactivarAnimacion(); cargarProyectos("+'"sinAsignar"'+");'> Sin asignar";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='sinAcabarLabel'>";
  	contenedor+="<input type='radio' name='estado' id='sinAcabar' value='sinAcabar' onchange='desactivarAnimacion(); cargarProyectos("+'"sinAcabar"'+");'> Sin acabar";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='finalizadosLabel'>";
  	contenedor+="<input type='radio' name='estado' id='finalizados' value='finalizados' onchange='desactivarAnimacion(); cargarProyectos("+'"finalizados"'+");'> Finalizados";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='enCursoLabel'>";
  	contenedor+="<input type='radio' name='estado' id='enCurso' value='enCurso' onchange='desactivarAnimacion(); cargarProyectos("+'"enCurso"'+");'> En curso";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='todosLabel'>";
  	contenedor+="<input type='radio' name='estado' id='todos' value='todos' onchange='desactivarAnimacion(); cargarProyectos("+'"todos"'+");'> Todos";
	contenedor+="</label>";
	contenedor+="</div>";

	contenedor+="<div class='col-sm-4 mostrarResponsive'>";
	contenedor+="<div class='input-group'>";
	contenedor+="<label class='input-group-addon' for='orden'>Mostrar:</label><select id='estadoProyectos' class='form-control' name='estadoProyectos'  onchange='desactivarAnimacion(); cambiarEstado();'>";
	contenedor+="<option id='todosResponsive' value='todos'>Todos</option>";
	contenedor+="<option id='enCursoResponsive' value='enCurso'>En curso</option>";
	contenedor+="<option id='finalizadosResponsive' value='finalizados'>Finalizados</option>";
	contenedor+="<option id='sinAcabarResponsive' value='sinAcabar'>Sin acabar</option>";
	contenedor+="<option id='sinAsignarResponsive' value='sinAsignar'>Sin asignar</option>";
	contenedor+="</select>";
	contenedor+="</div>";
	contenedor+="</div>";

	contenedor+="</div>";
	document.getElementById("menuSuperior").innerHTML=contenedor;
}
function cargarFiltrosProyectosAdmin () {
	var contenedor="";
	contenedor="<div class='row'>";
	contenedor+="<div class='col-sm-4 selectResponsive'>";
	contenedor+="<div class='input-group'>";
	contenedor+="<label class='input-group-addon' for='orden'>Ordenar por:</label><select id='ordenProyectos' class='form-control' name='orden'  onchange='desactivarAnimacion(); adminProyectos("+'"'+estadoOrden+'"'+");'>";
	contenedor+="<option id='Alumno'>Alumno</option>";
	contenedor+="<option id='Tutor'>Tutor</option>";
	contenedor+="<option id='Ciclo'>Ciclo</option>";
	contenedor+="<option id='Convocatoria'>Convocatoria</option>";
	contenedor+="</select>";
	contenedor+="</div>";
	contenedor+="</div>";

	contenedor+="<div class='botonesEstado col-sm-8'>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='sinAsignarLabel'>";
  	contenedor+="<input type='radio' name='estado' id='sinAsignar' value='sinAsignar' onchange='desactivarAnimacion(); adminProyectos("+'"sinAsignar"'+");'> Sin asignar";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='sinAcabarLabel'>";
  	contenedor+="<input type='radio' name='estado' id='sinAcabar' value='sinAcabar' onchange='desactivarAnimacion(); adminProyectos("+'"sinAcabar"'+");'> Sin acabar";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='finalizadosLabel'>";
  	contenedor+="<input type='radio' name='estado' id='finalizados' value='finalizados' onchange='desactivarAnimacion(); adminProyectos("+'"finalizados"'+");'> Finalizados";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='enCursoLabel'>";
  	contenedor+="<input type='radio' name='estado' id='enCurso' value='enCurso' onchange='desactivarAnimacion(); adminProyectos("+'"enCurso"'+");'> En curso";
	contenedor+="</label>";
	contenedor+="<label class='radio-inline etiquetaBoton' id='todosLabel'>";
  	contenedor+="<input type='radio' name='estado' id='todos' value='todos' onchange='desactivarAnimacion(); adminProyectos("+'"todos"'+");'> Todos";
	contenedor+="</label>";
	contenedor+="</div>";

	contenedor+="<div class='col-sm-4 mostrarResponsive'>";
	contenedor+="<div class='input-group'>";
	contenedor+="<label class='input-group-addon' for='orden'>Mostrar:</label><select id='estadoProyectos' class='form-control' name='estadoProyectos'  onchange='desactivarAnimacion(); cambiarEstado();'>";
	contenedor+="<option id='todosResponsive' value='todos'>Todos</option>";
	contenedor+="<option id='enCursoResponsive' value='enCurso'>En curso</option>";
	contenedor+="<option id='finalizadosResponsive' value='finalizados'>Finalizados</option>";
	contenedor+="<option id='sinAcabarResponsive' value='sinAcabar'>Sin acabar</option>";
	contenedor+="<option id='sinAsignarResponsive' value='sinAsignar'>Sin asignar</option>";
	contenedor+="</select>";
	contenedor+="</div>";
	contenedor+="</div>";

	contenedor+="</div>";
	document.getElementById("menuSuperior2").innerHTML=contenedor;
}

function cargarFiltrosAlumnos () {
	var contenedor="";
	contenedor="<div class='row'>";
	contenedor+="<div class='col-sm-4 selectResponsive'>";
	contenedor+="<div class='input-group'>";
	contenedor+="<label class='input-group-addon' for='orden'>Ordenar por:</label><select id='ordenAlumnos' class='form-control' name='orden'  onchange='desactivarAnimacion(); adminProyectos("+'"'+estadoOrden+'"'+");'>";
	contenedor+="<option id='Nombre'>Nombre</option>";
	contenedor+="<option id='Ciclo'>Ciclo</option>";
	contenedor+="<option id='Email'>Email</option>";
	contenedor+="</select>";
	contenedor+="</div>";
	contenedor+="</div>";

	contenedor+="<div class='fullWidth padded'>";
	contenedor+="<input type='text' class='form-control right' name='busquedaAlumnos' value='' placeholder='Buscar ...'>";
	contenedor+="</div>";

	contenedor+="</div>";
	document.getElementById("menuSuperiorAlumnos").innerHTML=contenedor;
}

function cargarFiltrosProfesores () {
	var contenedor="";
	contenedor="<div class='row'>";
	contenedor+="<div class='fullWidth padded'>";
	contenedor+="<input type='text' class='form-control' name='busquedaAlumnos' value='' placeholder='Buscar ...'>";
	contenedor+="</div>";

	contenedor+="</div>";
	document.getElementById("menuSuperiorProfesores").innerHTML=contenedor;
}

function verProyecto (id) {
	var ajax = new XMLHttpRequest();
	ajax.open("post","proyecto.html");
	ajax.send();
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
 			fillProyecto(id);
 		}
 	};
}

/**
 * Funcion que reyena los datos de un proyecto
 * Eficiencia: la variable se consigue en la pagina anterior, se almacena en un JSON
 * para acceder a ella de forma local, y evitar asi la peticion al servidor.
 * @param  {int} id ID del proyecto al que se accede
 */
function fillProyecto (id) {
	$("#page-wrapper").css("display","none");
	//seleccionar proyecto
	var proyecto=null;
	var i=0;
	while(proyecto==null && i < proyectos.numProyectos){ // seleccionar el proyecto
		if(proyectos[i].IDProyecto==id){
			proyecto=proyectos[i];
		}
		i++;
	}
	if (proyecto==null) {
		bootbox.alert("Proyecto no encontrado",function(){cargarProyectos(estadoOrden)});
	}
	else{
		document.getElementById("tituloProyecto").value=proyecto.descripcion;
		document.getElementById("alumno").innerHTML=proyecto.nombre+" "+proyecto.apellido1+" "+proyecto.apellido2;
		document.getElementById("tutor").innerHTML=proyecto.nombreProfe+" "+proyecto.profeApe1+" "+proyecto.profeApe2;
		document.getElementById("fechaAsig").value=proyecto.fecha_asig;
		document.getElementById("fechaPresentacion").value=proyecto.fecha_presentacion;
		document.getElementById("convocatoria").value=proyecto.convocatoria;
		document.getElementById("materia").value=proyecto.materia;
		document.getElementById("ciclo").value=proyecto.ciclo;
		document.getElementById("progreso").value=proyecto.porcentaje+" %";
		document.getElementById("nota").value=proyecto.nota;
		document.getElementById("idProyecto").value=proyecto.IDProyecto;
		document.getElementById("idAlumno").value=proyecto.IDAlumno;
		document.getElementById("idProfesor").value=proyecto.IDProfesor;
		var estado=getNombreEstado(proyecto.estado);
		document.getElementById("estado").innerHTML=estado;
		mostrarCapa(31);
	}
	
}

function retroceder () {
	var url=document.URL;
	url=url.split("#");
	url=url[1];
	if(url=="verProyecto"){
		cargarProyectos("none");
	}
	else{
		adminProyectos("none");
	}
	
}

function habilitarEdicion () {

	var idAlumno=document.getElementById("idAlumno").value;
	var idProfesor=document.getElementById("idProfesor").value;
	var idProyecto=document.getElementById("idProyecto").value;
	var formulario=document.getElementById("formEditarProyecto");
	var selects=formulario.getElementsByTagName("select");
	formulario=formulario.getElementsByTagName("input");
	for(var i=0; i<formulario.length; i++){
		formulario[i].removeAttribute("disabled");
	}
	for (var i = 0; i < selects.length; i++) {
		selects[i].removeAttribute("disabled");
	};
	if(idAlumno==0){
		habilitarAlumno();
	}
	
	var alumnos = new XMLHttpRequest();
	alumnos.open("post",SERVER);
	alumnos.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	alumnos.send("action=getNombreAlumnos&idAlumno="+idAlumno);
	alumnos.onreadystatechange=function() {
 		if(alumnos.readyState==4&&alumnos.status==200){
 			var requestAlumnos=JSON.parse(alumnos.responseText);
 			for(var i=0; i<requestAlumnos.numAlumnos; i++){
 				document.getElementById("alumnoSelect").innerHTML+="<option value='"+requestAlumnos[i]['id']+"'>"+requestAlumnos[i]['nombre']+"</option>";
 			}
 		}
 	};
	var profesores = new XMLHttpRequest();
	profesores.open("post",SERVER);
	profesores.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	profesores.send("action=getNombreProfesores&idProfesor="+idProfesor);
	profesores.onreadystatechange=function() {
 		if(profesores.readyState==4&&profesores.status==200){
 			var requestProfesores=JSON.parse(profesores.responseText);
 			var optionsProfesores="";
 			for(var i=0; i<requestProfesores.numProfesores; i++){
 				document.getElementById("tutorSelect").innerHTML+="<option value='"+requestProfesores[i]['id']+"'>"+requestProfesores[i]['nombre']+"</option>";
 			}
 			
 			
 		}
 	};
 	var estados = new XMLHttpRequest();
	estados.open("post",SERVER);
	estados.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	estados.send("action=getNombreEstados&idProyecto="+idProyecto);
	estados.onreadystatechange=function() {
 		if(estados.readyState==4&&estados.status==200){
 			var requestEstados=JSON.parse(estados.responseText);
 			var optionsEstados="";
 			for(var i=0; i<requestEstados.numEstados; i++){
 				document.getElementById("estadoSelect").innerHTML+="<option value='"+requestEstados[i]['id']+"'>"+requestEstados[i]['nombre']+"</option>";
 			}
 			
 			
 		}
 	};


	$("#botonAplicar").fadeIn();
	$("#botonCancelar").fadeIn();

	//quitar el % del progreso
	var progreso=document.getElementById("progreso").value;
	progreso=parseInt(progreso);
	document.getElementById("progreso").value=progreso;
}

function aplicarEdicion () {
	var editar=true;
	var idAlumno=document.getElementById("idAlumno").value;
	if(idAlumno==0){
		if(document.getElementById("alumnoSelect").value!=0 && document.getElementById("tutorSelect").value==0){
			bootbox.alert("Si se asigna un alumno, debe ser asignado un tutor");
			editar=false;
		}
		else if(document.getElementById("tutorSelect").value!=0 && document.getElementById("alumnoSelect").value==0){
			bootbox.alert("Si se asigna un tutor, debe ser asignado un alumno");
			editar=false;
		}
	}
	
	else if(editar){
		var formulario=document.getElementById("formEditarProyecto");
		var datos=new FormData(formulario);
		datos.append("action","editarProyecto");
		var ajax = new XMLHttpRequest();
		ajax.open("post",SERVER);
		ajax.send(datos);
		ajax.onreadystatechange=function() {
	 		if(ajax.readyState==4&&ajax.status==200){
	 			//alert(ajax.responseText);
	 			var request=JSON.parse(ajax.responseText);
	 			if(request['warning']!=0 || request['warning2']!=0){
	 				bootbox.alert("Algún campo no se actualizó correctamente", function(){
	 					estadoOrden="nonee"; //lo pongo diferente para que recargue los proyectos
	 					var url=document.URL;
						url=url.split("#");
						url=url[1];
						if(url=="verProyecto"){
							cargarProyectos("none");
						}
						else{
							adminProyectos("none");
						}
	 				});
	 			}
	 			else{
	 				bootbox.alert("¡Proyecto actualizado!", function(){
	 					estadoOrden="nonee"; //lo pongo diferente para que recargue los proyectos
	 					var url=document.URL;
	 					url=url.split("#");
						url=url[1];
						if(url=="verProyecto"){
							cargarProyectos("none");
						}
						else{
							adminProyectos("none");
						}
	 				});
	 			}
	 		}
	 	};
	}
	
 	return false;
}

function cancelarEdicion () {
	var id=document.getElementById("idProyecto").value;
	verProyecto(id);
}

function eliminarProyecto () {
	var formulario=document.getElementById("formEditarProyecto");
	var datos=new FormData(formulario);
	datos.append("action","eliminarProyecto");
	bootbox.confirm("¿Seguro que desea eliminar el proyecto?", function(result){
		if(result){
			var ajax = new XMLHttpRequest();
			ajax.open("post",SERVER);
			ajax.send(datos);
			ajax.onreadystatechange=function() {
		 		if(ajax.readyState==4&&ajax.status==200){
		 			var request=JSON.parse(ajax.responseText);
		 			if(request.warning==0 && request.warning2==0){
		 				bootbox.alert("Proyecto eliminado correctamente", function(){
		 					estadoOrden="none"; //lo pongo diferente para que recargue los proyectos
		 					cargarProyectos("todos");
		 				});
		 			}
		 			else{
		 				bootbox.alert("Ha habido algún error eliminando el proyecto", function(){
		 					estadoOrden="none"; //lo pongo diferente para que recargue los proyectos
		 					cargarProyectos("todos");
		 				});
		 			}
		 			
		 		}
		 	};
		}//if
	});//confirm
	
}

function adminProyectos (estado) {
	document.getElementById("page-wrapper").style.display="none";
	var ordenCambiado="Alumno";
	if(document.getElementById("ordenProyectos")){
		ordenCambiado=document.getElementById("ordenProyectos").value;
	}
	if(estadoOrden!=estado || ordenCambiado!=orden){ //si se cambia el filtro ESTADO, se vuelve a hacer la peticion
		proyectosCargados=false;
	}
	if(proyectosCargados){
		fillAdminProyectos(estado);
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
	 			proyectos=JSON.parse(ajax.responseText);
	 			proyectosCargados=true;
	 			if(proyectos.warning==2){
	 				bootbox.alert("No estas registrado como administrador", function(){window.location="../index.html"});
	 			}
	 			else{
		 			fillAdminProyectos(estado);
	 			}// else if warning==2
	 		}//if ajax.status == 200
	 	};
	}	
}

function fillAdminProyectos (estado) {

	var contenedor="<div class='container-fluid'>";
	/* Menu superior para los filtros */
	contenedor+="<div id='menuSuperior2'></div>";
	contenedor+="<button type='submit' onclick='addProyecto();' class='btn btn-default center-block marginBot'>Añadir proyecto</button>";
	contenedor+="<table class='table table-hover'>";
	contenedor+="<thead><tr><th>Proyecto</th><th>Estado</th><th>Convocatoria</th><th class='ver'>Ver</th></tr></thead>";
	contenedor+="<tbody>";
	for(var i=0; i<proyectos.numProyectos; i++){
		contenedor+="<tr>";
		contenedor+="<td>"+proyectos[i]['descripcion']+"</td>";
		contenedor+="<td>"+getNombreEstado(proyectos[i]['estado'])+"</td>";
		contenedor+="<td>"+proyectos[i]['convocatoria']+"</td>";
		contenedor+="<td class='ver'>";
		contenedor+="<img src='../img/view.png' onclick='verProyecto("+proyectos[i].IDProyecto+");' class='imagenVerProyecto ver'>";
		contenedor+="</td>";
		contenedor+="</tr>";

	}
	contenedor+="</tbody>";
	contenedor+="</table>";
	contenedor+="</div>";
	document.getElementById('page-wrapper').innerHTML=contenedor;
	mostrarCapa(43);
	cargarFiltrosProyectosAdmin();
	marcarFiltroEstado(estado);
	document.getElementById(orden).setAttribute("selected","selected");
	
}

function adminAlumnos () {
	document.getElementById("page-wrapper").style.display="none";
	var contenedor="<div class='container-fluid'>";
	contenedor+="<div id='menuSuperiorAlumnos'></div>";
	contenedor+="<button type='submit' onclick='addAlumno();' class='btn btn-default center-block marginBot2'>Añadir alumno</button>";
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=getAlumnos");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var alumnos=JSON.parse(ajax.responseText);
 			contenedor+="<table class='table table-hover'>";
			contenedor+="<thead><tr><th>Alumno</th><th>DNI</th><th class='hidden-xs'>Email</th><th class='hidden-xs'>Ciclo</th><th class='ver'>Ver</th></tr></thead>";
			contenedor+="<tbody>";
			for (var i = 0; i < alumnos.numeroAlumnos; i++) {
				contenedor+="<tr>";
				contenedor+="<td>"+alumnos[i]['nombre']+"</td>";
				contenedor+="<td>"+alumnos[i]['dni']+"</td>";
				contenedor+="<td class='hidden-xs'>"+alumnos[i]['email']+"</td>";
				contenedor+="<td class='hidden-xs'>"+alumnos[i]['ciclo']+"</td>";
				contenedor+="<td class='ver'>";
				contenedor+="<img src='../img/view.png' onclick='verAlumno("+alumnos[i]['id']+")' class='imagenVerProyecto ver'>";
				contenedor+="</td>";
				contenedor+="</tr>";
			};
			contenedor+="</tbody>";
			contenedor+="</table>";
			contenedor+="</div>";

			document.getElementById('page-wrapper').innerHTML=contenedor;
			cargarFiltrosAlumnos();
			mostrarCapa(41);
 		}
 	};

}

function adminProfesores () {
	document.getElementById("page-wrapper").style.display="none";
	var contenedor="<div class='container-fluid'>";
	contenedor+="<div id='menuSuperiorProfesores'></div>";
	contenedor+="<button type='submit' onclick='addProfesor();' class='btn btn-default center-block marginBot2'>Añadir profesor</button>";
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("action=getProfesores");
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var profesores=JSON.parse(ajax.responseText);
 			contenedor+="<table class='table table-hover'>";
			contenedor+="<thead><tr><th>Profesor</th><th>Email</th><th class='ver'>Ver</th></tr></thead>";
			contenedor+="<tbody>";
			//alert(ajax.responseText);
			for (var i = 0; i < profesores.numeroProfesores; i++) {
				contenedor+="<tr>";
				contenedor+="<td>"+profesores[i]['nombre']+"</td>";
				contenedor+="<td>"+profesores[i]['email']+"</td>";
				contenedor+="<td class='ver'>";
				contenedor+="<img src='../img/view.png' onclick='verProfesor("+profesores[i]['id']+")' class='imagenVerProyecto ver'>";
				contenedor+="</td>";
				contenedor+="</tr>";
			};
			contenedor+="</tbody>";
			contenedor+="</table>";
			contenedor+="</div>";

			document.getElementById('page-wrapper').innerHTML=contenedor;
			cargarFiltrosProfesores();
			mostrarCapa(42);
 		}
 	};
}

function addProyecto () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax = new XMLHttpRequest();
	ajax.open("post","proyectoEdit.html");
	ajax.send();
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
 			cargarSelects();
 		}
 	};
}

function cargarSelects () {
		var alumnos = new XMLHttpRequest();
		alumnos.open("post",SERVER);
		alumnos.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		alumnos.send("action=getNombreAlumnos");
		alumnos.onreadystatechange=function() {
	 		if(alumnos.readyState==4&&alumnos.status==200){
	 			var requestAlumnos=JSON.parse(alumnos.responseText);
	 			for(var i=0; i<requestAlumnos.numAlumnos; i++){
	 				document.getElementById("alumnoSelect").innerHTML+="<option value='"+requestAlumnos[i]['id']+"'>"+requestAlumnos[i]['nombre']+"</option>";
	 			}
	 		}
	 	};
	var profesores = new XMLHttpRequest();
	profesores.open("post",SERVER);
	profesores.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	profesores.send("action=getNombreProfesores");
	profesores.onreadystatechange=function() {
 		if(profesores.readyState==4&&profesores.status==200){
 			var requestProfesores=JSON.parse(profesores.responseText);
 			var optionsProfesores="";
 			for(var i=0; i<requestProfesores.numProfesores; i++){
 				document.getElementById("tutorSelect").innerHTML+="<option value='"+requestProfesores[i]['id']+"'>"+requestProfesores[i]['nombre']+"</option>";
 			}
 			
 			
 		}
 	};
 	var estados = new XMLHttpRequest();
	estados.open("post",SERVER);
	estados.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	estados.send("action=getNombreEstados");
	estados.onreadystatechange=function() {
 		if(estados.readyState==4&&estados.status==200){
 			var requestEstados=JSON.parse(estados.responseText);
 			var optionsEstados="";
 			for(var i=0; i<requestEstados.numEstados; i++){
 				document.getElementById("estadoSelect").innerHTML+="<option value='"+requestEstados[i]['id']+"'>"+requestEstados[i]['nombre']+"</option>";
 			}
 			
 			
 		}
 	};
 	document.getElementById("botonAplicar").value="Añadir proyecto";
 	$("#botonAplicar").fadeIn();
	$("#botonCancelar").fadeIn();
	mostrarCapa(43);

}

function cancelarAddProyecto () {
	
}

function confirmAddProyecto () {
	if(document.getElementById("alumnoSelect").value!=0 && document.getElementById("tutorSelect").value==0){
		bootbox.alert("Si se asigna un alumno, debe ser asignado un tutor");
	}
	else if(document.getElementById("tutorSelect").value!=0 && document.getElementById("alumnoSelect").value==0){
		bootbox.alert("Si se asigna un tutor, debe ser asignado un alumno");
	}
	else{
		var formulario=document.getElementById("formAddProyecto");
		var datos=new FormData(formulario);
		datos.append("action","addProyecto");
		var ajax = new XMLHttpRequest();
		ajax.open("post",SERVER);
		ajax.send(datos);
		ajax.onreadystatechange=function() {
	 		if(ajax.readyState==4&&ajax.status==200){
	 			//alert(ajax.responseText);
	 			var request=JSON.parse(ajax.responseText);
	 			if(request.warning==0 && request.warning2==0){
	 				bootbox.alert("Proyecto agregado correctamente", function(){
	 					estadoOrden="none"; //lo pongo diferente para que recargue los proyectos
	 					adminProyectos("todos");
	 				});
	 			}
	 			else{
	 				bootbox.alert("Ha ocurrido algún error, antes de agregarlo de nuevo, revise los proyectos actuales", function(){
	 					estadoOrden="none"; //lo pongo diferente para que recargue los proyectos
	 					adminProyectos("todos");
	 				});
	 			}
	 		}
	 	};
	}
	return false;
	
}

function habilitarAlumno () {
	if(document.getElementById("alumnoSelect").value==0){
		document.getElementById("fechaAsig").setAttribute("disabled","disabled");
		document.getElementById("fechaPresentacion").setAttribute("disabled","disabled");
		document.getElementById("convocatoria").setAttribute("disabled","disabled");
	}
	else{
		document.getElementById("fechaAsig").removeAttribute("disabled");
		document.getElementById("fechaPresentacion").removeAttribute("disabled");
		document.getElementById("convocatoria").removeAttribute("disabled");
	}
	
}


/**
 * Dependiendo del numero del estado, devuelve una cadena con el nombre del estado
 * @param  {int} estado numero del estado
 * 0 todos, 2 asignado, 3 en curso, 4 finalizado, 5 sin acabar, 6 sin asignar
 * @return {string} estado  nombre del estado
 */
function getNombreEstado (estado) {
	var cadenaEstado="";
	estado=parseInt(estado);
	switch(estado){
		case 1: cadenaEstado="Reservado";
		break;
		case 2: cadenaEstado="Asignado";
		break;
		case 3: cadenaEstado="En curso";
		break;
		case 4: cadenaEstado="Finalizado";
		break;
		case 5: cadenaEstado="Sin acabar";
		break;
		case 6: cadenaEstado="Sin asignar";
		break;
	}
	return cadenaEstado;
}

function addAlumno () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax = new XMLHttpRequest();
	ajax.open("post","alumnoEdit.html");
	ajax.send();
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
 			cargarCiclos();
 		}
 	};
}

function cargarCiclos () {
	var ciclos = new XMLHttpRequest();
	ciclos.open("post",SERVER);
	ciclos.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ciclos.send("action=getNombreCiclos");
	ciclos.onreadystatechange=function() {
 		if(ciclos.readyState==4&&ciclos.status==200){
 			//alert(ciclos.responseText);
 			var requestCiclos=JSON.parse(ciclos.responseText);
 			var optionsCiclos="";
 			for(var i=0; i<requestCiclos.numCiclos; i++){
 				document.getElementById("cicloSelect").innerHTML+="<option value='"+requestCiclos[i]['id']+"'>"+requestCiclos[i]['nombre']+"</option>";
 			}
 			
 			
 		}
 	};
 	document.getElementById("botonAplicar").value="Añadir alumno";
 	$("#botonAplicar").fadeIn();
	$("#botonCancelar").fadeIn();
	mostrarCapa(41);
}

function confirmAddAlumno () {
	var formulario=document.getElementById("formAddAlumno");
	var datos=new FormData(formulario);
	datos.append("action","addAlumno");
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(datos);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			//alert(ajax.responseText);
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==0){
 				bootbox.alert("Alumno agregado correctamente", function(){
 					adminAlumnos();
 				});
 			}
 			else{
 				bootbox.alert("Ha ocurrido algún error, antes de agregarlo de nuevo, revise los alumnos actuales", function(){
 					adminAlumnos();
 				});
 			}
 		}
 	};
 	return false;
}

function verAlumno (id) {
	document.getElementById("page-wrapper").style.display="none";
	var ajax=new XMLHttpRequest();
	ajax.open("post","alumnoView.html");
	ajax.send();
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4&&ajax.status==200){
			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
			rellenarAlumno(id);
		}
	};
}

function rellenarAlumno (id) {
	var alumno = new XMLHttpRequest();
	alumno.open("post",SERVER);
	alumno.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	alumno.send("action=getAlumno&id="+id);
	alumno.onreadystatechange=function() {
 		if(alumno.readyState==4&&alumno.status==200){
 			var request=JSON.parse(alumno.responseText);
 			$("#nombre").val(request.nombre);
 			$("#apellido1").val(request.apellido1);
 			$("#apellido2").val(request.apellido2);
 			$("#password").val(request.password);
 			$("#dni").val(request.dni);
 			$("#ciclo").html(request.ciclo);
 			$("#email").val(request.email);
 			$("#idAlumno").val(request.id);
 			$("#idCiclo").val(request.idCiclo);
 			mostrarCapa(41);
 		}
 	};
}

function retrocederAlumno () {
	var url=document.URL;
	url=url.split("#");
	url=url[1].toLowerCase();
	//alert(url);
	if(url=="misalumnos"){
		cargarMisAlumnos();
	}
	else{
		adminAlumnos("none");
	}
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
 					adminAlumnos();
 				});
 			}
 			else{
 				bootbox.alert("Ha ocurrido algún error modificando los campos", function(){
 					adminAlumnos();
 				});
 			}
 		}
 	};
 	return false;
}

function eliminarAlumno () {
	var idAlumno=document.getElementById("idAlumno").value;
	bootbox.confirm("¿Seguro que desea eliminar este alumno?", function(result){
		if(result){
			var ajax = new XMLHttpRequest();
			ajax.open("post",SERVER);
			ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			ajax.send("action=eliminarAlumno&idAlumno="+idAlumno);
			ajax.onreadystatechange=function() {
		 		if(ajax.readyState==4&&ajax.status==200){
		 			var request=JSON.parse(ajax.responseText);
		 			if(request.warning==0){
		 				bootbox.alert("Alumno eliminado correctamente", function(){
		 					adminAlumnos();
		 				});
		 			}
		 			else{
		 				bootbox.alert("Ha habido algún error eliminando el alumno", function(){
		 					adminAlumnos();
		 				});
		 			}
		 			
		 		}
		 	};
		}//if
	});//confirm
}

function verProfesor (id) {
	document.getElementById("page-wrapper").style.display="none";
	var ajax=new XMLHttpRequest();
	ajax.open("post","profesorView.html");
	ajax.send();
	ajax.onreadystatechange=function(){
		if(ajax.readyState==4&&ajax.status==200){
			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
			rellenarProfesor(id);
		}
	};
}

function rellenarProfesor (id) {
	var profesor = new XMLHttpRequest();
	profesor.open("post",SERVER);
	profesor.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	profesor.send("action=getProfesor&id="+id);
	profesor.onreadystatechange=function() {
 		if(profesor.readyState==4&&profesor.status==200){
 			var request=JSON.parse(profesor.responseText);
 			$("#nombre").val(request.nombre);
 			$("#apellido1").val(request.apellido1);
 			$("#apellido2").val(request.apellido2);
 			$("#password").val(request.password);
 			$("#usuario").val(request.usuario);
 			$("#email").val(request.email);
 			$("#idProfesor").val(request.id);
 			mostrarCapa(42);
 		}
 	};
}

function retrocederProfesor () {
	adminProfesores();
}

function habilitarEdicionProfesor () {
	var formulario=document.getElementById("formAddProfesor");
	formulario=formulario.getElementsByTagName("input");
	for(var i=0; i<formulario.length; i++){
		formulario[i].removeAttribute("disabled");
	}

	$("#botonAplicar").fadeIn();
	$("#botonCancelar").fadeIn();
}

function aplicarEdicionProfesor () {
	formulario=new FormData(document.getElementById("formAddProfesor"));
	formulario.append("action","editarProfesor");
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(formulario);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==0){
 				bootbox.alert("Profesor modificado correctamente", function(){
 					adminProfesores();
 				});
 			}
 			else if(request.warning==2){
 				bootbox.alert("El nombre de usuario ya está en uso", function(){
 					adminProfesores();
 				});
 			}
 			else{
 				bootbox.alert("Ha ocurrido un error", function(){
 					adminProfesores();
 				});
 			}
 		}
 	};
 	return false;
}

function eliminarProfesor () {
	var idProfesor=document.getElementById("idProfesor").value;
	bootbox.confirm("¿Seguro que desea eliminar este profesor?", function(result){
		if(result){
			var ajax = new XMLHttpRequest();
			ajax.open("post",SERVER);
			ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			ajax.send("action=eliminarProfesor&idProfesor="+idProfesor);
			ajax.onreadystatechange=function() {
		 		if(ajax.readyState==4&&ajax.status==200){
		 			var request=JSON.parse(ajax.responseText);
		 			if(request.warning==0){
		 				bootbox.alert("Profesor eliminado correctamente", function(){
		 					adminProfesores();
		 				});
		 			}
		 			else{
		 				bootbox.alert("Ha habido algún error eliminando el profesor", function(){
		 					adminProfesores();
		 				});
		 			}
		 			
		 		}
		 	};
		}//if
	});//confirm
}

function addProfesor () {
	document.getElementById("page-wrapper").style.display="none";
	var ajax = new XMLHttpRequest();
	ajax.open("post","profesorEdit.html");
	ajax.send();
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			document.getElementById("page-wrapper").innerHTML=ajax.responseText;
 			mostrarCapa(42);
 			$("#botonAplicar").fadeIn();
			$("#botonCancelar").fadeIn();
 		}
 	};
}



function confirmAddProfesor () {
	var formulario=document.getElementById("formAddProfesor");
	var datos=new FormData(formulario);
	datos.append("action","addProfesor");
	var ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(datos);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			//alert(ajax.responseText);
 			var request=JSON.parse(ajax.responseText);
 			if(request.warning==0){
 				bootbox.alert("Profesor agregado correctamente", function(){
 					adminProfesores();
 				});
 			}
 			else if(request.warning==2){
 				bootbox.alert("Ese usuario ya está en uso", function(){
 					document.getElementById("usuario").value="";
 				});
 			}
 			else{
 				bootbox.alert("Ha ocurrido algún error, antes de agregarlo de nuevo, revise los profesores actuales", function(){
 					adminProfesores();
 				});
 			}
 		}
 	};
 	return false;
}










/****** Funciones de visualizacion  ********/

/**
 * Muestra la capa pasada por parametro con una transicion distinta para monitores mayores
 * de 768, y para monitores menores de esa resolucion.
 * Ademas comprueba que la transicion este activada o no.
 * @param  {int} capa numero de la capa a activar
 */
function mostrarCapa (capa) {
	
	if($(window).width() <= 768){
		if(transicion){
			$("#page-wrapper").show("slide"); //efecto móviles
		}
		else{
			document.getElementById("page-wrapper").style.display="inherit";
		}
		
		$("#colapsar").removeClass("in"); //cierra menu para resolucion < 768
	}
	else{
		if(transicion){
			$("#page-wrapper").fadeIn(); //efecto ordenador
		}
		else{
			document.getElementById("page-wrapper").style.display="inherit";
		}
	}

 	if(capa!=41 && capa!=42 && capa!=43){
 		$("#demo").removeClass("in"); //cierra el submenu administracion en caso de no estar en el
 	}
 	else{
 		$("#demo").addClass("in");
 	}

 	/* marcar el elemento del menu donde estoy situado */
 	for(i=1; i<=5; i++){
 		$("#menu"+i).removeClass("activeMenu");
 		$("#menu4"+i).removeClass("activeMenu");
 	}

 	if(capa==31){
 		$("#menu3").addClass("activeMenu");
 		$("#page-wrapper").addClass("noPadding");
 	}
 	else{
 		$("#menu3").removeClass("activeMenu");
 		$("#page-wrapper").removeClass("noPadding");
 	}
 	$("#menu"+capa).addClass("activeMenu");
 	transicion=true; //por defecto, la siguiente capa se muestra con animacion
}

function activarBarra (num) {
	$("#barra"+num).addClass("active");
}

function desactivarBarra (num) {
	$("#barra"+num).removeClass("active");
}

function cambiarEstado () {
	var estado=document.getElementById("estadoProyectos").value;
	cargarProyectos(estado);
}


function marcarFiltroEstado (estado) {
	if(estado=="none"){
		estado="todos";
	}
	document.getElementById(estado+"Label").style.fontWeight="bold";
	document.getElementById(estado).setAttribute("checked","checked");
	document.getElementById(estado+"Responsive").setAttribute("selected","selected");
}

/**
 * Desactiva la animacion para la siguiente vez que se muestra una capa
 */
function desactivarAnimacion(){
	transicion=false;
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
 				bootbox.alert("No estas registrado como administrador", function(){window.location="../index.html"});
 			}
 			else{
 				document.getElementById("nombrePerfil").innerHTML+=request.nombre+" "+request.apellido1;
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
	ajax.open("post","profesorView.html");
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
 			$("#usuario").val(request.usuario);
 			$("#email").val(request.email);
 			$("#idProfesor").val(request.id);
 			$("#retroceder").hide();
 			$("#eliminar").hide();
 			mostrarCapa(0);

 		}
 	};
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











