<?php  


function comprobarAdmin()
{
	$json=array();
	if(!(isset($_SESSION['rol']))){
		$json['warning']=1;
	}
	else if($_SESSION['rol']!="administrador" && $_SESSION['rol']!="profesor"){
		$json['warning']=1;
	}
	else{
		$json['warning']=0;
	}
	echo json_encode($json);
}

function profesorGetAlumnos()
{
	$conAlumnos=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	if(isset($_SESSION['id'])){
		$idProfesor=$_SESSION['id'];
		$relacion=mysqli_query($conAlumnos, "select alumnos.IDAlumno,alumnos.Nombre,alumnos.Apellido1,alumnos.Apellido2,alumnos.DNI,alumnos.Email,proyectos.descripcion,proyectos.porcentaje,proyectos.estado from alumnos, proyectos, proyecto_alumno_profesor where ((proyecto_alumno_profesor.IDProyecto=proyectos.IDProyecto and proyecto_alumno_profesor.IDAlumno=alumnos.IDAlumno) and (IDProfesor=$idProfesor) and (proyectos.estado!=6)) order by apellido1 desc;");
		if(mysqli_num_rows($relacion)<1){
			$json['warning']=1;
		}
		else{
			$i=0; //contador
			while($datos=mysqli_fetch_array($relacion)){
				
				$json[$i]['IDAlumno']=$datos['IDAlumno'];
				$json[$i]['Nombre']=$datos['Nombre'];
				$json[$i]['Apellido1']=$datos['Apellido1'];
				$json[$i]['Apellido2']=$datos['Apellido2'];
				$json[$i]['DNI']=$datos['DNI'];
				$json[$i]['Email']=$datos['Email'];
				$json[$i]['descripcion']=$datos['descripcion'];
				$json[$i]['porcentaje']=$datos['porcentaje'];
				$i++;
			}
			$json['numAlumnos']=$i;

		}
		echo json_encode($json);
		mysqli_close($conAlumnos);
	}
	else{
		$json['warning']=2;
		echo json_encode($json);
		mysqli_close($conAlumnos);
	}
	
	
}

