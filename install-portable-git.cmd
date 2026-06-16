@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "TOOLS_DIR=%PROJECT_ROOT%tools"
set "ZIP=%TOOLS_DIR%\MinGit-2.54.0-64-bit.zip"
set "DEST=%TOOLS_DIR%\mingit"
set "URL=https://github.com/git-for-windows/git/releases/download/v2.54.0.windows.1/MinGit-2.54.0-64-bit.zip"

if not exist "%TOOLS_DIR%" mkdir "%TOOLS_DIR%"

if not exist "%ZIP%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%ZIP%'"
)

if exist "%DEST%" rmdir /s /q "%DEST%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%ZIP%' -DestinationPath '%DEST%' -Force"

call "%PROJECT_ROOT%dev-env.cmd"
git --version
