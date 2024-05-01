let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;
let tiempoTotal = 0;
const inputFecha = document.querySelector('#fecha');
const btnpaginaAnterior = document.querySelector('#anterior');
const btnpaginaSiguiente = document.querySelector('#siguiente');

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    horaFin: '',
    empleadoId: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

//Agregado - Se le asigna el valor de una vez porque cuando la seccion abre, el input de fecha toma el valor de hoy, pero el array cita en su llave fecha sigue en blanco. Si el usuario no cambia el valor, el array cita en su llave fecha sigue en blanco.
//Recuerda que para que el query de buscar empleado funcione, debemos enviarle FECHA y HORA, entonces si enviamos una fecha vacia, no dara resultados
if(document.querySelector('#paso-1')) {
    cita.fecha = inputFecha.value;
}

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente(); 
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend de PHP

    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto
    seleccionarBarbero();

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {

    // Ocultar la sección que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {

    // Agrega y cambia la variable de paso según el tab seleccionado
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();

            paso = parseInt( e.target.dataset.paso );
            mostrarSeccion();

            botonesPaginador(); 
        });
    });
}

function botonesPaginador() {
    const { servicios } = cita;
    if( paso === 1 ) {
      btnpaginaAnterior.classList.add('ocultar');
      btnpaginaSiguiente.classList.remove('ocultar');  
    }
    if( paso === 3 ){
      btnpaginaAnterior.classList.remove('ocultar');
      btnpaginaSiguiente.classList.add('ocultar');
      mostrarResumen();
    }
    if( paso === 2 ){
      btnpaginaAnterior.classList.remove('ocultar');
      btnpaginaSiguiente.classList.remove('ocultar');
      tiempoTotal = servicios.reduce((tiempoTotal, tiempo) => tiempoTotal + parseFloat(tiempo.tiempo), 0);
    }   
    mostrarSeccion();
}

function paginaAnterior() {
    btnpaginaAnterior.addEventListener('click', function() {

        if(paso <= pasoInicial) return;
        paso--;
        
        botonesPaginador();
    })
}
function paginaSiguiente() {
    btnpaginaSiguiente.addEventListener('click', function() {

        if(paso >= pasoFinal) return;
        paso++;
        
        botonesPaginador();
    })
}

async function consultarAPI() {

    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        //console.log(servicios);
        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}
function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio, tiempo } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const tiempoServicio = document.createElement('P');
        tiempoServicio.classList.add('nombre-servicio');
        tiempoServicio.textContent = "Tiempo: " + tiempo + " Min";

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);
        servicioDiv.appendChild(tiempoServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    });
}
function seleccionarServicio(servicio) {
    const { id } = servicio;
    const { servicios } = cita;

    const divServicioSel = document.querySelector(`[data-id-servicio="${id}"]`);
    if( servicios.some( agregado => agregado.id === id) ) {
      //Eliminarlo
      cita.servicios = servicios.filter( agregado => agregado.id !== id );
    } else{
      //agregarlo
      cita.servicios = [...servicios, servicio];
    }
    divServicioSel.classList.toggle('seleccionado');
    //console.log(cita);
}

