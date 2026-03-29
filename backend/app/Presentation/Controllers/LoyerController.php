<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceLoyer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les loyers
 */
class LoyerController extends Controller
{
    protected $serviceLoyer;

    public function __construct(ServiceLoyer $serviceLoyer)
    {
        $this->serviceLoyer = $serviceLoyer;
    }

    /**
     * GET /api/loyers
     */
    public function index(Request $request)
    {
        $filtres = $request->only(['statut', 'mois']);
        $loyers = $this->serviceLoyer->lister($filtres);

        return response()->json([
            'donnees' => $loyers->items(),
            'meta' => [
                'page_courante' => $loyers->currentPage(),
                'total_pages' => $loyers->lastPage(),
                'total' => $loyers->total(),
            ],
        ]);
    }

    /**
     * POST /api/loyers
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_contrat' => 'required|exists:contrats,id',
            'mois' => 'required|date_format:Y-m',
            'montant' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $loyer = $this->serviceLoyer->creer($request->all());

        return response()->json($loyer, 201);
    }

    /**
     * GET /api/loyers/{id}
     */
    public function show($id)
    {
        $loyer = $this->serviceLoyer->obtenirParId($id);
        return response()->json($loyer);
    }

    /**
     * PUT /api/loyers/{id}/payer
     */
    public function payer(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mode_paiement' => 'required|in:especes,virement,cheque,wave,orange_money',
            'date_paiement' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $loyer = $this->serviceLoyer->enregistrerPaiement($id, $request->all());

        return response()->json([
            'id' => $loyer->id,
            'statut' => $loyer->statut,
            'quittance_disponible' => $loyer->quittance !== null,
        ]);
    }

    /**
     * PUT /api/loyers/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'montant' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:impaye,paye,partiel',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $loyer = $this->serviceLoyer->mettreAJour($id, $request->all());

        return response()->json($loyer);
    }

    /**
     * DELETE /api/loyers/{id}
     */
    public function destroy($id)
    {
        $this->serviceLoyer->supprimer($id);
        return response()->json(null, 204);
    }

    /**
     * POST /api/loyers/generer
     */
    public function generer(Request $request)
    {
        $nombre = $this->serviceLoyer->genererLoyersMensuels();
        
        return response()->json([
            'success' => true,
            'message' => "$nombre loyers ont été générés pour le mois en cours.",
            'nombre_generes' => $nombre
        ]);
    }

    /**
     * GET /api/quittances/{id}/pdf
     */
    public function telechargerQuittance($id)
    {
        $pdf = $this->serviceLoyer->genererQuittancePdf($id);
        return $pdf->download('quittance-' . $id . '.pdf');
    }
}
