using Microsoft.EntityFrameworkCore;
using Rewards.Server.Data;
using Rewards.Server.Entities;

namespace Rewards.Server.Repositories
{
    public class SaleRepository : ISaleRepository
    {
        private readonly SaleDbContext _context;

        public SaleRepository(SaleDbContext context)
        {
            _context = context;
        }

        public async Task<List<Sale>> GetAllAsync()
        {
            return await _context.Sales
                .Include(s => s.InsuranceType)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Sale?> GetByIdAsync(Guid id)
        {
            return await _context.Sales
                .Include(s => s.InsuranceType)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Sale> CreateAsync(Sale sale)
        {
            ArgumentNullException.ThrowIfNull(sale);
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();
            return sale;
        }

        public async Task UpdateAsync(Sale sale)
        {
            ArgumentNullException.ThrowIfNull(sale);
            _context.Sales.Update(sale);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale is not null)
            {
                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.Sales.AnyAsync(s => s.Id == id);
        }
    }
}