function idCliente() {
    cita.id = document.querySelector('#id').value;
}
function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {

        const dia = new Date(e.target.value).getUTCDay();

        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
            //console.log(cita);
        }
    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){

    let horaCita = e.target.value;
    let soloHora = horaCita.split(":")[0];
    
    if( soloHora < 8 || soloHora > 17) {
        e.target.value = '';
        mostrarAlerta('Hora No Valida','error', '.formulario');
    }else{
        cita.hora = e.target.value;
        horaFinal = sumarMinutos(cita.hora, tiempoTotal);
        cita.horaFin = horaFinal;
        //console.log(cita);   

        // Validar que el Barbero en esa fecha y a esa hora no este ocupado.
        consultarBarberos(); // Quien atendera al cliente
    }
  });
}
function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    // Previene que se generen más de 1 alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
  
}
async function consultarBarberos() {
    const { fecha, hora, horaFin } = cita;
  
    const datos = new FormData();  
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('horaFin', horaFin);
    /*console.log('Dentro de consultarBarberos');
    console.log( cita );
    return;*/
    
    try {    
      const URL = 'http://localhost:3000/api/empleados';
      const respuesta = await fetch(URL, {
        method: 'POST',
        body: datos
      });
      const barberos = await respuesta.json();
      //console.log(barberos);
      listarBarberos(barberos);
    } catch (error) {
      console.log(error);
    }
}
function listarBarberos(barberos) {
  
    const select = document.querySelector("#empleadoId");
    select.innerHTML = "";
    let nuevaOpcion = document.createElement("OPTION");
    nuevaOpcion.value = 0;
    nuevaOpcion.text = '-- Seleccione al Barbero Disponible --';
    select.appendChild(nuevaOpcion);
  
    barberos.forEach( barbero => {
      const {id, nombre} = barbero;
      
      nuevaOpcion = document.createElement("OPTION");
      nuevaOpcion.value = id;
      nuevaOpcion.text = nombre;
      select.appendChild(nuevaOpcion);
    });
  
  }
  function seleccionarBarbero() {
    const inputBarbero = document.querySelector('#empleadoId');
    inputBarbero.addEventListener("change", function() {
      if(this.value > 0) {
        cita.empleadoId = this.value;
        console.log(cita);
      }
    });
  }




function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el Contenido de Resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false);

        return;
    } 

    // Formatear el div de resumen
    const { nombre, fecha, hora, horaFin, servicios } = cita;

    // Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    //console.log("Hora Final:" + cita.horaFin);

    // Heading para Cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`;

    const horaCitaFin = document.createElement('P');
    horaCitaFin.innerHTML = `<span>Hora Final:</span> ${horaFin} Horas`;

    const cantidadServicios = document.createElement('P');
    cantidadServicios.innerHTML = `<span>Cantidad de Servicios: </span>
    ${servicios.length}`;

    //Total a pagar
    const total = servicios.reduce((total, servicio) => total + parseFloat(servicio.precio), 0);
    
    const totalParrafo = document.createElement('P');
    totalParrafo.innerHTML = `<span>Total: </span> $${total}`;

    // Boton para Crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(horaCitaFin);
    resumen.appendChild(cantidadServicios);
    resumen.appendChild(totalParrafo);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    
    const { nombre, fecha, hora, horaFin, servicios, id, empleadoId} = cita;

    const idServicios = servicios.map( servicio => servicio.id );
    // console.log(idServicios);

    const datos = new FormData();
    
    datos.append('fecha', fecha);
    datos.append('hora', hora );
    datos.append('horaFin', horaFin);
    datos.append('usuarioId', id);
    datos.append('empleadoId', empleadoId)
    datos.append('servicios', idServicios);

    // console.log([...datos]);

    try {
        // Petición hacia la api
        const url = 'http://localhost:3000/api/citas'
        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });

        const resultado = await respuesta.json();
        console.log(resultado);
        
        if(resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente',
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
        })
    }

    
    // console.log([...datos]);

}

/*async function consultarCitasApi() {

    try {
        const url = 'http://localhost:3000/api/obtenerCitas';
        const resultado = await fetch(url);
        const citas = await resultado.json();
        obtenerCitas(citas);
    } catch (error) {
        console.log(error);
    }
}*/

function sumarMinutos(hora, minutos) {
    let [horaActual, minutosActuales] = hora.split(':');
    let totalMinutos = parseInt(minutosActuales) + minutos;
  
    let horasAdicionales = Math.floor(totalMinutos / 60);
    let minutosRestantes = totalMinutos % 60;
  
    horaActual = parseInt(horaActual) + horasAdicionales;
  
    if (horaActual > 23) {
        horaActual = horaActual - 24;
    }
  
    if (minutosRestantes < 10) {
        minutosRestantes = '0' + minutosRestantes;
    }
  
    return horaActual + ':' + minutosRestantes;
  }