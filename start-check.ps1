# Script de vérification et démarrage
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
        Write-Host "  $phpVersion" -ForegroundColor Gray
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
        Write-Host "  Version: $nodeVersion" -ForegroundColor Gray
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    Write-Host "  Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier les dépendances backend
Write-Host "Vérification des dépendances backend..." -NoNewline
if (Test-Path "backend/vendor") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ❌" -ForegroundColor Yellow
    Write-Host "  Installation des dépendances backend..." -ForegroundColor Yellow
    Set-Location backend
    composer install --no-interaction
    Set-Location ..
    Write-Host "  ✓ Dépendances installées" -ForegroundColor Green
}

# Vérifier les dépendances frontend
Write-Host "Vérification des dépendances frontend..." -NoNewline
if (Test-Path "frontend/node_modules") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ❌" -ForegroundColor Yellow
    Write-Host "  Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "  ✓ Dépendances installées" -ForegroundColor Green
}

# Vérifier le fichier .env
Write-Host "Vérification du fichier .env..." -NoNewline
if (Test-Path "backend/.env") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ❌" -ForegroundColor Yellow
    Write-Host "  Création du fichier .env..." -ForegroundColor Yellow
    Copy-Item "backend/.env.example" "backend/.env"
    Set-Location backend
    php artisan key:generate
    Set-Location ..
    Write-Host "  ✓ Fichier .env créé" -ForegroundColor Green
}

# Vérifier la base de données
Write-Host "Vérification de la base de données..." -NoNewline
if (Test-Path "backend/database/database.sqlite") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ❌" -ForegroundColor Yellow
    Write-Host "  Création de la base de données..." -ForegroundColor Yellow
    New-Item -Path "backend/database/database.sqlite" -ItemType File -Force | Out-Null
    Set-Location backend
    php artisan migrate --force
    Set-Location ..
    Write-Host "  ✓ Base de données créée et migrée" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Tout est prêt !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Demander si on veut démarrer
$reponse = Read-Host "Voulez-vous démarrer l'application maintenant ? (O/n)"
if ($reponse -eq "" -or $reponse -eq "O" -or $reponse -eq "o") {
    Write-Host ""
    Write-Host "Démarrage de l'application..." -ForegroundColor Cyan
    Write-Host ""
    
    # Démarrer le backend
    Write-Host "Démarrage du backend Laravel..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host 'URL: http://127.0.0.1:8000' -ForegroundColor Cyan; Write-Host ''; php artisan serve"
    
    # Attendre 3 secondes
    Start-Sleep -Seconds 3
    
    # Démarrer le frontend
    Write-Host "Démarrage du frontend React..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev"
    
    Write-Host ""
    Write-Host "✓ Backend démarré: http://127.0.0.1:8000" -ForegroundColor Green
    Write-Host "✓ Frontend démarré: http://localhost:5173" -ForegroundColor Blue
    Write-Host ""
    Write-Host "💡 Compte de test:" -ForegroundColor Yellow
    Write-Host "   Email: admin@demo.com" -ForegroundColor Gray
    Write-Host "   Mot de passe: password" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pour arrêter: Fermez les fenêtres de terminal" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Pour démarrer plus tard, exécutez: .\start-simple.ps1" -ForegroundColor Cyan
}
