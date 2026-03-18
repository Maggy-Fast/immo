<?php

namespace App\Application\Services;

use App\Domaine\Entities\Contrat;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des contrats
 */
class ServiceContrat
{
    /**
     * Lister tous les contrats avec filtres
     */
    public function lister(array $filtres = [])
    {
        $query = Contrat::with(['bien', 'locataire', 'tenant']);

        // Filtre par statut
        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        // Filtre par locataire
        if (!empty($filtres['id_locataire'])) {
            $query->where('id_locataire', $filtres['id_locataire']);
        }

        // Filtre par bien
        if (!empty($filtres['id_bien'])) {
            $query->where('id_bien', $filtres['id_bien']);
        }

        return $query->paginate(15);
    }

    /**
     * Créer un nouveau contrat
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        $donnees['statut'] = 'actif';
        
        return Contrat::create($donnees);
    }

    /**
     * Obtenir un contrat par ID
     */
    public function obtenirParId(int $id)
    {
        return Contrat::with(['bien', 'locataire', 'tenant'])->findOrFail($id);
    }

    /**
     * Mettre à jour un contrat
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $contrat = Contrat::findOrFail($id);
        $contrat->update($donnees);
        
        return $contrat->fresh(['bien', 'locataire', 'tenant']);
    }

    /**
     * Supprimer un contrat
     */
    public function supprimer(int $id)
    {
        $contrat = Contrat::findOrFail($id);
        $contrat->delete();
        
        return true;
    }
}
