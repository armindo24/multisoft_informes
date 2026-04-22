# Script para detener todos los servicios de desarrollo
# Detiene: Django, Next.js, Node.js API

$ErrorActionPreference = "Stop"

# Colores para output
$green = "`e[32m"
$yellow = "`e[33m"
$red = "`e[31m"
$reset = "`e[0m"
$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFilePath = Join-Path $rootPath ".multisoft-services.json"

function Get-DescendantProcessIds {
    param(
        [Parameter(Mandatory = $true)]
        [int]$ParentId
    )

    $children = @(Get-CimInstance Win32_Process -Filter "ParentProcessId = $ParentId" -ErrorAction SilentlyContinue)
    $ids = @()
    foreach ($child in $children) {
        $ids += [int]$child.ProcessId
        $ids += Get-DescendantProcessIds -ParentId ([int]$child.ProcessId)
    }
    return $ids
}

function Stop-TrackedWindow {
    param(
        [Parameter(Mandatory = $true)]
        [int]$ProcessId
    )

    $allIds = @($ProcessId) + @(Get-DescendantProcessIds -ParentId $ProcessId)
    $allIds = $allIds | Sort-Object -Descending -Unique
    foreach ($id in $allIds) {
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "${green}========================================${reset}"
Write-Host "${red}Deteniendo servicios de Multisoft${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""

if (Test-Path $pidFilePath) {
    Write-Host "${yellow}[1/1] Cerrando ventanas de servicios registradas...${reset}"
    $state = Get-Content -Raw $pidFilePath | ConvertFrom-Json
    $closed = @()
    foreach ($processInfo in @($state.processes)) {
        if ($processInfo.pid) {
            Stop-TrackedWindow -ProcessId ([int]$processInfo.pid)
            $closed += $processInfo.name
        }
    }
    Remove-Item -LiteralPath $pidFilePath -Force -ErrorAction SilentlyContinue
    if ($closed.Count -gt 0) {
        Write-Host "${green}Ventanas cerradas: $($closed -join ', ')${reset}"
    } else {
        Write-Host "${yellow}No habia procesos registrados para cerrar${reset}"
    }
} else {
    Write-Host "${yellow}[1/2] Archivo de seguimiento no encontrado. Aplicando cierre por proceso...${reset}"

    $pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
    if ($pythonProcesses) {
        Stop-Process -Name python -Force -ErrorAction SilentlyContinue
        Write-Host "${green}Django detenido${reset}"
    } else {
        Write-Host "${yellow}Django no esta corriendo${reset}"
    }

    Write-Host "${yellow}[2/2] Deteniendo Node.js (Next.js + API)...${reset}"
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host "${green}Node.js detenido${reset}"
    } else {
        Write-Host "${yellow}Node.js no esta corriendo${reset}"
    }
}

Write-Host ""
Write-Host "${green}========================================${reset}"
Write-Host "${green}Todos los servicios se han detenido${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""
Write-Host "Para iniciar de nuevo, ejecuta: .\start-all-services.ps1"
