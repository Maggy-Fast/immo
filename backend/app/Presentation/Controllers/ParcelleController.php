<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceParcelle;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les parcelles
 */
class ParcelleController extends Controller
{
    protected $serviceParcelle;

    public function __construct(ServiceParcelle $serviceParcelle)
    {
        $this->serviceParcelle = $serviceParcelle;
    }

    /**
     * GET /api/parcelles
     */
    public function index(Request $request)
    {
        $filtres = $request->only(['id_lotissement', 'statut']);
        $parcelles = $this->serviceParcelle->lister($filtres);

        return response()->json([
            'donnees' => $parcelles->items(),
            'meta' => [
                'page_courante' => $parcelles->currentPage(),
                'total_pages' => $parcelles->lastPage(),
                'total' => $parcelles->total(),
            ],
        ]);
    }

    /**
     * POST /api/parcelles
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_lotissement' => 'required|exists:lotissements,id',
            'numero' => 'required|string|max:50',
            'superficie' => 'required|numeric|min:0',
            'prix' => 'required|numeric|min:0',
            'statut' => 'nullable|in:disponible,vendue,reservee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $parcelle = $this->serviceParcelle->creer($request->all());

        return response()->json($parcelle, 201);
    }

    /**
     * GET /api/parcelles/{id}
     */
    public function show($id)
    {
        $parcelle = $this->serviceParcelle->obtenirParId($id);
        return response()->json($parcelle);
    }

    /**
     * PUT /api/parcelles/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_lotissement' => 'sometimes|exists:lotissements,id',
            'numero' => 'sometimes|string|max:50',
            'superficie' => 'sometimes|numeric|min:0',
            'prix' => 'sometimes|numeric|min:0',
            'statut' => 'sometimes|in:disponible,vendue,reservee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $parcelle = $this->serviceParcelle->mettreAJour($id, $request->all());

        return response()->json($parcelle);
    }

    /**
     * DELETE /api/parcelles/{id}
     */
    public function destroy($id)
    {
        $this->serviceParcelle->supprimer($id);
        return response()->json(null, 204);
    }
}
