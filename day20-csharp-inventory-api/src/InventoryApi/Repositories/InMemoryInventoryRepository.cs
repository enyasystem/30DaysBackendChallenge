using InventoryApi.Models;

namespace InventoryApi.Repositories
{
    /// <summary>
    /// Simple thread-safe in-memory repository for demo and tests.
    /// </summary>
    public class InMemoryInventoryRepository : IInventoryRepository
    {
        private readonly Dictionary<Guid, Item> _store = new();
        private readonly object _lock = new();

        public Task AddAsync(Item item, CancellationToken ct = default)
        {
            // Lock to ensure thread-safety for dictionary access in a single-process demo
            lock (_lock)
            {
                _store[item.Id] = item;
            }
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            lock (_lock)
            {
                _store.Remove(id);
            }
            return Task.CompletedTask;
        }

        public Task<IEnumerable<Item>> GetAllAsync(CancellationToken ct = default)
        {
            IEnumerable<Item> items;
            lock (_lock)
            {
                items = _store.Values.Select(i => i).ToList();
            }
            return Task.FromResult(items);
        }

        public Task<Item?> GetByIdAsync(Guid id, CancellationToken ct = default)
        {
            Item? item;
            lock (_lock)
            {
                _store.TryGetValue(id, out item);
            }
            return Task.FromResult(item);
        }

        public Task UpdateAsync(Item item, CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (_store.ContainsKey(item.Id))
                {
                    _store[item.Id] = item;
                }
                else
                {
                    // Explicitly throw so callers can decide how to handle missing items (e.g., return 404)
                    throw new KeyNotFoundException("Item not found");
                }
            }
            return Task.CompletedTask;
        }
    }
}