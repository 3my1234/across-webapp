$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $port)
$listener.Start()
Write-Host "Across preview running at http://localhost:$port"

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
}

function Write-HttpResponse($stream, [int]$status, [string]$statusText, [string]$contentType, [byte[]]$body) {
  $headers = "HTTP/1.1 $status $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
  $stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($body.Length -gt 0) {
    $stream.Write($body, 0, $body.Length)
  }
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $buffer = New-Object byte[] 4096
    $read = $stream.Read($buffer, 0, $buffer.Length)
    if ($read -le 0) {
      $client.Close()
      continue
    }
    $request = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
    $firstLine = ($request -split "`r`n")[0]
    $parts = $firstLine -split " "
    $requestPath = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
    if ($requestPath -eq "/") {
      $requestPath = "/index.html"
    }
    $requestPath = ($requestPath -split "\?")[0]
    $relative = [System.Uri]::UnescapeDataString($requestPath.TrimStart("/")) -replace "/", [System.IO.Path]::DirectorySeparatorChar
    $filePath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relative))

    if (-not $filePath.StartsWith($root)) {
      Write-HttpResponse $stream 403 "Forbidden" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Forbidden"))
    } elseif (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
      Write-HttpResponse $stream 404 "Not Found" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Not found"))
    } else {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $extension = [System.IO.Path]::GetExtension($filePath)
      $contentType = if ($types.ContainsKey($extension)) { $types[$extension] } else { "application/octet-stream" }
      Write-HttpResponse $stream 200 "OK" $contentType $bytes
    }
  } catch {
    try {
      Write-HttpResponse $stream 500 "Internal Server Error" "text/plain; charset=utf-8" ([System.Text.Encoding]::UTF8.GetBytes("Server error"))
    } catch {}
  } finally {
    $client.Close()
  }
}
