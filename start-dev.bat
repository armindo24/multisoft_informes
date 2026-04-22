@echo off
setlocal

rem Start Django + Node in separate PowerShell windows
set ROOT=C:\Multisoft\datos\web_informe\Web_New\webapp\multisoft_informes

start "DJANGO" powershell -NoExit -Command "cd %ROOT%; .\.venv\Scripts\Activate.ps1; python manage.py runserver 0.0.0.0:8000"
start "NODE" powershell -NoExit -Command "cd %ROOT%\server\multisoft; node .\bin\www"

endlocal
