# Script de demarrage avec ngrok pour tests externes
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Demarrage avec ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier si ngrok est installe
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "ERREUR: ngrok n'est pas installe !" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer ngrok:" -ForegroundColor Yellow
    Write-Host "1. Telechargez depuis: https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "2. Ou installez avec: choco install ngrok (si vous avez Chocolatey)" -ForegroundColor Yellow
    Write-Host "3. Ou installez avec: scoop install ngrok (si vous avez Scoop)" -ForegroundColor Yellow
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
Write-Host "  Etape 2: Demarrage de ngrok (Backend)" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Demarrer ngrok pour le BACKEND (port 8000)
Write-Host "Demarrage de ngrok sur le backend (port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Tunnel Public Backend' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; Write-Host ''; Write-Host 'IMPORTANT: Copiez URL https://xxxx.ngrok-free.app' -ForegroundColor Yellow; Write-Host ''; ngrok http 8000 --log=stdout"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Etape 3: Configuration de l'URL ngrok" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Consultez le terminal ngrok et copiez l'URL publique" -ForegroundColor Yellow
Write-Host "Format: https://xxxx-xx-xx-xx-xx.ngrok-free.app" -ForegroundColor Gray
Write-Host ""

# Demander l'URL ngrok
$urlNgrok = Read-Host "Collez l'URL ngrok ici (sans /api a la fin)"

if ($urlNgrok -eq "") {
    Write-Host "ERREUR: URL ngrok requise" -ForegroundColor Red
    Write-Host "Le frontend demarrera avec l'ancienne configuration" -ForegroundColor Yellow
} else {
    # Nettoyer l'URL
    $urlNgrok = $urlNgrok.TrimEnd('/')
    $urlNgrok = $urlNgrok -replace '/api$', ''
    
    Write-Host ""
    Write-Host "Configuration du frontend avec l'URL: $urlNgrok" -ForegroundColor Cyan
    
    # Mettre a jour le fichier .env du frontend
    $envContent = @"
# Configuration API Backend Laravel
VITE_API_URL=$urlNgrok/api

# Nom de l'application
VITE_APP_NAME=Maggyfast Immo
"@
    
    Set-Content -Path "$PSScriptRoot\frontend\.env" -Value $envContent -Encoding UTF8
    Write-Host "Fichier frontend/.env mis a jour" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Etape 4: Demarrage du frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Demarrer le frontend React
Write-Host "Demarrage du frontend React..." -ForegroundColor Yellow
if ($urlNgrok -ne "") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL locale: http://localhost:5173' -ForegroundColor Cyan; Write-Host 'API Backend: $urlNgrok/api' -ForegroundColor Yellow; Write-Host ''; npm run dev"
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL locale: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev"
}
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Application demarree avec succes !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Backend local:  http://127.0.0.1:8000" -ForegroundColor Gray
if ($urlNgrok -ne "") {
    Write-Host "  Backend public: $urlNgrok" -ForegroundColor Cyan
}
Write-Host "  Frontend:       http://localhost:5173" -ForegroundColor Gray
Write-Host ""
if ($urlNgrok -ne "") {
    Write-Host "Le frontend utilise maintenant l'URL ngrok du backend" -ForegroundColor Green
} else {
    Write-Host "Le frontend utilise la configuration precedente" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "Compte de test:" -ForegroundColor Yellow
Write-Host "  Email:    admin@demo.com" -ForegroundColor Gray
Write-Host "  Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANT pour ngrok:" -ForegroundColor Yellow
Write-Host "  1. L'URL ngrok change a chaque redemarrage (version gratuite)" -ForegroundColor Gray
Write-Host "  2. Partagez l'URL frontend avec vos testeurs: http://localhost:5173" -ForegroundColor Gray
Write-Host "  3. Ou deployez le frontend pour un acces public complet" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les 3 fenetres de terminal" -ForegroundColor Red
Write-Host "(Backend, ngrok, Frontend)" -ForegroundColor Gray
Write-Host ""