function profesorGetProyectos($orden,$estado)
{
	$conProyectos=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	if(isset($_SESSION['id'])){
		$idProfesor=$_SESSION['id'];
		$ordenQuery="apellido1";
		$estadoQuery=0; //0 todos, 2 asignado, 3 en curso, 4 finalizado, 5 sin acabar, 6 sin asignar
		switch ($estado) {
			case 'asignados':
				$estadoQuery=2;
				break;
			case 'enCurso':
				$estadoQuery=3;
				break;
			case 'finalizados':
				$estadoQuery=4;
				break;
			case 'sinAcabar':
				$estadoQuery=5;
				break;
			case 'sinAsignar':
				$estadoQuery=6;
				break;
			
			default:
				$estadoQuery=0;
				break;
		}
		switch ($orden) {
			case 'Alumno':
				$ordenQuery="alumnos.apellido1";
				break;
			case 'Tutor':
				$ordenQuery="profeApe1";
				break;
			case 'Ciclo':
				$ordenQuery="alumnos.Ciclo";
				break;
			case 'Convocatoria':
				$ordenQuery="PAP.convocatoria";
				break;
		}


		if($estadoQuery==0){
			$proyectos=mysqli_query($conProyectos, "select PAP.IDProyecto, PAP.IDProfesor, PAP.Fecha_asig, PAP.Convocatoria, profesores.Nombre as nombreProfe, profesores.Apellido1 as profeApe1, profesores.Apellido2 as profeApe2,alumnos.IDAlumno, alumnos.Nombre, alumnos.Apellido1, alumnos.Apellido2, alumnos.Ciclo,proyectos.Descripcion,proyectos.Porcentaje, proyectos.Nota, proyectos.Estado, proyectos.Materia, proyectos.Fecha_presentacion from proyecto_alumno_profesor as PAP, profesores, alumnos, proyectos where (PAP.IDProfesor=profesores.IDProfesor and PAP.IDAlumno=alumnos.IDAlumno and PAP.IDProyecto=proyectos.IDProyecto and proyectos.Estado!=6) order by $ordenQuery asc;");
			$proyectosSinAsignar=mysqli_query($conProyectos, "select * from proyectos where Estado=6");
		}
		else{
			$proyectos=mysqli_query($conProyectos, "select PAP.IDProyecto, PAP.IDProfesor, PAP.Fecha_asig, PAP.Convocatoria, profesores.Nombre as nombreProfe, profesores.Apellido1 as profeApe1, profesores.Apellido2 as profeApe2,alumnos.IDAlumno, alumnos.Nombre, alumnos.Apellido1, alumnos.Apellido2, alumnos.Ciclo,proyectos.Descripcion,proyectos.Porcentaje, proyectos.Nota, proyectos.Estado, proyectos.Materia, proyectos.Fecha_presentacion from proyecto_alumno_profesor as PAP, profesores, alumnos, proyectos where (PAP.IDProfesor=profesores.IDProfesor and PAP.IDAlumno=alumnos.IDAlumno and PAP.IDProyecto=proyectos.IDProyecto) and (proyectos.Estado=$estadoQuery) order by $ordenQuery asc;");
			$proyectosSinAsignar=mysqli_query($conProyectos, "select * from proyectos where Estado=5640");;
			if($estadoQuery==6){
				$proyectos=mysqli_query($conProyectos, "select * from proyectos where Estado=4524");
				$proyectosSinAsignar=mysqli_query($conProyectos, "select * from proyectos where Estado=6");
			}
		}
		$i=0; //contador
		if(mysqli_num_rows($proyectos)<1){
			$json['warning']=1;
		}
		else{
			while($datos=mysqli_fetch_array($proyectos)){
				
				$json[$i]['IDProyecto']=$datos['IDProyecto'];
				$json[$i]['IDProfesor']=$datos['IDProfesor'];
				$json[$i]['IDAlumno']=$datos['IDAlumno'];
				$json[$i]['fecha_asig']=$datos['Fecha_asig'];
				$json[$i]['fecha_presentacion']=$datos['Fecha_presentacion'];
				$json[$i]['convocatoria']=$datos['Convocatoria'];
				$json[$i]['nombreProfe']=$datos['nombreProfe'];
				$json[$i]['profeApe1']=$datos['profeApe1'];
				$json[$i]['profeApe2']=$datos['profeApe2'];
				$json[$i]['nombre']=$datos['Nombre'];
				$json[$i]['apellido1']=$datos['Apellido1'];
				$json[$i]['apellido2']=$datos['Apellido2'];
				$json[$i]['descripcion']=$datos['Descripcion'];
				$json[$i]['porcentaje']=$datos['Porcentaje'];
				$json[$i]['estado']=$datos['Estado'];
				$json[$i]['materia']=$datos['Materia'];
				$json[$i]['nota']=$datos['Nota'];

				//nombre del ciclo
				$nombreCiclo=mysqli_query($conProyectos, "select NombreCiclo from ciclos where IDCiclo=".$datos['Ciclo']."");
				$datosConsultaCiclo=mysqli_fetch_row($nombreCiclo);
				$json[$i]['ciclo']=$datosConsultaCiclo[0];
				$i++;
			}
		}
		if(mysqli_num_rows($proyectosSinAsignar)>0){
			while($datosSinAsignar=mysqli_fetch_array($proyectosSinAsignar)){
				$json[$i]['IDProyecto']=$datosSinAsignar['IDProyecto'];
				$json[$i]['IDProfesor']=0;
				$json[$i]['IDAlumno']=0;
				$json[$i]['fecha_asig']="No asignado";
				$json[$i]['fecha_presentacion']=$datosSinAsignar['Fecha_presentacion'];
				$json[$i]['convocatoria']="Sin asignar";
				$json[$i]['nombreProfe']="Sin asignar";
				$json[$i]['profeApe1']="";
				$json[$i]['profeApe2']="";
				$json[$i]['nombre']="Sin asignar";
				$json[$i]['apellido1']="";
				$json[$i]['apellido2']="";
				$json[$i]['descripcion']=$datosSinAsignar['Descripcion'];
				$json[$i]['porcentaje']=$datosSinAsignar['Porcentaje'];
				$json[$i]['estado']=$datosSinAsignar['Estado'];
				$json[$i]['materia']=$datosSinAsignar['Materia'];
				$json[$i]['nota']=$datosSinAsignar['Nota'];
				$json[$i]['ciclo']="Sin asignar";
				$i++;
			}
		}
		
		$json['numProyectos']=$i;

		
		echo json_encode($json);
		mysqli_close($conProyectos);
	}
	else{
		$json['warning']=2;
		echo json_encode($json);
		mysqli_close($conProyectos);
	}
	
}

