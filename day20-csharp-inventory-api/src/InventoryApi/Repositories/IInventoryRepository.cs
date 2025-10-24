using InventoryApi.Models;

namespace InventoryApi.Repositories
{
    /// <summary>
    /// Repository contract for inventory persistence.
    /// </summary>
    public interface IInventoryRepository
    {
        /// <summary>
        /// Returns all items currently stored.
        /// </summary>
        /// <returns>Enumerable of <see cref="Item"/>.</returns>
        Task<IEnumerable<Item>> GetAllAsync(CancellationToken ct = default);

        /// <summary>
        /// Finds an item by its identifier.
        /// </summary>
        /// <param name="id">Item identifier.</param>
        /// <returns>The matching <see cref="Item"/> or null if not found.</returns>
        Task<Item?> GetByIdAsync(Guid id, CancellationToken ct = default);

        /// <summary>
        /// Adds a new item to the store.
        /// </summary>
        /// <param name="item">Item to add.</param>
        Task AddAsync(Item item, CancellationToken ct = default);

        /// <summary>
        /// Updates an existing item in the store. Implementations may throw if the item does not exist.
        /// </summary>
        /// <param name="item">Item to update.</param>
        Task UpdateAsync(Item item, CancellationToken ct = default);

        /// <summary>
        /// Deletes an item by id. If the item does not exist, implementations may simply return.
        /// </summary>
        /// <param name="id">Identifier of the item to delete.</param>
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }
}