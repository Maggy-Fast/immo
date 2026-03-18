<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceLotissement;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les lotissements
 */
class LotissementController extends Controller
{
    protected $serviceLotissement;

    public function __construct(ServiceLotissement $serviceLotissement)
    {
        $this->serviceLotissement = $serviceLotissement;
    }

    /**
     * GET /api/lotissements
     */
    public function index()
    {
        $lotissements = $this->serviceLotissement->lister();

        return response()->json([
            'donnees' => $lotissements->items(),
            'meta' => [
                'page_courante' => $lotissements->currentPage(),
                'total_pages' => $lotissements->lastPage(),
                'total' => $lotissements->total(),
            ],
        ]);
    }

    /**
     * POST /api/lotissements
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'localisation' => 'required|string|max:500',
            'superficie_totale' => 'required|numeric|min:0',
            'nombre_parcelles' => 'required|integer|min:1',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'plan' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $lotissement = $this->serviceLotissement->creer($request->all());

        return response()->json($lotissement, 201);
    }

    /**
     * GET /api/lotissements/{id}
     */
    public function show($id)
    {
        $lotissement = $this->serviceLotissement->obtenirParId($id);
        return response()->json($lotissement);
    }

    /**
     * PUT /api/lotissements/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'localisation' => 'sometimes|string|max:500',
            'superficie_totale' => 'sometimes|numeric|min:0',
            'nombre_parcelles' => 'sometimes|integer|min:1',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'plan' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $lotissement = $this->serviceLotissement->mettreAJour($id, $request->all());

        return response()->json($lotissement);
    }

    /**
     * DELETE /api/lotissements/{id}
     */
    public function destroy($id)
    {
        $this->serviceLotissement->supprimer($id);
        return response()->json(null, 204);
    }
}
