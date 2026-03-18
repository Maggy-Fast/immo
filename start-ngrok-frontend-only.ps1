# Script pour compte ngrok GRATUIT (1 seul tunnel)
# Expose uniquement le FRONTEND via ngrok
# Le frontend communique avec le backend en local

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Mode Gratuit ngrok" -ForegroundColor Cyan
Write-Host "  1 seul tunnel = Frontend public" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour recuperer l'URL ngrok
function Get-NgrokUrl {
    param([string]$Port)
    
    $maxAttempts = 15
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get -ErrorAction Stop
            foreach ($tunnel in $response.tunnels) {
                $tunnelPort = $tunnel.config.addr -replace '.*:', ''
                if ($tunnelPort -eq $Port) {
                    return $tunnel.public_url
                }
            }
        } catch {
            # API pas encore prete
        }
        Start-Sleep -Seconds 2
        $attempt++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    return $null
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Etape 1: Demarrage Backend LOCAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel (LOCAL - Port 8000)' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; Write-Host 'URL: http://127.0.0.1:8000' -ForegroundColor Cyan; Write-Host ''; php artisan serve"
Start-Sleep -Seconds 5

Write-Host "OK Backend demarre en local" -ForegroundColor Green
Write-Host ""

# Configuration frontend pour backend LOCAL
Write-Host "Configuration frontend (backend local)..." -ForegroundColor Yellow
$envContent = @"
# Configuration API Backend Laravel (LOCAL)
VITE_API_URL=http://127.0.0.1:8000/api

# Nom de l'application
VITE_APP_NAME=Maggyfast Immo
"@

Set-Content -Path "$PSScriptRoot\frontend\.env" -Value $envContent -Encoding UTF8
Write-Host "OK frontend/.env configure" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Etape 2: Demarrage Frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React (Port 5173)' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'URL locale: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev"
Start-Sleep -Seconds 8

Write-Host "OK Frontend demarre" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Etape 3: Tunnel ngrok FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Cyan; Write-Host 'ngrok - Frontend PUBLIC (Port 5173)' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; ngrok http 5173"

Write-Host "Attente du tunnel ngrok..." -ForegroundColor Yellow
$urlFrontend = Get-NgrokUrl -Port "5173"

if (-not $urlFrontend) {
    Write-Host ""
    Write-Host "ERREUR: Tunnel ngrok non detecte" -ForegroundColor Red
    Write-Host "Verifiez la fenetre ngrok manuellement" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  APPLICATION DEMARREE !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URL PUBLIQUE POUR LA PRESENTATION:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  $urlFrontend" -ForegroundColor Cyan -BackgroundColor DarkGreen
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "  - Vous devez presenter depuis CETTE machine" -ForegroundColor White
Write-Host "  - Le backend tourne en local (127.0.0.1:8000)" -ForegroundColor White
Write-Host "  - Le frontend est public via ngrok" -ForegroundColor White
Write-Host ""
Write-Host "Compte de test:" -ForegroundColor Yellow
Write-Host "  Email:    admin@demo.com" -ForegroundColor Cyan
Write-Host "  Password: password" -ForegroundColor Cyan
Write-Host ""
Write-Host "Module Cooperative:" -ForegroundColor Yellow
Write-Host "  $urlFrontend/cooperative" -ForegroundColor Gray
Write-Host ""
Write-Host "Interface ngrok: http://127.0.0.1:4040" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les 3 fenetres PowerShell" -ForegroundColor Red
Write-Host ""
