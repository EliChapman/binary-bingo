@echo off
call deps.bat

if %errorlevel% equ 0 (
    call page.bat
)

exit