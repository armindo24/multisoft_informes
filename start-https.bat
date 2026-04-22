@echo off
setlocal

set ROOT=C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes
set CADDY_ROOT=C:\Caddy
set CADDYFILE=%CADDY_ROOT%\Caddyfile

if not exist "%CADDY_ROOT%\caddy.exe" (
  echo No se encontro Caddy en %CADDY_ROOT%\caddy.exe
  exit /b 1
)

if not exist "%CADDYFILE%" (
  echo No se encontro el archivo %CADDYFILE%
  exit /b 1
)

start "DJANGO" powershell -NoExit -Command "cd %ROOT%; .\.venv\Scripts\Activate.ps1; python manage.py runserver 127.0.0.1:8000"
start "NODE" powershell -NoExit -Command "cd %ROOT%\server\multisoft; node .\bin\www"
start "CADDY" powershell -NoExit -Command "cd %CADDY_ROOT%; .\caddy.exe run --config .\Caddyfile"

echo Servicios iniciados:
echo - Django: 127.0.0.1:8000
echo - Node:   127.0.0.1:3000
echo - HTTPS:  https://sig.multisoft.local

endlocal
