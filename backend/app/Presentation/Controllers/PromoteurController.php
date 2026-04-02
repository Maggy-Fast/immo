<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServicePromoteur;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Contrôleur de présentation pour les promoteurs
 */
class PromoteurController extends Controller
{
    protected $servicePromoteur;

    public function __construct(ServicePromoteur $servicePromoteur)
    {
        $this->servicePromoteur = $servicePromoteur;
    }

    /**
     * GET /api/promoteurs
     */
    public function index(Request $request)
    {
        $terme = $request->get('recherche');
        $promoteurs = $terme ? $this->servicePromoteur->rechercher($terme) : $this->servicePromoteur->lister();

        return response()->json([
            'donnees' => $promoteurs->items(),
            'meta' => [
                'page_courante' => $promoteurs->currentPage(),
                'total_pages' => $promoteurs->lastPage(),
                'total' => $promoteurs->total(),
            ],
        ]);
    }

    /**
     * POST /api/promoteurs
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'cin' => 'nullable|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'licence' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'registre_commerce' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'statut_juridique' => 'nullable|string|max:100',
            'id_utilisateur' => 'nullable|exists:utilisateurs,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'erreurs' => $validator->errors()
            ], 422);
        }

        try {
            $promoteur = $this->servicePromoteur->creer($request->all());

            return response()->json([
                'message' => 'Promoteur créé avec succès',
                'donnees' => $promoteur
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/promoteurs/{id}
     */
    public function show($id)
    {
        try {
            $promoteur = $this->servicePromoteur->obtenirParId($id);

            return response()->json([
                'donnees' => $promoteur
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Promoteur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/promoteurs/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|nullable|email|max:255',
            'adresse' => 'sometimes|nullable|string|max:500',
            'cin' => 'sometimes|nullable|string|max:50',
            'photo' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'licence' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'registre_commerce' => 'sometimes|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'statut_juridique' => 'sometimes|nullable|string|max:100',
            'id_utilisateur' => 'sometimes|nullable|exists:utilisateurs,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides',
                'erreurs' => $validator->errors()
            ], 422);
        }

        try {
            $promoteur = $this->servicePromoteur->mettreAJour($id, $request->all());

            return response()->json([
                'message' => 'Promoteur mis à jour avec succès',
                'donnees' => $promoteur
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Promoteur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/promoteurs/{id}
     */
    public function destroy($id)
    {
        try {
            $this->servicePromoteur->supprimer($id);

            return response()->json([
                'message' => 'Promoteur supprimé avec succès'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Promoteur non trouvé'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }
}
