<?php  
session_start();

define("DATABASE", "gestor_proyectos");
define("DBhost", "localhost");
define("DBuser", "root");
define("DBpassword", "");

include("login.php");
include("admin.php");
include("mensajes.php");
include("mails.php");

$function=$_REQUEST['action'];

switch($function){
	case 'logIn': 	$user=$_REQUEST['loginUser'];
					$pass=$_REQUEST['loginPassword'];
					checkLogin($user,$pass);
	break;

	case 'comprobarAdmin':	comprobarAdmin();
	break;

	case 'profesorGetAlumnos':	 profesorGetAlumnos();
					
	break;

	case 'profesorGetProyectos': $orden=$_REQUEST['orden'];
								 $estado=$_REQUEST['estado'];
								 profesorGetProyectos($orden,$estado);
					
	break;

	case 'editarProyecto': 	$idProyecto=$_REQUEST['idProyecto'];
							$titulo=$_REQUEST['tituloProyecto'];
							$alumno=$_REQUEST['alumnoSelect'];
							$tutor=$_REQUEST['tutorSelect'];
							$fechaAsig=$_REQUEST['fechaAsig'];
							$fechaPresentacion=$_REQUEST['fechaPresentacion'];
							$convocatoria=$_REQUEST['convocatoria'];
							$progreso=$_REQUEST['progreso'];
							$nota=$_REQUEST['nota'];
							$idProfesor=$_REQUEST['idProfesor'];
							$idAlumno=$_REQUEST['idAlumno'];
							$estado=$_REQUEST['estadoSelect'];
							$materia=$_REQUEST['materia'];
							aplicarEdicionProyecto($idProyecto,$titulo,$alumno,$tutor,$fechaAsig,$fechaPresentacion,$convocatoria,$progreso,$nota,$estado,$materia);

	break;

	case 'eliminarProyecto':	$alumno=$_REQUEST['idAlumno'];
								$idProyecto=$_REQUEST['idProyecto'];
								$tutor=$_REQUEST['idProfesor'];
								eliminarProyecto($idProyecto,$alumno,$tutor);
	break;	

	case 'getNombreAlumnos':	if(isset($_REQUEST['idAlumno'])){
									$idAlumno=$_REQUEST['idAlumno'];
									getNombreAlumnos($idAlumno);
								}
								else{
									getNombreAlumnos();
								}
								
	break;	

	case 'getNombreProfesores':	if(isset($_REQUEST['idProfesor'])){
									$idProfesor=$_REQUEST['idProfesor'];
									getNombreProfesores($idProfesor);
								}
								else{
									getNombreProfesores();
								}
								
								
	break;

	case 'getNombreEstados': if(isset($_REQUEST['idProyecto'])){
							 	$idProyecto=$_REQUEST['idProyecto'];
							 	 getNombreEstados($idProyecto);
							 }
							 else{
							 	 getNombreEstados();

							 }
							
	break;

	case 'getAlumnos': getAlumnos();
	break;
	case 'getProfesores': getProfesores();
	break;

	case 'addProyecto':		
							$titulo=$_REQUEST['tituloProyecto'];
							$alumno=$_REQUEST['alumnoSelect'];
							$tutor=$_REQUEST['tutorSelect'];
							$progreso=$_REQUEST['progreso'];
							$nota=$_REQUEST['nota'];
							$estado=$_REQUEST['estadoSelect'];
							$materia=$_REQUEST['materia'];
							if($alumno!=0){
								$fechaAsig=$_REQUEST['fechaAsig'];
								$fechaPresentacion=$_REQUEST['fechaPresentacion'];
								$convocatoria=$_REQUEST['convocatoria'];
								addProyecto($titulo,$materia,$alumno,$tutor,$progreso,$nota,$estado,$fechaAsig,$fechaPresentacion,$convocatoria);

							}
							else{
								addProyecto($titulo,$materia,$alumno,$tutor,$progreso,$nota,$estado);

							}
							
	break;

	case 'getNombreCiclos': if(isset($_REQUEST['idCiclo'])){
								$idCiclo=$_REQUEST['idCiclo'];
								getNombreCiclos($idCiclo);
							}
							else{
								getNombreCiclos();
							}
							
	break;

	case 'addAlumno':	$nombre=$_REQUEST['nombre'];
						$apellido1=$_REQUEST['apellido1'];
						$apellido2=$_REQUEST['apellido2'];
						$password=$_REQUEST['password'];
						$dni=$_REQUEST['dni'];
						$email=$_REQUEST['email'];
						$ciclo=$_REQUEST['cicloSelect'];
						addAlumno($nombre,$apellido1,$apellido2,$password,$dni,$email,$ciclo);

	break;

	case 'getAlumno': 	$id=$_REQUEST['id'];
						getAlumno($id);
	break;

	case 'editarAlumno':	$idAlumno=$_REQUEST['idAlumno'];
							$nombre=$_REQUEST['nombre'];
							$apellido1=$_REQUEST['apellido1'];
							$apellido2=$_REQUEST['apellido2'];
							$password=$_REQUEST['password'];
							$dni=$_REQUEST['dni'];
							$email=$_REQUEST['email'];
							$ciclo=$_REQUEST['cicloSelect'];
							editarAlumno($idAlumno,$nombre,$apellido1,$apellido2,$password,$dni,$email,$ciclo);
	break;

	case 'eliminarAlumno':	$idAlumno=$_REQUEST['idAlumno'];
							eliminarAlumno($idAlumno);
	break;

	case 'getProfesor': 	$id=$_REQUEST['id'];
						getProfesor($id);
	break;


	case 'editarProfesor':	$idProfesor=$_REQUEST['idProfesor'];
							$nombre=$_REQUEST['nombre'];
							$apellido1=$_REQUEST['apellido1'];
							$apellido2=$_REQUEST['apellido2'];
							$password=$_REQUEST['password'];
							$usuario=$_REQUEST['usuario'];
							$email=$_REQUEST['email'];
							editarProfesor($idProfesor,$nombre,$apellido1,$apellido2,$password,$usuario,$email);
	break;

	case 'eliminarProfesor':	$idProfesor=$_REQUEST['idProfesor'];
								eliminarProfesor($idProfesor);
	break;

	case 'addProfesor':	$nombre=$_REQUEST['nombre'];
						$apellido1=$_REQUEST['apellido1'];
						$apellido2=$_REQUEST['apellido2'];
						$password=$_REQUEST['password'];
						$usuario=$_REQUEST['usuario'];
						$email=$_REQUEST['email'];
						addProfesor($nombre,$apellido1,$apellido2,$password,$usuario,$email);

	break;

	case 'datosPerfil':	datosPerfil();
	break;

	case 'getPerfil': 	getPerfil();
	break;

	case 'desconectar': desconectar();
	break;

	case 'getMensajes': getMensajes();
	break;
	case 'addMensajeProyecto': 	$proyecto=$_REQUEST['proyecto'];
								$mensaje=$_REQUEST['mensaje'];
								addMensajeProyecto($proyecto, $mensaje);
	break;

	case 'verMensajesProyecto': $idProyecto=$_REQUEST['idProyecto'];
								verMensajesProyecto($idProyecto);
	break;

	case 'getProyectoAlumno': getProyectoAlumno();
	break;
	case 'cambiarProgreso': cambiarProgreso($_REQUEST['progreso']);
	break;
	case 'subirArchivo': 	$idProyecto=$_REQUEST['id'];
							subirArchivo($idProyecto);
	break;
	case 'mostrarArchivos': $idProyecto=$_REQUEST['idProyecto'];
							mostrarArchivos($idProyecto);
	break;

}



?>










