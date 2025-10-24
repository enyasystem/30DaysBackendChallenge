using InventoryApi.DTOs;
using InventoryApi.Models;
using InventoryApi.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace InventoryApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IInventoryService _service;

        public ItemsController(IInventoryService service)
        {
            _service = service;
        }

        /// <summary>
        /// Items — List all items.
        /// Returns all inventory items as JSON.
        /// </summary>
        /// <remarks>Example: curl http://localhost:5000/api/items</remarks>
        [HttpGet]
        [SwaggerOperation(Summary = "Items — List all items", Description = "Returns all inventory items as JSON. Use this endpoint to retrieve the current inventory list.")]
        [ProducesResponseType(typeof(IEnumerable<Item>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Item>>> GetAll(CancellationToken ct)
        {
            var items = await _service.GetAllAsync(ct);
            return Ok(items);
        }

        /// <summary>
        /// Items — Get item by id.
        /// Returns a single item by id or 404 if not found.
        /// </summary>
        /// <remarks>Example: curl http://localhost:5000/api/items/{id}</remarks>
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Items — Get item by id", Description = "Returns a single item by id. Provide the item's GUID to retrieve it. Returns 404 when not found.")]
        [ProducesResponseType(typeof(Item), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Item>> GetById(Guid id, CancellationToken ct)
        {
            var item = await _service.GetByIdAsync(id, ct);
            if (item == null) return NotFound();
            return Ok(item);
        }

        /// <summary>
        /// Items — Create.
        /// Creates a new inventory item and returns 201 Created with its location.
        /// </summary>
        /// <remarks>
        /// Example:
        /// curl -X POST http://localhost:5000/api/items -H "Content-Type: application/json" -d '{"name":"Widget","quantity":10,"description":"test"}'
        /// </remarks>
        [HttpPost]
        [SwaggerOperation(Summary = "Items — Create", Description = "Creates a new inventory item. Returns 201 Created with a Location header pointing to the created item.")]
        [ProducesResponseType(typeof(Item), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Item>> Create([FromBody] ItemCreateDto dto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var item = await _service.CreateAsync(dto.Name, dto.Quantity, dto.Description, ct);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        /// <summary>
        /// Items — Update.
        /// Updates an existing item. Returns 204 No Content on success or 404 if not found.
        /// </summary>
        /// <remarks>
        /// Example:
        /// curl -X PUT http://localhost:5000/api/items/{id} -H "Content-Type: application/json" -d '{"name":"Updated","quantity":5,"description":"updated"}'
        /// </remarks>
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Items — Update", Description = "Updates an existing item. Provide the item's GUID and a JSON body matching ItemUpdateDto. Returns 204 No Content on success or 404 if the item does not exist.")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(Guid id, [FromBody] ItemUpdateDto dto, CancellationToken ct)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                await _service.UpdateAsync(id, dto.Name, dto.Quantity, dto.Description, ct);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// Items — Delete.
        /// Deletes an item by id. Returns 204 No Content.
        /// </summary>
        /// <remarks>Example: curl -X DELETE http://localhost:5000/api/items/{id}</remarks>
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Items — Delete", Description = "Deletes an item by id. Returns 204 No Content.")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            // delete is idempotent — repository will silently ignore if not present
            await _service.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}