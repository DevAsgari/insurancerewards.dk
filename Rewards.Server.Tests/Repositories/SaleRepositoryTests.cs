using Microsoft.EntityFrameworkCore;
using Rewards.Server.Data;
using Rewards.Server.Entities;
using Rewards.Server.Repositories;

namespace Rewards.Server.Tests.Repositories
{
    public class SaleRepositoryTests : IDisposable
    {
        private readonly SaleDbContext _context;
        private readonly SaleRepository _repository;

        public SaleRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<SaleDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new SaleDbContext(options);
            _repository = new SaleRepository(_context);
        }

        [Fact]
        public async Task GetAllAsync_WithNoSales_ReturnsEmptyList()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllAsync_WithSales_ReturnsAllSales()
        {
            // Arrange
            var type1 = new InsuranceType { Id = 1, Name = "Car Insurance" };
            var type2 = new InsuranceType { Id = 2, Name = "Home Insurance" };
            await _context.InsuranceTypes.AddRangeAsync(type1, type2);

            var sale1 = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };
            var sale2 = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 2,
                Price = 2000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 8
            };

            await _context.Sales.AddRangeAsync(sale1, sale2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_WithExistingId_ReturnsSale()
        {
            // Arrange
            var type1 = new InsuranceType { Id = 1, Name = "Car Insurance" };
            await _context.InsuranceTypes.AddAsync(type1);

            var saleId = Guid.NewGuid();
            var sale = new Sale
            {
                Id = saleId,
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            await _context.Sales.AddAsync(sale);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(saleId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(saleId, result.Id);
            Assert.Equal(1, result.InsuranceTypeId);
        }

        [Fact]
        public async Task GetByIdAsync_WithNonExistingId_ReturnsNull()
        {
            // Act
            var result = await _repository.GetByIdAsync(Guid.NewGuid());

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateAsync_AddsSaleToDatabase()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 3,
                Price = 5000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 9
            };

            // Act
            var result = await _repository.CreateAsync(sale);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(sale.Id, result.Id);

            var savedSale = await _context.Sales.FindAsync(sale.Id);
            Assert.NotNull(savedSale);
            Assert.Equal(sale.InsuranceTypeId, savedSale.InsuranceTypeId);
        }

        [Fact]
        public async Task UpdateAsync_UpdatesExistingSale()
        {
            // Arrange
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            await _context.Sales.AddAsync(sale);
            await _context.SaveChangesAsync();
            _context.Entry(sale).State = EntityState.Detached;

            // Modify the sale
            sale.Price = 2000m;
            sale.CustomerSatisfaction = 8;

            // Act
            await _repository.UpdateAsync(sale);

            // Assert
            var updatedSale = await _context.Sales.FindAsync(sale.Id);
            Assert.NotNull(updatedSale);
            Assert.Equal(2000m, updatedSale.Price);
            Assert.Equal(8, updatedSale.CustomerSatisfaction);
        }

        [Fact]
        public async Task DeleteAsync_RemovesSaleFromDatabase()
        {
            // Arrange
            var saleId = Guid.NewGuid();
            var sale = new Sale
            {
                Id = saleId,
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            await _context.Sales.AddAsync(sale);
            await _context.SaveChangesAsync();

            // Act
            await _repository.DeleteAsync(saleId);

            // Assert
            var deletedSale = await _context.Sales.FindAsync(saleId);
            Assert.Null(deletedSale);
        }

        [Fact]
        public async Task DeleteAsync_WithNonExistingId_DoesNotThrow()
        {
            // Act & Assert
            var exception = await Record.ExceptionAsync(async () =>
                await _repository.DeleteAsync(Guid.NewGuid()));

            Assert.Null(exception);
        }

        [Fact]
        public async Task ExistsAsync_WithExistingId_ReturnsTrue()
        {
            // Arrange
            var saleId = Guid.NewGuid();
            var sale = new Sale
            {
                Id = saleId,
                InsuranceTypeId = 1,
                Price = 1000m,
                SaleDate = DateTime.Now,
                CustomerSatisfaction = 5
            };

            await _context.Sales.AddAsync(sale);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.ExistsAsync(saleId);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task ExistsAsync_WithNonExistingId_ReturnsFalse()
        {
            // Act
            var result = await _repository.ExistsAsync(Guid.NewGuid());

            // Assert
            Assert.False(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
