let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarTareas() {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";

  if (tareas.length > 0) {
    const contenedorBoton = document.createElement("div");
    contenedorBoton.style.textAlign = "right";
    contenedorBoton.style.marginBottom = "10px";

    const btnEliminarSeleccionadas = document.createElement("button");
    btnEliminarSeleccionadas.textContent = "Eliminar tareas seleccionadas";
    btnEliminarSeleccionadas.onclick = eliminarSeleccionadas;

    contenedorBoton.appendChild(btnEliminarSeleccionadas);
    lista.appendChild(contenedorBoton);
  }

  tareas.forEach((tarea, i) => {
    const div = document.createElement("div");
    div.className = "tarea" + (tarea.completada ? " completada" : "");

    div.innerHTML = `
      <div style="display:flex; justify-content: space-between; align-items: center;">
        <div style="flex-grow:1;">
          <strong>${tarea.titulo}</strong><br>
          ${tarea.descripcion}<br>
          Fecha: ${tarea.fecha}<br>
        </div>
        <div style="text-align:right;">
          <input type="checkbox" class="selector" data-index="${i}" style="margin-left:10px;">
        </div>
      </div>
      <div class="botones">
        <button onclick="completar(${i})">${tarea.completada ? "Desmarcar" : "Completar"}</button>
        <button onclick="editarSeguro(${i})">Editar</button>
        <button onclick="eliminar(${i})">Eliminar</button>
      </div>
    `;
    lista.appendChild(div);
  });
}

function agregarTarea() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const fecha = document.getElementById("fecha").value;

  // Validar que la fecha tenga el formato correcto
  if (!titulo || !descripcion || !fecha || !validarFecha(fecha)) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  tareas.push({ titulo, descripcion, fecha, completada: false });
  guardarTareas();
  mostrarTareas();
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("fecha").value = "";
}

function completar(i) {
  tareas[i].completada = !tareas[i].completada;
  guardarTareas();
  mostrarTareas();
}

function eliminar(i) {
  if (confirm("¿Eliminar esta tarea?")) {
    tareas.splice(i, 1);
    guardarTareas();
    mostrarTareas();
  }
}

function editarSeguro(i) {
  const nuevaTitulo = prompt("Nuevo título", tareas[i].titulo);
  const nuevaDescripcion = prompt("Nueva descripción", tareas[i].descripcion);
  const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD)", tareas[i].fecha);
  const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha);
  const fechaValida = !isNaN(Date.parse(nuevaFecha));

  if (nuevaTitulo && nuevaDescripcion && formatoValido && fechaValida) {
    tareas[i].titulo = nuevaTitulo;
    tareas[i].descripcion = nuevaDescripcion;
    tareas[i].fecha = nuevaFecha;
    guardarTareas();
    mostrarTareas();
    alert("Tarea editada correctamente.");
  } else {
    alert("Fecha inválida o datos incompletos. Usa el formato YYYY-MM-DD.");
  }
}

function eliminarSeleccionadas() {
  const checkboxes = document.querySelectorAll(".selector:checked");
  const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
  if (indices.length === 0) {
    alert("Selecciona al menos una tarea para eliminar.");
    return;
  }
  if (confirm("¿Eliminar las tareas seleccionadas?")) {
    tareas = tareas.filter((_, i) => !indices.includes(i));
    guardarTareas();
    mostrarTareas();
  }
}

mostrarTareas();

// === Lógica para tema oscuro ===
const toggleSwitch = document.getElementById('theme-toggle');
const body = document.body;

// Verificar si el usuario ya eligió un tema anteriormente
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
  body.classList.add("dark-mode");
  if (toggleSwitch) {
    toggleSwitch.checked = true;
  }
}

if (toggleSwitch) {
  toggleSwitch.addEventListener("change", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Función para validar el formato de la fecha
function validarFecha(fecha) {
  // Validar formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;

  // Validar que sea una fecha válida
  const fechaValida = new Date(fecha);
  return !isNaN(fechaValida.getTime());
}