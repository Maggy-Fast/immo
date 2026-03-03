<?php

namespace App\Application\Services;

use App\Domaine\Entities\Parcelle;

/**
 * Service Application pour la gestion des parcelles
 */
class ServiceParcelle
{
    /**
     * Lister toutes les parcelles avec filtres
     */
    public function lister(array $filtres = [])
    {
        $query = Parcelle::with('lotissement');

        // Filtre par lotissement
        if (!empty($filtres['id_lotissement'])) {
            $query->where('id_lotissement', $filtres['id_lotissement']);
        }

        // Filtre par statut
        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        return $query->paginate(15);
    }

    /**
     * Créer une nouvelle parcelle
     */
    public function creer(array $donnees)
    {
        return Parcelle::create($donnees);
    }

    /**
     * Obtenir une parcelle par ID
     */
    public function obtenirParId(int $id)
    {
        return Parcelle::with('lotissement')->findOrFail($id);
    }

    /**
     * Mettre à jour une parcelle
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $parcelle = Parcelle::findOrFail($id);
        $parcelle->update($donnees);
        
        return $parcelle->fresh('lotissement');
    }

    /**
     * Supprimer une parcelle
     */
    public function supprimer(int $id)
    {
        $parcelle = Parcelle::findOrFail($id);
        $parcelle->delete();
        
        return true;
    }
}
