@echo off
setlocal

rem Kill Node on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
  taskkill /PID %%a /F >nul 2>&1
)

rem Kill Django on port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
  taskkill /PID %%a /F >nul 2>&1
)

rem Close PowerShell windows opened by start-dev.bat
taskkill /FI "WINDOWTITLE eq DJANGO" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NODE" /T /F >nul 2>&1

echo Servicios detenidos.
endlocal
