<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceProprietaire;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les propriétaires
 */
class ProprietaireController extends Controller
{
    protected $serviceProprietaire;

    public function __construct(ServiceProprietaire $serviceProprietaire)
    {
        $this->serviceProprietaire = $serviceProprietaire;
    }

    /**
     * GET /api/proprietaires
     */
    public function index()
    {
        $proprietaires = $this->serviceProprietaire->lister();

        return response()->json([
            'donnees' => $proprietaires->items(),
            'meta' => [
                'page_courante' => $proprietaires->currentPage(),
                'total_pages' => $proprietaires->lastPage(),
                'total' => $proprietaires->total(),
            ],
        ]);
    }

    /**
     * POST /api/proprietaires
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'cin' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $proprietaire = $this->serviceProprietaire->creer($request->all());

        return response()->json($proprietaire, 201);
    }

    /**
     * GET /api/proprietaires/{id}
     */
    public function show($id)
    {
        $proprietaire = $this->serviceProprietaire->obtenirParId($id);
        return response()->json($proprietaire);
    }

    /**
     * PUT /api/proprietaires/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'cin' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $proprietaire = $this->serviceProprietaire->mettreAJour($id, $request->all());

        return response()->json($proprietaire);
    }

    /**
     * DELETE /api/proprietaires/{id}
     */
    public function destroy($id)
    {
        $this->serviceProprietaire->supprimer($id);
        return response()->json(null, 204);
    }
}
