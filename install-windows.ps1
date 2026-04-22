$ErrorActionPreference = "Stop"

$green = "`e[32m"
$yellow = "`e[33m"
$reset = "`e[0m"

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvPath = Join-Path $rootPath "venv"
$frontendPath = Join-Path $rootPath "frontend-next"
$serverPath = Join-Path $rootPath "server\multisoft"
$requirementsPath = Join-Path $rootPath "requirements.txt"
$nvmCommand = Get-Command nvm.exe -ErrorAction SilentlyContinue
$nvmHome = if ($nvmCommand) { Split-Path -Parent $nvmCommand.Source } else { $null }
$legacyNodeVersion = "12.22.12"
$frontendNodeVersion = "20.19.0"
$legacyNpmCmd = if ($nvmHome) { Join-Path $nvmHome "v$legacyNodeVersion\npm.cmd" } else { $null }
$frontendNpmCmd = if ($nvmHome) { Join-Path $nvmHome "v$frontendNodeVersion\npm.cmd" } else { $null }

Write-Host "${green}========================================${reset}"
Write-Host "${green}Instalacion automatica - Multisoft${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    throw "No se encontro Python en PATH. Instala Python 3.10 o superior."
}

if (-not $nvmHome) {
    throw "No se encontro nvm.exe en PATH. Instala nvm-windows antes de continuar."
}

Write-Host "${yellow}[1/8] Verificando Python...${reset}"
python --version

Write-Host "${yellow}[2/8] Instalando versiones de Node requeridas...${reset}"
& nvm.exe install $legacyNodeVersion | Out-Host
& nvm.exe install $frontendNodeVersion | Out-Host

if (-not (Test-Path $legacyNpmCmd)) {
    throw "No se encontro npm para Node $legacyNodeVersion"
}

if (-not (Test-Path $frontendNpmCmd)) {
    throw "No se encontro npm para Node $frontendNodeVersion"
}

Write-Host "${yellow}[3/8] Creando entorno virtual Python...${reset}"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}

$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
if (-not (Test-Path $activateScript)) {
    throw "No se pudo crear el entorno virtual en $venvPath"
}

Write-Host "${yellow}[4/8] Instalando dependencias Python...${reset}"
& powershell -NoProfile -ExecutionPolicy Bypass -Command "& '$activateScript'; python -m pip install --upgrade pip; pip install -r '$requirementsPath'"

Write-Host "${yellow}[5/8] Instalando dependencias Node del frontend...${reset}"
Push-Location $frontendPath
try {
    & $frontendNpmCmd install
} finally {
    Pop-Location
}

Write-Host "${yellow}[6/8] Instalando dependencias Node de la API legacy...${reset}"
Push-Location $serverPath
try {
    & $legacyNpmCmd install
} finally {
    Pop-Location
}

Write-Host "${yellow}[7/8] Ejecutando migraciones Django...${reset}"
& powershell -NoProfile -ExecutionPolicy Bypass -Command "& '$activateScript'; Set-Location '$rootPath'; python manage.py migrate --noinput"

Write-Host "${yellow}[8/8] Compilando frontend Next.js...${reset}"
Push-Location $frontendPath
try {
    & $frontendNpmCmd run build
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "${green}========================================${reset}"
Write-Host "${green}Instalacion finalizada${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""
Write-Host "Siguientes pasos recomendados:"
Write-Host "  1. Revisar PRODUCCION_WINDOWS.md"
Write-Host "  2. Configurar PostgreSQL y SQL Anywhere"
Write-Host "  3. Probar .\start-prod.ps1"
Write-Host "  4. Para detener: .\stop-prod.ps1"
