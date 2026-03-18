# Script de nettoyage des anciens fichiers CSS de formulaires

Write-Host "=== Nettoyage des anciens fichiers CSS ===" -ForegroundColor Cyan

$fichiersASupprimer = @(
    "frontend/src/presentation/composants/biens/FormulaireBien.css",
    "frontend/src/presentation/composants/proprietaires/FormulaireProprietaire.css",
    "frontend/src/presentation/composants/locataires/FormulaireLocataire.css",
    "frontend/src/presentation/composants/contrats/FormulaireContrat.css",
    "frontend/src/presentation/composants/lotissements/FormulaireLotissement.css",
    "frontend/src/presentation/composants/parcelles/FormulaireParcelle.css",
    "frontend/src/presentation/composants/partenariats/FormulairePartenariat.css"
)

$supprime = 0
$nonTrouve = 0

foreach ($fichier in $fichiersASupprimer) {
    if (Test-Path $fichier) {
        Remove-Item $fichier -Force
        Write-Host "OK Supprime: $fichier" -ForegroundColor Green
        $supprime++
    } else {
        Write-Host "X Non trouve: $fichier" -ForegroundColor Yellow
        $nonTrouve++
    }
}

Write-Host "`n=== Resume ===" -ForegroundColor Cyan
Write-Host "Fichiers supprimes: $supprime" -ForegroundColor Green
Write-Host "Fichiers non trouves: $nonTrouve" -ForegroundColor Yellow

Write-Host "`nNote: ModalPaiement.css est conserve pour la section d'informations specifique" -ForegroundColor Gray
Write-Host ""
