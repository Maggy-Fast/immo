# Script de redémarrage du backend avec configuration ngrok
Write-Host "🔄 Redémarrage du backend Laravel..." -ForegroundColor Cyan

# Aller dans le dossier backend
Set-Location backend

# Vider les caches
Write-Host "🧹 Nettoyage des caches..." -ForegroundColor Yellow
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Afficher la configuration actuelle
Write-Host "`n📋 Configuration actuelle:" -ForegroundColor Green
Write-Host "APP_URL: " -NoNewline
php artisan tinker --execute="echo config('app.url');"
Write-Host "SANCTUM_STATEFUL_DOMAINS: " -NoNewline
php artisan tinker --execute="echo config('sanctum.stateful');"

Write-Host "`n✅ Backend prêt à être lancé!" -ForegroundColor Green
Write-Host "Lancer avec: php artisan serve" -ForegroundColor Cyan

# Retour au dossier racine
Set-Location ..
