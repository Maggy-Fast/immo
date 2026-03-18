<?php

namespace App\Application\Services;

use App\Domaine\Entities\Depense;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceDepense
{
    public function lister(array $filtres = [])
    {
        $query = Depense::with(['bien', 'travaux', 'tenant']);

        if (!empty($filtres['id_bien'])) {
            $query->where('id_bien', $filtres['id_bien']);
        }

        if (!empty($filtres['id_travaux'])) {
            $query->where('id_travaux', $filtres['id_travaux']);
        }

        if (!empty($filtres['type_depense'])) {
            $query->where('type_depense', $filtres['type_depense']);
        }

        if (!empty($filtres['statut_paiement'])) {
            $query->where('statut_paiement', $filtres['statut_paiement']);
        }

        if (!empty($filtres['recherche'])) {
            $recherche = $filtres['recherche'];
            $query->where(function ($q) use ($recherche) {
                $q->where('intitule', 'like', "%{$recherche}%")
                    ->orWhere('description', 'like', "%{$recherche}%");
            });
        }

        return $query->orderByDesc('date_depense')->paginate(15);
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        if (isset($donnees['fichier_facture']) && $donnees['fichier_facture'] instanceof UploadedFile) {
            $donnees['fichier_facture'] = $this->stockerFichier($donnees['fichier_facture']);
        }

        return Depense::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        return Depense::with(['bien', 'travaux', 'tenant'])->findOrFail($id);
    }

    public function mettreAJour(int $id, array $donnees)
    {
        $depense = Depense::findOrFail($id);

        if (isset($donnees['fichier_facture']) && $donnees['fichier_facture'] instanceof UploadedFile) {
            // Supprimer l'ancien fichier s'il existe
            if ($depense->fichier_facture) {
                Storage::disk('public')->delete($depense->fichier_facture);
            }
            $donnees['fichier_facture'] = $this->stockerFichier($donnees['fichier_facture']);
        }

        $depense->update($donnees);
        return $depense;
    }

    public function supprimer(int $id)
    {
        $depense = Depense::findOrFail($id);
        
        // Supprimer le fichier facture s'il existe
        if ($depense->fichier_facture) {
            Storage::disk('public')->delete($depense->fichier_facture);
        }
        
        $depense->delete();
    }

    private function stockerFichier(UploadedFile $fichier): string
    {
        $nomFichier = Str::uuid() . '.' . $fichier->getClientOriginalExtension();
        $chemin = $fichier->storeAs('factures', $nomFichier, 'public');
        return $chemin;
    }

    public function telechargerFacture(int $id)
    {
        $depense = Depense::findOrFail($id);

        if (empty($depense->fichier_facture) || !Storage::disk('public')->exists($depense->fichier_facture)) {
            return null;
        }

        return Storage::disk('public')->path($depense->fichier_facture);
    }

    public function formaterPourApi(Depense $depense): array
    {
        return [
            'id' => $depense->id,
            'id_bien' => $depense->id_bien,
            'id_travaux' => $depense->id_travaux,
            'intitule' => $depense->intitule,
            'description' => $depense->description,
            'montant' => $depense->montant,
            'date_depense' => $depense->date_depense?->format('Y-m-d'),
            'type_depense' => $depense->type_depense,
            'statut_paiement' => $depense->statut_paiement,
            'fichier_facture' => $depense->fichier_facture,
            'url_facture' => $depense->fichier_facture ? Storage::disk('public')->url($depense->fichier_facture) : null,
            'bien' => $depense->bien ? [
                'id' => $depense->bien->id,
                'adresse' => $depense->bien->adresse,
                'type' => $depense->bien->type,
            ] : null,
            'travaux' => $depense->travaux ? [
                'id' => $depense->travaux->id,
                'intitule' => $depense->travaux->intitule,
                'statut' => $depense->travaux->statut,
            ] : null,
            'date_creation' => $depense->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
