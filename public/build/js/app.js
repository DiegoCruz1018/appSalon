let paso=1;const pasoInicial=1,pasoFinal=3;let tiempoTotal=0;const inputFecha=document.querySelector("#fecha"),btnpaginaAnterior=document.querySelector("#anterior"),btnpaginaSiguiente=document.querySelector("#siguiente"),cita={id:"",nombre:"",fecha:"",hora:"",horaFin:"",empleadoId:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),seleccionarBarbero(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const t="#paso-"+paso;document.querySelector(t).classList.add("mostrar");const a=document.querySelector(".actual");a&&a.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",(function(e){e.preventDefault(),paso=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador()}))})}function botonesPaginador(){const{servicios:e}=cita;1===paso&&(btnpaginaAnterior.classList.add("ocultar"),btnpaginaSiguiente.classList.remove("ocultar")),3===paso&&(btnpaginaAnterior.classList.remove("ocultar"),btnpaginaSiguiente.classList.add("ocultar"),mostrarResumen()),2===paso&&(btnpaginaAnterior.classList.remove("ocultar"),btnpaginaSiguiente.classList.remove("ocultar"),tiempoTotal=e.reduce((e,t)=>e+parseFloat(t.tiempo),0)),mostrarSeccion()}function paginaAnterior(){btnpaginaAnterior.addEventListener("click",(function(){paso<=1||(paso--,botonesPaginador())}))}function paginaSiguiente(){btnpaginaSiguiente.addEventListener("click",(function(){paso>=3||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e="http://localhost:3000/api/servicios",t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach(e=>{const{id:t,nombre:a,precio:n,tiempo:o}=e,r=document.createElement("P");r.classList.add("nombre-servicio"),r.textContent=a;const i=document.createElement("P");i.classList.add("precio-servicio"),i.textContent="$"+n;const c=document.createElement("P");c.classList.add("nombre-servicio"),c.textContent="Tiempo: "+o+" Min";const s=document.createElement("DIV");s.classList.add("servicio"),s.dataset.idServicio=t,s.onclick=function(){seleccionarServicio(e)},s.appendChild(r),s.appendChild(i),s.appendChild(c),document.querySelector("#servicios").appendChild(s)})}function seleccionarServicio(e){const{id:t}=e,{servicios:a}=cita,n=document.querySelector(`[data-id-servicio="${t}"]`);a.some(e=>e.id===t)?cita.servicios=a.filter(e=>e.id!==t):cita.servicios=[...a,e],n.classList.toggle("seleccionado")}function idCliente(){cita.id=document.querySelector("#id").value}function nombreCliente(){cita.nombre=document.querySelector("#nombre").value}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay();[6,0].includes(t)?(e.target.value="",mostrarAlerta("Fines de semana no permitidos","error",".formulario")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){let t=e.target.value.split(":")[0];t<8||t>17?(e.target.value="",mostrarAlerta("Hora No Valida","error",".formulario")):(cita.hora=e.target.value,horaFinal=sumarMinutos(cita.hora,tiempoTotal),cita.horaFin=horaFinal,consultarBarberos())}))}function mostrarAlerta(e,t,a,n=!0){const o=document.querySelector(".alerta");o&&o.remove();const r=document.createElement("DIV");r.textContent=e,r.classList.add("alerta"),r.classList.add(t);document.querySelector(a).appendChild(r),n&&setTimeout(()=>{r.remove()},3e3)}async function consultarBarberos(){const{fecha:e,hora:t,horaFin:a}=cita,n=new FormData;n.append("fecha",e),n.append("hora",t),n.append("horaFin",a);try{const e="http://localhost:3000/api/empleados",t=await fetch(e,{method:"POST",body:n});listarBarberos(await t.json())}catch(e){console.log(e)}}function listarBarberos(e){const t=document.querySelector("#empleadoId");t.innerHTML="";let a=document.createElement("OPTION");a.value=0,a.text="-- Seleccione al Barbero Disponible --",t.appendChild(a),e.forEach(e=>{const{id:n,nombre:o}=e;a=document.createElement("OPTION"),a.value=n,a.text=o,t.appendChild(a)})}function seleccionarBarbero(){document.querySelector("#empleadoId").addEventListener("change",(function(){this.value>0&&(cita.empleadoId=this.value,console.log(cita))}))}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Faltan datos de Servicios, Fecha u Hora","error",".contenido-resumen",!1);const{nombre:t,fecha:a,hora:n,horaFin:o,servicios:r}=cita,i=document.createElement("H3");i.textContent="Resumen de Servicios",e.appendChild(i),r.forEach(t=>{const{id:a,precio:n,nombre:o}=t,r=document.createElement("DIV");r.classList.add("contenedor-servicio");const i=document.createElement("P");i.textContent=o;const c=document.createElement("P");c.innerHTML="<span>Precio:</span> $"+n,r.appendChild(i),r.appendChild(c),e.appendChild(r)});const c=document.createElement("H3");c.textContent="Resumen de Cita",e.appendChild(c);const s=document.createElement("P");s.innerHTML="<span>Nombre:</span> "+t;const l=new Date(a),d=l.getMonth(),u=l.getDate()+2,p=l.getFullYear(),m=new Date(Date.UTC(p,d,u)).toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),h=document.createElement("P");h.innerHTML="<span>Fecha:</span> "+m;const v=document.createElement("P");v.innerHTML=`<span>Hora:</span> ${n} Horas`;const f=document.createElement("P");f.innerHTML=`<span>Hora Final:</span> ${o} Horas`;const g=document.createElement("P");g.innerHTML="<span>Cantidad de Servicios: </span>\n    "+r.length;const b=r.reduce((e,t)=>e+parseFloat(t.precio),0),S=document.createElement("P");S.innerHTML="<span>Total: </span> $"+b;const C=document.createElement("BUTTON");C.classList.add("boton"),C.textContent="Reservar Cita",C.onclick=reservarCita,e.appendChild(s),e.appendChild(h),e.appendChild(v),e.appendChild(f),e.appendChild(g),e.appendChild(S),e.appendChild(C)}async function reservarCita(){const{nombre:e,fecha:t,hora:a,horaFin:n,servicios:o,id:r,empleadoId:i}=cita,c=o.map(e=>e.id),s=new FormData;s.append("fecha",t),s.append("hora",a),s.append("horaFin",n),s.append("usuarioId",r),s.append("empleadoId",i),s.append("servicios",c);try{const e="http://localhost:3000/api/citas",t=await fetch(e,{method:"POST",body:s}),a=await t.json();console.log(a),a.resultado&&Swal.fire({icon:"success",title:"Cita Creada",text:"Tu cita fue creada correctamente",button:"OK"}).then(()=>{setTimeout(()=>{window.location.reload()},3e3)})}catch(e){Swal.fire({icon:"error",title:"Error",text:"Hubo un error al guardar la cita"})}}function sumarMinutos(e,t){let[a,n]=e.split(":"),o=parseInt(n)+t,r=Math.floor(o/60),i=o%60;return a=parseInt(a)+r,a>23&&(a-=24),i<10&&(i="0"+i),a+":"+i}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()})),document.querySelector("#paso-1")&&(cita.fecha=inputFecha.value);