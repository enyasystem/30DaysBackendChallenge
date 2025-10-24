using InventoryApi.Models;
using InventoryApi.Services;

namespace InventoryApi.Utilities
{
    /// <summary>
    /// Seeds sample data into the inventory for demos and tests.
    /// </summary>
    public class DataSeeder
    {
        private readonly IInventoryService _service;

        public DataSeeder(IInventoryService service)
        {
            _service = service;
        }

        /// <summary>
        /// Seed sample items. Idempotent for demo purposes.
        /// </summary>
        public async Task SeedAsync(CancellationToken ct = default)
        {
            var items = await _service.GetAllAsync(ct);
            if (items.Any()) return; // don't reseed if already has data

            var samples = new[]
            {
                ("Widget A", 10, "Basic widget"),
                ("Widget B", 5, "Premium widget"),
                ("Gadget", 25, "Handy gadget"),
            };

            foreach (var (name, qty, desc) in samples)
            {
                await _service.CreateAsync(name, qty, desc, ct);
            }
        }
    }
}
