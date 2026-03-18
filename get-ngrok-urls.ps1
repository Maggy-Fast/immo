# Script pour recuperer les URLs ngrok actives
# Utilise l'API locale de ngrok

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Recuperation des URLs ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # L'API ngrok est accessible sur http://127.0.0.1:4040/api/tunnels
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get
    
    if ($response.tunnels.Count -eq 0) {
        Write-Host "Aucun tunnel ngrok actif trouve" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Assurez-vous que ngrok est en cours d'execution" -ForegroundColor Gray
        exit 0
    }
    
    Write-Host "Tunnels ngrok actifs:" -ForegroundColor Green
    Write-Host ""
    
    foreach ($tunnel in $response.tunnels) {
        $port = $tunnel.config.addr -replace '.*:', ''
        $publicUrl = $tunnel.public_url
        
        if ($port -eq "8000") {
            Write-Host "BACKEND (Port 8000):" -ForegroundColor Magenta
            Write-Host "  $publicUrl" -ForegroundColor Cyan
            Write-Host ""
        }
        elseif ($port -eq "5173") {
            Write-Host "FRONTEND (Port 5173):" -ForegroundColor Blue
            Write-Host "  $publicUrl" -ForegroundColor Cyan
            Write-Host ""
            Write-Host ">>> PARTAGEZ CETTE URL POUR LA PRESENTATION <<<" -ForegroundColor Green
            Write-Host ""
        }
        else {
            Write-Host "Port $port :" -ForegroundColor Yellow
            Write-Host "  $publicUrl" -ForegroundColor Cyan
            Write-Host ""
        }
    }
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "ERREUR: Impossible de contacter l'API ngrok" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifiez que ngrok est en cours d'execution" -ForegroundColor Yellow
    Write-Host "L'API ngrok est accessible sur: http://127.0.0.1:4040" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Vous pouvez aussi ouvrir cette URL dans votre navigateur" -ForegroundColor Gray
    Write-Host "pour voir l'interface web de ngrok" -ForegroundColor Gray
    Write-Host ""
}
