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

// Función para registrar horas extra
function registrarHoras() {
    const jugador = document.getElementById("PJ").value;
    const minutos = parseInt(document.getElementById("minutes").value, 10);
    const lista = document.getElementById("extraTimeList");

    if (isNaN(minutos) || minutos <= 0) {
        alert("Por favor, ingresa un número válido de minutos.");
        return;
    }

    // Actualizar los minutos acumulados
    if (!registroHoras[jugador]) {
        registroHoras[jugador] = 0;
    }
    registroHoras[jugador] += minutos;

    // Guardar los datos en el localStorage
    localStorage.setItem('registroHoras', JSON.stringify(registroHoras));

    // Actualizar la lista visual
    actualizarLista();
    document.getElementById("minutes").value = ""; // Limpiar el campo de entrada
}

function actualizarLista() {
    const lista = document.getElementById("extraTimeList");
    lista.innerHTML = ""; // Limpiar la lista

    // Recorrer el objeto de registro de horas y agregar los elementos a la lista
    for (const [jugador, minutos] of Object.entries(registroHoras)) {
        const li = document.createElement("li");
        li.textContent = `${jugador}: ${minutos} minutos`;
        lista.appendChild(li);
    }
}

// Función para resetear todas las horas
function resetearHoras() {
    // Confirmar con el usuario antes de resetear
    const confirmacion = confirm("¿Estás seguro de que deseas resetear todas las horas?");
    if (confirmacion) {
        // Resetear el objeto de horas
        localStorage.removeItem('registroHoras');
        // Limpiar el objeto en memoria
        for (const jugador in registroHoras) {
            delete registroHoras[jugador];
        }
        // Actualizar la lista visual
        actualizarLista();
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

    if (!registroHoras[jugador] || registroHoras[jugador] < minutosAQuitar) {
        alert(`No se pueden quitar ${minutosAQuitar} minutos porque ${jugador} no tiene suficientes minutos registrados.`);
        return;
    }

    // Restar los minutos del jugador
    registroHoras[jugador] -= minutosAQuitar;

    // Guardar los datos en el localStorage
    localStorage.setItem('registroHoras', JSON.stringify(registroHoras));

    // Actualizar la lista visual
    actualizarLista();
    document.getElementById("minutesToRemove").value = ""; // Limpiar el campo de entrada
}

// Cargar la lista de horas extras desde el localStorage al inicio
actualizarLista();

// Añadir eventos a los botones
document.getElementById("resetButton").addEventListener("click", resetearHoras);
document.getElementById("removeMinutesButton").addEventListener("click", quitarMinutos);