function getNombreAlumnos($idAlumno=0)
{
	$conAlumnos=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$alumnos=mysqli_query($conAlumnos, "select * from alumnos where IDAlumno!=$idAlumno;");
	$json=array();
	if(mysqli_num_rows($alumnos)>0){
		$json['warning']=0;
		$cont=0;
		while($nombreAlumnos=mysqli_fetch_array($alumnos)){
			$json[$cont]['nombre']=$nombreAlumnos['Nombre']." ".$nombreAlumnos['Apellido1']." ".$nombreAlumnos['Apellido2'];
			$json[$cont]["id"]=$nombreAlumnos['IDAlumno'];
			$cont++;
		}
		$json['numAlumnos']=$cont;
	}
	else{
		$json['warning']=1;
	}
	mysqli_close($conAlumnos);
	echo json_encode($json);
}

function getNombreProfesores($idProfesor=-1)
{
	$conProfesores=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$profesores=mysqli_query($conProfesores, "select * from profesores where IDProfesor!=$idProfesor;");
	$json=array();
	if(mysqli_num_rows($profesores)>0){
		$json['warning']=0;
		$cont=0;
		while($nombreProfesores=mysqli_fetch_array($profesores)){
			$json[$cont]['nombre']=$nombreProfesores['Nombre']." ".$nombreProfesores['Apellido1']." ".$nombreProfesores['Apellido2'];
			$json[$cont]["id"]=$nombreProfesores['IDProfesor'];
			$cont++;
		}
		$json["numProfesores"]=$cont;
	}
	else{
		$json['warning']=1;
	}
	mysqli_close($conProfesores);
	echo json_encode($json);
}

function aplicarEdicionProyecto($idProyecto,$titulo,$alumno,$tutor,$fechaAsig,$fechaPresentacion,$convocatoria,$progreso,$nota,$estado,$materia)
{
	$json=array();
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($con, "UTF-8");

	//escapado de caracteres
	$titulo=mysqli_real_escape_string($con, $titulo);
	$materia=mysqli_real_escape_string($con, $materia);

	$estaAsignado=mysqli_query($con, "select Estado from proyectos where IDProyecto=$idProyecto");
	$estaAsignado=mysqli_fetch_array($estaAsignado);
	$estaAsignado=$estaAsignado['Estado'];
	if($estaAsignado!=6){
		$consultaPAP="update proyecto_alumno_profesor set ";
		if($alumno!=0){
			$consultaPAP.="IDAlumno=$alumno, ";
		}
		if($tutor!=0){
			$consultaPAP.="IDProfesor=$tutor, ";
		}
		$consultaPAP.="Fecha_asig='$fechaAsig' , Convocatoria='$convocatoria' where IDProyecto=$idProyecto";
	}
	else{
		if($tutor==0 || $alumno==0){
			$json['warning']=5;
			$consultaPAP="select * from proyectos";
		}
		else{
			if($estado!=6){ //si el estado sigue en sin asignar por error, se marca asignado
				mysqli_query($con, "update proyectos set Estado=$estado where IDProyecto=$idProyecto");
			}
			else{
				mysqli_query($con, "update proyectos set Estado=2 where IDProyecto=$idProyecto");
			}
			
			$consultaPAP="insert into proyecto_alumno_profesor values($idProyecto,$alumno,$tutor,$fechaAsig,'$convocatoria')";
		}
		
	}
	

	if(mysqli_query($con, $consultaPAP)){
		$json['warning']=0;
		
	}
	else{
		$json['warning']=1;
	}
	$consultaProyectos="update proyectos set ";
	if($estado!=0){
		$consultaProyectos.=" Estado=$estado, ";
	}
	$consultaProyectos.="Descripcion='$titulo', Fecha_presentacion='$fechaPresentacion', Nota=$nota, Materia='$materia', Porcentaje=$progreso where IDProyecto=$idProyecto";
	if(mysqli_query($con, $consultaProyectos)){
		$json['warning2']=0;
	}
	else{
		$json['warning2']=1;
	}


	mysqli_close($con);
	echo json_encode($json);
	$razon="Modificación de proyecto";
		$body="Se ha modificado algunos parámetros de su proyecto, por favor, revíselos accediendo al gestor";
		$proyecto=$idProyecto;
		$whoSend=0;
		enviarEmail($razon,$body,$proyecto,$whoSend);

}

