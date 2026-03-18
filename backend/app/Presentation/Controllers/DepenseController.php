<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceDepense;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DepenseController extends Controller
{
    protected $service;

    public function __construct(ServiceDepense $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filtres = $request->only(['id_bien', 'id_travaux', 'type_depense', 'statut_paiement', 'recherche']);
        $depenses = $this->service->lister($filtres);

        $donnees = array_map(function ($depense) {
            return $this->service->formaterPourApi($depense);
        }, $depenses->items());

        return response()->json([
            'donnees' => $donnees,
            'meta' => [
                'page_courante' => $depenses->currentPage(),
                'total_pages' => $depenses->lastPage(),
                'total' => $depenses->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'required|exists:biens,id',
            'id_travaux' => 'nullable|exists:travaux,id',
            'intitule' => 'required|string|max:255',
            'description' => 'nullable|string',
            'montant' => 'required|numeric|min:0',
            'date_depense' => 'required|date',
            'type_depense' => 'required|string|in:materiaux,main_oeuvre,autres,frais_administratif',
            'statut_paiement' => 'required|string|in:paye,en_attente,impaye',
            'fichier_facture' => 'nullable|file|mimetypes:application/pdf,image/jpeg,image/png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $donnees = $request->all();
        if ($request->hasFile('fichier_facture')) {
            $donnees['fichier_facture'] = $request->file('fichier_facture');
        }

        $depense = $this->service->creer($donnees);

        return response()->json($this->service->formaterPourApi($depense), 201);
    }

    public function show($id)
    {
        $depense = $this->service->obtenirParId((int) $id);
        return response()->json($this->service->formaterPourApi($depense));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'sometimes|required|exists:biens,id',
            'id_travaux' => 'nullable|exists:travaux,id',
            'intitule' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'montant' => 'sometimes|required|numeric|min:0',
            'date_depense' => 'sometimes|required|date',
            'type_depense' => 'sometimes|required|string|in:materiaux,main_oeuvre,autres,frais_administratif',
            'statut_paiement' => 'sometimes|required|string|in:paye,en_attente,impaye',
            'fichier_facture' => 'nullable|file|mimetypes:application/pdf,image/jpeg,image/png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $donnees = $request->all();
        if ($request->hasFile('fichier_facture')) {
            $donnees['fichier_facture'] = $request->file('fichier_facture');
        }

        $depense = $this->service->mettreAJour((int) $id, $donnees);

        return response()->json($this->service->formaterPourApi($depense));
    }

    public function destroy($id)
    {
        $this->service->supprimer((int) $id);
        return response()->json(null, 204);
    }

    public function telechargerFacture($id)
    {
        $cheminFichier = $this->service->telechargerFacture((int) $id);

        if (!$cheminFichier) {
            return response()->json(['message' => 'Facture introuvable.'], 404);
        }

        $depense = $this->service->obtenirParId((int) $id);
        $nomFichier = 'facture-' . Str::slug($depense->intitule) . '.' . pathinfo($cheminFichier, PATHINFO_EXTENSION);

        return response()->download($cheminFichier, $nomFichier);
    }
}
