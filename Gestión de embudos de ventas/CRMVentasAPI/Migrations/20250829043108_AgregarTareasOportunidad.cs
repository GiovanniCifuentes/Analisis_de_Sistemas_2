using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMVentasAPI.Migrations
{
    /// <inheritdoc />
    public partial class AgregarTareasOportunidad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TipoNegocio",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipoNegocio",
                table: "Propuestas");
        }
    }
}
