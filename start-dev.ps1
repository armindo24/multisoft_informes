$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$nvmCommand = Get-Command nvm.exe -ErrorAction Stop
$legacyNodeExe = Join-Path (Split-Path -Parent $nvmCommand.Source) 'v12.22.12\node.exe'
if (-not (Test-Path -LiteralPath $legacyNodeExe)) {
    throw 'La API SQL Anywhere necesita Node 12.22.12. Instala con: nvm install 12.22.12'
}
# Start Node API in a separate PowerShell window
$nodeDir = Join-Path $root 'server\\multisoft'
Start-Process powershell -WindowStyle Hidden -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$nodeDir`"; & `"$legacyNodeExe`" .\bin\www"
) -WorkingDirectory $nodeDir

# Start Django in the current window, listening on the LAN
Set-Location $root
.\\.venv\\Scripts\\Activate.ps1
python manage.py runserver 0.0.0.0:8000
