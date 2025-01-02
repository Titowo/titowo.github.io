// Inicializa Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD_VM3EZ1GnUe-a73Eoc-cXP4tkNT3NiAw",
    authDomain: "munici-b68a9.firebaseapp.com",
    databaseURL: "https://munici-b68a9-default-rtdb.firebaseio.com",
    projectId: "munici-b68a9",
    storageBucket: "munici-b68a9.firebasestorage.app",
    messagingSenderId: "61750848581",
    appId: "1:61750848581:web:97d214420b9aa87106072c",
    measurementId: "G-DJMFF4KX9V"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // Referencia a la base de datos
  const registroHorasRef = database.ref('registroHoras');

  const fechaHoy = new Date();
  const fechaMeta = new Date(2025, 1, 28); // Mes 1 = febrero

  // Función para calcular días faltantes
  function calcular() {
    const pj = document.getElementById("PJ").value; // Obtiene el valor seleccionado del dropdown
    const elem = document.getElementById("DATA");  // Elemento donde se mostrará el resultado
    let dia;
    // Determinar el día excluido según el jugador seleccionado
    if (pj === "Jose" || pj == "Maca") {
      dia = 1;
    } else if (pj === "Pablo" || pj === "Tito") {
      dia = 2;
    } else if (pj === "Nico1" || pj === "Luis") {
      dia = 3;
    } else if (pj === "Benja" || pj === "Nico2") {
      dia = 4;
    } else if (pj === "Nico3" || pj === "Seba"){
      dia = 5;
    } else {
      elem.textContent = "Jugador no reconocido. Por favor selecciona un nombre válido.";
      return;
    }
    // Verificar si ya llegamos a la fecha meta
    if (fechaHoy.toDateString() === fechaMeta.toDateString()) {
      elem.textContent = "¡La fecha ya llegó! 🤑🤑🤑";
      return;
    }
    // Calcular días faltantes excluyendo el día específico
    let diasFaltantes = 0;
    let fechaActual = new Date(fechaHoy); // Crear una copia de la fecha actual
    while (fechaActual <= fechaMeta) {
      if (fechaActual.getDay() !== dia) {
        diasFaltantes++;
      }
      fechaActual.setDate(fechaActual.getDate() + 1); // Avanzar un día
    }
    // Mostrar el resultado
    elem.textContent = "Faltan " + diasFaltantes + " días para que termine la temporada.";
  }

  // Función para registrar horas extra
  function registrarHoras() {
    const jugador = document.getElementById("PJ").value;
    const minutos = parseInt(document.getElementById("minutes").value, 10);
    const lista = document.getElementById("extraTimeList");
    if (isNaN(minutos) || minutos <= 0) {
      alert("Por favor, ingresa un número válido de minutos.");
      return;
    }

    // Actualiza los minutos acumulados en Firebase
    registroHorasRef.child(jugador).once('value', (snapshot) => {
      let minutosActuales = snapshot.val() || 0;
      minutosActuales += minutos;
      registroHorasRef.child(jugador).set(minutosActuales);
    });

    // Limpia el campo de entrada
    document.getElementById("minutes").value = "";
  }

  // Función para actualizar la lista visual
  function actualizarLista() {
    const lista = document.getElementById("extraTimeList");
    lista.innerHTML = ""; // Limpia la lista

    // Obtiene los datos de Firebase
    registroHorasRef.on('value', (snapshot) => {
      const registroHoras = snapshot.val();
      if (registroHoras) {
        // Recorre el objeto de registro de horas y agrega los elementos a la lista
        for (const [jugador, minutos] of Object.entries(registroHoras)) {
          const li = document.createElement("li");
          li.textContent = `${jugador}: ${minutos} minutos`;
          lista.appendChild(li);
        }
      }
    });
  }

  // Función para resetear todas las horas
  function resetearHoras() {
    // Confirmar con el usuario antes de resetear
    const confirmacion = confirm("¿Estás seguro de que deseas resetear todas las horas?");
    if (confirmacion) {
      // Resetear los datos en Firebase
      registroHorasRef.set({});
    }
  }

  // Función para quitar minutos de un jugador específico
  function quitarMinutos() {
    const jugador = document.getElementById("PJ").value;
    const minutosAQuitar = parseInt(document.getElementById("minutesToRemove").value, 10);
    if (isNaN(minutosAQuitar) || minutosAQuitar <= 0) {
      alert("Por favor, ingresa un número válido de minutos a quitar.");
      return;
    }

    // Actualiza los minutos acumulados en Firebase
    registroHorasRef.child(jugador).once('value', (snapshot) => {
      let minutosActuales = snapshot.val() || 0;
      if (minutosActuales < minutosAQuitar) {
        alert(`No se pueden quitar ${minutosAQuitar} minutos porque ${jugador} no tiene suficientes minutos registrados.`);
        return;
      }
      minutosActuales -= minutosAQuitar;
      registroHorasRef.child(jugador).set(minutosActuales);
    });

    // Limpia el campo de entrada
    document.getElementById("minutesToRemove").value = "";
  }

  // Cargar la lista de horas extras desde Firebase al inicio
  actualizarLista();

  // Añadir eventos a los botones
  document.getElementById("resetButton").addEventListener("click", resetearHoras);
  document.getElementById("removeMinutesButton").addEventListener("click", quitarMinutos);
