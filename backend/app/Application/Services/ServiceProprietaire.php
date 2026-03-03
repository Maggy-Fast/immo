<?php

namespace App\Application\Services;

use App\Domaine\Entities\Proprietaire;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des propriétaires
 */
class ServiceProprietaire
{
    /**
     * Lister tous les propriétaires
     */
    public function lister()
    {
        return Proprietaire::with('tenant')->paginate(15);
    }

    /**
     * Créer un nouveau propriétaire
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        return Proprietaire::create($donnees);
    }

    /**
     * Obtenir un propriétaire par ID
     */
    public function obtenirParId(int $id)
    {
        return Proprietaire::with('tenant')->findOrFail($id);
    }

    /**
     * Mettre à jour un propriétaire
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $proprietaire->update($donnees);
        
        return $proprietaire->fresh('tenant');
    }

    /**
     * Supprimer un propriétaire
     */
    public function supprimer(int $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $proprietaire->delete();
        
        return true;
    }
}
