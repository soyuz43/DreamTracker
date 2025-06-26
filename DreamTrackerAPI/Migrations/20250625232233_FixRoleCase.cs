using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DreamTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixRoleCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                column: "NormalizedName",
                value: "ADMIN");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b2f0a5a7-55f6-4b6e-a12f-89ef34d9ec3c",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "6c3ebcb9-2102-4aa5-82e6-c9e406b8b583", "AQAAAAIAAYagAAAAEKZ0sJek5ZpmlKSDNgkfmQvLuX9KORE+uDBxHlDSAsN27RX1MMv4kwR7VREQ++u0kQ==", "f8480ae3-a815-432b-bce1-37060de0c9af" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3ca3d77e-573e-4506-bed9-f43c3eacacf4", "AQAAAAIAAYagAAAAEGwG6H5X4G8NDv7duDuoIDzqko8g/vPehqgBOZX08PVJOKoaqGy9g+O25gWKxS6GPA==", "85b66547-5726-4699-84f6-cb7642cb2855" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c3aaeb97-d2ba-4a53-a521-4eea61e59b35",
                column: "NormalizedName",
                value: "admin");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "b2f0a5a7-55f6-4b6e-a12f-89ef34d9ec3c",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5390448e-2e8b-441c-8d25-c4a97f3f0d0a", "AQAAAAIAAYagAAAAEDvLpOMexGoD+ONU/5/DG57BppMPZAIRFC0G30EaHOJDi+ObFotq1ed71imwuNGPcA==", "6f4de5ad-2091-46a9-98a7-ab1d9e87cee3" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "dbc40bc6-0829-4ac5-a3ed-180f5e916a5f",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "211adcc0-1500-45d7-8405-fcacf917094c", "AQAAAAIAAYagAAAAEPHtr3pC9/Li2edAPwVjHkvh3N3PTaPMYObOurOEVcR/mVIB8nglbFN813sbv1wNlQ==", "84f4dc76-6fb4-4abd-ae14-aa54f88533a7" });
        }
    }
}
