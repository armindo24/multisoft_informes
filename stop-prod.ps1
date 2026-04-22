$ErrorActionPreference = "Stop"

$green = "`e[32m"
$yellow = "`e[33m"
$reset = "`e[0m"

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFilePath = Join-Path $rootPath ".multisoft-prod.json"

Write-Host "${green}========================================${reset}"
Write-Host "${green}Deteniendo Multisoft en modo produccion${reset}"
Write-Host "${green}========================================${reset}"
Write-Host ""

function Stop-MultisoftProcess {
    param(
        [string]$Name,
        [int]$Pid
    )

    try {
        $process = Get-Process -Id $Pid -ErrorAction Stop
        Stop-Process -Id $Pid -Force
        Write-Host "${yellow}Detenido ${Name} (PID ${Pid})${reset}"
    } catch {
        Write-Host "${yellow}${Name} (PID ${Pid}) ya no estaba ejecutandose${reset}"
    }
}

if (Test-Path $pidFilePath) {
    $data = Get-Content -Path $pidFilePath -Raw | ConvertFrom-Json
    foreach ($process in ($data.processes | Where-Object { $_.pid })) {
        Stop-MultisoftProcess -Name $process.name -Pid ([int]$process.pid)
    }
    Remove-Item -Path $pidFilePath -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "${yellow}No se encontro archivo PID de produccion. Intentando por puertos...${reset}"

    foreach ($port in 8000, 3001, 3000) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid in ($connections | Where-Object { $_ })) {
            Stop-MultisoftProcess -Name "puerto-$port" -Pid ([int]$pid)
        }
    }
}

Write-Host ""
Write-Host "${green}Proceso de detencion finalizado${reset}"
