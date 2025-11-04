using Rewards.Server.Entities;

namespace Rewards.Server.Repositories
{
    public interface ISaleRepository
    {
        Task<List<Sale>> GetAllAsync();
        Task<Sale?> GetByIdAsync(Guid id);
        Task<Sale> CreateAsync(Sale sale);
        Task UpdateAsync(Sale sale);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
}
