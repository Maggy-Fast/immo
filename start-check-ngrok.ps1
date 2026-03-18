# Script de vérification et démarrage avec ngrok
# Vérifie que tout est installé avant de démarrer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Vérification de l'installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ ERREUR: Ce script doit être exécuté depuis le répertoire 'imo'" -ForegroundColor Red
    exit 1
}

# Vérifier PHP
Write-Host "Vérification de PHP..." -NoNewline
try {
    $phpVersion = php -v 2>&1 | Select-String "PHP" | Select-Object -First 1
    if ($phpVersion) {
        Write-Host " ✓" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "  PHP n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    exit 1
}

# Vérifier Composer
Write-Host "Vérification de Composer..." -NoNewline
try {
    $composerVersion = composer --version 2>&1 | Select-String "Composer" | Select-Object -First 1
    if ($composerVersion) {
        Write-Host " ✓" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "  Composer n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
Write-Host "Vérification de Node.js..." -NoNewline
try {
    $nodeVersion = node -v 2>&1
    if ($nodeVersion) {
        Write-Host " ✓" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "  Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier ngrok
Write-Host "Vérification de ngrok..." -NoNewline
try {
    $ngrokVersion = ngrok version 2>&1
    if ($ngrokVersion) {
        Write-Host " ✓" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌" -ForegroundColor Yellow
    Write-Host "  ngrok n'est pas installé - Téléchargez-le sur https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "  L'application démarrera sans ngrok" -ForegroundColor Yellow
    $ngrokDisponible = $false
}

if (-not $ngrokDisponible) {
    $ngrokDisponible = $true
}

# Vérifier les dépendances backend
Write-Host "Vérification des dépendances backend..." -NoNewline
if (Test-Path "backend/vendor") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ⏳" -ForegroundColor Yellow
    Write-Host "  Installation des dépendances backend..." -ForegroundColor Yellow
    Set-Location backend
    composer install --no-interaction --quiet
    Set-Location ..
    Write-Host "  ✓ Dépendances installées" -ForegroundColor Green
}

# Vérifier les dépendances frontend
Write-Host "Vérification des dépendances frontend..." -NoNewline
if (Test-Path "frontend/node_modules") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ⏳" -ForegroundColor Yellow
    Write-Host "  Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install --silent
    Set-Location ..
    Write-Host "  ✓ Dépendances installées" -ForegroundColor Green
}

# Vérifier le fichier .env backend
Write-Host "Vérification du fichier .env backend..." -NoNewline
if (Test-Path "backend/.env") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ⏳" -ForegroundColor Yellow
    Write-Host "  Création du fichier .env..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Set-Location backend
    php artisan key:generate --quiet
    Set-Location ..
    Write-Host "  ✓ Fichier .env créé" -ForegroundColor Green
}

# Vérifier le fichier .env frontend
Write-Host "Vérification du fichier .env frontend..." -NoNewline
if (Test-Path "frontend/.env") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ⏳" -ForegroundColor Yellow
    Copy-Item "frontend/.env.example" "frontend/.env"
    Write-Host "  ✓ Fichier .env créé" -ForegroundColor Green
}

# Vérifier la base de données
Write-Host "Vérification de la base de données..." -NoNewline
if (Test-Path "backend/database/database.sqlite") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ⏳" -ForegroundColor Yellow
    Write-Host "  Création de la base de données..." -ForegroundColor Yellow
    New-Item -Path "backend/database/database.sqlite" -ItemType File -Force | Out-Null
    Set-Location backend
    php artisan migrate --force --quiet
    Set-Location ..
    Write-Host "  ✓ Base de données créée et migrée" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Tout est prêt !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Démarrage de l'application avec ngrok..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le backend
Write-Host "Demarrage du backend Laravel..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host 'URL locale: http://127.0.0.1:8000' -ForegroundColor Cyan; Write-Host ''; php artisan serve"

# Attendre que le backend démarre
Start-Sleep -Seconds 3

# Démarrer ngrok si disponible
if ($ngrokDisponible) {
    Write-Host "Demarrage de ngrok..." -ForegroundColor Magenta
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Tunnel Public' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'Copiez l''URL https://xxxx.ngrok-free.app ci-dessous' -ForegroundColor Yellow; Write-Host ''; ngrok http 8000 --log=stdout"
    
    # Attendre que ngrok démarre
    Start-Sleep -Seconds 2
}

# Démarrer le frontend
Write-Host "Demarrage du frontend React..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL locale: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Application démarrée !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs locales:" -ForegroundColor Yellow
Write-Host "   Backend:  http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""

if ($ngrokDisponible) {
    Write-Host "URL publique ngrok:" -ForegroundColor Magenta
    Write-Host "   Consultez le terminal ngrok pour obtenir l'URL" -ForegroundColor Gray
    Write-Host "   Format: https://xxxx-xx-xx-xx-xx.ngrok-free.app" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Configuration ngrok:" -ForegroundColor Yellow
    Write-Host "   1. Copiez l'URL ngrok depuis le terminal ngrok" -ForegroundColor Gray
    Write-Host "   2. Mettez a jour frontend/.env.ngrok avec cette URL" -ForegroundColor Gray
    Write-Host "   3. Redemarrez le frontend si necessaire" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Compte de test:" -ForegroundColor Yellow
Write-Host "   Email:    admin@demo.com" -ForegroundColor Gray
Write-Host "   Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les fenetres de terminal" -ForegroundColor Red
Write-Host ""