function eliminarProyecto($idProyecto,$alumno,$tutor){
	$conEliminar=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();

	if(mysqli_query($conEliminar, "delete from proyectos where IDProyecto=$idProyecto")){
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}
	if(mysqli_query($conEliminar, "delete from proyecto_alumno_profesor where IDProyecto=$idProyecto and IDAlumno=$alumno and IDProfesor=$tutor")){
		$json['warning2']=0;
	}
	else{
		$json['warning2']=1;
	}


	mysqli_close($conEliminar);
	echo json_encode($json);
}

function getNombreEstados($idProyecto=0)
{
	$conEstados=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	$idEstado=mysqli_query($conEstados, "select Estado from proyectos where IDProyecto=$idProyecto");
	if(mysqli_num_rows($idEstado)==1){
		$datoConsulta=mysqli_fetch_row($idEstado);
		$idEstado=$datoConsulta[0];
		$result=mysqli_query($conEstados, "select * from estados where IDEstado!=$idEstado");
		$i=0;
		while($datosEstados=mysqli_fetch_array($result)){
			$json[$i]['id']=$datosEstados['IDEstado'];
			$json[$i]['nombre']=$datosEstados['Descripcion'];
			$i++;
		}
		$json['numEstados']=$i;
		$json['warning']=0;
	}
	else{
		$result=mysqli_query($conEstados, "select * from estados");
		$i=0;
		while($datosEstados=mysqli_fetch_array($result)){
			$json[$i]['id']=$datosEstados['IDEstado'];
			$json[$i]['nombre']=$datosEstados['Descripcion'];
			$i++;
		}
		$json['numEstados']=$i;
		$json['warning']=1;
	}

	mysqli_close($conEstados);
	echo json_encode($json);

}

function getAlumnos()
{
	$conGetAlumnos=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$result=mysqli_query($conGetAlumnos, "select * from alumnos,ciclos where alumnos.Ciclo=ciclos.IDCiclo order by Apellido1");
	$json=array();

	$cont=0;
	while($datos=mysqli_fetch_array($result)){
		$json[$cont]['id']=$datos['IDAlumno'];
		$json[$cont]['nombre']=$datos['Apellido1']." ".$datos['Apellido2'].", ".$datos['Nombre'];
		$json[$cont]['dni']=$datos['DNI'];
		$json[$cont]['email']=$datos['Email'];
		$json[$cont]['ciclo']=$datos['NombreCiclo'];
		$cont++;
	}
	$json['numeroAlumnos']=$cont;

	mysqli_close($conGetAlumnos);
	echo json_encode($json);
}

function getProfesores(){
	$conGetProfesores=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$result=mysqli_query($conGetProfesores, "select * from profesores where Admin!=1");
	$json=array();

	$cont=0;
	while($datos=mysqli_fetch_array($result)){
		$json[$cont]['id']=$datos['IDProfesor'];
		$json[$cont]['nombre']=$datos['Apellido1']." ".$datos['Apellido2'].", ".$datos['Nombre'];
		$json[$cont]['email']=$datos['Email'];
		$cont++;
	}
	$json['numeroProfesores']=$cont;

	mysqli_close($conGetProfesores);
	echo json_encode($json);
}

