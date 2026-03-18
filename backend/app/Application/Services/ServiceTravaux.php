<?php

namespace App\Application\Services;

use App\Domaine\Entities\Travaux;
use Illuminate\Support\Facades\Auth;

class ServiceTravaux
{
    public function lister(array $filtres = [])
    {
        $query = Travaux::with(['bien', 'tenant']);

        if (!empty($filtres['id_bien'])) {
            $query->where('id_bien', $filtres['id_bien']);
        }

        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        if (!empty($filtres['recherche'])) {
            $recherche = $filtres['recherche'];
            $query->where(function ($q) use ($recherche) {
                $q->where('intitule', 'like', "%{$recherche}%")
                    ->orWhere('description', 'like', "%{$recherche}%");
            });
        }

        return $query->orderByDesc('id')->paginate(15);
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        return Travaux::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        return Travaux::with(['bien', 'tenant'])->findOrFail($id);
    }

    public function mettreAJour(int $id, array $donnees)
    {
        $travaux = Travaux::findOrFail($id);
        $travaux->update($donnees);
        return $travaux;
    }

    public function supprimer(int $id)
    {
        $travaux = Travaux::findOrFail($id);
        $travaux->delete();
    }

    public function formaterPourApi(Travaux $travaux): array
    {
        return [
            'id' => $travaux->id,
            'id_bien' => $travaux->id_bien,
            'intitule' => $travaux->intitule,
            'description' => $travaux->description,
            'montant_estime' => $travaux->montant_estime,
            'date_debut' => $travaux->date_debut?->format('Y-m-d'),
            'date_fin' => $travaux->date_fin?->format('Y-m-d'),
            'statut' => $travaux->statut,
            'bien' => $travaux->bien ? [
                'id' => $travaux->bien->id,
                'adresse' => $travaux->bien->adresse,
                'type' => $travaux->bien->type,
            ] : null,
            'date_creation' => $travaux->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
