# Script ameliore avec verification des URLs ngrok
# Attend que les 2 tunnels soient actifs avant de continuer

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Demarrage Complet" -ForegroundColor Cyan
Write-Host "  Backend + Frontend publics via ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour recuperer les URLs ngrok
function Get-NgrokUrls {
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get -ErrorAction Stop
        return $response.tunnels
    } catch {
        return $null
    }
}

# Fonction pour attendre un tunnel specifique
function Wait-NgrokTunnel {
    param(
        [string]$Port,
        [string]$Name,
        [int]$MaxWaitSeconds = 30
    )
    
    Write-Host "Attente du tunnel $Name (port $Port)..." -ForegroundColor Yellow
    
    $elapsed = 0
    while ($elapsed -lt $MaxWaitSeconds) {
        $tunnels = Get-NgrokUrls
        if ($tunnels) {
            foreach ($tunnel in $tunnels) {
                $tunnelPort = $tunnel.config.addr -replace '.*:', ''
                if ($tunnelPort -eq $Port) {
                    Write-Host "OK Tunnel $Name actif: $($tunnel.public_url)" -ForegroundColor Green
                    return $tunnel.public_url
                }
            }
        }
        Start-Sleep -Seconds 2
        $elapsed += 2
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "TIMEOUT: Tunnel $Name non detecte apres ${MaxWaitSeconds}s" -ForegroundColor Red
    return $null
}

# Verifier ngrok
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokInstalled) {
    Write-Host "ERREUR: ngrok n'est pas installe !" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Etape 1: Demarrage Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel (Port 8000)' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; php artisan serve"
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Etape 2: Demarrage ngrok Backend" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Backend (Port 8000)' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; ngrok http 8000"

# Attendre que le tunnel backend soit actif
$urlBackend = Wait-NgrokTunnel -Port "8000" -Name "Backend"
if (-not $urlBackend) {
    Write-Host "Impossible de demarrer le tunnel backend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configuration du frontend avec URL backend..." -ForegroundColor Cyan

# Mettre a jour .env frontend
$envContent = @"
# Configuration API Backend Laravel
VITE_API_URL=$urlBackend/api

# Nom de l'application
VITE_APP_NAME=Maggyfast Immo
"@

Set-Content -Path "$PSScriptRoot\frontend\.env" -Value $envContent -Encoding UTF8
Write-Host "OK frontend/.env mis a jour" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Etape 3: Demarrage Frontend" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React (Port 5173)' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; npm run dev"
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Etape 4: Demarrage ngrok Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '========================================' -ForegroundColor Cyan; Write-Host 'ngrok - Frontend (Port 5173)' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; ngrok http 5173"

# Attendre que le tunnel frontend soit actif
$urlFrontend = Wait-NgrokTunnel -Port "5173" -Name "Frontend"
if (-not $urlFrontend) {
    Write-Host "Impossible de demarrer le tunnel frontend" -ForegroundColor Red
    Write-Host "Verifiez que le frontend React est bien demarre sur le port 5173" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  APPLICATION DEMARREE AVEC SUCCES !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs PUBLIQUES POUR LA PRESENTATION:" -ForegroundColor Yellow
Write-Host ""
Write-Host "BACKEND:" -ForegroundColor Magenta
Write-Host "  $urlBackend" -ForegroundColor Cyan
Write-Host ""
Write-Host "FRONTEND (PARTAGEZ CETTE URL):" -ForegroundColor Blue
Write-Host "  $urlFrontend" -ForegroundColor Cyan -BackgroundColor DarkGreen
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Compte de test:" -ForegroundColor Yellow
Write-Host "  Email:    admin@demo.com" -ForegroundColor White
Write-Host "  Password: password" -ForegroundColor White
Write-Host ""
Write-Host "Module Cooperative: $urlFrontend/cooperative" -ForegroundColor Gray
Write-Host ""
Write-Host "Interface ngrok: http://127.0.0.1:4040" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour arreter: Fermez les 4 fenetres PowerShell" -ForegroundColor Red
Write-Host ""