function addProyecto($titulo,$materia,$alumno,$tutor,$progreso,$nota,$estado,$fechaAsig="0000-00-00",$fechaPresentacion="0000-00-00",$convocatoria=""){
	$conAddProyecto=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($conAddProyecto, "UTF-8");

	//escapado de caracteres
	$titulo=mysqli_real_escape_string($conAddProyecto, $titulo);
	$materia=mysqli_real_escape_string($conAddProyecto, $materia);
	$json=array();
	if($alumno==0){
		if(mysqli_query($conAddProyecto, "insert into proyectos values(default,'$titulo',6,$fechaPresentacion,now(),$fechaPresentacion,$nota,$progreso,0,default,default,'$materia')")){
			$json['warning']=0;
			$json['warning2']=0;
		}
		else{
			$json['warning']=1;
		}
	}
	else{
		if($estado==0){
			$estado=2;
		}
		if(mysqli_query($conAddProyecto, "insert into proyectos values(default,'$titulo',$estado,$fechaPresentacion,now(),$fechaPresentacion,$nota,$progreso,1,default,default,'$materia')")){
			$idProyecto=mysqli_query($conAddProyecto, "select IDProyecto from proyectos where Descripcion='$titulo' and Estado='$estado' and porcentaje=$progreso order by IDProyecto desc limit 1");
			$datoID=mysqli_fetch_array($idProyecto);
			$idProyecto=$datoID['IDProyecto'];
			if(mysqli_query($conAddProyecto, "insert into proyecto_alumno_profesor values($idProyecto,$alumno,$tutor,$fechaAsig,'$convocatoria')")){
				$json['warning2']=0;
			}
			else{
				$json['warning2']=1;
			}
			$json['warning']=0;
		}
		else{
			$json['warning']=1;
		}
	}


	mysqli_close($conAddProyecto);
	echo json_encode($json);
}

function getNombreCiclos($idCiclo=0)
{
	$conCiclos=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	
	$ciclos=mysqli_query($conCiclos, "select * from ciclos where IDCiclo!=$idCiclo");
	$i=0;
	while($datos=mysqli_fetch_array($ciclos)){
		$json[$i]['id']=$datos['IDCiclo'];
		$json[$i]['nombre']=$datos['NombreCiclo'];
		$i++;
	}
	$json["numCiclos"]=$i;

	mysqli_close($conCiclos);
	echo json_encode($json);

}

function addAlumno($nombre,$apellido1,$apellido2,$password,$dni,$email,$ciclo)
{
	$json=array();
	$conAlumno=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($conAlumno, "UTF-8");

	$nombre=mysqli_real_escape_string($conAlumno, $nombre);
	$apellido1=mysqli_real_escape_string($conAlumno, $apellido1);
	$apellido2=mysqli_real_escape_string($conAlumno, $apellido2);
	$email=mysqli_real_escape_string($conAlumno, $email);

	if(mysqli_query($conAlumno, "insert into alumnos values(default,'$nombre','$apellido1','$apellido2','$password','$dni','$email',$ciclo,0)")){
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}

	mysqli_close($conAlumno);
	echo json_encode($json);

}

function getAlumno($id)
{
	$conAlumno=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	$result=mysqli_query($conAlumno, "select * from alumnos where IDAlumno=$id");
	$alumno=mysqli_fetch_array($result);
	$json['id']=$alumno['IDAlumno'];
	$json['nombre']=$alumno['Nombre'];
	$json['apellido1']=$alumno['Apellido1'];
	$json['apellido2']=$alumno['Apellido2'];
	$json['password']=$alumno['Password'];
	$json['dni']=$alumno['DNI'];
	$json['email']=$alumno['Email'];

	$nombreCiclo=mysqli_query($conAlumno, "select * from ciclos where IDCiclo=".$alumno['Ciclo']."");
	$datosConsultaCiclo=mysqli_fetch_row($nombreCiclo);
	$json['ciclo']=$datosConsultaCiclo[1];
	$json['idCiclo']=$datosConsultaCiclo[0];

	mysqli_close($conAlumno);
	echo json_encode($json);


}

function editarAlumno($idAlumno,$nombre,$apellido1,$apellido2,$password,$dni,$email,$ciclo){
	$json=array();
	$conAlumno=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($conAlumno, "UTF-8");

	$nombre=mysqli_real_escape_string($conAlumno, $nombre);
	$apellido1=mysqli_real_escape_string($conAlumno, $apellido1);
	$apellido2=mysqli_real_escape_string($conAlumno, $apellido2);
	$email=mysqli_real_escape_string($conAlumno, $email);
	if($ciclo==0){
		$query="update alumnos set Nombre='$nombre', Apellido1='$apellido1', Apellido2='$apellido2', Password='$password', DNI='$dni', Email='$email' where IDAlumno=$idAlumno";
	}
	else{
		$query="update alumnos set Nombre='$nombre', Apellido1='$apellido1', Apellido2='$apellido2', Password='$password', DNI='$dni', Email='$email',Ciclo=$ciclo where IDAlumno=$idAlumno";
	}
	if(mysqli_query($conAlumno, $query)){
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}

	mysqli_close($conAlumno);
	echo json_encode($json);
	$razon="Modificación de tu perfil";
		$body="Se ha modificado algunos parámetros de su perfil, por favor, revísalo";
		$proyecto=$idProyecto;
		$whoSend=0;
		enviarEmail($razon,$body,$proyecto,$whoSend);
}

