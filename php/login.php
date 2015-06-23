<?php 


function checkLogin($user, $password)
{

	$response=array();
	$conLogin=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	//el registro habitual sera de alumnos, asi que es el primero que se comprueba
	
	$alumno=mysqli_query($conLogin, "select * from alumnos where DNI='$user' and Password='$password'");
	if (mysqli_num_rows($alumno)==1) {
		$response['warning']="alumno"; 
		$datosAlumno=mysqli_fetch_array($alumno);
		$_SESSION['nombrePerfil']=$datosAlumno['Nombre']." ".$datosAlumno['Apellido1'];
		$_SESSION['user']=$datosAlumno['DNI'];
		$_SESSION['rol']="alumno";
		$_SESSION['id']=$datosAlumno['IDAlumno'];
		$response['nombrePerfil']=$datosAlumno['Nombre']." ".$datosAlumno['Apellido1'];
		$response['user']=$datosAlumno['DNI'];
		$response['rol']="alumno";
		$response['id']=$datosAlumno['IDAlumno'];
	}
	else{ 
		$profesor=mysqli_query($conLogin, "select * from profesores where Usuario='$user' and Password='$password'");
		if (mysqli_num_rows($profesor)==1) {
			$response['warning']="profesor"; 
			$response['rol']="profesor";
			$_SESSION['rol']="profesor";
			$datosProfesor=mysqli_fetch_array($profesor);
			$_SESSION['nombrePerfil']=$datosProfesor['Nombre']." ".$datosProfesor['Apellido1'];
			$_SESSION['user']=$datosProfesor['Usuario'];
			$_SESSION['id']=$datosProfesor['IDProfesor'];
			$response['nombrePerfil']=$datosProfesor['Nombre']." ".$datosProfesor['Apellido1'];
			$response['user']=$datosProfesor['Usuario'];
			if($datosProfesor['Admin']==1){
				$_SESSION['rol']="administrador";
				$response['rol']="administrador";
			}
			
		}
		else{ //ni es alumno ni es profesor
			$response['warning']="error";
		}
	}

	mysqli_close($conLogin);
	echo json_encode($response);

}

function datosPerfil()
{
	$json=array();
	if(!(isset($_SESSION['rol']))){
		$json['warning']=1;
	}
	else{
		$rol=$_SESSION['rol'];
		if($rol=="alumno"){
			getAlumno($_SESSION['id']);
		}
		else if($rol=="profesor" || $rol=="administrador"){
			getProfesor($_SESSION['id']);
		}
	}
}

function desconectar()
{	
	session_destroy();
	echo "done";
}

















?>