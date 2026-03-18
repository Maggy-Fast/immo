<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceCotisation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CotisationController extends Controller
{
    protected $serviceCotisation;

    public function __construct(ServiceCotisation $serviceCotisation)
    {
        $this->serviceCotisation = $serviceCotisation;
    }

    public function creerParametre(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'montant' => 'required|numeric|min:0',
            'frequence' => 'required|in:mensuel,trimestriel,annuel',
            'jour_echeance' => 'required|integer|min:1|max:28',
            'date_debut' => 'required|date',
            'periode_grace_jours' => 'required|integer|min:0',
            'max_echeances_retard' => 'required|integer|min:1',
            'id_groupe' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $parametre = $this->serviceCotisation->creerParametre($request->all());

        return response()->json($parametre, 201);
    }

    public function obtenirParametreActif()
    {
        $idGroupe = request()->query('id_groupe');
        $parametre = $this->serviceCotisation->obtenirParametreActif($idGroupe ? (int) $idGroupe : null);
        
        if (!$parametre) {
            return response()->json(['message' => 'Aucun paramètre actif'], 404);
        }

        return response()->json($parametre);
    }

    public function genererEcheances(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_adherent' => 'required|exists:adherents,id',
            'nombre_mois' => 'nullable|integer|min:1|max:24',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        try {
            $echeances = $this->serviceCotisation->genererEcheances(
                $request->id_adherent,
                $request->nombre_mois ?? 12
            );

            return response()->json([
                'message' => count($echeances) . ' échéance(s) générée(s)',
                'echeances' => $echeances,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function listerEcheances(Request $request)
    {
        $filtres = $request->only(['id_groupe', 'statut', 'id_adherent', 'mois']);
        $echeances = $this->serviceCotisation->listerEcheances($filtres);

        return response()->json([
            'donnees' => $echeances->items(),
            'meta' => [
                'page_courante' => $echeances->currentPage(),
                'total_pages' => $echeances->lastPage(),
                'total' => $echeances->total(),
            ],
        ]);
    }

    public function payerEcheance(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'montant_paye' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:especes,virement,mobile_money,cheque',
            'reference_paiement' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        try {
            $echeance = $this->serviceCotisation->payerEcheance($id, $request->all());

            return response()->json([
                'message' => 'Paiement enregistré avec succès',
                'echeance' => $echeance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function verifierRetards()
    {
        $this->serviceCotisation->verifierRetards();

        return response()->json(['message' => 'Vérification des retards effectuée']);
    }

    public function statistiques()
    {
        $idGroupe = request()->query('id_groupe');
        $stats = $idGroupe
            ? $this->serviceCotisation->obtenirStatistiquesParGroupe((int) $idGroupe)
            : $this->serviceCotisation->obtenirStatistiques();
        return response()->json($stats);
    }
}
