# Script de démarrage avec localtunnel (alternative à ngrok)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Démarrage avec tunnel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Démarrer le backend Laravel
Write-Host "Démarrage du backend Laravel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; php artisan serve"
Start-Sleep -Seconds 3

# Démarrer le frontend React
Write-Host "Démarrage du frontend React..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
Start-Sleep -Seconds 5

# Démarrer localtunnel pour le frontend
Write-Host "Démarrage du tunnel public..." -ForegroundColor Yellow
Write-Host "Installation de localtunnel si nécessaire..." -ForegroundColor Gray
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx localtunnel --port 5173"
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Tous les services sont démarrés !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs locales:" -ForegroundColor Cyan
Write-Host "   Backend:  http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "🌍 URL publique:" -ForegroundColor Cyan
Write-Host "   Consultez le terminal 'localtunnel' pour obtenir l'URL" -ForegroundColor Yellow
Write-Host "   Format: https://xxxx-xx-xx.loca.lt" -ForegroundColor Gray
Write-Host ""
Write-Host "👤 Compte de test:" -ForegroundColor Cyan
Write-Host "   Email:    admin@demo.com" -ForegroundColor Gray
Write-Host "   Password: password" -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Copiez l'URL depuis le terminal localtunnel" -ForegroundColor Gray
Write-Host "   2. La premiere visite demandera un code de verification" -ForegroundColor Gray
Write-Host "   3. Partagez l'URL avec vos testeurs" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: ./stop-all.ps1" -ForegroundColor Red
Write-Host ""
