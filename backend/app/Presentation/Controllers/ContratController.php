<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceContrat;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les contrats
 */
class ContratController extends Controller
{
    protected $serviceContrat;

    public function __construct(ServiceContrat $serviceContrat)
    {
        $this->serviceContrat = $serviceContrat;
    }

    /**
     * GET /api/contrats
     */
    public function index(Request $request)
    {
        $filtres = $request->only(['statut', 'id_locataire', 'id_bien']);
        $contrats = $this->serviceContrat->lister($filtres);

        return response()->json([
            'donnees' => $contrats->items(),
            'meta' => [
                'page_courante' => $contrats->currentPage(),
                'total_pages' => $contrats->lastPage(),
                'total' => $contrats->total(),
            ],
        ]);
    }

    /**
     * POST /api/contrats
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'required|exists:biens,id',
            'id_locataire' => 'required|exists:locataires,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'loyer_mensuel' => 'required|numeric|min:0',
            'caution' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $contrat = $this->serviceContrat->creer($request->all());

        return response()->json($contrat, 201);
    }

    /**
     * GET /api/contrats/{id}
     */
    public function show($id)
    {
        $contrat = $this->serviceContrat->obtenirParId($id);
        return response()->json($contrat);
    }

    /**
     * PUT /api/contrats/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'sometimes|exists:biens,id',
            'id_locataire' => 'sometimes|exists:locataires,id',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date',
            'loyer_mensuel' => 'sometimes|numeric|min:0',
            'caution' => 'nullable|numeric|min:0',
            'statut' => 'sometimes|in:actif,termine,resilie',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $contrat = $this->serviceContrat->mettreAJour($id, $request->all());

        return response()->json($contrat);
    }

    /**
     * DELETE /api/contrats/{id}
     */
    public function destroy($id)
    {
        $this->serviceContrat->supprimer($id);
        return response()->json(null, 204);
    }
}
