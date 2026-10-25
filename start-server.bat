@echo off
rem === Gurman order server launcher ===
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found! Install it from https://nodejs.org and run again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies ^(first launch only^)...
  call npm install
)

if not exist dist (
  echo Building site ^(first launch only^)...
  call npm run build
)

echo.
echo ================================================
echo   Server running: http://localhost:3000
echo   Kitchen screen: http://localhost:3000/kitchen
echo   Keep this window open. Close it to stop.
echo ================================================
echo.
start "" http://localhost:3000/kitchen
node server/server.js
pause
