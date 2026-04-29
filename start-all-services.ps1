# Script para iniciar todos los servicios de desarrollo
# Django (8000) + Next.js (3001) + Node.js API (3000)

$ErrorActionPreference = "Stop"

$green = "`e[32m"
$yellow = "`e[33m"
$reset = "`e[0m"

Write-Host "${green}========================================${reset}"
Write-Host "${green}Iniciando servicios de Multisoft${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvPath = Join-Path $rootPath "venv\Scripts\Activate.ps1"
$frontendPath = Join-Path $rootPath "frontend-next"
$serverPath = Join-Path $rootPath "server\multisoft"
$pidFilePath = Join-Path $rootPath ".multisoft-services.json"
$nvmCommand = Get-Command nvm.exe -ErrorAction SilentlyContinue
$nvmHome = if ($nvmCommand) { Split-Path -Parent $nvmCommand.Source } else { $null }
$legacyNodeVersion = "12.22.12"
$frontendNodeVersion = "20.19.0"
$legacyNodeExe = if ($nvmHome) { Join-Path $nvmHome "v$legacyNodeVersion\node.exe" } else { $null }
$frontendNpmCmd = if ($nvmHome) { Join-Path $nvmHome "v$frontendNodeVersion\npm.cmd" } else { $null }

if (-not (Test-Path $venvPath)) {
    Write-Host "${yellow}ERROR: No se encontro venv en $venvPath${reset}"
    exit 1
}

if (-not $nvmHome) {
    Write-Host "${yellow}ERROR: No se encontro nvm.exe en PATH${reset}"
    exit 1
}

if (-not (Test-Path $legacyNodeExe)) {
    Write-Host "${yellow}ERROR: Falta Node.js v$legacyNodeVersion para la API legacy/sqlanywhere${reset}"
    Write-Host "Instala con: nvm install $legacyNodeVersion"
    exit 1
}

if (-not (Test-Path $frontendNpmCmd)) {
    Write-Host "${yellow}ERROR: Falta Node.js v$frontendNodeVersion para Next.js${reset}"
    Write-Host "Instala con: nvm install $frontendNodeVersion"
    exit 1
}

$djangoCommand = "& '$venvPath'; Set-Location '$rootPath'; `$env:DJANGO_SETTINGS_MODULE='multisoft_informes.settings.development'; python manage.py migrate; python manage.py runserver 0.0.0.0:8000"
$nextCommand = "Set-Location '$frontendPath'; & '$frontendNpmCmd' run dev"
$nodeCommand = "Set-Location '$serverPath'; & '$legacyNodeExe' .\bin\www"
$trackedProcesses = @()

Write-Host "${yellow}[1/3] Iniciando Django (Puerto 8000)...${reset}"
$djangoProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $djangoCommand
) -WorkingDirectory $rootPath -WindowStyle Normal
$trackedProcesses += [pscustomobject]@{ name = "django"; pid = $djangoProcess.Id }

Write-Host "${yellow}[2/3] Iniciando Next.js (Puerto 3001)...${reset}"
$nextProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $nextCommand
) -WorkingDirectory $frontendPath -WindowStyle Normal
$trackedProcesses += [pscustomobject]@{ name = "next"; pid = $nextProcess.Id }

Write-Host "${yellow}[3/3] Iniciando Node.js API (Puerto 3000)...${reset}"
$nodeProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $nodeCommand
) -WorkingDirectory $serverPath -WindowStyle Normal
$trackedProcesses += [pscustomobject]@{ name = "node_api"; pid = $nodeProcess.Id }

[pscustomobject]@{
    created_at = (Get-Date).ToString("s")
    root_path = $rootPath
    processes = $trackedProcesses
} | ConvertTo-Json -Depth 3 | Set-Content -Path $pidFilePath

Write-Host ""
Write-Host "${green}========================================${reset}"
Write-Host "${green}Todos los servicios se estan iniciando${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""
Write-Host "Versiones activas:"
Write-Host "  Node API legacy/sqlanywhere: $legacyNodeVersion"
Write-Host "  Next.js frontend:            $frontendNodeVersion"
Write-Host ""
Write-Host "URLs de acceso:"
Write-Host "  Django API:  http://10.0.0.22:8000"
Write-Host "  Next.js:     http://10.0.0.22:3001"
Write-Host "  Node.js API: http://localhost:3000"
Write-Host ""
Write-Host "Para detener todos los servicios, ejecuta: .\stop-all-services.ps1"
