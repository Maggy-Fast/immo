<?php

namespace App\Application\Services;

use App\Domaine\Entities\Plan;
use Illuminate\Support\Str;
use Exception;

class ServicePlan
{
    public function listerPlans()
    {
        return Plan::withCount('tenants')->get();
    }

    public function obtenirPlan(int $id): Plan
    {
        $plan = Plan::find($id);
        if (!$plan) {
            throw new Exception("Plan non trouvé");
        }
        return $plan;
    }

    public function creerPlan(array $donnees)
    {
        return Plan::create([
            'nom' => $donnees['nom'],
            'slug' => $donnees['slug'] ?? Str::slug($donnees['nom']),
            'prix' => $donnees['prix'] ?? 0,
            'duree_mois' => $donnees['duree_mois'] ?? 12,
            'description' => $donnees['description'] ?? null,
            'actif' => $donnees['actif'] ?? true,
        ]);
    }

    public function modifierPlan(int $id, array $donnees)
    {
        $plan = $this->obtenirPlan($id);
        
        if (isset($donnees['nom']) && !isset($donnees['slug'])) {
            $donnees['slug'] = Str::slug($donnees['nom']);
        }
        
        $plan->update($donnees);
        return $plan;
    }

    public function supprimerPlan(int $id)
    {
        $plan = $this->obtenirPlan($id);
        
        if ($plan->tenants()->count() > 0) {
            throw new Exception("Impossible de supprimer ce plan car il est utilisé par des tenants.");
        }
        
        return $plan->delete();
    }
}
