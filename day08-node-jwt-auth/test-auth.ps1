# Quick smoke test for Day08 API: register -> login -> protected
$base = 'http://localhost:3000'
$ts = (Get-Date).ToString('yyyyMMddHHmmss')
$username = "testuser_$ts"
$password = 'secret'

Write-Host "Using username: $username`n"

function Try-Request($method, $path, $body = $null, $headers = $null){
    try{
        if ($body -ne $null){
            $json = $body | ConvertTo-Json
            return Invoke-RestMethod -Uri "$base$path" -Method $method -Body $json -ContentType 'application/json' -Headers $headers -ErrorAction Stop
        } else {
            return Invoke-RestMethod -Uri "$base$path" -Method $method -Headers $headers -ErrorAction Stop
        }
    } catch {
        # Try to extract response body if available
        $err = $_.Exception
        Write-Host "Request to $path failed: $($err.Message)" -ForegroundColor Yellow
        if ($err.Response -ne $null){
            try { $reader = (New-Object System.IO.StreamReader($err.Response.GetResponseStream())); $bodyText = $reader.ReadToEnd(); $reader.Close(); Write-Host "Response body:`n$bodyText" -ForegroundColor Gray } catch { }
        }
        return $null
    }
}

# Register
Write-Host "Registering..."
$reg = Try-Request -method 'POST' -path '/api/auth/register' -body @{ username = $username; password = $password }
if ($reg -ne $null){ Write-Host "Register response:`n"; $reg | ConvertTo-Json -Depth 5 | Write-Host }

# Login
Write-Host "`nLogging in..."
$login = Try-Request -method 'POST' -path '/api/auth/login' -body @{ username = $username; password = $password }
if ($login -eq $null){ Write-Host "Login failed, aborting." -ForegroundColor Red; exit 1 }

$token = $login.token
Write-Host "`nReceived token (first 64 chars): $($token.Substring(0,[Math]::Min(64,$token.Length)))...`n"

# Call protected
Write-Host "Calling protected endpoint..."
$hdr = @{ Authorization = "Bearer $token" }
$prot = Try-Request -method 'GET' -path '/api/protected' -headers $hdr
if ($prot -ne $null){ Write-Host "Protected response:`n"; $prot | ConvertTo-Json -Depth 5 | Write-Host }

Write-Host "`nSmoke test completed." -ForegroundColor Green
