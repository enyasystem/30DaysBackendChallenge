#!/usr/bin/env bash
set -euo pipefail
root_dir="$(cd "$(dirname "$0")" && pwd)"

echo "Running dotnet restore/build/test from $root_dir"
cd "$root_dir"

dotnet restore "./src/InventoryApi/InventoryApi.csproj"
dotnet build "./src/InventoryApi/InventoryApi.csproj"
dotnet test "./tests/InventoryApi.Tests/InventoryApi.Tests.csproj" --no-build

echo "Done."