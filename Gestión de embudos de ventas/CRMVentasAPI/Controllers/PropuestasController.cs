using CRMVentasAPI.Data;
using CRMVentasAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRMVentasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropuestasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropuestasController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Obtener todas las propuestas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Propuesta>>> GetAll()
        {
            return Ok(await _context.Propuestas.AsNoTracking().ToListAsync());
        }

        // ✅ Obtener una propuesta por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Propuesta>> GetById(int id)
        {
            var propuesta = await _context.Propuestas.FindAsync(id);
            if (propuesta == null)
                return NotFound(new { mensaje = $"No se encontró la propuesta con ID {id}" });

            return Ok(propuesta);
        }

        // ✅ Crear una nueva propuesta
        [HttpPost]
        public async Task<ActionResult<Propuesta>> Create(Propuesta propuesta)
        {
            try
            {
                propuesta.FechaCreacion = DateTime.Now;
                _context.Propuestas.Add(propuesta);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = propuesta.Id }, propuesta);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear la propuesta", detalle = ex.Message });
            }
        }

        // ✅ Actualizar una propuesta existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Propuesta propuesta)
        {
            if (id != propuesta.Id)
                return BadRequest(new { mensaje = "El ID de la propuesta no coincide" });

            try
            {
                _context.Entry(propuesta).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Propuestas.Any(p => p.Id == id))
                    return NotFound(new { mensaje = "No se encontró la propuesta para actualizar" });

                throw;
            }
        }

        // ✅ Eliminar propuesta
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var propuesta = await _context.Propuestas.FindAsync(id);
            if (propuesta == null)
                return NotFound(new { mensaje = $"No existe la propuesta con ID {id}" });

            _context.Propuestas.Remove(propuesta);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Propuesta eliminada correctamente" });
        }

        // ✅ Enviar propuesta (solo si está aceptada)
        [HttpPost("{id}/enviar")]
        public async Task<IActionResult> Enviar(int id)
        {
            var propuesta = await _context.Propuestas.FindAsync(id);
            if (propuesta == null) return NotFound();

            if (propuesta.Estado != "Aceptada")
                return BadRequest(new { mensaje = "Solo se pueden enviar propuestas aceptadas." });

            propuesta.Estado = "Enviada";
            await _context.SaveChangesAsync();

            return Ok(propuesta);
        }

        // ✅ Aceptar propuesta
        [HttpPost("{id}/aceptar")]
        public async Task<IActionResult> Aceptar(int id)
        {
            var propuesta = await _context.Propuestas.FindAsync(id);
            if (propuesta == null) return NotFound();

            if (propuesta.Estado == "Aceptada")
                return BadRequest(new { mensaje = "La propuesta ya fue aceptada." });

            propuesta.Estado = "Aceptada";
            await _context.SaveChangesAsync();

            return Ok(propuesta);
        }

        // ✅ Rechazar propuesta
        [HttpPost("{id}/rechazar")]
        public async Task<IActionResult> Rechazar(int id)
        {
            var propuesta = await _context.Propuestas.FindAsync(id);
            if (propuesta == null) return NotFound();

            if (propuesta.Estado == "Rechazada")
                return BadRequest(new { mensaje = "La propuesta ya fue rechazada." });

            propuesta.Estado = "Rechazada";
            await _context.SaveChangesAsync();

            return Ok(propuesta);
        }
    }
}
