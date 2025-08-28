using CRMVentasAPI.Data;
using CRMVentasAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMVentasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TareasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TareasController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Obtener todas las tareas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarea>>> GetAll()
        {
            return Ok(await _context.Tareas.AsNoTracking().ToListAsync());
        }

        // ✅ Obtener tarea por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Tarea>> GetById(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null) return NotFound(new { mensaje = $"No se encontró la tarea con ID {id}" });

            return Ok(tarea);
        }

        // ✅ Crear nueva tarea
        [HttpPost]
        public async Task<ActionResult<Tarea>> Create(Tarea tarea)
        {
            try
            {
                tarea.FechaCreacion = DateTime.Now;
                _context.Tareas.Add(tarea);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = tarea.Id }, tarea);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear la tarea", detalle = ex.Message });
            }
        }

        // ✅ Actualizar estado de la tarea
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Tarea tarea)
        {
            if (id != tarea.Id) return BadRequest(new { mensaje = "El ID de la tarea no coincide" });

            try
            {
                tarea.UltimaActualizacion = DateTime.Now;
                _context.Entry(tarea).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tareas.Any(t => t.Id == id))
                    return NotFound(new { mensaje = "No se encontró la tarea para actualizar" });

                throw;
            }
        }

        // ✅ Eliminar tarea
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null) return NotFound(new { mensaje = $"No existe la tarea con ID {id}" });

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Tarea eliminada correctamente" });
        }

        // ✅ Asignar tarea a un vendedor
        [HttpPost("{id}/asignar")]
        public async Task<IActionResult> AsignarVendedor(int id, [FromQuery] string vendedor)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null) return NotFound(new { mensaje = "Tarea no encontrada" });

            tarea.VendedorAsignado = vendedor;
            tarea.UltimaActualizacion = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(tarea);
        }

        // ✅ Actualizar progreso de tarea
        [HttpPost("{id}/progreso")]
        public async Task<IActionResult> ActualizarProgreso(int id, [FromQuery] string estado)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null) return NotFound(new { mensaje = "Tarea no encontrada" });

            tarea.EstadoTarea = estado;
            if (estado == "Completada") tarea.FechaFinalizacion = DateTime.Now;

            tarea.UltimaActualizacion = DateTime.Now;
            await _context.SaveChangesAsync();

            return Ok(tarea);
        }
    }
}
