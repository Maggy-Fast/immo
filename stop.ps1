# Script d'arrêt Frontend + Backend - Maggyfast Immo
# Exécuter depuis le répertoire imo: .\stop.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Arrêt des serveurs..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lire les IDs des jobs depuis le fichier
if (Test-Path ".jobs.json") {
    $jobs = Get-Content ".jobs.json" | ConvertFrom-Json
    
    # Arrêter le backend
    if ($jobs.BackendJobId) {
        Write-Host "Arrêt du backend (Job ID: $($jobs.BackendJobId))..." -ForegroundColor Yellow
        Stop-Job -Id $jobs.BackendJobId -ErrorAction SilentlyContinue
        Remove-Job -Id $jobs.BackendJobId -ErrorAction SilentlyContinue
        Write-Host "✓ Backend arrêté" -ForegroundColor Green
    }
    
    # Arrêter le frontend
    if ($jobs.FrontendJobId) {
        Write-Host "Arrêt du frontend (Job ID: $($jobs.FrontendJobId))..." -ForegroundColor Yellow
        Stop-Job -Id $jobs.FrontendJobId -ErrorAction SilentlyContinue
        Remove-Job -Id $jobs.FrontendJobId -ErrorAction SilentlyContinue
        Write-Host "✓ Frontend arrêté" -ForegroundColor Green
    }
    
    # Supprimer le fichier des jobs
    Remove-Item ".jobs.json" -ErrorAction SilentlyContinue
} else {
    Write-Host "Aucun fichier de jobs trouvé. Arrêt de tous les jobs PowerShell..." -ForegroundColor Yellow
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}

# Tuer les processus PHP et Node qui pourraient encore tourner
Write-Host ""
Write-Host "Nettoyage des processus restants..." -ForegroundColor Yellow

# Arrêter les processus PHP sur le port 8000
$phpProcesses = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
if ($phpProcesses) {
    $phpProcesses | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Processus PHP arrêtés" -ForegroundColor Green
}

# Arrêter les processus Node sur le port 5173
$nodeProcesses = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Processus Node arrêtés" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tous les serveurs sont arrêtés" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
