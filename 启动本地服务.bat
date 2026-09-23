@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo Starting local web server for the Agent learning platform...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "start-local-server.ps1"
echo.
echo Server stopped. Press any key to close.
pause >nul
