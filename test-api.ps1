# Script de test de l'API
Write-Host "🧪 Test de connexion à l'API..." -ForegroundColor Cyan

$apiUrl = "https://cd3c-2001-4278-13-9048-7d9e-b593-1be9-c850.ngrok-free.app/api"

Write-Host "`n1️⃣ Test de disponibilité du backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiUrl/auth/connexion" -Method GET -ErrorAction Stop
    Write-Host "❌ Erreur: Le endpoint répond en GET (devrait être POST uniquement)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ Backend accessible (405 Method Not Allowed est normal)" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n2️⃣ Test de connexion avec identifiants..." -ForegroundColor Yellow
$body = @{
    email = "superadmin@maggyfast.com"
    password = "password"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/auth/connexion" -Method POST -Body $body -Headers $headers -ErrorAction Stop
    Write-Host "✅ Connexion réussie!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "Utilisateur: $($response.utilisateur.nom) ($($response.utilisateur.email))" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur de connexion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host "`n3️⃣ Vérification CORS..." -ForegroundColor Yellow
Write-Host "Pour tester CORS, ouvrir test-connexion.html dans un navigateur" -ForegroundColor Cyan

Write-Host "`n✅ Test terminé!" -ForegroundColor Green
