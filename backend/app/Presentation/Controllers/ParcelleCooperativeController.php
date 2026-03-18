<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceParcelleCooperative;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParcelleCooperativeController extends Controller
{
    protected $serviceParcelle;

    public function __construct(ServiceParcelleCooperative $serviceParcelle)
    {
        $this->serviceParcelle = $serviceParcelle;
    }

    public function index(Request $request)
    {
        $filtres = $request->only(['id_groupe', 'statut', 'recherche']);
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'numero' => 'required|string|max:50|unique:parcelles_cooperative,numero',
            'surface' => 'required|numeric|min:0',
            'prix' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'id_groupe' => 'nullable|integer',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

    public function show($id)
    {
        $parcelle = $this->serviceParcelle->obtenirParId($id);
        return response()->json($parcelle);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'numero' => 'sometimes|string|max:50',
            'surface' => 'sometimes|numeric|min:0',
            'prix' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'id_groupe' => 'nullable|integer',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

    public function destroy($id)
    {
        try {
            $this->serviceParcelle->supprimer($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function attribuer(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'attributions' => 'required_without:id_groupe|array',
            'attributions.*.id_adherent' => 'required_with:attributions|exists:adherents,id',
            'attributions.*.pourcentage' => 'nullable|numeric|min:0|max:100',
            'id_groupe' => 'required_without:attributions|nullable|integer|exists:groupes_cooperative,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        try {
            $parcelle = $this->serviceParcelle->attribuer($id, $request->all());

            return response()->json([
                'message' => 'Parcelle attribuée avec succès',
                'parcelle' => $parcelle,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function retirer(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'motif' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        try {
            $parcelle = $this->serviceParcelle->retirer($id, $request->motif);

            return response()->json([
                'message' => 'Parcelle retirée avec succès',
                'parcelle' => $parcelle,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function statistiques()
    {
        $stats = $this->serviceParcelle->obtenirStatistiques();
        return response()->json($stats);
    }
}
