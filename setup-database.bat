@echo off
echo ================================================
echo Aroxa Crop Science - Database Setup Script
echo ================================================
echo.

echo Step 1: Checking if MySQL is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [ERROR] MySQL is not running!
    echo Please start XAMPP and run MySQL first.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS aroxa_cropscience;" 2>NUL
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database created successfully
) else (
    echo [ERROR] Failed to create database
    echo Make sure MySQL is running in XAMPP
    pause
    exit /b 1
)

echo.
echo Step 3: Importing database schema...
mysql -u root aroxa_cropscience < database\schema.sql 2>NUL
if %ERRORLEVEL% EQU 0 (
    echo [OK] Database schema imported successfully
) else (
    echo [ERROR] Failed to import schema
    pause
    exit /b 1
)

echo.
echo ================================================
echo Database setup completed successfully!
echo ================================================
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
pause
