$ErrorActionPreference = "Stop"

$green = "`e[32m"
$yellow = "`e[33m"
$reset = "`e[0m"

Write-Host "${green}========================================${reset}"
Write-Host "${green}Iniciando Multisoft en modo produccion${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvPath = Join-Path $rootPath "venv\Scripts\Activate.ps1"
$frontendPath = Join-Path $rootPath "frontend-next"
$serverPath = Join-Path $rootPath "server\multisoft"
$pidFilePath = Join-Path $rootPath ".multisoft-prod.json"
$nvmCommand = Get-Command nvm.exe -ErrorAction SilentlyContinue
$nvmHome = if ($nvmCommand) { Split-Path -Parent $nvmCommand.Source } else { $null }
$legacyNodeVersion = "12.22.12"
$frontendNodeVersion = "20.19.0"
$legacyNodeExe = if ($nvmHome) { Join-Path $nvmHome "v$legacyNodeVersion\node.exe" } else { $null }
$frontendNpmCmd = if ($nvmHome) { Join-Path $nvmHome "v$frontendNodeVersion\npm.cmd" } else { $null }
$frontendNodeExe = if ($nvmHome) { Join-Path $nvmHome "v$frontendNodeVersion\node.exe" } else { $null }

if (-not (Test-Path $venvPath)) {
    throw "No se encontro el entorno virtual en $venvPath"
}

if (-not $nvmHome) {
    throw "No se encontro nvm.exe en PATH."
}

if (-not (Test-Path $legacyNodeExe)) {
    throw "Falta Node.js v$legacyNodeVersion para la API legacy/sqlanywhere. Ejecuta: nvm install $legacyNodeVersion"
}

if (-not (Test-Path $frontendNpmCmd)) {
    throw "Falta Node.js v$frontendNodeVersion para Next.js. Ejecuta: nvm install $frontendNodeVersion"
}

if (-not (Test-Path $frontendNodeExe)) {
    throw "No se encontro node.exe para Node.js v$frontendNodeVersion"
}

Write-Host "${yellow}[1/4] Verificando dependencias Python...${reset}"
& powershell -NoProfile -ExecutionPolicy Bypass -Command "& '$venvPath'; Set-Location '$rootPath'; python --version"

Write-Host "${yellow}[2/4] Ejecutando migraciones Django...${reset}"
& powershell -NoProfile -ExecutionPolicy Bypass -Command "& '$venvPath'; Set-Location '$rootPath'; `$env:DJANGO_SETTINGS_MODULE='multisoft_informes.settings.production'; python manage.py migrate --noinput"

Write-Host "${yellow}[3/4] Compilando frontend Next.js...${reset}"
Push-Location $frontendPath
try {
    & $frontendNpmCmd run build
} finally {
    Pop-Location
}

$djangoCommand = "& '$venvPath'; Set-Location '$rootPath'; `$env:DJANGO_SETTINGS_MODULE='multisoft_informes.settings.production'; python manage.py runserver 0.0.0.0:8000"
$nextCommand = "Set-Location '$frontendPath'; `$env:NODE_ENV='production'; & '$frontendNpmCmd' run start"
$nodeCommand = "Set-Location '$serverPath'; & '$legacyNodeExe' .\bin\www"

Write-Host "${yellow}[4/4] Levantando servicios...${reset}"

$djangoProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $djangoCommand
) -WorkingDirectory $rootPath -WindowStyle Normal

$nextProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $nextCommand
) -WorkingDirectory $frontendPath -WindowStyle Normal

$nodeProcess = Start-Process powershell -PassThru -ArgumentList @(
    "-NoExit",
    "-Command",
    $nodeCommand
) -WorkingDirectory $serverPath -WindowStyle Normal

[pscustomobject]@{
    created_at = (Get-Date).ToString("s")
    root_path = $rootPath
    mode = "production"
    processes = @(
        [pscustomobject]@{ name = "django"; pid = $djangoProcess.Id }
        [pscustomobject]@{ name = "next"; pid = $nextProcess.Id }
        [pscustomobject]@{ name = "node_api"; pid = $nodeProcess.Id }
    )
} | ConvertTo-Json -Depth 3 | Set-Content -Path $pidFilePath

Write-Host ""
Write-Host "${green}========================================${reset}"
Write-Host "${green}Servicios iniciados en modo produccion${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""
Write-Host "Versiones activas:"
Write-Host "  Node API legacy/sqlanywhere: $legacyNodeVersion"
Write-Host "  Next.js frontend:            $frontendNodeVersion"
Write-Host ""
Write-Host "URLs de acceso:"
Write-Host "  Django API:  http://localhost:8000"
Write-Host "  Next.js:     http://localhost:3001"
Write-Host "  Node.js API: http://localhost:3000"
Write-Host ""
Write-Host "PIDs levantados:"
Write-Host "  Django:   $($djangoProcess.Id)"
Write-Host "  Next.js:  $($nextProcess.Id)"
Write-Host "  Node API: $($nodeProcess.Id)"
Write-Host ""
Write-Host "Archivo PID:"
Write-Host "  $pidFilePath"
Write-Host ""
Write-Host "Nota: en produccion real conviene ejecutar estos procesos con PM2, NSSM o un servicio Windows."
