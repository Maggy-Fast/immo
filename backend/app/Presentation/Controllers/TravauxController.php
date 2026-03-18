<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceTravaux;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TravauxController extends Controller
{
    protected $service;

    public function __construct(ServiceTravaux $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filtres = $request->only(['id_bien', 'statut', 'recherche']);
        $travaux = $this->service->lister($filtres);

        $donnees = array_map(function ($travail) {
            return $this->service->formaterPourApi($travail);
        }, $travaux->items());

        return response()->json([
            'donnees' => $donnees,
            'meta' => [
                'page_courante' => $travaux->currentPage(),
                'total_pages' => $travaux->lastPage(),
                'total' => $travaux->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'required|exists:biens,id',
            'intitule' => 'required|string|max:255',
            'description' => 'nullable|string',
            'montant_estime' => 'nullable|numeric|min:0',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'statut' => 'required|string|in:planifie,en_cours,termine,annule',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $travail = $this->service->creer($request->all());

        return response()->json($this->service->formaterPourApi($travail), 201);
    }

    public function show($id)
    {
        $travail = $this->service->obtenirParId((int) $id);
        return response()->json($this->service->formaterPourApi($travail));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'sometimes|required|exists:biens,id',
            'intitule' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'montant_estime' => 'nullable|numeric|min:0',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'statut' => 'sometimes|required|string|in:planifie,en_cours,termine,annule',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $travail = $this->service->mettreAJour((int) $id, $request->all());

        return response()->json($this->service->formaterPourApi($travail));
    }

    public function destroy($id)
    {
        $this->service->supprimer((int) $id);
        return response()->json(null, 204);
    }
}
