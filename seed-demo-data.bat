@echo off
cd /d "%~dp0backend"
call venv\Scripts\activate
python seed_demo_data.py
pause
