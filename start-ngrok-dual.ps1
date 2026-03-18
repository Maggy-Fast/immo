# Script utilisant la configuration ngrok.yml
# Demarre 2 tunnels avec UNE SEULE session ngrok

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Maggyfast Immo - Mode Dual Tunnel" -ForegroundColor Cyan
Write-Host "  Backend + Frontend via ngrok.yml" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour recuperer les URLs ngrok
function Get-NgrokUrls {
    $maxAttempts = 20
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -Method Get -ErrorAction Stop
            if ($response.tunnels.Count -ge 1) {
                return $response.tunnels
            }
        }
        catch {
            # API pas encore prete
        }
        Start-Sleep -Seconds 2
        $attempt++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    return $null
}

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Etape 1: Demarrage Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '========================================' -ForegroundColor Green; Write-Host 'Backend Laravel (Port 8000)' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green; php artisan serve"
Start-Sleep -Seconds 5
Write-Host "OK Backend demarre" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Etape 2: Demarrage ngrok (2 tunnels)" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Verifier que ngrok.yml existe
if (-not (Test-Path "$PSScriptRoot\ngrok.yml")) {
    Write-Host "ERREUR: Fichier ngrok.yml introuvable" -ForegroundColor Red
    exit 1
}

# Mettre a jour .env backend
Write-Host "Configuration backend pour accès via proxy..." -ForegroundColor Yellow
$backendEnvPath = "$PSScriptRoot\backend\.env"
if (Test-Path $backendEnvPath) {
    $backendEnv = Get-Content $backendEnvPath
    
    # On utilise un domaine bidon pour l'instant car on n'a pas encore l'URL ngrok
    # Mais le script mettra a jour l'URL frontend a la fin si necessaire
    $backendEnv = $backendEnv -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,ngrok-free.dev"
    
    Set-Content -Path $backendEnvPath -Value $backendEnv -Encoding Ascii
    Write-Host "OK backend/.env mis a jour" -ForegroundColor Green
}

# Etape 2: Demarrage Frontend
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Etape 2: Demarrage Frontend (Vite)" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Demarrer le frontend d'abord pour que le port 5173 soit actif
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Frontend React (Port 5173)' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host 'Proxy API -> http://localhost:8000' -ForegroundColor Gray; npm run dev"
Write-Host "Attente du demarrage de Vite (10s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "OK Frontend lance" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "  Etape 3: Demarrage ngrok" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "Demarrage de ngrok (Tunnel Unique Frontend)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '========================================' -ForegroundColor Magenta; Write-Host 'ngrok - Mode Proxy Vite' -ForegroundColor Magenta; Write-Host '========================================' -ForegroundColor Magenta; Write-Host ''; ngrok start frontend --config=ngrok.yml"

Write-Host "Attente du tunnel ngrok..."
$tunnels = Get-NgrokUrls

if (-not $tunnels -or $tunnels.Count -lt 1) {
    Write-Host ""
    Write-Host "ERREUR: Impossible de demarrer le tunnel" -ForegroundColor Red
    exit 1
}

$urlFrontend = $tunnels[0].public_url

Write-Host ""
Write-Host "========================================"  -ForegroundColor Green
Write-Host "  APPLICATION DEMARREE (MODE PROXY) !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "URL UNIQUE POUR LES TESTEURS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  $urlFrontend" -ForegroundColor Cyan -BackgroundColor DarkGreen

# Mise à jour finale du backend avec l'URL réelle
Write-Host ""
Write-Host "Finalisation de la configuration backend..." -ForegroundColor Yellow
if (Test-Path $backendEnvPath) {
    $backendEnv = Get-Content $backendEnvPath
    $domainNgrok = $urlFrontend -replace 'https?://', ''
    
    $backendEnv = $backendEnv -replace '^APP_URL=.*', "APP_URL=$urlFrontend"
    $backendEnv = $backendEnv -replace '^SANCTUM_STATEFUL_DOMAINS=.*', "SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,$domainNgrok"
    
    Set-Content -Path $backendEnvPath -Value $backendEnv -Encoding Ascii
    Write-Host "OK backend/.env finalise avec : $domainNgrok" -ForegroundColor Green
}
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
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
