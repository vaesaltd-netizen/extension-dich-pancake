@echo off
setlocal EnableDelayedExpansion

set "GITHUB_USER=vaesaltd-netizen"
set "REPO_NAME=extension-dich-pancake"
set "BRANCH=main"

set "DOWNLOAD_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%/archive/refs/heads/%BRANCH%.zip"
set "SCRIPT_DIR=%~dp0"
set "ZIP_FILE=%SCRIPT_DIR%extension-update.zip"
set "EXTRACT_DIR=%SCRIPT_DIR%%REPO_NAME%-%BRANCH%"

echo ====================================================
echo    PANCAKE EXTENSION - AUTO UPDATE
echo ====================================================
echo.

where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] curl not found. Please use Windows 10 or later.
    pause
    exit /b 1
)

echo [1/3] Downloading latest version from GitHub...
curl -L -o "%ZIP_FILE%" "%DOWNLOAD_URL%" --progress-bar
if %errorlevel% neq 0 (
    echo [ERROR] Download failed. Check your internet connection.
    pause
    exit /b 1
)

echo.
echo [2/3] Extracting and updating...

if exist "%EXTRACT_DIR%" rmdir /s /q "%EXTRACT_DIR%"

powershell -NoProfile -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%SCRIPT_DIR%' -Force"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to extract zip file.
    del "%ZIP_FILE%" 2>nul
    pause
    exit /b 1
)

:: Copy all files from extracted folder to current directory (overwrite)
xcopy "%EXTRACT_DIR%\*" "%SCRIPT_DIR%" /E /I /Q /Y >nul

echo.
echo [3/3] Cleaning up...
rmdir /s /q "%EXTRACT_DIR%" 2>nul
del "%ZIP_FILE%" 2>nul

echo.
echo ====================================================
echo    UPDATE SUCCESSFUL!
echo ====================================================
echo.
echo Next steps:
echo   1. Open Chrome, go to chrome://extensions/
echo   2. Enable "Developer mode"
echo   3. Click "Load unpacked" and select this folder:
echo      %SCRIPT_DIR%
echo   (Or click the reload button if already loaded)
echo.
pause
