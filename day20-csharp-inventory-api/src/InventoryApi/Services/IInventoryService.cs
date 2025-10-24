using InventoryApi.Models;

namespace InventoryApi.Services
{
    /// <summary>
    /// Business logic for inventory operations.
    /// </summary>
    public interface IInventoryService
    {
        /// <summary>
        /// Retrieve all items.
        /// </summary>
        Task<IEnumerable<Item>> GetAllAsync(CancellationToken ct = default);

        /// <summary>
        /// Retrieve a single item by id.
        /// </summary>
        Task<Item?> GetByIdAsync(Guid id, CancellationToken ct = default);

        /// <summary>
        /// Create a new item after performing business validation.
        /// </summary>
        /// <returns>The created <see cref="Item"/> with generated Id.</returns>
        Task<Item> CreateAsync(string name, int quantity, string? description, CancellationToken ct = default);

        /// <summary>
        /// Update an existing item. Throws <see cref="KeyNotFoundException"/> if the item does not exist.
        /// </summary>
        Task UpdateAsync(Guid id, string name, int quantity, string? description, CancellationToken ct = default);

        /// <summary>
        /// Delete an item by id. If the item is not present, implementation may return without error.
        /// </summary>
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }
}