@echo off
setlocal

for %%P in (3000 8000 443 80) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P') do (
    taskkill /PID %%a /F >nul 2>&1
  )
)

taskkill /FI "WINDOWTITLE eq DJANGO" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NODE" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq CADDY" /T /F >nul 2>&1

echo Servicios HTTPS detenidos.
endlocal
