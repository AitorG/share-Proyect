const SERVER="php/connect.php";

function logIn () {
	var formulario=document.getElementById("loginForm");
	var data=new FormData(formulario);
	data.append("action","logIn");
	ajax = new XMLHttpRequest();
	ajax.open("post",SERVER);
	ajax.send(data);
	ajax.onreadystatechange=function() {
 		if(ajax.readyState==4&&ajax.status==200){
 			var request=JSON.parse(ajax.responseText);
			if(request['warning']=="error"){
				bootbox.alert('Usuario no encontrado');
			}
			else{
				var mensaje="Bienvenido "+request['nombrePerfil'];
				bootbox.alert(mensaje,function(){cargarPagina(request.rol)});
				
			}
			
			
 		}
 	};
	return false;
}

function cargarPagina (rol) {
	if(rol=="administrador"){
		window.location="html/profesor.html";
	}
	else if(rol=="profesor"){
		window.location="html/profesor.html";
	}
	else if(rol=="alumno"){
		window.location="html/alumno.html";
	}
}











