# Output only the Content-Type header
Write-Host "Content-Type: application/json"
Write-Host  # Ensure there's a blank line after the header

try {
    # Read incoming JSON data
    $requestBody = [Console]::In.ReadToEnd()

    if (!$requestBody) {
        throw "No input received."
    }

    $data = $requestBody | ConvertFrom-Json
    $username = $data.username
    $password = $data.password

    # Load user credentials from users.txt
    $usersFilePath = "C:\Users\ralra\OneDrive\Desktop\Ticketingsystem\backend\users.txt"

    if (!(Test-Path $usersFilePath)) {
        throw "Users file not found."
    }

    $users = Get-Content $usersFilePath | ForEach-Object {
        $parts = $_ -split ":"
        @{ Username = $parts[0]; Password = $parts[1] }
    }

    # Validate credentials
    $user = $users | Where-Object { $_.Username -eq $username -and $_.Password -eq $password }

    if ($user) {
        $response = @{ success = $true }
    } else {
        $response = @{ success = $false }
    }

} catch {
    # Handle errors and return them as JSON
    $response = @{ success = $false; error = $_.Exception.Message }
}

# Output the final JSON response
$response | ConvertTo-Json -Compress
