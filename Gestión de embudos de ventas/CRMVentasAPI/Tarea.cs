using System.ComponentModel.DataAnnotations.Schema;

namespace CRMVentasAPI.Models
{
    public class Tarea
    {
        public int Id { get; set; }

        // Información de la tarea
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        // Relación con oportunidad
        public int OportunidadId { get; set; }
        public string EstadoOportunidad { get; set; } = "Pendiente";

        // Asignación
        public string VendedorAsignado { get; set; } = string.Empty;

        // Progreso y fechas
        public string EstadoTarea { get; set; } = "Pendiente"; // Pendiente, En Progreso, Completada
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public DateTime? FechaFinalizacion { get; set; }

        // Auditoría
        public string UsuarioUltimaActualizacion { get; set; } = string.Empty;
        public DateTime UltimaActualizacion { get; set; } = DateTime.Now;
    }
}
