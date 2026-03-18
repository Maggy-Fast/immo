<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceAdherent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdherentController extends Controller
{
    protected $serviceAdherent;

    public function __construct(ServiceAdherent $serviceAdherent)
    {
        $this->serviceAdherent = $serviceAdherent;
    }

    public function index(Request $request)
    {
        $filtres = $request->only(['id_groupe', 'statut', 'recherche']);
        $adherents = $this->serviceAdherent->lister($filtres);

        return response()->json([
            'donnees' => $adherents->items(),
            'meta' => [
                'page_courante' => $adherents->currentPage(),
                'total_pages' => $adherents->lastPage(),
                'total' => $adherents->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'nullable|string|max:50',
            'telephone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string',
            'date_adhesion' => 'nullable|date',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $adherent = $this->serviceAdherent->creer($request->all());

        return response()->json($adherent, 201);
    }

    public function show($id)
    {
        $adherent = $this->serviceAdherent->obtenirParId($id);
        return response()->json($adherent);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'cin' => 'nullable|string|max:50',
            'telephone' => 'sometimes|string|max:20',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string',
            'statut' => 'sometimes|in:actif,suspendu,radie',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $adherent = $this->serviceAdherent->mettreAJour($id, $request->all());

        return response()->json($adherent);
    }

    public function destroy($id)
    {
        try {
            $this->serviceAdherent->supprimer($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function verifierEligibilite($id)
    {
        $eligibilite = $this->serviceAdherent->verifierEligibiliteParcelle($id);
        return response()->json($eligibilite);
    }

    public function statistiques()
    {
        $stats = $this->serviceAdherent->obtenirStatistiques();
        return response()->json($stats);
    }
}
