<?php

use App\Presentation\Controllers\AuthController;
use App\Presentation\Controllers\BienController;
use App\Presentation\Controllers\GestionPromoteurController;
use App\Presentation\Controllers\ProprietaireController;
use App\Presentation\Controllers\LocataireController;
use App\Presentation\Controllers\ContratController;
use App\Presentation\Controllers\LoyerController;
use App\Presentation\Controllers\LotissementController;
use App\Presentation\Controllers\ParcelleController;
use App\Presentation\Controllers\PartenariatController;
use App\Presentation\Controllers\AdherentController;
use App\Presentation\Controllers\GroupeCooperativeController;
use App\Presentation\Controllers\CotisationController;
use App\Presentation\Controllers\ParcelleCooperativeController;
use App\Presentation\Controllers\TableauBordCooperativeController;
use App\Presentation\Controllers\TableauBordController;
use App\Presentation\Controllers\RoleController;
use App\Presentation\Controllers\DocumentFoncierController;
use App\Presentation\Controllers\TravauxController;
use App\Http\Controllers\FileController;
use App\Presentation\Controllers\DepenseController;
use App\Http\Controllers\NotificationWhatsappController;
use App\Presentation\Controllers\TenantController;
use App\Presentation\Controllers\JournalAuditController;

use Illuminate\Support\Facades\Route;
// Root API
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'message' => 'MaggyFast API is running']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'Test successful']);
});

// Routes publiques
Route::post('/auth/connexion', [AuthController::class, 'connexion']);

