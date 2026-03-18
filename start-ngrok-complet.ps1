# Script de demarrage avec 2 ngrok (Backend + Frontend)
# Pour presentation publique complete
# Executer depuis le repertoire imo: .\start-ngrok-complet.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Demarrage Complet" -ForegroundColor Cyan
Write-Host "  Backend + Frontend publics via ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier si ngrok est installe
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "ERREUR: ngrok n'est pas installe !" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer ngrok:" -ForegroundColor Yellow
    Write-Host "1. Telechargez depuis: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "OK ngrok detecte" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Etape 1: Demarrage du backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Demarrer le backend Laravel
Write-Host "Demarrage du backend Laravel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host 'URL locale: http://127.0.0.1:8000' -ForegroundColor Cyan; Write-Host ''; php artisan serve"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Etape 2: Demarrage ngrok Backend" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Demarrer ngrok pour le BACKEND (port 8000)
Write-Host "Demarrage de ngrok sur le backend (port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Backend (Port 8000)' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; Write-Host ''; Write-Host 'Copiez URL Backend ci-dessous:' -ForegroundColor Yellow; Write-Host ''; ngrok http 8000 --log=stdout"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Etape 3: Configuration Backend URL" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Consultez le terminal ngrok BACKEND et copiez l'URL" -ForegroundColor Yellow
Write-Host "Format: https://xxxx-backend.ngrok-free.app" -ForegroundColor Gray
Write-Host ""

# Demander l'URL ngrok du backend
$urlNgrokBackend = Read-Host "Collez l'URL ngrok du BACKEND ici"

if ($urlNgrokBackend -eq "") {
    Write-Host "ERREUR: URL ngrok backend requise" -ForegroundColor Red
    exit 1
}

# Nettoyer l'URL
$urlNgrokBackend = $urlNgrokBackend.TrimEnd('/')
$urlNgrokBackend = $urlNgrokBackend -replace '/api$', ''

Write-Host ""
Write-Host "Configuration du frontend avec l'URL backend: $urlNgrokBackend" -ForegroundColor Cyan

# Mettre a jour le fichier .env du frontend
$envContent = @"
# Configuration API Backend Laravel
VITE_API_URL=$urlNgrokBackend/api

# Nom de l'application
VITE_APP_NAME=Maggyfast Immo
"@

Set-Content -Path "$PSScriptRoot\frontend\.env" -Value $envContent -Encoding UTF8
Write-Host "Fichier frontend/.env mis a jour" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Etape 4: Demarrage du frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Demarrer le frontend React
Write-Host "Demarrage du frontend React..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL locale: http://localhost:5173' -ForegroundColor Cyan; Write-Host 'API Backend: $urlNgrokBackend/api' -ForegroundColor Yellow; Write-Host ''; npm run dev"
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Etape 5: Demarrage ngrok Frontend" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Demarrer ngrok pour le FRONTEND (port 5173)
Write-Host "Demarrage de ngrok sur le frontend (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Cyan; Write-Host 'ngrok - Frontend (Port 5173)' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; Write-Host 'URL PUBLIQUE FRONTEND ci-dessous:' -ForegroundColor Yellow; Write-Host 'Partagez cette URL pour la presentation' -ForegroundColor Green; Write-Host ''; ngrok http 5173 --log=stdout"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application demarree avec succes !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration complete:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:" -ForegroundColor Green
Write-Host "  Local:  http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host "  Public: $urlNgrokBackend" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend:" -ForegroundColor Blue
Write-Host "  Local:  http://localhost:5173" -ForegroundColor Gray
Write-Host "  Public: Consultez le terminal ngrok Frontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  IMPORTANT POUR LA PRESENTATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Consultez le terminal 'ngrok - Frontend'" -ForegroundColor White
Write-Host "2. Copiez l'URL publique du frontend" -ForegroundColor White
Write-Host "   Format: https://xxxx-frontend.ngrok-free.app" -ForegroundColor Gray
Write-Host "3. Partagez cette URL avec votre audience" -ForegroundColor White
Write-Host ""
Write-Host "Compte de test pour la demo:" -ForegroundColor Yellow
Write-Host "  Email:    admin@demo.com" -ForegroundColor Cyan
Write-Host "  Password: password" -ForegroundColor Cyan
Write-Host ""
Write-Host "Module Cooperative accessible via:" -ForegroundColor Yellow
Write-Host "  /cooperative" -ForegroundColor Gray
Write-Host "  /cooperative/adherents" -ForegroundColor Gray
Write-Host "  /cooperative/cotisations" -ForegroundColor Gray
Write-Host "  /cooperative/parcelles" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminaux ouverts (4):" -ForegroundColor Yellow
Write-Host "  1. Backend Laravel" -ForegroundColor Gray
Write-Host "  2. ngrok Backend" -ForegroundColor Gray
Write-Host "  3. Frontend React" -ForegroundColor Gray
Write-Host "  4. ngrok Frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les 4 fenetres de terminal" -ForegroundColor Red
Write-Host ""
