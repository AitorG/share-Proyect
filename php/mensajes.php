<?php  

function getMensajes()
{
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();

	$id=$_SESSION['id'];
	$estarAsignado=mysqli_query($con, "select IDProyecto from proyecto_alumno_profesor where IDProfesor=$id or IDAlumno=$id");
	if(mysqli_num_rows($estarAsignado)>0){
		$idProyecto=mysqli_fetch_array($estarAsignado);
		$idProyecto=$idProyecto['IDProyecto'];

		$mensajes=mysqli_query($con, "select * from observaciones where IDProyecto=$idProyecto order by Fecha desc");
		if(mysqli_num_rows($mensajes)>0){
			$i=0;
			while($datos=mysqli_fetch_array($mensajes)){
				$json[$i]['idMensaje']=$datos['IDObservacion'];
				$json[$i]['descripcion']=$datos['Descripcion'];
				
				$fecha=$datos['Fecha'];
				$fecha=explode($fecha," ");
				$nombreProfe=mysqli_query($con, "select * from profesores where IDProfesor=$Profesor");
				$datosProfe=mysqli_fetch_array($nombreProfe);
				$nombreProfe=$datosProfe['Nombre']." ".$datosProfe['Apellido1'];
				$nombreAlumno=mysqli_query($con, "select * from alumnos where IDAlumno=$IDUsuario");
				$datosAlumno=mysqli_fetch_array($nombreAlumno);
				$nombreAlumno=$datosAlumno['Nombre']." ".$datosAlumno['Apellido1'];

				$json[$i]['fecha']=$fecha[0];
				$json[$i]['profesor']=$nombreProfe;
				$json[$i]['alumno']=$nombreAlumno;

				$i++;
			}
			$json['numMensajes']=$i;

		}

	}
	else{
		$json['warning']=1;
	}


	mysqli_close($con);
	echo json_encode($json);
}

function verMensajesProyecto($idProyecto)
{
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();

	$mensajes=mysqli_query($con, "select * from observaciones where IDProyecto=$idProyecto order by Fecha desc");
	if(mysqli_num_rows($mensajes)>0){
		$i=0;
		while($datos=mysqli_fetch_array($mensajes)){
			$json[$i]['idMensaje']=$datos['IDObservacion'];
			$json[$i]['descripcion']=$datos['Descripcion'];
			
			$fecha=$datos['Fecha'];
			$fecha=explode(" ",$fecha);
			$nombreProfe=mysqli_query($con, "select * from profesores where IDProfesor=".$datos['Profesor']."");
			$datosProfe=mysqli_fetch_array($nombreProfe);
			$nombreProfe=$datosProfe['Nombre']." ".$datosProfe['Apellido1'];
			$nombreAlumno=mysqli_query($con, "select * from alumnos where IDAlumno=".$datos['IDUsuario']."");
			$datosAlumno=mysqli_fetch_array($nombreAlumno);
			$nombreAlumno=$datosAlumno['Nombre']." ".$datosAlumno['Apellido1'];
			$soloFecha=$fecha[0];
			$soloFecha=explode("-",$soloFecha);
			$soloFecha=$soloFecha[2]."-".$soloFecha[1]."-".$soloFecha[0];

			$json[$i]['fecha']=$soloFecha."  <span style='float:right;'>".$fecha[1]."</span>";
			$json[$i]['profesor']=$nombreProfe;
			$json[$i]['alumno']=$nombreAlumno;

			$i++;
		}
		$json['numMensajes']=$i;

	}

	
	else{
		$json['warning']=1;
	}


	mysqli_close($con);
	echo json_encode($json);
}

function addMensajeProyecto($idProyecto, $mensaje){
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	mysqli_set_charset($con, "UTF-8");

	$mensaje=mysqli_real_escape_string($con, $mensaje);

	$result=mysqli_query($con, "select * from proyecto_alumno_profesor where IDProyecto=$idProyecto");
	$datos=mysqli_fetch_array($result);
	$idProfesor=$datos['IDProfesor'];
	$idAlumno=$datos['IDAlumno'];

	if(mysqli_query($con, "insert into observaciones values(default, '$mensaje', $idProyecto, $idAlumno, 1, now());")){
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}
	echo json_encode($json);
	$razon="Nuevo mensaje de proyecto";
		$body="Se ha añadido un nuevo mensaje a tu proyecto, revísalo.";
		$proyecto=$idProyecto;
		$whoSend=0;
		enviarEmail($razon,$body,$proyecto,$whoSend);

	$razon="Nuevo mensaje de proyecto";
		$body="Se ha añadido un nuevo mensaje a tu proyecto, revísalo.";
		$proyecto=$idProyecto;
		$whoSend=1;
		enviarEmail($razon,$body,$proyecto,$whoSend);

}




























?>