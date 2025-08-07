using Microsoft.AspNetCore.Mvc;
using CRMVentasAPI.Data;
using CRMVentasAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CRMVentasAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmbudosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmbudosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Embudo>> Crear([FromBody] Embudo embudo)
        {
            // Validaciones
            if (embudo == null)
                return BadRequest("El objeto Embudo no puede ser nulo");

            if (string.IsNullOrEmpty(embudo.Nombre))
                return BadRequest("El nombre del embudo es requerido");

            if (embudo.Etapas == null || embudo.Etapas.Count == 0)
                return BadRequest("Debe especificar al menos una etapa");

            if (embudo.ValorEstimado <= 0)
                return BadRequest("El valor estimado debe ser positivo");

            if (embudo.ProbabilidadCierre < 0 || embudo.ProbabilidadCierre > 100)
                return BadRequest("La probabilidad de cierre debe estar entre 0 y 100");

            _context.Embudos.Add(embudo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPorId), new { id = embudo.Id }, embudo);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Embudo>> GetPorId(int id)
        {
            var embudo = await _context.Embudos.FindAsync(id);
            if (embudo == null)
                return NotFound();
            return embudo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Embudo>>> GetTodos()
        {
            return await _context.Embudos.ToListAsync();
        }
    }
}
