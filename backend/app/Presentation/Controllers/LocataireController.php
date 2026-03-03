<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceLocataire;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les locataires
 */
class LocataireController extends Controller
{
    protected $serviceLocataire;

    public function __construct(ServiceLocataire $serviceLocataire)
    {
        $this->serviceLocataire = $serviceLocataire;
    }

    /**
     * GET /api/locataires
     */
    public function index()
    {
        $locataires = $this->serviceLocataire->lister();

        return response()->json([
            'donnees' => $locataires->items(),
            'meta' => [
                'page_courante' => $locataires->currentPage(),
                'total_pages' => $locataires->lastPage(),
                'total' => $locataires->total(),
            ],
        ]);
    }

    /**
     * POST /api/locataires
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'cin' => 'nullable|string|max:50',
            'profession' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $locataire = $this->serviceLocataire->creer($request->all());

        return response()->json($locataire, 201);
    }

    /**
     * GET /api/locataires/{id}
     */
    public function show($id)
    {
        $locataire = $this->serviceLocataire->obtenirParId($id);
        return response()->json($locataire);
    }

    /**
     * PUT /api/locataires/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:255',
            'cin' => 'nullable|string|max:50',
            'profession' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $locataire = $this->serviceLocataire->mettreAJour($id, $request->all());

        return response()->json($locataire);
    }

    /**
     * DELETE /api/locataires/{id}
     */
    public function destroy($id)
    {
        $this->serviceLocataire->supprimer($id);
        return response()->json(null, 204);
    }
}
