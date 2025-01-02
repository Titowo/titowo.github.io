import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";


// Configuración de Firebase (usa tu propia configuración desde Firebase Console)
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

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Fecha de hoy y fecha meta
const fechaHoy = new Date();
const fechaMeta = new Date(2025, 1, 28); // Mes 1 = febrero
const registroHoras = JSON.parse(localStorage.getItem('registroHoras')) || {}; // Recuperar datos desde localStorage

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

// Función para registrar horas en Firebase
function registrarHoras() {
    const jugador = document.getElementById("PJ").value;
    const minutos = parseInt(document.getElementById("minutes").value, 10);

    if (isNaN(minutos) || minutos <= 0) {
        alert("Por favor, ingresa un número válido de minutos.");
        return;
    }

    // Leer los minutos actuales y actualizar en Firebase
    const jugadorRef = firebase.database().ref(`registroHoras/${jugador}`);
    jugadorRef.get().then((snapshot) => {
        const minutosPrevios = snapshot.val() || 0;
        jugadorRef.set(minutosPrevios + minutos);
        actualizarLista();
        document.getElementById("minutes").value = ""; // Limpiar el campo de entrada
    })
}
// Función para actualizar la lista visual desde Firebase
function actualizarLista() {
    const lista = document.getElementById("extraTimeList");
    lista.innerHTML = ""; // Limpiar la lista

    firebase.database().ref('registroHoras').once('value').then((snapshot) => {
        const datos = snapshot.val();
        for (const jugador in datos) {
            const li = document.createElement("li");
            li.textContent = `${jugador}: ${datos[jugador]} minutos`;
            lista.appendChild(li);
        }
    });
}

// Función para resetear datos en Firebase
function resetearHoras() {
    const confirmacion = confirm("¿Estás seguro de que deseas resetear todas las horas?");
    if (confirmacion) {
        firebase.database().ref('registroHoras').remove();
        actualizarLista();
    }
}

// Función para quitar minutos de un jugador en Firebase
function quitarMinutos() {
    const jugador = document.getElementById("PJ").value;
    const minutosAQuitar = parseInt(document.getElementById("minutesToRemove").value, 10);

    if (isNaN(minutosAQuitar) || minutosAQuitar <= 0) {
        alert("Por favor, ingresa un número válido de minutos a quitar.");
        return;
    }

    const jugadorRef = firebase.database().ref(`registroHoras/${jugador}`);
    jugadorRef.get().then((snapshot) => {
        const minutosPrevios = snapshot.val() || 0;

        if (minutosPrevios < minutosAQuitar) {
            alert(`No se pueden quitar ${minutosAQuitar} minutos porque ${jugador} no tiene suficientes minutos registrados.`);
            return;
        }

        jugadorRef.set(minutosPrevios - minutosAQuitar);
        actualizarLista();
        document.getElementById("minutesToRemove").value = ""; // Limpiar el campo de entrada
    });
}

// Cargar los datos iniciales
actualizarLista();

// Añadir eventos a los botones
document.getElementById("resetButton").addEventListener("click", resetearHoras);
document.getElementById("removeMinutesButton").addEventListener("click", quitarMinutos);
