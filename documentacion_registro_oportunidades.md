# 📄 Documentación de la implementación del módulo de Propuestas

## 1. Descripción general

Este módulo implementa un **API REST** para la gestión de propuestas comerciales en un CRM de ventas, utilizando **ASP.NET Core** en el backend, **Entity Framework Core** como ORM, y una interfaz web moderna con **HTML, TailwindCSS y JavaScript (Axios)** para la interacción con la API.

Incluye:

* Clases del dominio (`Propuesta`).
* Controlador de API (`PropuestasController`) con métodos CRUD y de flujo de estado.
* Interfaz de usuario para listar, filtrar, crear y actualizar propuestas.

---

## 2. Modelo de datos: `Propuesta`

```csharp
public class Propuesta
{
    public int Id { get; set; }

    // Información principal
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    [Column(TypeName = "decimal(18,2)")]
    public decimal Monto { get; set; }
    [NotMapped]
    public string MontoEnQuetzales => string.Format(new CultureInfo("es-GT"), "{0:C}", Monto);

    // Estado del ciclo de vida
    public string Estado { get; set; } = "Borrador"; // Borrador, Enviada, En Revisión, Aceptada, Rechazada, Cerrada

    // Fechas importantes
    public DateTime FechaCreacion { get; set; } = DateTime.Now;
    public DateTime? FechaEnvio { get; set; }
    public DateTime? FechaRespuesta { get; set; }
    public DateTime? FechaCierre { get; set; }

    // Relación con cliente/prospecto
    public int ClienteId { get; set; }
    public string ContactoPrincipal { get; set; } = string.Empty;
    public string EmailContacto { get; set; } = string.Empty;
    public string TelefonoContacto { get; set; } = string.Empty;

    // Seguimiento y condiciones
    public string Responsable { get; set; } = string.Empty;
    public string Observaciones { get; set; } = string.Empty;
    public string Condiciones { get; set; } = string.Empty;
    public int ValidezDias { get; set; } = 30;

    // Auditoría
    public DateTime UltimaActualizacion { get; set; } = DateTime.Now;
    public string UsuarioUltimaActualizacion { get; set; } = string.Empty;
}
```

### Propiedades clave:

* `MontoEnQuetzales`: calculada dinámicamente para mostrar valores formateados.
* `Estado`: define el flujo de vida de la propuesta.
* Fechas: seguimiento de creación, envío, respuesta y cierre.

---

## 3. Controlador de API: `PropuestasController`

```csharp
[ApiController]
[Route("api/[controller]")]
public class PropuestasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PropuestasController(AppDbContext context) => _context = context;

    // GET: api/Propuestas
    public async Task<ActionResult<IEnumerable<Propuesta>>> GetAll() {...}

    // GET: api/Propuestas/{id}
    public async Task<ActionResult<Propuesta>> GetById(int id) {...}

    // POST: api/Propuestas
    public async Task<ActionResult<Propuesta>> Create(Propuesta propuesta) {...}

    // PUT: api/Propuestas/{id}
    public async Task<IActionResult> Update(int id, Propuesta propuesta) {...}

    // DELETE: api/Propuestas/{id}
    public async Task<IActionResult> Delete(int id) {...}

    // POST: api/Propuestas/{id}/enviar
    public async Task<IActionResult> Enviar(int id) {...}

    // POST: api/Propuestas/{id}/aceptar
    public async Task<IActionResult> Aceptar(int id) {...}

    // POST: api/Propuestas/{id}/rechazar
    public async Task<IActionResult> Rechazar(int id) {...}
}
```

### Métodos principales:

| Método                  | Ruta                                 | Descripción                            |
| ----------------------- | ------------------------------------ | -------------------------------------- |
| `GetAll()`              | GET `/api/Propuestas`                | Retorna todas las propuestas.          |
| `GetById(id)`           | GET `/api/Propuestas/{id}`           | Retorna propuesta por ID.              |
| `Create(propuesta)`     | POST `/api/Propuestas`               | Crea una nueva propuesta.              |
| `Update(id, propuesta)` | PUT `/api/Propuestas/{id}`           | Actualiza propuesta existente.         |
| `Delete(id)`            | DELETE `/api/Propuestas/{id}`        | Elimina propuesta.                     |
| `Enviar(id)`            | POST `/api/Propuestas/{id}/enviar`   | Envía propuesta solo si está aceptada. |
| `Aceptar(id)`           | POST `/api/Propuestas/{id}/aceptar`  | Cambia estado a aceptada.              |
| `Rechazar(id)`          | POST `/api/Propuestas/{id}/rechazar` | Cambia estado a rechazada.             |

---

## 4. Interfaz web

### Estructura HTML y TailwindCSS

* **Formulario de creación**: inputs para título, monto, cliente, contacto y responsable.
* **Filtro por estado**: botones que filtran las propuestas visualizadas.
* **Lista de propuestas**: tarjetas generadas dinámicamente.

### Funciones JavaScript

* `fetchPropuestas()`: obtiene todas las propuestas desde la API.
* `renderPropuestas(propuestas)`: renderiza tarjetas filtradas.
* `crearBtn.addEventListener('click')`: crea nueva propuesta.
* `accionVerificada(id, tipo, estadoActual)`: maneja acciones de enviar, aceptar, rechazar y eliminar.
* `filterEstado(estado)`: filtra las propuestas por estado.

---

## 5. Relaciones y diagramas

### Diagrama de clases (simplificado)

```
Propuesta
-----------
- Id : int
- Titulo : string
- Descripcion : string
- Monto : decimal
- MontoEnQuetzales : string (NotMapped)
- Estado : string
- FechaCreacion : DateTime
- FechaEnvio : DateTime?
- FechaRespuesta : DateTime?
- FechaCierre : DateTime?
- ClienteId : int
- ContactoPrincipal : string
- EmailContacto : string
- TelefonoContacto : string
- Responsable : string
- Observaciones : string
- Condiciones : string
- ValidezDias : int
- UltimaActualizacion : DateTime
- UsuarioUltimaActualizacion : string
```

### Flujo de operaciones (simplificado)

```
Usuario UI --> API Controller --> DbContext
  Crear propuesta --> Create()
  Listar propuestas --> GetAll()
  Actualizar propuesta --> Update()
  Eliminar propuesta --> Delete()
  Cambiar estado --> Enviar()/Aceptar()/Rechazar()
DbContext --> Base de datos
```
