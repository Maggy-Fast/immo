<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServicePartenariat;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les partenariats
 */
class PartenariatController extends Controller
{
    protected $servicePartenariat;

    public function __construct(ServicePartenariat $servicePartenariat)
    {
        $this->servicePartenariat = $servicePartenariat;
    }

    /**
     * GET /api/partenariats
     */
    public function index()
    {
        $partenariats = $this->servicePartenariat->lister();

        return response()->json([
            'donnees' => $partenariats->items(),
            'meta' => [
                'page_courante' => $partenariats->currentPage(),
                'total_pages' => $partenariats->lastPage(),
                'total' => $partenariats->total(),
            ],
        ]);
    }

    /**
     * POST /api/partenariats
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_promoteur' => 'required|exists:proprietaires,id',
            'id_proprietaire' => 'required|exists:proprietaires,id',
            'id_lotissement' => 'required|exists:lotissements,id',
            'ticket_entree' => 'required|numeric|min:0',
            'pourcentage_promoteur' => 'required|numeric|min:0|max:100',
            'pourcentage_proprietaire' => 'required|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        // Vérifier que la somme des pourcentages = 100
        $somme = $request->pourcentage_promoteur + $request->pourcentage_proprietaire;
        if ($somme != 100) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => [
                    'pourcentages' => ['La somme des pourcentages doit être égale à 100%.'],
                ],
            ], 422);
        }

        $partenariat = $this->servicePartenariat->creer($request->all());

        return response()->json($partenariat, 201);
    }

    /**
     * GET /api/partenariats/{id}
     */
    public function show($id)
    {
        $partenariat = $this->servicePartenariat->obtenirParId($id);
        return response()->json($partenariat);
    }

    /**
     * GET /api/partenariats/{id}/calculer-repartition
     */
    public function calculerRepartition($id)
    {
        $repartition = $this->servicePartenariat->calculerRepartition($id);
        return response()->json($repartition);
    }

    /**
     * PUT /api/partenariats/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_promoteur' => 'sometimes|exists:proprietaires,id',
            'id_proprietaire' => 'sometimes|exists:proprietaires,id',
            'id_lotissement' => 'sometimes|exists:lotissements,id',
            'ticket_entree' => 'sometimes|numeric|min:0',
            'pourcentage_promoteur' => 'sometimes|numeric|min:0|max:100',
            'pourcentage_proprietaire' => 'sometimes|numeric|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $partenariat = $this->servicePartenariat->mettreAJour($id, $request->all());

        return response()->json($partenariat);
    }

    /**
     * DELETE /api/partenariats/{id}
     */
    public function destroy($id)
    {
        $this->servicePartenariat->supprimer($id);
        return response()->json(null, 204);
    }
}
