$base = "http://localhost:18080"
function Api($method, $path, $token, $body) {
  $h = @{}
  if ($token) { $h["Authorization"] = "Bearer $token" }
  if ($body) { Invoke-RestMethod -Method $method -Uri "$base$path" -Headers $h -ContentType "application/json" -Body ($body | ConvertTo-Json -Depth 5) }
  else { Invoke-RestMethod -Method $method -Uri "$base$path" -Headers $h }
}
$admin = (Api POST "/api/auth/login" $null @{username="admin";password="Admin@123"}).accessToken

$u = "demo" + (Get-Random -Maximum 9999)
$uid = (Api POST "/api/auth/register" $null @{username=$u;password="P@ss123";email="$u@example.com"}).uid
$cust = (Api POST "/api/auth/login" $null @{username=$u;password="P@ss123"}).accessToken
Start-Sleep 3
Api GET "/api/customers/$uid/membership" $cust | ConvertTo-Json