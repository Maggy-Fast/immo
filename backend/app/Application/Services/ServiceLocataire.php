<?php

namespace App\Application\Services;

use App\Domaine\Entities\Locataire;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des locataires
 */
class ServiceLocataire
{
    /**
     * Lister tous les locataires
     */
    public function lister()
    {
        return Locataire::with('tenant')->paginate(15);
    }

    /**
     * Créer un nouveau locataire
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        return Locataire::create($donnees);
    }

    /**
     * Obtenir un locataire par ID
     */
    public function obtenirParId(int $id)
    {
        return Locataire::with('tenant')->findOrFail($id);
    }

    /**
     * Mettre à jour un locataire
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $locataire = Locataire::findOrFail($id);
        $locataire->update($donnees);
        
        return $locataire->fresh('tenant');
    }

    /**
     * Supprimer un locataire
     */
    public function supprimer(int $id)
    {
        $locataire = Locataire::findOrFail($id);
        $locataire->delete();
        
        return true;
    }
}
