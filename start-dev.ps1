$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
# Start Node API in a separate PowerShell window
$nodeDir = Join-Path $root 'server\\multisoft'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$nodeDir`"; node .\\bin\\www"
) -WorkingDirectory $nodeDir

# Start Django in the current window, listening on the LAN
Set-Location $root
.\\.venv\\Scripts\\Activate.ps1
python manage.py runserver 0.0.0.0:8000
