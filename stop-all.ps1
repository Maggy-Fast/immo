# Script pour arrêter tous les processus
Write-Host "========================================" -ForegroundColor Red
Write-Host "  Arrêt de tous les services" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Arrêter les processus PHP (Laravel)
Write-Host "Arrêt du backend Laravel..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "php"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✓ Backend arrêté" -ForegroundColor Green

# Arrêter les processus Node (Vite/React)
Write-Host "Arrêt du frontend React..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✓ Frontend arrêté" -ForegroundColor Green

# Arrêter ngrok
Write-Host "Arrêt de ngrok..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "ngrok"} | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "✓ ngrok arrêté" -ForegroundColor Green

Write-Host ""
Write-Host "✓ Tous les services ont été arrêtés" -ForegroundColor Green
Write-Host ""
