const API_URL = "https://localhost:7193/api/Tareas";
const API_OPORTUNIDADES = "https://localhost:7193/api/Oportunidades";

const tareasContainer = document.getElementById("tareasContainer");
const crearBtn = document.getElementById("crear");

const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const oportunidadIdInput = document.getElementById("oportunidadId");
const estadoOportunidadInput = document.getElementById("estadoOportunidad");
const vendedorAsignadoInput = document.getElementById("vendedorAsignado");

const filtroVendedorSelect = document.getElementById("filtroVendedor");
const filtroEstadoSelect = document.getElementById("filtroEstado");
const filtroOportunidadSelect = document.getElementById("filtroOportunidad");
const aplicarFiltroBtn = document.getElementById("aplicarFiltro");
const limpiarFiltroBtn = document.getElementById("limpiarFiltro");

let allTareas = [];
let allOportunidades = [];

async function fetchTareas() {
    try {
        const resTareas = await axios.get(API_URL);
        allTareas = resTareas.data;

        const resOportunidades = await axios.get(API_OPORTUNIDADES);
        allOportunidades = resOportunidades.data;

        renderTareas(allTareas);
        llenarSelects();
    } catch (err) {
        console.error(err);
        tareasContainer.innerHTML = "<p class='text-red-500'>Error cargando datos</p>";
    }
}

function renderTareas(tareas) {
    tareasContainer.innerHTML = "";
    tareas.forEach(t => {
        const card = document.createElement("div");
        card.className = `task-card estado-${t.estadoTarea.replace(/\s/g,'')}`;
        card.innerHTML = `
            <h3>${t.titulo}</h3>
            <p>${t.descripcion}</p>
            <p>Oportunidad: ${t.oportunidadId} (${t.estadoOportunidad})</p>
            <p>Vendedor: ${t.vendedorAsignado || "-"}</p>
            <p>Estado tarea: ${t.estadoTarea}</p>
            <p>Creada: ${new Date(t.fechaCreacion).toLocaleDateString()}</p>
            <div class="buttons">
                <button onclick="cambiarEstado(${t.id}, 'Pendiente')">Pendiente</button>
                <button onclick="cambiarEstado(${t.id}, 'En Progreso')">En Progreso</button>
                <button onclick="cambiarEstado(${t.id}, 'Completada')">Completada</button>
                <button onclick="eliminarTarea(${t.id})">Eliminar</button>
            </div>
        `;
        tareasContainer.appendChild(card);
    });
}

async function llenarSelects() {
    // Oportunidades
    oportunidadIdInput.innerHTML = '<option value="">Selecciona Oportunidad</option>';
    allOportunidades.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.id;
        opt.textContent = `${o.id} - ${o.titulo}`;
        oportunidadIdInput.appendChild(opt);
    });

    // Autocompletar vendedor y estado al seleccionar oportunidad
    oportunidadIdInput.addEventListener("change", () => {
        const selected = allOportunidades.find(o => o.id == oportunidadIdInput.value);
        if (selected) {
            estadoOportunidadInput.value = selected.estado;
            vendedorAsignadoInput.value = selected.vendedor;
        } else {
            estadoOportunidadInput.value = "";
            vendedorAsignadoInput.value = "";
        }
    });

    // Filtros
    const vendedores = [...new Set(allOportunidades.map(o => o.vendedor).filter(v => v))];
    filtroVendedorSelect.innerHTML = '<option value="">Filtrar por vendedor</option>';
    vendedores.forEach(v => filtroVendedorSelect.appendChild(new Option(v, v)));

    const estadosTarea = ["Pendiente","En Progreso","Completada"];
    filtroEstadoSelect.innerHTML = '<option value="">Filtrar por estado tarea</option>';
    estadosTarea.forEach(e => filtroEstadoSelect.appendChild(new Option(e,e)));

    const estadosOportunidad = [...new Set(allOportunidades.map(o => o.estado))];
    filtroOportunidadSelect.innerHTML = '<option value="">Filtrar por estado oportunidad</option>';
    estadosOportunidad.forEach(e => filtroOportunidadSelect.appendChild(new Option(e,e)));
}

// Crear tarea
crearBtn.addEventListener("click", async () => {
    const nueva = {
        titulo: tituloInput.value.trim(),
        descripcion: descripcionInput.value.trim(),
        oportunidadId: parseInt(oportunidadIdInput.value),
        estadoOportunidad: estadoOportunidadInput.value,
        vendedorAsignado: vendedorAsignadoInput.value,
        estadoTarea: "Pendiente"
    };
    if (!nueva.titulo || !nueva.descripcion || isNaN(nueva.oportunidadId)) return alert("Llena todos los campos correctamente");
    try {
        await axios.post(API_URL, nueva);
        [tituloInput, descripcionInput, oportunidadIdInput, estadoOportunidadInput, vendedorAsignadoInput].forEach(i => i.value = "");
        fetchTareas();
    } catch (err) { console.error(err); alert("Error al crear la tarea"); }
});

// Filtros
aplicarFiltroBtn.addEventListener("click", () => {
    const v = filtroVendedorSelect.value;
    const e = filtroEstadoSelect.value;
    const o = filtroOportunidadSelect.value;
    const filtradas = allTareas.filter(t =>
        (!v || t.vendedorAsignado === v) &&
        (!e || t.estadoTarea === e) &&
        (!o || t.estadoOportunidad === o)
    );
    renderTareas(filtradas);
});

limpiarFiltroBtn.addEventListener("click", () => {
    filtroVendedorSelect.value = "";
    filtroEstadoSelect.value = "";
    filtroOportunidadSelect.value = "";
    renderTareas(allTareas);
});

// Cambiar estado y eliminar
async function cambiarEstado(id, estado) {
    try { await axios.post(`${API_URL}/${id}/progreso?estado=${estado}`); fetchTareas(); }
    catch(e){console.error(e); alert("Error actualizando");}
}
async function eliminarTarea(id) {
    if(!confirm("¿Eliminar esta tarea?")) return;
    try { await axios.delete(`${API_URL}/${id}`); fetchTareas(); }
    catch(e){console.error(e); alert("Error eliminando");}
}

fetchTareas();
