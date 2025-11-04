using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rewards.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRewardPropertiesFromSale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RewardStrategyType",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "RewardValue",
                table: "Sales");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "RewardStrategyType",
                table: "Sales",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RewardValue",
                table: "Sales",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
