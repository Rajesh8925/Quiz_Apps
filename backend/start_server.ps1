# Activate virtual environment and start Django server
$venvPath = Join-Path $PSScriptRoot "venv\Scripts\Activate.ps1"
& $venvPath
python manage.py runserver 0.0.0.0:8000
