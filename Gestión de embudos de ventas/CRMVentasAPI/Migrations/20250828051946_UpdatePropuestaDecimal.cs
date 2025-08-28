using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMVentasAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePropuestaDecimal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClienteId",
                table: "Propuestas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Condiciones",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactoPrincipal",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmailContacto",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCierre",
                table: "Propuestas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaEnvio",
                table: "Propuestas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaRespuesta",
                table: "Propuestas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Observaciones",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Responsable",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TelefonoContacto",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaActualizacion",
                table: "Propuestas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UsuarioUltimaActualizacion",
                table: "Propuestas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ValidezDias",
                table: "Propuestas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClienteId",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "Condiciones",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "ContactoPrincipal",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "EmailContacto",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "FechaCierre",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "FechaEnvio",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "FechaRespuesta",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "Observaciones",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "Responsable",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "TelefonoContacto",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "UltimaActualizacion",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "UsuarioUltimaActualizacion",
                table: "Propuestas");

            migrationBuilder.DropColumn(
                name: "ValidezDias",
                table: "Propuestas");
        }
    }
}
