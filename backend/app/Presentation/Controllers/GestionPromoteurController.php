<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServicePromoteur;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * Controleur de presentation pour les promoteurs
 */
class GestionPromoteurController extends Controller
{
    protected $servicePromoteur;

    public function __construct(ServicePromoteur $servicePromoteur)
    {
        $this->servicePromoteur = $servicePromoteur;
    }

    /**
     * Lister les promoteurs avec pagination et recherche optionnelle
     */
    public function index(Request $request)
    {
        try {
            $terme = $request->query('recherche');
            $promoteurs = $terme ? $this->servicePromoteur->rechercher($terme) : $this->servicePromoteur->lister();

            return response()->json([
                'donnees' => $promoteurs->items(),
                'meta' => [
                    'page_courante' => $promoteurs->currentPage(),
                    'total_pages' => $promoteurs->lastPage(),
                    'total' => $promoteurs->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la recuperation des promoteurs',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Creer un nouveau promoteur
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'id_tenant' => 'nullable|exists:tenants,id',
                'email' => 'nullable|email|max:255',
                'telephone' => 'required|string|max:20',
                'adresse' => 'nullable|string',
                'cin' => 'nullable|string|max:20',
                'photo' => 'nullable|image|max:2048',
                'id_utilisateur' => 'nullable|exists:users,id',
                'licence' => 'nullable|file|max:5120',
                'registre_commerce' => 'nullable|file|max:5120',
                'statut_juridique' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Donnees invalides',
                    'erreurs' => $validator->errors()
                ], 422);
            }

            $promoteur = $this->servicePromoteur->creer($request->all());

            return response()->json([
                'message' => 'Promoteur cree avec succes',
                'donnees' => $promoteur
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erreur lors de la creation du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher les details d'un promoteur
     */
    public function show($id)
    {
        try {
            $promoteur = $this->servicePromoteur->obtenirParId($id);
            if (!$promoteur) {
                return response()->json([
                    'message' => 'Promoteur non trouve'
                ], 404);
            }
            return response()->json($promoteur);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erreur lors de la recuperation du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre a jour un promoteur
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|required|string|max:255',
                'email' => 'nullable|email|max:255',
                'telephone' => 'sometimes|required|string|max:20',
                'adresse' => 'nullable|string',
                'cin' => 'nullable|string|max:20',
                'photo' => 'nullable|image|max:2048',
                'id_utilisateur' => 'nullable|exists:users,id',
                'licence' => 'nullable|file|max:5120',
                'registre_commerce' => 'nullable|file|max:5120',
                'statut_juridique' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Donnees invalides',
                    'erreurs' => $validator->errors()
                ], 422);
            }

            $promoteur = $this->servicePromoteur->mettreAJour($id, $request->all());
            return response()->json([
                'message' => 'Promoteur mis a jour avec succes',
                'donnees' => $promoteur
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise a jour du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un promoteur
     */
    public function destroy($id)
    {
        try {
            $resultat = $this->servicePromoteur->supprimer($id);
            if (!$resultat) {
                return response()->json([
                    'message' => 'Promoteur non trouve'
                ], 404);
            }
            return response()->json([
                'message' => 'Promoteur supprime avec succes'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression du promoteur',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }
}
