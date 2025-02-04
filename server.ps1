$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"

while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $baseDir = "C:\Users\ralra\OneDrive\Desktop\Ticketingsystem"
    $localPath = $request.Url.AbsolutePath.TrimStart('/') -replace '/', '\'
    $filePath = Join-Path $baseDir $localPath

    if ($request.Url.AbsolutePath -eq "/") {
        $filePath = Join-Path $baseDir "index.html"
    }

    if (Test-Path $filePath) {
        if ($filePath -like "*.ps1") {
            # Execute PowerShell script
            $requestBody = New-Object IO.StreamReader $request.InputStream
            $inputJson = $requestBody.ReadToEnd()
            $output = powershell -NoProfile -ExecutionPolicy Bypass -File $filePath -ArgumentList $inputJson
            $buffer = [Text.Encoding]::UTF8.GetBytes($output)
            $response.ContentType = "application/json"
        } else {
            # Serve static files (HTML, CSS, JS, etc.)
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            switch ([System.IO.Path]::GetExtension($filePath).ToLower()) {
                ".html" { $response.ContentType = "text/html" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                default { $response.ContentType = "application/octet-stream" }
            }
        }
    } else {
        # File not found
        $response.StatusCode = 404
        $buffer = [Text.Encoding]::UTF8.GetBytes("File not found: $filePath")
        $response.ContentType = "text/plain"
    }

    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.Close()
}
