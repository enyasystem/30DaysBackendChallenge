using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using InventoryApi.Repositories;
using InventoryApi.Services;
using Moq;
using Xunit;

namespace InventoryApi.Tests
{
    public class InventoryServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidData_AddsItem()
        {
            var repo = new InMemoryInventoryRepository();
            var service = new InventoryService(repo);

            var item = await service.CreateAsync("Widget", 10, "desc");

            Assert.NotNull(item);
            var fetched = await repo.GetByIdAsync(item.Id);
            Assert.NotNull(fetched);
            Assert.Equal("Widget", fetched!.Name);
            Assert.Equal(10, fetched.Quantity);
        }

        [Fact]
        public async Task UpdateAsync_NonExisting_Throws()
        {
            var repo = new InMemoryInventoryRepository();
            var service = new InventoryService(repo);

            await Assert.ThrowsAsync<KeyNotFoundException>(async () =>
                await service.UpdateAsync(System.Guid.NewGuid(), "X", 1, null));
        }
    }
}