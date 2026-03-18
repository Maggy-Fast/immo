<?php

namespace App\Application\Services;

use App\Domaine\Entities\Adherent;
use App\Domaine\Entities\Echeance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceAdherent
{
    public function lister(array $filtres = [])
    {
        $query = Adherent::with(['parcelleAttribuee', 'echeances']);

        if (!empty($filtres['id_groupe'])) {
            $query->where('id_groupe', $filtres['id_groupe']);
        }

        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        if (!empty($filtres['recherche'])) {
            $query->where(function($q) use ($filtres) {
                $q->where('nom', 'like', '%' . $filtres['recherche'] . '%')
                  ->orWhere('prenom', 'like', '%' . $filtres['recherche'] . '%')
                  ->orWhere('numero', 'like', '%' . $filtres['recherche'] . '%');
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        if (empty($donnees['id_groupe'])) {
            $serviceGroupe = new ServiceGroupeCooperative();
            $donnees['id_groupe'] = $serviceGroupe->obtenirGroupeParDefautId();
        }
        $donnees['numero'] = $this->genererNumero();
        $donnees['date_adhesion'] = $donnees['date_adhesion'] ?? now();

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            $donnees['photo']->storeAs('public/uploads/adherent', $nomFichier);
            $donnees['photo'] = '/storage/uploads/adherent/' . $nomFichier;
        }
        
        return Adherent::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        return Adherent::with([
            'parcelleAttribuee',
            'echeances' => function($q) {
                $q->orderBy('date_echeance', 'desc');
            },
            'historiqueAttributions.parcelle'
        ])->findOrFail($id);
    }

    public function mettreAJour(int $id, array $donnees)
    {
        $adherent = Adherent::findOrFail($id);

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            $donnees['photo']->storeAs('public/uploads/adherent', $nomFichier);
            $donnees['photo'] = '/storage/uploads/adherent/' . $nomFichier;
        }

        $adherent->update($donnees);
        
        return $adherent->fresh(['parcelleAttribuee', 'echeances']);
    }

    public function supprimer(int $id)
    {
        $adherent = Adherent::findOrFail($id);
        
        // Vérifier qu'il n'a pas de parcelle attribuée
        if ($adherent->parcelleAttribuee) {
            throw new \Exception("Impossible de supprimer un adhérent avec une parcelle attribuée");
        }
        
        $adherent->delete();
        return true;
    }

    public function verifierEligibiliteParcelle(int $id): array
    {
        $adherent = Adherent::with('echeances')->findOrFail($id);
        
        $eligible = $adherent->statut === 'actif' && 
                    $adherent->echeances_en_retard === 0;
        
        $raisons = [];
        if ($adherent->statut !== 'actif') {
            $raisons[] = "Statut non actif: {$adherent->statut}";
        }
        if ($adherent->echeances_en_retard > 0) {
            $raisons[] = "{$adherent->echeances_en_retard} échéance(s) en retard";
        }
        
        return [
            'eligible' => $eligible,
            'raisons' => $raisons,
        ];
    }

    public function obtenirStatistiques()
    {
        $idTenant = Auth::user()->id_tenant;

        return [
            'total_adherents' => Adherent::where('id_tenant', $idTenant)->count(),
            'actifs' => Adherent::where('id_tenant', $idTenant)->where('statut', 'actif')->count(),
            'suspendus' => Adherent::where('id_tenant', $idTenant)->where('statut', 'suspendu')->count(),
            'radies' => Adherent::where('id_tenant', $idTenant)->where('statut', 'radie')->count(),
            'avec_parcelle' => Adherent::where('id_tenant', $idTenant)->whereHas('parcelleAttribuee')->count(),
        ];
    }

    public function obtenirStatistiquesParGroupe(int $idGroupe)
    {
        $idTenant = Auth::user()->id_tenant;

        $base = Adherent::where('id_tenant', $idTenant)->where('id_groupe', $idGroupe);

        return [
            'total_adherents' => (clone $base)->count(),
            'actifs' => (clone $base)->where('statut', 'actif')->count(),
            'suspendus' => (clone $base)->where('statut', 'suspendu')->count(),
            'radies' => (clone $base)->where('statut', 'radie')->count(),
            'avec_parcelle' => (clone $base)->whereHas('parcelleAttribuee')->count(),
        ];
    }

    private function genererNumero(): string
    {
        $idTenant = Auth::user()->id_tenant;
        $dernier = Adherent::where('id_tenant', $idTenant)
            ->orderBy('id', 'desc')
            ->first();
        
        $numero = $dernier ? intval(substr($dernier->numero, 3)) + 1 : 1;
        
        return 'ADH' . str_pad($numero, 3, '0', STR_PAD_LEFT);
    }
}
