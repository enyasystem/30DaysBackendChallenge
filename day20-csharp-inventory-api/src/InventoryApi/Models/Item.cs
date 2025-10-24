using System.ComponentModel.DataAnnotations;

namespace InventoryApi.Models
{
    /// <summary>
    /// Represents an item in inventory.
    /// </summary>
    public class Item
    {
        /// <summary>
        /// Unique identifier.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Item name.
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Quantity in stock.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        /// <summary>
        /// Optional description.
        /// </summary>
        [StringLength(1000)]
        public string? Description { get; set; }
    }
}