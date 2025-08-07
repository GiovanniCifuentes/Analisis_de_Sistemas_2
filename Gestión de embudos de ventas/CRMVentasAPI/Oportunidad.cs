using System.ComponentModel.DataAnnotations.Schema;

namespace CRMVentasAPI.Models
{
    public class Oportunidad
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Etapa { get; set; }
        public float ValorEstimado { get; set; }
        public DateTime FechaCierreProbable { get; set; }
        public string Estado { get; set; }
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; }

        public string Nombre { get; set; }

        // 🔧 Estas dos propiedades debes agregarlas para solucionar los errores
        public DateTime FechaCreacion { get; set; }

        public string Vendedor { get; set; }
    }
}
