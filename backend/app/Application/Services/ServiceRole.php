<?php

namespace App\Application\Services;

use App\Domaine\Entities\Role;
use App\Domaine\Entities\Permission;
use Illuminate\Support\Facades\DB;
use Exception;

class ServiceRole
{
    public function listerRoles()
    {
        return Role::with(['permissions', 'utilisateurs'])->get();
    }

    public function obtenirRole(int $id)
    {
        $role = Role::with(['permissions', 'utilisateurs'])->find($id);
        
        if (!$role) {
            throw new Exception("Rôle non trouvé");
        }
        
        return $role;
    }

    public function creerRole(array $donnees)
    {
        DB::beginTransaction();
        try {
            $role = Role::create([
                'nom' => $donnees['nom'],
                'libelle' => $donnees['libelle'],
                'description' => $donnees['description'] ?? null,
                'systeme' => false,
            ]);

            if (isset($donnees['permissions']) && is_array($donnees['permissions'])) {
                $role->permissions()->sync($donnees['permissions']);
            }

            DB::commit();
            return $role->load('permissions');
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function modifierRole(int $id, array $donnees)
    {
        DB::beginTransaction();
        try {
            $role = Role::find($id);
            
            if (!$role) {
                throw new Exception("Rôle non trouvé");
            }

            if ($role->systeme) {
                throw new Exception("Les rôles système ne peuvent pas être modifiés");
            }

            $role->update([
                'nom' => $donnees['nom'] ?? $role->nom,
                'libelle' => $donnees['libelle'] ?? $role->libelle,
                'description' => $donnees['description'] ?? $role->description,
            ]);

            if (isset($donnees['permissions']) && is_array($donnees['permissions'])) {
                $role->permissions()->sync($donnees['permissions']);
            }

            DB::commit();
            return $role->load('permissions');
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function supprimerRole(int $id)
    {
        $role = Role::find($id);
        
        if (!$role) {
            throw new Exception("Rôle non trouvé");
        }

        if ($role->systeme) {
            throw new Exception("Les rôles système ne peuvent pas être supprimés");
        }

        if ($role->utilisateurs()->count() > 0) {
            throw new Exception("Ce rôle est assigné à des utilisateurs et ne peut pas être supprimé");
        }

        $role->permissions()->detach();
        $role->delete();

        return true;
    }

    public function assignerPermissions(int $idRole, array $permissions)
    {
        $role = Role::find($idRole);
        
        if (!$role) {
            throw new Exception("Rôle non trouvé");
        }

        $role->permissions()->sync($permissions);
        
        return $role->load('permissions');
    }

    public function listerPermissions()
    {
        return Permission::all()->groupBy('module');
    }

    public function obtenirPermissionsRole(int $idRole)
    {
        $role = Role::with('permissions')->find($idRole);
        
        if (!$role) {
            throw new Exception("Rôle non trouvé");
        }
        
        return $role->permissions;
    }
}
