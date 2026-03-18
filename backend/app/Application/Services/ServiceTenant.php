<?php

namespace App\Application\Services;

use App\Domaine\Entities\Tenant;
use Exception;

class ServiceTenant
{
    public function listerTenants()
    {
        return Tenant::withCount(['utilisateurs', 'biens'])->get();
    }

    public function obtenirTenant(int $id)
    {
        $tenant = Tenant::find($id);
        if (!$tenant) {
            throw new Exception("Tenant non trouvé");
        }
        return $tenant;
    }

    public function creerTenant(array $donnees)
    {
        return Tenant::create([
            'nom' => $donnees['nom'],
            'domaine' => $donnees['domaine'] ?? null,
            'plan' => $donnees['plan'] ?? 'gratuit',
            'actif' => $donnees['actif'] ?? true,
        ]);
    }

    public function modifierTenant(int $id, array $donnees)
    {
        $tenant = $this->obtenirTenant($id);
        $tenant->update($donnees);
        return $tenant;
    }

    public function supprimerTenant(int $id)
    {
        $tenant = $this->obtenirTenant($id);
        // On pourrait ajouter des vérifications ici (ex: ne pas supprimer si des données existent)
        return $tenant->delete();
    }

    public function changerStatut(int $id, bool $actif)
    {
        $tenant = $this->obtenirTenant($id);
        $tenant->actif = $actif;
        $tenant->save();
        return $tenant;
    }
}
