<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceTableauBord;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TableauBordController extends Controller
{
    protected $serviceTableauBord;

    public function __construct(ServiceTableauBord $serviceTableauBord)
    {
        $this->serviceTableauBord = $serviceTableauBord;
    }

    /**
     * Obtenir les statistiques du tableau de bord
     */
    public function index(): JsonResponse
    {
        try {
            $stats = $this->serviceTableauBord->obtenirStatsGlobales();
            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les données pour la carte interactive
     */
    public function carte(): JsonResponse
    {
        try {
            $donnees = $this->serviceTableauBord->obtenirDonneesCarte();
            return response()->json($donnees);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des données de la carte',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
