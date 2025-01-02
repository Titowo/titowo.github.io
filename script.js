import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

function registrarHoras() {
    const jugador = document.getElementById("PJ").value;
    const minutos = parseInt(document.getElementById("minutes").value, 10);

    if (isNaN(minutos) || minutos <= 0) {
        alert("Por favor, ingresa un número válido de minutos.");
        return;
    }

    const jugadorRef = ref(db, `registroHoras/${jugador}`);
    get(jugadorRef).then((snapshot) => {
        const minutosPrevios = snapshot.val() || 0;
        set(jugadorRef, minutosPrevios + minutos);
        actualizarLista();
        document.getElementById("minutes").value = "";
    });
}

function actualizarLista() {
    const lista = document.getElementById("extraTimeList");
    lista.innerHTML = "";

    const horasRef = ref(db, 'registroHoras');
    get(horasRef).then((snapshot) => {
        const datos = snapshot.val();
        if (datos) {
            for (const jugador in datos) {
                const li = document.createElement("li");
                li.textContent = `${jugador}: ${datos[jugador]} minutos`;
                lista.appendChild(li);
            }
        }
    });
}

function resetearHoras() {
    const confirmacion = confirm("¿Estás seguro de que deseas resetear todas las horas?");
    if (confirmacion) {
        remove(ref(db, 'registroHoras')).then(() => actualizarLista());
    }
}

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
