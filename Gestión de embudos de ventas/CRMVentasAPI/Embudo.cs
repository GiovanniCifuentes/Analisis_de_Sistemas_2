namespace CRMVentasAPI.Models
{
    public class Embudo
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        // Cambio: Etapas como lista en lugar de string
        public List<string> Etapas { get; set; } = new List<string>();

        public double ValorEstimado { get; set; }
        public string Estado { get; set; }
        public DateTime FechaCierreProbable { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string Vendedor { get; set; }

        // Nuevo: Probabilidad de cierre (0-100%)
        public int ProbabilidadCierre { get; set; } = 50;

        // Nuevo: Valor previsto calculado
        public double ValorPrevisto => ValorEstimado * (ProbabilidadCierre / 100.0);
    }
}
