// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_VM3EZ1GnUe-a73Eoc-cXP4tkNT3NiAw",
  authDomain: "munici-b68a9.firebaseapp.com",
  databaseURL: "https://munici-b68a9-default-rtdb.firebaseio.com",
  projectId: "munici-b68a9",
  storageBucket: "munici-b68a9.appspot.com",
  messagingSenderId: "61750848581",
  appId: "1:61750848581:web:97d214420b9aa87106072c",
  measurementId: "G-DJMFF4KX9V",
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const registroHorasRef = database.ref("registroHoras");

// Variables globales
const fechaHoy = new Date();
const fechaMeta = new Date(2025, 1, 28); // Mes 1 = febrero

// Función para calcular días faltantes
function calcular() {
  const pj = document.getElementById("PJ").value;
  const elem = document.getElementById("DATA");
  let dia;

  // Determinar día excluido
  switch (pj) {
    case "Jose":
    case "Maca":
      dia = 1;
      break;
    case "Pablo":
    case "Tito":
      dia = 2;
      break;
    case "Nico1":
    case "Luis":
      dia = 3;
      break;
    case "Benja":
    case "Nico2":
      dia = 4;
      break;
    case "Nico3":
    case "Seba":
      dia = 5;
      break;
    default:
      elem.textContent =
        "Jugador no reconocido. Selecciona un nombre válido.";
      return;
  }

  if (fechaHoy.toDateString() === fechaMeta.toDateString()) {
    elem.textContent = "¡La fecha ya llegó! 🤑🤑🤑";
    return;
  }

  let diasFaltantes = 0;
  let fechaActual = new Date(fechaHoy);

  while (fechaActual <= fechaMeta) {
    if (fechaActual.getDay() !== dia) {
      diasFaltantes++;
    }
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  elem.textContent = `Faltan ${diasFaltantes} días para que termine la temporada.`;
}

function registrarHoras() {
  const jugador = document.getElementById("PJ").value;
  if (!jugador) {
    alert("Por favor, selecciona un jugador.");
    return;
  }
  const minutos = parseInt(document.getElementById("minutes").value, 10);
  if (isNaN(minutos) || minutos <= 0) {
    alert("Por favor, ingresa un número válido de minutos.");
    return;
  }

  // Actualiza los minutos acumulados en Firebase
  registroHorasRef.child(jugador).once("value", (snapshot) => {
    let minutosActuales = snapshot.val() || 0;
    minutosActuales += minutos;
    registroHorasRef.child(jugador).set(minutosActuales, () => {
      // Llama a la función para actualizar la lista una vez que se guarden los datos
      actualizarLista();
    });
  });

  // Limpia el campo de entrada
  document.getElementById("minutes").value = "";
}

// Función para actualizar la lista
function actualizarLista() {
  const lista = document.getElementById("extraTimeList");
  lista.innerHTML = ""; // Limpia la lista

  // Elimina cualquier escucha previa en la referencia para evitar duplicados
  registroHorasRef.off("value");

  // Escucha los datos más recientes desde Firebase
  registroHorasRef.on("value", (snapshot) => {
    const registroHoras = snapshot.val();

    // Si hay datos, actualiza la lista
    if (registroHoras) {
      lista.innerHTML = ""; // Limpia la lista antes de poblarla de nuevo
      for (const [jugador, minutos] of Object.entries(registroHoras)) {
        const li = document.createElement("li");
        li.textContent = `${jugador}: ${minutos} minutos`;
        lista.appendChild(li);
      }
    } else {
      lista.innerHTML = "<li>No hay datos registrados.</li>"; // Mensaje en caso de lista vacía
    }
  });
}

function resetearJugador() {
  const jugador = document.getElementById("PJ").value; // Obtiene el jugador seleccionado

  // Confirmar con el usuario antes de borrar los datos del jugador
  const confirmacion = confirm(
    `¿Estás seguro de que deseas resetear los minutos de ${jugador}?`
  );
  if (confirmacion) {
    // Resetea los minutos del jugador seleccionado en Firebase
    registroHorasRef.child(jugador).set(null, (error) => {
      if (error) {
        alert(
          "Hubo un error al intentar resetear los minutos del jugador."
        );
      } else {
        alert(`Se han reseteado los minutos de ${jugador}.`);
        actualizarLista(); // Actualiza la lista para reflejar los cambios
      }
    });
  }
}

// Función para quitar minutos de un jugador
function quitarMinutos() {
  const jugador = document.getElementById("PJ").value;
  const minutosAQuitar = parseInt(
    document.getElementById("minutesToRemove").value,
    10
  );

  if (isNaN(minutosAQuitar) || minutosAQuitar <= 0) {
    alert("Por favor, ingresa un número válido de minutos a quitar.");
    return;
  }

  registroHorasRef.child(jugador).once("value", (snapshot) => {
    let minutosActuales = snapshot.val() || 0;

    if (minutosActuales < minutosAQuitar) {
      alert(`${jugador} no tiene suficientes minutos registrados.`);
    } else {
      registroHorasRef
        .child(jugador)
        .set(minutosActuales - minutosAQuitar);
    }
  });

  document.getElementById("minutesToRemove").value = "";
}

// Inicializar eventos
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("calculateButton")
    .addEventListener("click", calcular);
  document
    .getElementById("registerButton")
    .addEventListener("click", registrarHoras);
  document
    .getElementById("resetButton")
    .addEventListener("click", resetearJugador);
  document
    .getElementById("removeMinutesButton")
    .addEventListener("click", quitarMinutos);
  actualizarLista();
});
