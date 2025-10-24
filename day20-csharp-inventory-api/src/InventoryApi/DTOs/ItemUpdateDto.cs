using System.ComponentModel.DataAnnotations;

namespace InventoryApi.DTOs
{
    /// <summary>
    /// DTO for updating an inventory item.
    /// </summary>
    public class ItemUpdateDto
    {
        /// <summary>
        /// New name for the item. Required. Max length 200.
        /// </summary>
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Updated quantity. Must be zero or positive.
        /// </summary>
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        /// <summary>
        /// Optional description for the item. Max length 1000.
        /// </summary>
        [StringLength(1000)]
        public string? Description { get; set; }
    }
}