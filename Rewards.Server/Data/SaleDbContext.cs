using Microsoft.EntityFrameworkCore;
using Rewards.Server.Entities;

namespace Rewards.Server.Data;

public class SaleDbContext : DbContext
{
    public SaleDbContext(DbContextOptions<SaleDbContext> options) : base(options) { }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<InsuranceType> InsuranceTypes { get; set; }
}
