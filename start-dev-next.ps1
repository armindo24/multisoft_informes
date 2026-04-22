$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$nvmCommand = Get-Command nvm.exe -ErrorAction SilentlyContinue
$nvmHome = if ($nvmCommand) { Split-Path -Parent $nvmCommand.Source } else { $null }
$legacyNodeVersion = '12.22.12'
$frontendNodeVersion = '20.19.0'
$legacyNodeExe = if ($nvmHome) { Join-Path $nvmHome "v$legacyNodeVersion\node.exe" } else { $null }
$frontendNpmCmd = if ($nvmHome) { Join-Path $nvmHome "v$frontendNodeVersion\npm.cmd" } else { $null }

if (-not $nvmHome) {
    throw 'No se encontro nvm.exe en PATH.'
}

if (-not (Test-Path $legacyNodeExe)) {
    throw "Falta Node.js v$legacyNodeVersion para la API legacy/sqlanywhere. Ejecuta: nvm install $legacyNodeVersion"
}

if (-not (Test-Path $frontendNpmCmd)) {
    throw "Falta Node.js v$frontendNodeVersion para Next.js. Ejecuta: nvm install $frontendNodeVersion"
}

$nodeDir = Join-Path $root 'server\multisoft'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$nodeDir`"; & `"$legacyNodeExe`" .\bin\www"
) -WorkingDirectory $nodeDir

$frontDir = Join-Path $root 'frontend-next'
Start-Process powershell -ArgumentList @(
    '-NoExit',
    '-Command',
    "cd `"$frontDir`"; & `"$frontendNpmCmd`" run dev"
) -WorkingDirectory $frontDir

Set-Location $root
& ".\venv\Scripts\Activate.ps1"
python manage.py runserver 0.0.0.0:8000
