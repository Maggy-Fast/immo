# Script de demarrage complet avec verification et ngrok
# Executer depuis le repertoire imo: .\demarrer.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Demarrage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que nous sommes dans le bon repertoire
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERREUR: Ce script doit etre execute depuis le repertoire 'imo'" -ForegroundColor Red
    exit 1
}

# Verifier PHP
Write-Host "Verification de PHP..." -NoNewline
try {
    $null = php -v 2>&1
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " ERREUR" -ForegroundColor Red
    Write-Host "  PHP n'est pas installe" -ForegroundColor Red
    exit 1
}

# Verifier Node.js
Write-Host "Verification de Node.js..." -NoNewline
try {
    $null = node -v 2>&1
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " ERREUR" -ForegroundColor Red
    Write-Host "  Node.js n'est pas installe" -ForegroundColor Red
    exit 1
}

# Verifier ngrok
Write-Host "Verification de ngrok..." -NoNewline
$ngrokDisponible = $true
try {
    $null = ngrok version 2>&1
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " NON INSTALLE" -ForegroundColor Yellow
    $ngrokDisponible = $false
}

# Verifier les dependances backend
Write-Host "Verification des dependances backend..." -NoNewline
if (Test-Path "backend/vendor") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " INSTALLATION..." -ForegroundColor Yellow
    Set-Location backend
    composer install --no-interaction --quiet
    Set-Location ..
    Write-Host "  OK Dependances installees" -ForegroundColor Green
}

# Verifier les dependances frontend
Write-Host "Verification des dependances frontend..." -NoNewline
if (Test-Path "frontend/node_modules") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " INSTALLATION..." -ForegroundColor Yellow
    Set-Location frontend
    npm install --silent
    Set-Location ..
    Write-Host "  OK Dependances installees" -ForegroundColor Green
}

# Verifier le fichier .env backend
Write-Host "Verification du fichier .env backend..." -NoNewline
if (Test-Path "backend/.env") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " CREATION..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Set-Location backend
    php artisan key:generate --quiet
    Set-Location ..
    Write-Host "  OK Fichier .env cree" -ForegroundColor Green
}

# Verifier la base de donnees
Write-Host "Verification de la base de donnees..." -NoNewline
if (Test-Path "backend/database/database.sqlite") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " CREATION..." -ForegroundColor Yellow
    New-Item -Path "backend/database/database.sqlite" -ItemType File -Force | Out-Null
    Set-Location backend
    php artisan migrate --force --quiet
    Set-Location ..
    Write-Host "  OK Base de donnees creee" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Tout est pret !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Demarrage de l'application..." -ForegroundColor Cyan
Write-Host ""

# Demarrer le backend
Write-Host "Demarrage du backend Laravel..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '========================================'  -ForegroundColor Green; Write-Host 'Backend Laravel' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host 'URL: http://127.0.0.1:8000' -ForegroundColor Cyan; Write-Host ''; php artisan serve"

# Attendre que le backend demarre
Start-Sleep -Seconds 3

# Demarrer ngrok si disponible
if ($ngrokDisponible) {
    Write-Host "Demarrage de ngrok..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Tunnel Public' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'Copiez URL https://xxxx.ngrok-free.app ci-dessous' -ForegroundColor Yellow; Write-Host ''; ngrok http 8000 --log=stdout"
    Start-Sleep -Seconds 2
}

# Demarrer le frontend
Write-Host "Demarrage du frontend React..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application demarree !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs locales:" -ForegroundColor Yellow
Write-Host "  Backend:  http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""

if ($ngrokDisponible) {
    Write-Host "URL publique ngrok:" -ForegroundColor Magenta
    Write-Host "  Consultez le terminal ngrok pour obtenir URL" -ForegroundColor Gray
    Write-Host "  Format: https://xxxx.ngrok-free.app" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Compte de test:" -ForegroundColor Yellow
Write-Host "  Email:    admin@demo.com" -ForegroundColor Gray
Write-Host "  Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les fenetres de terminal" -ForegroundColor Red
Write-Host ""
