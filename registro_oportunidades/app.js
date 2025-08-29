const API_URL = "https://localhost:7193/api/Propuestas";

const propuestasContainer = document.getElementById("propuestas");
const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const clienteIdInput = document.getElementById("clienteId");
const contactoInput = document.getElementById("contacto");
const emailInput = document.getElementById("email");
const telefonoInput = document.getElementById("telefono");
const responsableInput = document.getElementById("responsable");
const tipoNegocioInput = document.getElementById("tipoNegocio");
const crearBtn = document.getElementById("crear");

let allPropuestas = [];
let filtroEstado = "";

// ✅ Obtener propuestas
async function fetchPropuestas() {
  try {
    const res = await axios.get(API_URL);
    allPropuestas = res.data;
    renderPropuestas(allPropuestas);
  } catch (err) {
    console.error(err);
    propuestasContainer.innerHTML = "<p class='text-red-500'>Error cargando propuestas</p>";
  }
}

// ✅ Renderizar propuestas
function renderPropuestas(propuestas) {
  propuestasContainer.innerHTML = "";
  propuestas
    .filter(p => filtroEstado === "" || p.estado === filtroEstado)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card bg-white p-5 rounded-xl shadow-md flex flex-col justify-between";

      // ✅ Formatear monto en Quetzales
      const montoQuetzales = new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ"
      }).format(p.monto);

      card.innerHTML = `
        <div>
          <h3 class="text-xl font-bold mb-2">${p.titulo}</h3>
          <p class="text-gray-700 mb-2">${p.descripcion}</p>
          <p class="text-gray-500 mb-1">💰 Monto: <span class="font-semibold">${montoQuetzales}</span></p>
          <p class="text-gray-500 mb-1">🏷️ Tipo de negocio: <span class="font-semibold">${p.tipoNegocio}</span></p>
          <p class="text-gray-500 mb-1">👤 Contacto: ${p.contactoPrincipal} (${p.emailContacto})</p>
          <p class="text-gray-500 mb-1">📞 Tel: ${p.telefonoContacto}</p>
          <p class="text-gray-500 mb-1">🧑 Responsable: ${p.responsable}</p>
          <p class="mt-1 text-gray-500">📌 Estado: <span class="font-semibold">${p.estado}</span></p>
          <p class="text-xs text-gray-400 mt-2">Creada: ${new Date(p.fechaCreacion).toLocaleDateString()}</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <button onclick="accionVerificada(${p.id}, 'enviar', '${p.estado}')" class="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition">Enviar</button>
          <button onclick="accionVerificada(${p.id}, 'aceptar', '${p.estado}')" class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">Aceptar</button>
          <button onclick="accionVerificada(${p.id}, 'rechazar', '${p.estado}')" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">Rechazar</button>
          <button onclick="accionVerificada(${p.id}, 'delete', '${p.estado}')" class="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition">Eliminar</button>
        </div>
      `;
      propuestasContainer.appendChild(card);
    });
}

// ✅ Crear nueva propuesta
crearBtn.addEventListener("click", async () => {
  const nueva = {
    titulo: tituloInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    monto: parseFloat(montoInput.value),
    clienteId: parseInt(clienteIdInput.value),
    contactoPrincipal: contactoInput.value.trim(),
    emailContacto: emailInput.value.trim(),
    telefonoContacto: telefonoInput.value.trim(),
    responsable: responsableInput.value.trim(),
    tipoNegocio: tipoNegocioInput.value   // Nuevo campo
  };

  if (!nueva.titulo || !nueva.descripcion || isNaN(nueva.monto) || isNaN(nueva.clienteId)) {
    return alert("Llena todos los campos obligatorios correctamente");
  }

  try {
    await axios.post(API_URL, nueva);
    [tituloInput, descripcionInput, montoInput, clienteIdInput, contactoInput, emailInput, telefonoInput, responsableInput].forEach(input => input.value = "");
    tipoNegocioInput.value = "General"; // Reset select
    fetchPropuestas();
  } catch (err) {
    console.error(err);
    alert("Error al crear la propuesta");
  }
});

// ✅ Acción con verificación
async function accionVerificada(id, tipo, estadoActual) {
  let mensaje = "";
  switch(tipo) {
    case "enviar":
      if (estadoActual !== "Aceptada") {
        alert("Una propuesta debe ser ACEPTADA antes de ser ENVIADA.");
        return;
      }
      mensaje = "¿Enviar esta propuesta al cliente?";
      break;
    case "aceptar":
      mensaje = "¿Confirmas aceptar esta propuesta?";
      break;
    case "rechazar":
      mensaje = "¿Confirmas rechazar esta propuesta?";
      break;
    case "delete":
      mensaje = "¿Eliminar esta propuesta? Esta acción es irreversible.";
      break;
  }

  if (!confirm(mensaje)) return;

  try {
    if (tipo === "delete") await axios.delete(`${API_URL}/${id}`);
    else await axios.post(`${API_URL}/${id}/${tipo}`);

    fetchPropuestas();
  } catch (err) {
    console.error(err);
    alert("Ocurrió un error en la operación");
  }
}

// ✅ Filtro de estados
function filterEstado(estado) {
  filtroEstado = estado;
  renderPropuestas(allPropuestas);
}

// Inicializar
fetchPropuestas();

