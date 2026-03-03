<?php

use App\Presentation\Controllers\AuthController;
use App\Presentation\Controllers\BienController;
use App\Presentation\Controllers\ProprietaireController;
use App\Presentation\Controllers\LocataireController;
use App\Presentation\Controllers\ContratController;
use App\Presentation\Controllers\LoyerController;
use App\Presentation\Controllers\LotissementController;
use App\Presentation\Controllers\ParcelleController;
use App\Presentation\Controllers\PartenariatController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/auth/connexion', [AuthController::class, 'connexion']);

// Routes protégées
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

    // Propriétaires
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
    Route::get('/loyers/{id}', [LoyerController::class, 'show']);
    Route::put('/loyers/{id}', [LoyerController::class, 'update']);
    Route::put('/loyers/{id}/payer', [LoyerController::class, 'payer']);
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
});