function eliminarAlumno($idAlumno)
{
	$conEliminar=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();

	if(mysqli_query($conEliminar, "delete from alumnos where IDAlumno=$idAlumno")){
		$asignacion=mysqli_query($conEliminar, "select * from proyecto_alumno_profesor where IDAlumno=$idAlumno");
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}


	mysqli_close($conEliminar);
	echo json_encode($json);
}

function getProfesor($id)
{
	$conProfesor=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	$result=mysqli_query($conProfesor, "select * from profesores where IDProfesor=$id");
	$profesor=mysqli_fetch_array($result);
	$json['id']=$profesor['IDProfesor'];
	$json['nombre']=$profesor['Nombre'];
	$json['apellido1']=$profesor['Apellido1'];
	$json['apellido2']=$profesor['Apellido2'];
	$json['password']=$profesor['Password'];
	$json['usuario']=$profesor['Usuario'];
	$json['email']=$profesor['Email'];

	mysqli_close($conProfesor);
	echo json_encode($json);


}

function editarProfesor($idProfesor,$nombre,$apellido1,$apellido2,$password,$usuario,$email){
	$json=array();
	$conAlumno=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($conAlumno, "UTF-8");

	$nombre=mysqli_real_escape_string($conAlumno, $nombre);
	$apellido1=mysqli_real_escape_string($conAlumno, $apellido1);
	$apellido2=mysqli_real_escape_string($conAlumno, $apellido2);
	$email=mysqli_real_escape_string($conAlumno, $email);
	
	$comprobarUsuario=mysqli_query($conAlumno, "select * from profesores where Usuario='$usuario' and IDProfesor!=$idProfesor");

	if(mysqli_num_rows($comprobarUsuario)>0){
		$json['warning']=2;
	}
	else{
		$query="update profesores set Nombre='$nombre', Apellido1='$apellido1', Apellido2='$apellido2', Password='$password', Usuario='$usuario', Email='$email' where IDProfesor=$idProfesor";	
		if(mysqli_query($conAlumno, $query)){
			$json['warning']=0;
		}
		else{
			$json['warning']=1;
		}
	}
	
	

	mysqli_close($conAlumno);
	echo json_encode($json);
}

function eliminarProfesor($idProfesor)
{
	$conEliminar=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();

	if(mysqli_query($conEliminar, "delete from profesores where IDProfesor=$idProfesor")){
		$json['warning']=0;
	}
	else{
		$json['warning']=1;
	}


	mysqli_close($conEliminar);
	echo json_encode($json);
}

function addProfesor($nombre,$apellido1,$apellido2,$password,$usuario,$email)
{
	$json=array();
	$conAlumno=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	mysqli_set_charset($conAlumno, "UTF-8");

	$nombre=mysqli_real_escape_string($conAlumno, $nombre);
	$apellido1=mysqli_real_escape_string($conAlumno, $apellido1);
	$apellido2=mysqli_real_escape_string($conAlumno, $apellido2);
	$email=mysqli_real_escape_string($conAlumno, $email);

	$comprobarUsuario=mysqli_query($conAlumno, "select * from profesores where Usuario='$usuario'");

	if(mysqli_num_rows($comprobarUsuario)>0){
		$json['warning']=2;
	}
	else{
		if(mysqli_query($conAlumno, "insert into profesores values(default,'$nombre','$apellido1','$apellido2','$usuario', '$password','$email',0)")){
			$json['warning']=0;
		}
		else{
			$json['warning']=1;
		}
	}


	

	mysqli_close($conAlumno);
	echo json_encode($json);

}

function getPerfil()
{
	if($_SESSION['rol']=="profesor" || $_SESSION['rol']=="administrador"){
		getProfesor($_SESSION['id']);

	}
	else if($_SESSION['rol']=="alumno"){
		getAlumno($_SESSION['id']);
	}
}

