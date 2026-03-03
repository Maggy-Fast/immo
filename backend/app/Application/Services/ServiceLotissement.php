<?php

namespace App\Application\Services;

use App\Domaine\Entities\Lotissement;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des lotissements
 */
class ServiceLotissement
{
    /**
     * Lister tous les lotissements
     */
    public function lister()
    {
        return Lotissement::with(['tenant', 'parcelles'])->paginate(15);
    }

    /**
     * Créer un nouveau lotissement
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        return Lotissement::create($donnees);
    }

    /**
     * Obtenir un lotissement par ID
     */
    public function obtenirParId(int $id)
    {
        return Lotissement::with(['tenant', 'parcelles'])->findOrFail($id);
    }

    /**
     * Mettre à jour un lotissement
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $lotissement = Lotissement::findOrFail($id);
        $lotissement->update($donnees);
        
        return $lotissement->fresh(['tenant', 'parcelles']);
    }

    /**
     * Supprimer un lotissement
     */
    public function supprimer(int $id)
    {
        $lotissement = Lotissement::findOrFail($id);
        $lotissement->delete();
        
        return true;
    }
}
