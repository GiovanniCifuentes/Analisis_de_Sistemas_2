using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace CRMVentasAPI.Models
{
    public class Propuesta
    {
        public int Id { get; set; }

        // Información principal
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Monto { get; set; }

        // Propiedad calculada para mostrar en Quetzales
        [NotMapped]
        public string MontoEnQuetzales
        {
            get
            {
                return string.Format(new CultureInfo("es-GT"), "{0:C}", Monto);
            }
        }

        // Tipo de negocio
        public string TipoNegocio { get; set; } = "General";
        // Valores posibles sugeridos: "Producto", "Servicio", "Proyecto", "Suscripción", etc.

        // Estado del ciclo de vida
        public string Estado { get; set; } = "Borrador";
        // Borrador, Enviada, En Revisión, Aceptada, Rechazada, Cerrada

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

        // Seguimiento
        public string Responsable { get; set; } = string.Empty;
        public string Observaciones { get; set; } = string.Empty;

        // Condiciones de negocio
        public string Condiciones { get; set; } = string.Empty;
        public int ValidezDias { get; set; } = 30;

        // Auditoría
        public DateTime UltimaActualizacion { get; set; } = DateTime.Now;
        public string UsuarioUltimaActualizacion { get; set; } = string.Empty;
    }
}