function getProyectoAlumno()
{
	$json=array();
	$conProyecto=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$idAlumno=$_SESSION['id'];
	$proyecto=mysqli_query($conProyecto, "select * from proyecto_alumno_profesor where IDAlumno=$idAlumno");
	if(mysqli_num_rows($proyecto)>1){
		$json['warning']=1;
	}
	else if(mysqli_num_rows($proyecto)<1){
		$json['warning']=2;
	}
	else{
		$json['warning']=0;
		$datos=mysqli_fetch_array($proyecto);
		$idProyecto=$datos['IDProyecto'];
		$idProfesor=$datos['IDProfesor'];
		$json['idProyecto']=$idProyecto;

		$datoProyecto=mysqli_query($conProyecto, "select * from proyectos where IDProyecto=$idProyecto");
		$datoProyecto=mysqli_fetch_array($datoProyecto);
		$json['materia']=$datoProyecto['Materia'];
		$fecha=$datoProyecto['Fecha_presentacion'];
		$fecha=explode("-",$fecha);
		$json['fecha']=$fecha[2]."-".$fecha[1]."-".$fecha[0];
		$json['nota']=$datoProyecto['Nota'];
		$json['titulo']=$datoProyecto['Descripcion'];
		$json['progreso']=$datoProyecto['Porcentaje'];

		$datoProfesor=mysqli_query($conProyecto, "select * from profesores where IDProfesor=$idProfesor");
		$datoProfesor=mysqli_fetch_array($datoProfesor);
		$json['tutor']=$datoProfesor['Nombre']." ".$datoProfesor['Apellido1']." ".$datoProfesor['Apellido2'];

		$datoAlumno=mysqli_query($conProyecto, "select Ciclo from alumnos where IDAlumno=$idAlumno");
		$datoAlumno=mysqli_fetch_array($datoAlumno);
		$json['ciclo']=$datoAlumno['Ciclo'];

		$datoCiclo=mysqli_query($conProyecto, "select NombreCiclo from ciclos where IDCiclo=".$json['ciclo']."");
		$datoCiclo=mysqli_fetch_array($datoCiclo);
		$json['ciclo']=$datoCiclo['NombreCiclo'];


		
	}
	mysqli_close($conProyecto);
	echo json_encode($json);
}

function cambiarProgreso($progreso=0)
{
	$conProyecto=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$idAlumno=$_SESSION['id'];
	$datos=mysqli_query($conProyecto, "select * from proyecto_alumno_profesor where IDAlumno=$idAlumno");
	$datos=mysqli_fetch_array($datos);
	$idProyecto=$datos['IDProyecto'];


	mysqli_query($conProyecto, "update proyectos set Porcentaje=$progreso where IDProyecto=$idProyecto");
	$razon="Modificación de proyecto";
		$body="Se ha modificado algunos parámetros de su proyecto, por favor, revíselos accediendo al gestor";
		$proyecto=$idProyecto;
		$whoSend=1;
		enviarEmail($razon,$body,$proyecto,$whoSend);
}


function subirArchivo($idProyecto){
	$fileName = $_SERVER['HTTP_X_FILE_NAME'];
	$contentLength = $_SERVER['CONTENT_LENGTH'];
	$path = '../files/';
	file_put_contents(
		$path . $fileName,
		file_get_contents("php://input")
		);
	$idUsuario = $_SESSION['id'];
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$consulta = mysqli_query($con,"select * from proyecto_alumno_profesor where IDProyecto=$idProyecto order by IDProyecto desc limit 1;");
	$datos = mysqli_fetch_array($consulta);
	$idAlumno = $datos['IDAlumno'];
	mysqli_query($con,"insert into documentos values(default,'$fileName',$idProyecto,$idUsuario,1,now())");
	mysqli_close($con);
	$razon="Nuevo documento de proyecto";
		$body="Se ha subido un nuevo documento a su proyecto, revíselo";
		$proyecto=$idProyecto;
		$whoSend=1;
		enviarEmail($razon,$body,$proyecto,$whoSend);
}

function mostrarArchivos($idProyecto)
{
	$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
	$json=array();
	$archivos=mysqli_query($con, "select * from documentos where IDProyecto=$idProyecto");
	$cont=0;
	while($datos=mysqli_fetch_array($archivos)){
		$json[$cont]['nombre']=$datos['Nombre'];
		$json[$cont]['fecha']=$datos['Fecha_subida'];
		$cont++;
	}
	$json['numArchivos']=$cont;

	echo json_encode($json);
	mysqli_close($con);
}










?>