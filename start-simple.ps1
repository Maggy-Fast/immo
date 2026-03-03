# Script de démarrage simple - Ouvre 2 terminaux séparés
# Exécuter depuis le répertoire imo: .\start-simple.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Démarrage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERREUR: Ce script doit être exécuté depuis le répertoire 'imo'" -ForegroundColor Red
    exit 1
}

# Démarrer le backend dans un nouveau terminal
Write-Host "Démarrage du backend Laravel..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Backend Laravel - http://127.0.0.1:8000' -ForegroundColor Green; php artisan serve"

# Attendre 2 secondes
Start-Sleep -Seconds 2

# Démarrer le frontend dans un nouveau terminal
Write-Host "Démarrage du frontend React..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend React - http://localhost:5173' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✓ Backend démarré dans un terminal séparé" -ForegroundColor Green
Write-Host "  URL: http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host ""
Write-Host "✓ Frontend démarré dans un terminal séparé" -ForegroundColor Blue
Write-Host "  URL: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arrêter: Fermez les fenêtres de terminal ou utilisez Ctrl+C dans chaque terminal" -ForegroundColor Yellow
