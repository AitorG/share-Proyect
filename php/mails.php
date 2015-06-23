<?php  

require('../PHPMailer/class.phpmailer.php');
require('../PHPMailer/class.smtp.php');

define("HOST", "mail.fucoda.es"); 			// host.de.correo
define("PORT", 587);			// puerto del host
define("USER", "jfk925c");				// usuario del servidor
define("PASSWORD", "Fucoda2014");			// contraseña del servidor
define("ENVIARDESDE", "soporteformacion@fucoda.es");		// correo que envía el mensaje
define("NOMBREDESDE", "lolololol");		// nombre que saldra del emisor


function enviarEmail($razon,$body,$proyecto,$whoSend=0)
	{

			$con=mysqli_connect(DBhost,DBuser,DBpassword,DATABASE);
			$result=mysqli_query($con,"select * from proyecto_alumno_profesor where IDProyecto=$proyecto");

			$IDS=mysqli_fetch_array($result);
			$idAlumno=$IDS['IDAlumno'];
			$idProfesor=$IDS['IDProfesor'];
			
			$result2=mysqli_query($con,"select * from profesores where IDProfesor=$idProfesor");
			$result3=mysqli_query($con,"select * from alumnos where IDAlumno=$idAlumno");
			$result4=mysqli_query($con,"select * from proyectos where IDProyecto=$proyecto");

			$alumnos=mysqli_fetch_array($result3);
			$profesores=mysqli_fetch_array($result2);
			$proyectos=mysqli_fetch_array($result4);



			$correoAlumno=$alumnos['Email'];
			$nombreAlumno=$alumnos['Nombre'];
			$correoProfesor=$profesores['Email'];
			$nombreProfesor=$profesores['Nombre'];
			$nombreProyecto=$proyectos['Descripcion'];

			$razonCompleta=$nombreProyecto.": ".$razon;

		    $mail             = new PHPMailer();

		    $mail->CharSet = 'UTF-8';
		    $mail->IsSMTP(); // Usar SMTP para enviar
		    $mail->SMTPDebug  = 0; // habilita información de depuración SMTP (para pruebas)
		                           // 1 = errores y mensajes
		                           // 2 = sólo mensajes
		    $mail->SMTPAuth   = true; // habilitar autenticación SMTP
		    $mail->Host       = HOST; // establece el servidor SMTP
		    $mail->Port       = PORT; // configura el puerto SMTP utilizado
		    $mail->Username   = USER; // nombre de usuario UGR
		    $mail->Password   = PASSWORD; // contraseña del usuario UGR
		 
		    $mail->SetFrom(ENVIARDESDE,NOMBREDESDE);
		    $mail->Subject    = "$razonCompleta";
		    $mail->MsgHTML($body); // Fija el cuerpo del mensaje

		    if($whoSend==0){//envia el profesor al alumno
		    	$address = $correoAlumno; // Dirección del destinatario
		    	$mail->AddAddress($address, $nombreAlumno);
		    }
		    else{ //envia alumno al tutor
		    	$address = $correoProfesor; // Dirección del destinatario
		    	$mail->AddAddress($address, $nombreProfesor);
		    }
		    
		    $mail->Send();
		    //$mail->AddBCC("soporteformacion@fucoda.es","Soporte formación");
		


	    mysqli_close($con);
	    //echo "$correoAlumno";

	}




?>