// Routes prot??g??es
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/profil', [AuthController::class, 'profil']);
    Route::post('/auth/deconnexion', [AuthController::class, 'deconnexion']);

    // Biens
    Route::get('/biens', [BienController::class, 'index']);
    Route::post('/biens', [BienController::class, 'store']);
    Route::get('/biens/{id}', [BienController::class, 'show']);
    Route::put('/biens/{id}', [BienController::class, 'update']);
    Route::delete('/biens/{id}', [BienController::class, 'destroy']);

    // Promoteurs
    Route::get('/promoteurs', [GestionPromoteurController::class, 'index']);
    Route::post('/promoteurs', [GestionPromoteurController::class, 'store']);
    Route::get('/promoteurs/{id}', [GestionPromoteurController::class, 'show']);
    Route::put('/promoteurs/{id}', [GestionPromoteurController::class, 'update']);
    Route::delete('/promoteurs/{id}', [GestionPromoteurController::class, 'destroy']);

    // Propri??taires
    Route::get('/proprietaires', [ProprietaireController::class, 'index']);
    Route::post('/proprietaires', [ProprietaireController::class, 'store']);
    Route::get('/proprietaires/{id}', [ProprietaireController::class, 'show']);
    Route::put('/proprietaires/{id}', [ProprietaireController::class, 'update']);
    Route::delete('/proprietaires/{id}', [ProprietaireController::class, 'destroy']);

    // Locataires
    Route::get('/locataires', [LocataireController::class, 'index']);
    Route::post('/locataires', [LocataireController::class, 'store']);
    Route::get('/locataires/{id}', [LocataireController::class, 'show']);
    Route::put('/locataires/{id}', [LocataireController::class, 'update']);
    Route::delete('/locataires/{id}', [LocataireController::class, 'destroy']);

    // Contrats
    Route::get('/contrats', [ContratController::class, 'index']);
    Route::post('/contrats', [ContratController::class, 'store']);
    Route::get('/contrats/{id}', [ContratController::class, 'show']);
    Route::put('/contrats/{id}', [ContratController::class, 'update']);
    Route::delete('/contrats/{id}', [ContratController::class, 'destroy']);

    // Loyers
    Route::get('/loyers', [LoyerController::class, 'index']);
    Route::post('/loyers', [LoyerController::class, 'store']);
    Route::post('/loyers/generer', [LoyerController::class, 'generer']);
    Route::get('/loyers/{id}', [LoyerController::class, 'show']);
    Route::put('/loyers/{id}', [LoyerController::class, 'update']);
    Route::put('/loyers/{id}/payer', [LoyerController::class, 'payer']);
    Route::get('/quittances/{id}/pdf', [LoyerController::class, 'telechargerQuittance']);
    Route::delete('/loyers/{id}', [LoyerController::class, 'destroy']);

    // Lotissements
    Route::get('/lotissements', [LotissementController::class, 'index']);
    Route::post('/lotissements', [LotissementController::class, 'store']);
    Route::get('/lotissements/{id}', [LotissementController::class, 'show']);
    Route::put('/lotissements/{id}', [LotissementController::class, 'update']);
    Route::delete('/lotissements/{id}', [LotissementController::class, 'destroy']);

    // Parcelles
    Route::get('/parcelles', [ParcelleController::class, 'index']);
    Route::post('/parcelles', [ParcelleController::class, 'store']);
    Route::get('/parcelles/{id}', [ParcelleController::class, 'show']);
    Route::put('/parcelles/{id}', [ParcelleController::class, 'update']);
    Route::delete('/parcelles/{id}', [ParcelleController::class, 'destroy']);

    // Partenariats
    Route::get('/partenariats', [PartenariatController::class, 'index']);
    Route::post('/partenariats', [PartenariatController::class, 'store']);
    Route::get('/partenariats/{id}', [PartenariatController::class, 'show']);
    Route::get('/partenariats/{id}/calculer-repartition', [PartenariatController::class, 'calculerRepartition']);
    Route::put('/partenariats/{id}', [PartenariatController::class, 'update']);
    Route::delete('/partenariats/{id}', [PartenariatController::class, 'destroy']);

    // Documents Fonciers
    Route::get('/documents-fonciers', [DocumentFoncierController::class, 'index']);
    Route::post('/documents-fonciers', [DocumentFoncierController::class, 'store']);
    Route::get('/documents-fonciers/{id}', [DocumentFoncierController::class, 'show']);
    Route::get('/documents-fonciers/{id}/telecharger', [DocumentFoncierController::class, 'telecharger']);
    Route::delete('/documents-fonciers/{id}', [DocumentFoncierController::class, 'destroy']);

    // Travaux
    Route::get('/travaux', [TravauxController::class, 'index']);
    Route::post('/travaux', [TravauxController::class, 'store']);
    Route::get('/travaux/{id}', [TravauxController::class, 'show']);
    Route::put('/travaux/{id}', [TravauxController::class, 'update']);
    Route::delete('/travaux/{id}', [TravauxController::class, 'destroy']);

    // D??penses
    Route::get('/depenses/test', function() {
        return response()->json(['message' => 'API d??penses fonctionne']);
    });
    Route::get('/depenses', [DepenseController::class, 'index']);
    Route::post('/depenses', [DepenseController::class, 'store']);
    Route::get('/depenses/{id}', [DepenseController::class, 'show']);
    Route::put('/depenses/{id}', [DepenseController::class, 'update']);
    Route::delete('/depenses/{id}', [DepenseController::class, 'destroy']);
    Route::get('/depenses/{id}/telecharger-facture', [DepenseController::class, 'telechargerFacture']);

    // MODULE COOPERATIVE - Tableau de bord
    Route::get('/cooperative/tableau-bord', [TableauBordCooperativeController::class, 'index']);

    // MODULE COOPERATIVE - Groupes
    Route::get('/cooperative-groupes', [GroupeCooperativeController::class, 'index']);
    Route::post('/cooperative-groupes', [GroupeCooperativeController::class, 'store']);
    Route::get('/cooperative-groupes/{id}', [GroupeCooperativeController::class, 'show']);
    Route::put('/cooperative-groupes/{id}', [GroupeCooperativeController::class, 'update']);
    Route::delete('/cooperative-groupes/{id}', [GroupeCooperativeController::class, 'destroy']);

    // TABLEAU DE BORD PRINCIPAL
    Route::get('/tableau-bord', [TableauBordController::class, 'index']);
    Route::get('/tableau-bord/carte', [TableauBordController::class, 'carte']);

    // MODULE COOPERATIVE - Adh??rents
    Route::get('/adherents', [AdherentController::class, 'index']);
    Route::post('/adherents', [AdherentController::class, 'store']);
    Route::get('/adherents/statistiques', [AdherentController::class, 'statistiques']);
    Route::get('/adherents/{id}', [AdherentController::class, 'show']);
    Route::get('/adherents/{id}/eligibilite', [AdherentController::class, 'verifierEligibilite']);
    Route::put('/adherents/{id}', [AdherentController::class, 'update']);
    Route::delete('/adherents/{id}', [AdherentController::class, 'destroy']);

    // MODULE COOPERATIVE - Cotisations
    Route::post('/cotisations/parametres', [CotisationController::class, 'creerParametre']);
    Route::get('/cotisations/parametres/actif', [CotisationController::class, 'obtenirParametreActif']);
    Route::post('/cotisations/generer-echeances', [CotisationController::class, 'genererEcheances']);
    Route::get('/cotisations/echeances', [CotisationController::class, 'listerEcheances']);
    Route::put('/cotisations/echeances/{id}/payer', [CotisationController::class, 'payerEcheance']);
    Route::post('/cotisations/verifier-retards', [CotisationController::class, 'verifierRetards']);
    Route::get('/cotisations/statistiques', [CotisationController::class, 'statistiques']);

    // MODULE COOPERATIVE - Parcelles
    Route::get('/parcelles-cooperative', [ParcelleCooperativeController::class, 'index']);
    Route::post('/parcelles-cooperative', [ParcelleCooperativeController::class, 'store']);
    Route::get('/parcelles-cooperative/statistiques', [ParcelleCooperativeController::class, 'statistiques']);
    Route::get('/parcelles-cooperative/{id}', [ParcelleCooperativeController::class, 'show']);
    Route::put('/parcelles-cooperative/{id}', [ParcelleCooperativeController::class, 'update']);
    Route::put('/parcelles-cooperative/{id}/attribuer', [ParcelleCooperativeController::class, 'attribuer']);
    Route::put('/parcelles-cooperative/{id}/retirer', [ParcelleCooperativeController::class, 'retirer']);
    Route::delete('/parcelles-cooperative/{id}', [ParcelleCooperativeController::class, 'destroy']);

    // GESTION DES ROLES ET PERMISSIONS (Super Admin uniquement)
    \Illuminate\Support\Facades\Route::group(['prefix' => 'roles'], function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/permissions', [RoleController::class, 'listerPermissions']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::get('/{id}/permissions', [RoleController::class, 'obtenirPermissionsRole']);
        Route::post('/', [RoleController::class, 'store']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
        Route::post('/{id}/permissions', [RoleController::class, 'assignerPermissions']);
    });

    // GESTION DU PROFIL UTILISATEUR
    Route::group(['prefix' => 'utilisateur'], function () {
        Route::get('/profil', [App\Presentation\Controllers\UtilisateurController::class, 'profil']);
        Route::put('/profil', [App\Presentation\Controllers\UtilisateurController::class, 'mettreAJourProfil']);
        Route::put('/mot-de-passe', [App\Presentation\Controllers\UtilisateurController::class, 'changerMotDePasse']);
        Route::get('/preferences', [App\Presentation\Controllers\UtilisateurController::class, 'obtenirPreferences']);
        Route::put('/preferences', [App\Presentation\Controllers\UtilisateurController::class, 'mettreAJourPreferences']);
    });

    // INFORMATIONS SYST??ME (Super Admin uniquement)
    Route::group(['prefix' => 'systeme'], function () {
        Route::get('/informations', [App\Presentation\Controllers\UtilisateurController::class, 'informationsSysteme']);
        Route::post('/vider-cache', [App\Presentation\Controllers\UtilisateurController::class, 'viderCache']);
        Route::get('/exporter-donnees', [App\Presentation\Controllers\UtilisateurController::class, 'exporterDonnees']);
        Route::get('/logs', [App\Presentation\Controllers\UtilisateurController::class, 'obtenirLogs']);
        Route::get('/sauvegarder-base', [App\Presentation\Controllers\UtilisateurController::class, 'sauvegarderBase']);
    });

    // ADMINISTRATION GLOBALE (Super Admin uniquement)
    Route::prefix('admin')->group(function () {
        // Gestion des Plans
        Route::prefix('plans')->group(function () {
            Route::get('/', [\App\Presentation\Controllers\PlanController::class, 'index']);
            Route::get('/{id}', [\App\Presentation\Controllers\PlanController::class, 'show']);
            Route::post('/', [\App\Presentation\Controllers\PlanController::class, 'store']);
            Route::put('/{id}', [\App\Presentation\Controllers\PlanController::class, 'update']);
            Route::delete('/{id}', [\App\Presentation\Controllers\PlanController::class, 'destroy']);
        });

        // Gestion des Tenants
        Route::prefix('tenants')->group(function () {
            Route::get('/', [TenantController::class, 'index']);
            Route::get('/{id}', [TenantController::class, 'show']);
            Route::post('/', [TenantController::class, 'store']);
            Route::put('/{id}', [TenantController::class, 'update']);
            Route::delete('/{id}', [TenantController::class, 'destroy']);
        });

        // Gestion Globale des Utilisateurs
        Route::prefix('utilisateurs')->group(function () {
            Route::get('/', [\App\Presentation\Controllers\UtilisateurController::class, 'listeUtilisateursGlobale']);
            Route::post('/{id}/reinitialiser-password', [\App\Presentation\Controllers\UtilisateurController::class, 'reinitialiserMotDePasseUtilisateur']);
        });

        // Audit Logs
        Route::prefix('audit')->group(function () {
            Route::get('/', [\App\Presentation\Controllers\JournalAuditController::class, 'index']);
            Route::get('/{id}', [\App\Presentation\Controllers\JournalAuditController::class, 'show']);
        });
    });

    // UPLOAD D'IMAGES
    Route::prefix('upload')->group(function () {
        Route::post('/image', [App\Http\Controllers\UploadController::class, 'uploadImage']);
        Route::post('/images', [App\Http\Controllers\UploadController::class, 'uploadMultiple']);
        Route::delete('/image', [App\Http\Controllers\UploadController::class, 'deleteImage']);
    });

    // ASSISTANT IA
    Route::post('/ia/chat', [\App\Presentation\Controllers\IAController::class, 'chat']);

    // NOTIFICATIONS WHATSAPP
    Route::prefix('whatsapp')->group(function () {
        Route::post('/test', [NotificationWhatsappController::class, 'envoyerTest']);
        Route::post('/rappel', [NotificationWhatsappController::class, 'envoyerRappel']);
        Route::post('/traiter-file', [NotificationWhatsappController::class, 'traiterFileAttente']);
        Route::get('/historique/{id_adherent}', [NotificationWhatsappController::class, 'historique']);
        Route::get('/statistiques', [NotificationWhatsappController::class, 'statistiques']);
    });
});

// Routes publiques pour les fichiers (hors auth)
Route::get('/storage/{path}', [FileController::class, 'serve'])->where('path', '.*');
