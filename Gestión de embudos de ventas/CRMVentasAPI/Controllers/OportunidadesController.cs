using Microsoft.AspNetCore.Mvc;
using CRMVentasAPI.Data;
using CRMVentasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CRMVentasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OportunidadesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OportunidadesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Oportunidad>> Crear(Oportunidad oportunidad)
        {
            _context.Oportunidades.Add(oportunidad);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPorId), new { id = oportunidad.Id }, oportunidad);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Oportunidad>> GetPorId(int id)
        {
            var oportunidad = await _context.Oportunidades
                .Include(o => o.Cliente)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (oportunidad == null)
                return NotFound();

            return oportunidad;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oportunidad>>> GetTodas()
        {
            return await _context.Oportunidades.Include(o => o.Cliente).ToListAsync();
        }
    }
}
