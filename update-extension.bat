@echo off
chcp 65001 >nul
title Cập nhật Extension Pancake Dịch

:: ============================================
:: CẤU HÌNH - Thay YOUR_USERNAME bằng username GitHub thật
:: ============================================
set GITHUB_USER=vaesaltd-netizen
set REPO_NAME=extension-dich-pancake
set BRANCH=main
:: ============================================

set "DOWNLOAD_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%/archive/refs/heads/%BRANCH%.zip"
set "SCRIPT_DIR=%~dp0"
set "ZIP_FILE=%SCRIPT_DIR%extension-update.zip"
set "EXTRACT_DIR=%SCRIPT_DIR%%REPO_NAME%-%BRANCH%"

echo ====================================================
echo    PANCAKE INLINE TRANSLATOR - CẬP NHẬT EXTENSION
echo ====================================================
echo.

:: Kiểm tra curl
where curl >nul 2>&1
if %errorlevel% neq 0 (
    echo [LỖI] Không tìm thấy curl. Vui lòng cài đặt curl hoặc dùng Windows 10 trở lên.
    pause
    exit /b 1
)

echo [1/4] Đang tải bản mới nhất từ GitHub...
curl -L -o "%ZIP_FILE%" "%DOWNLOAD_URL%" --progress-bar
if %errorlevel% neq 0 (
    echo [LỖI] Không thể tải file. Kiểm tra kết nối mạng và URL repo.
    pause
    exit /b 1
)

echo.
echo [2/4] Đang giải nén...

:: Xóa thư mục tạm cũ nếu có
if exist "%EXTRACT_DIR%" rmdir /s /q "%EXTRACT_DIR%"

:: Giải nén bằng PowerShell (có sẵn trên Windows 10+)
powershell -NoProfile -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%SCRIPT_DIR%' -Force"
if %errorlevel% neq 0 (
    echo [LỖI] Không thể giải nén file.
    del "%ZIP_FILE%" 2>nul
    pause
    exit /b 1
)

echo.
echo [3/4] Đang cập nhật extension...

:: Xóa thư mục ext-pancake cũ
if exist "%SCRIPT_DIR%ext-pancake" rmdir /s /q "%SCRIPT_DIR%ext-pancake"

:: Copy thư mục ext-pancake mới
if exist "%EXTRACT_DIR%\ext-pancake" (
    xcopy "%EXTRACT_DIR%\ext-pancake" "%SCRIPT_DIR%ext-pancake\" /E /I /Q /Y >nul
) else (
    echo [LỖI] Không tìm thấy thư mục ext-pancake trong bản tải về.
    rmdir /s /q "%EXTRACT_DIR%" 2>nul
    del "%ZIP_FILE%" 2>nul
    pause
    exit /b 1
)

echo.
echo [4/4] Dọn dẹp file tạm...
rmdir /s /q "%EXTRACT_DIR%" 2>nul
del "%ZIP_FILE%" 2>nul

echo.
echo ====================================================
echo    CẬP NHẬT THÀNH CÔNG!
echo ====================================================
echo.
echo Bước tiếp theo:
echo   1. Mở Chrome, vào chrome://extensions/
echo   2. Bật "Chế độ nhà phát triển" (Developer mode)
echo   3. Nhấn "Tải tiện ích đã giải nén" (Load unpacked)
echo   4. Chọn thư mục: %SCRIPT_DIR%ext-pancake
echo   (Hoặc nhấn nút reload nếu đã tải trước đó)
echo.
pause
