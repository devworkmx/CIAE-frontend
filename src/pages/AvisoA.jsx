function AvisoA() {
  return (
    <>
      <div className="bg-morena py-10 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Aviso de Privacidad Integral para Alumnos y Usuarios Finales
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 text-gray-800 leading-relaxed">
        <p className="mb-6">
          <strong>
            Centro de Innovación y Aprendizaje Estratégico, S. de R.L. de C.V.
          </strong>{' '}
          (en adelante, "CIAE"), con domicilio en{' '}
          <strong>
            Prolongación Paseo de la Reforma No. 1200, Colonia Cruz Manca,
            Alcaldía Cuajimalpa, C.P. 05349, Ciudad de México
          </strong>
          , actúa como <strong>encargado</strong> del tratamiento de sus datos
          personales por cuenta del instructor, institución o administrador
          educativo que contrató nuestra plataforma para impartir sus cursos. Al
          respecto, le informamos lo siguiente:
        </p>

        <h2 className="text-xl font-semibold text-morena mt-8 mb-3">
          I. ¿Para qué fines utilizaremos sus datos personales?
        </h2>
        <p className="mb-3">
          Los datos personales que son ingresados en nuestra plataforma por el
          instructor o institución que le imparte el curso se utilizarán para
          las siguientes finalidades necesarias:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            Registro, inscripción y gestión de su expediente dentro del curso
            administrado por la institución educativa o instructor
            correspondiente.
          </li>
          <li>
            Generación, emisión y control de validez de constancias y
            certificados digitales de acreditación.
          </li>
          <li>
            <strong>Validación pública y consulta de certificados:</strong>{' '}
            Integrar sus datos en nuestro sistema de búsqueda pública disponible
            en la página principal, permitiendo que cualquier persona pueda
            validar la autenticidad del documento mediante el folio del
            certificado o su Clave Única de Registro de Población (CURP). Esta
            consulta mostrará públicamente de forma exclusiva:{' '}
            <strong>
              nombre completo del alumno, nombre del curso llevado, vigencia del
              certificado e instructor del curso
            </strong>
            .
          </li>
        </ul>
        <p className="mb-6">
          No utilizamos sus datos personales para fines mercadotécnicos,
          publicitarios o de prospección comercial por parte de CIAE.
        </p>

        <h2 className="text-xl font-semibold text-morena mt-8 mb-3">
          II. ¿Qué datos personales utilizaremos?
        </h2>
        <p className="mb-3">
          Para cumplir con las finalidades descritas, se procesan los siguientes
          datos personales proporcionados para la emisión de sus certificados:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            <strong>Datos de Identificación:</strong> Nombre completo y Clave
            Única de Registro de Población (CURP).
          </li>
          <li>
            <strong>Datos de Contacto:</strong> Número telefónico y correo
            electrónico.
          </li>
          <li>
            <strong>Datos Académicos:</strong> Nombre del curso acreditado,
            vigencia, folio del certificado e instructor.
          </li>
        </ul>
        <p className="mb-6">
          Le informamos que{' '}
          <strong>no recabamos datos personales sensibles</strong>.
        </p>

        <h2 className="text-xl font-semibold text-morena mt-8 mb-3">
          III. Transferencias y visibilidad pública
        </h2>
        <p className="mb-3">
          Sus datos de acreditación (nombre, curso, vigencia e instructor) se
          encuentran expuestos de manera controlada y pública{' '}
          <strong>únicamente</strong> a través del módulo de validación por
          folio o CURP en nuestra página principal, con la finalidad exclusiva
          de garantizar la autenticidad de sus documentos ante terceros.
        </p>
        <p className="mb-6">
          Asimismo, los datos son tratados bajo estricta confidencialidad por el
          instructor o institución educativa responsable de su curso, y
          compartidos con proveedores tecnológicos de infraestructura en la nube
          estrictamente necesarios para el funcionamiento del sistema.
        </p>

        <h2 className="text-xl font-semibold text-morena mt-8 mb-3">
          IV. Ejercicio de Derechos ARCO y Revocación
        </h2>
        <p className="mb-3">
          Usted tiene derecho a ejercer sus derechos de Acceso, Rectificación,
          Cancelación y Oposición (<strong>ARCO</strong>), así como a revocar su
          consentimiento para el tratamiento de sus datos.
        </p>
        <p className="mb-3">
          Tome en cuenta que, debido a que sus datos son gestionados
          originalmente por la institución o instructor que le impartió el
          curso, o bien, que la eliminación de su registro implica la pérdida de
          validez y baja del certificado digital emitido, las solicitudes
          correspondientes deberán canalizarse inicialmente a través del
          instructor o institución responsable, o bien, directamente con
          nosotros mediante correo electrónico a:{' '}
          <a href="mailto:contacto@ciae.site" className="text-morena underline">
            contacto@ciae.site
          </a>
          .
        </p>
        <p className="mb-6">
          El plazo máximo de respuesta a su solicitud será de{' '}
          <strong>20 días hábiles</strong>.
        </p>

        <h2 className="text-xl font-semibold text-morena mt-8 mb-3">
          V. Cambios al Aviso de Privacidad
        </h2>
        <p className="mb-6">
          Cualquier modificación al presente aviso le será informada a través de
          los canales habituales de la plataforma o mediante solicitud a{' '}
          <a href="mailto:contacto@ciae.site" className="text-morena underline">
            contacto@ciae.site
          </a>
          .
        </p>

        <p className="text-sm text-gray-500 border-t pt-4 mt-8">
          Última actualización:{' '}
          <span className="italic text-red-600">[Insertar Día/Mes/Año]</span>
        </p>
      </div>
    </>
  )
}

export default AvisoA
