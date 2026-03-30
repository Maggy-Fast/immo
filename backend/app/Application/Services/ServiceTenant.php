<?php

namespace App\Application\Services;

use App\Domaine\Entities\Tenant;
use App\Domaine\Entities\Utilisateur;
use App\Domaine\Entities\Role;
use App\Mail\BienvenueTenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class ServiceTenant
{
    public function listerTenants()
    {
        return Tenant::with(['plan'])->withCount(['utilisateurs', 'biens'])->get();
    }

    public function obtenirTenant(int $id)
    {
        $tenant = Tenant::with(['plan'])->find($id);
        if (!$tenant) {
            throw new Exception("Tenant non trouvé");
        }
        return $tenant;
    }

    public function creerTenant(array $donnees)
    {
        return DB::transaction(function () use ($donnees) {
            // 1. Créer le tenant
            $tenant = Tenant::create([
                'nom' => $donnees['nom'],
                'domaine' => $donnees['domaine'] ?? null,
                'id_plan' => $donnees['id_plan'] ?? null,
                'actif' => $donnees['actif'] ?? true,
            ]);

            // 2. Récupérer le rôle admin (Tenant)
            $roleAdmin = Role::where('nom', 'admin')->first();
            if (!$roleAdmin) {
                throw new Exception("Le rôle 'admin' n'existe pas dans le système.");
            }

            // 3. Créer l'utilisateur administrateur
            Utilisateur::create([
                'id_tenant' => $tenant->id,
                'id_role' => $roleAdmin->id,
                'nom' => $donnees['admin_nom'],
                'email' => $donnees['email'],
                'password' => Hash::make($donnees['admin_password']),
                'role' => 'admin',
            ]);

            // 4. Envoyer l'email de bienvenue
            try {
                Mail::to($donnees['email'])->send(new BienvenueTenant(
                    $donnees['nom'],
                    $donnees['email'],
                    $donnees['admin_password']
                ));
            } catch (Exception $e) {
                Log::error("Erreur envoi email bienvenue : " . $e->getMessage());
            }

            return $tenant;
        });
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
