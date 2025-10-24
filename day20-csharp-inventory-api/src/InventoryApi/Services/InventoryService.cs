using InventoryApi.Models;
using InventoryApi.Repositories;

namespace InventoryApi.Services
{
    /// <summary>
    /// Default inventory service implementing simple validation and repository usage.
    /// </summary>
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _repo;

        public InventoryService(IInventoryRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// Returns all items using the configured repository.
        /// </summary>
        public Task<IEnumerable<Item>> GetAllAsync(CancellationToken ct = default)
        {
            return _repo.GetAllAsync(ct);
        }

        /// <summary>
        /// Returns a single item by id or null if not found.
        /// </summary>
        public Task<Item?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            return _repo.GetByIdAsync(id, ct);
        }

        /// <summary>
        /// Validates input and creates a new item. Throws <see cref="ArgumentException"/> for invalid name
        /// or <see cref="ArgumentOutOfRangeException"/> for negative quantity.
        /// </summary>
        public async Task<Item> CreateAsync(string name, int quantity, string? description, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name is required", nameof(name));
            if (quantity < 0)
                throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity cannot be negative");

            var item = new Item
            {
                Id = Guid.NewGuid(),
                Name = name.Trim(),
                Quantity = quantity,
                Description = description?.Trim()
            };

            await _repo.AddAsync(item, ct);
            return item;
        }

        /// <summary>
        /// Updates an existing item. If the item does not exist, a <see cref="KeyNotFoundException"/> is thrown.
        /// </summary>
        public async Task UpdateAsync(Guid id, string name, int quantity, string? description, CancellationToken ct = default)
        {
            var existing = await _repo.GetByIdAsync(id, ct);
            if (existing == null)
                throw new KeyNotFoundException("Item not found");

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name is required", nameof(name));
            if (quantity < 0)
                throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity cannot be negative");

            existing.Name = name.Trim();
            existing.Quantity = quantity;
            existing.Description = description?.Trim();

            await _repo.UpdateAsync(existing, ct);
        }

        /// <summary>
        /// Deletes an item by its identifier.
        /// </summary>
        public Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            return _repo.DeleteAsync(id, ct);
        }
    }
}