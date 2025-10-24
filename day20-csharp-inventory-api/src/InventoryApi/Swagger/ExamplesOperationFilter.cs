using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace InventoryApi.Swagger
{
    /// <summary>
    /// Adds example request/response bodies for selected operations.
    /// </summary>
    public class ExamplesOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation == null || context == null) return;

            // Example for GET /api/Items
            if (context.ApiDescription.RelativePath?.StartsWith("api/Items", StringComparison.OrdinalIgnoreCase) == true
                && context.ApiDescription.HttpMethod?.Equals("GET", StringComparison.OrdinalIgnoreCase) == true
                && !context.ApiDescription.RelativePath.Contains("{") )
            {
                var exampleArray = new OpenApiArray
                {
                    new OpenApiObject
                    {
                        ["id"] = new OpenApiString("00000000-0000-0000-0000-000000000001"),
                        ["name"] = new OpenApiString("Widget A"),
                        ["quantity"] = new OpenApiInteger(10),
                        ["description"] = new OpenApiString("Basic widget")
                    }
                };

                operation.Responses.TryGetValue("200", out var ok200);
                ok200 ??= new OpenApiResponse { Description = "OK" };
                ok200.Content ??= new Dictionary<string, OpenApiMediaType>();
                ok200.Content["application/json"] = new OpenApiMediaType
                {
                    Example = exampleArray
                };
            }

            // Example for GET /api/Items/{id}
            if (context.ApiDescription.RelativePath?.StartsWith("api/Items/", StringComparison.OrdinalIgnoreCase) == true
                && context.ApiDescription.HttpMethod?.Equals("GET", StringComparison.OrdinalIgnoreCase) == true
                && context.ApiDescription.RelativePath.Contains("{") )
            {
                var example = new OpenApiObject
                {
                    ["id"] = new OpenApiString("00000000-0000-0000-0000-000000000001"),
                    ["name"] = new OpenApiString("Widget A"),
                    ["quantity"] = new OpenApiInteger(10),
                    ["description"] = new OpenApiString("Basic widget")
                };

                operation.Responses.TryGetValue("200", out var ok200);
                ok200 ??= new OpenApiResponse { Description = "OK" };
                ok200.Content ??= new Dictionary<string, OpenApiMediaType>();
                ok200.Content["application/json"] = new OpenApiMediaType
                {
                    Example = example
                };
            }

            // Example request body for PUT /api/Items/{id}
            if (context.ApiDescription.RelativePath?.StartsWith("api/Items/", StringComparison.OrdinalIgnoreCase) == true
                && context.ApiDescription.HttpMethod?.Equals("PUT", StringComparison.OrdinalIgnoreCase) == true
                && context.ApiDescription.RelativePath.Contains("{") )
            {
                var reqExample = new OpenApiObject
                {
                    ["name"] = new OpenApiString("Updated Widget"),
                    ["quantity"] = new OpenApiInteger(5),
                    ["description"] = new OpenApiString("Updated description")
                };

                operation.RequestBody ??= new OpenApiRequestBody { Content = new Dictionary<string, OpenApiMediaType>() };
                operation.RequestBody.Content["application/json"] = new OpenApiMediaType
                {
                    Example = reqExample
                };
            }
        }
    }
}
