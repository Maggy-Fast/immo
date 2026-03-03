# Script de démarrage Frontend + Backend - Maggyfast Immo
# Exécuter depuis le répertoire imo: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Démarrage complet" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "ERREUR: Ce script doit être exécuté depuis le répertoire 'imo'" -ForegroundColor Red
    Write-Host "Répertoire actuel: $PWD" -ForegroundColor Yellow
    exit 1
}

# Fonction pour démarrer le backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    Write-Host "[BACKEND] Démarrage du serveur Laravel..." -ForegroundColor Green
    php artisan serve
}

# Attendre 2 secondes pour que le backend démarre
Start-Sleep -Seconds 2

# Fonction pour démarrer le frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    Write-Host "[FRONTEND] Démarrage du serveur React..." -ForegroundColor Blue
    npm run dev
}

Write-Host ""
Write-Host "✓ Backend Laravel démarré (Job ID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "  URL: http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host ""
Write-Host "✓ Frontend React démarré (Job ID: $($frontendJob.Id))" -ForegroundColor Blue
Write-Host "  URL: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Les serveurs sont en cours d'exécution" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour voir les logs:" -ForegroundColor Yellow
Write-Host "  Backend:  Receive-Job -Id $($backendJob.Id) -Keep" -ForegroundColor Gray
Write-Host "  Frontend: Receive-Job -Id $($frontendJob.Id) -Keep" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arrêter les serveurs:" -ForegroundColor Yellow
Write-Host "  .\stop.ps1" -ForegroundColor Gray
Write-Host "  ou appuyez sur Ctrl+C puis exécutez: .\stop.ps1" -ForegroundColor Gray
Write-Host ""

# Sauvegarder les IDs des jobs dans un fichier
@{
    BackendJobId = $backendJob.Id
    FrontendJobId = $frontendJob.Id
} | ConvertTo-Json | Out-File -FilePath ".jobs.json"

# Garder le script actif et afficher les logs en temps réel
Write-Host "Affichage des logs (Ctrl+C pour arrêter):" -ForegroundColor Cyan
Write-Host ""

try {
    while ($true) {
        # Afficher les logs du backend
        $backendOutput = Receive-Job -Id $backendJob.Id
        if ($backendOutput) {
            $backendOutput | ForEach-Object {
                Write-Host "[BACKEND] $_" -ForegroundColor Green
            }
        }

        # Afficher les logs du frontend
        $frontendOutput = Receive-Job -Id $frontendJob.Id
        if ($frontendOutput) {
            $frontendOutput | ForEach-Object {
                Write-Host "[FRONTEND] $_" -ForegroundColor Blue
            }
        }

        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host ""
    Write-Host "Arrêt en cours... Exécutez .\stop.ps1 pour arrêter complètement les serveurs" -ForegroundColor Yellow
}
