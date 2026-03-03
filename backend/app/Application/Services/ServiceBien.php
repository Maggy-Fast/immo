<?php

namespace App\Application\Services;

use App\Domaine\Entities\Bien;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des biens
 * Orchestre les cas d'utilisation métier
 */
class ServiceBien
{
    /**
     * Lister tous les biens avec filtres
     */
    public function lister(array $filtres = [])
    {
        $query = Bien::with(['proprietaire', 'tenant']);

        // Filtre par type
        if (!empty($filtres['type'])) {
            $query->where('type', $filtres['type']);
        }

        // Filtre par statut
        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        // Filtre par propriétaire
        if (!empty($filtres['id_proprietaire'])) {
            $query->where('id_proprietaire', $filtres['id_proprietaire']);
        }

        return $query->paginate(15);
    }

    /**
     * Créer un nouveau bien
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        return Bien::create($donnees);
    }

    /**
     * Obtenir un bien par ID
     */
    public function obtenirParId(int $id)
    {
        return Bien::with(['proprietaire', 'tenant'])->findOrFail($id);
    }

    /**
     * Mettre à jour un bien
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $bien = Bien::findOrFail($id);
        $bien->update($donnees);
        
        return $bien->fresh(['proprietaire', 'tenant']);
    }

    /**
     * Supprimer un bien
     */
    public function supprimer(int $id)
    {
        $bien = Bien::findOrFail($id);
        $bien->delete();
        
        return true;
    }
}
