<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Table des rôles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->string('libelle');
            $table->text('description')->nullable();
            $table->boolean('systeme')->default(false); // Rôles système non modifiables
            $table->timestamps();
        });

        // Table des permissions
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->string('libelle');
            $table->string('module'); // adherents, cotisations, parcelles, etc.
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Table pivot role_permission
        Schema::create('role_permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_role')->constrained('roles')->onDelete('cascade');
            $table->foreignId('id_permission')->constrained('permissions')->onDelete('cascade');
            $table->timestamps();
            
            $table->unique(['id_role', 'id_permission']);
        });

        // Modifier la table utilisateurs pour utiliser id_role
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->foreignId('id_role')->nullable()->after('password')->constrained('roles')->onDelete('set null');
        });

        // Insérer les rôles par défaut
        $roles = [
            ['nom' => 'super_admin', 'libelle' => 'Super Administrateur', 'description' => 'Accès complet au système', 'systeme' => true],
            ['nom' => 'admin', 'libelle' => 'Administrateur', 'description' => 'Gestion opérationnelle complète', 'systeme' => true],
            ['nom' => 'gestionnaire', 'libelle' => 'Gestionnaire', 'description' => 'Gestion et consultation', 'systeme' => true],
            ['nom' => 'agent', 'libelle' => 'Agent', 'description' => 'Consultation uniquement', 'systeme' => true],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->insert(array_merge($role, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Insérer les permissions par défaut
        $permissions = [
            // Adhérents
            ['nom' => 'adherents.voir', 'libelle' => 'Voir les adhérents', 'module' => 'adherents'],
            ['nom' => 'adherents.creer', 'libelle' => 'Créer un adhérent', 'module' => 'adherents'],
            ['nom' => 'adherents.modifier', 'libelle' => 'Modifier un adhérent', 'module' => 'adherents'],
            ['nom' => 'adherents.supprimer', 'libelle' => 'Supprimer un adhérent', 'module' => 'adherents'],
            
            // Cotisations
            ['nom' => 'cotisations.voir', 'libelle' => 'Voir les cotisations', 'module' => 'cotisations'],
            ['nom' => 'cotisations.creer', 'libelle' => 'Créer une cotisation', 'module' => 'cotisations'],
            ['nom' => 'cotisations.modifier', 'libelle' => 'Modifier une cotisation', 'module' => 'cotisations'],
            ['nom' => 'cotisations.parametres', 'libelle' => 'Gérer les paramètres', 'module' => 'cotisations'],
            
            // Parcelles
            ['nom' => 'parcelles.voir', 'libelle' => 'Voir les parcelles', 'module' => 'parcelles'],
            ['nom' => 'parcelles.creer', 'libelle' => 'Créer une parcelle', 'module' => 'parcelles'],
            ['nom' => 'parcelles.modifier', 'libelle' => 'Modifier une parcelle', 'module' => 'parcelles'],
            ['nom' => 'parcelles.supprimer', 'libelle' => 'Supprimer une parcelle', 'module' => 'parcelles'],
            ['nom' => 'parcelles.attribuer', 'libelle' => 'Attribuer une parcelle', 'module' => 'parcelles'],
            
            // Utilisateurs
            ['nom' => 'utilisateurs.voir', 'libelle' => 'Voir les utilisateurs', 'module' => 'utilisateurs'],
            ['nom' => 'utilisateurs.creer', 'libelle' => 'Créer un utilisateur', 'module' => 'utilisateurs'],
            ['nom' => 'utilisateurs.modifier', 'libelle' => 'Modifier un utilisateur', 'module' => 'utilisateurs'],
            ['nom' => 'utilisateurs.supprimer', 'libelle' => 'Supprimer un utilisateur', 'module' => 'utilisateurs'],
            
            // Rôles et Permissions (super_admin uniquement)
            ['nom' => 'roles.voir', 'libelle' => 'Voir les rôles', 'module' => 'roles'],
            ['nom' => 'roles.creer', 'libelle' => 'Créer un rôle', 'module' => 'roles'],
            ['nom' => 'roles.modifier', 'libelle' => 'Modifier un rôle', 'module' => 'roles'],
            ['nom' => 'roles.supprimer', 'libelle' => 'Supprimer un rôle', 'module' => 'roles'],
            ['nom' => 'permissions.gerer', 'libelle' => 'Gérer les permissions', 'module' => 'roles'],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->insert(array_merge($permission, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // Attribuer toutes les permissions au super_admin
        $superAdminId = DB::table('roles')->where('nom', 'super_admin')->value('id');
        $allPermissions = DB::table('permissions')->pluck('id');
        
        foreach ($allPermissions as $permissionId) {
            DB::table('role_permission')->insert([
                'id_role' => $superAdminId,
                'id_permission' => $permissionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Attribuer permissions à admin (tout sauf gestion des rôles)
        $adminId = DB::table('roles')->where('nom', 'admin')->value('id');
        $adminPermissions = DB::table('permissions')
            ->where('module', '!=', 'roles')
            ->pluck('id');
        
        foreach ($adminPermissions as $permissionId) {
            DB::table('role_permission')->insert([
                'id_role' => $adminId,
                'id_permission' => $permissionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Attribuer permissions à gestionnaire (voir et modifier, pas supprimer)
        $gestionnaireId = DB::table('roles')->where('nom', 'gestionnaire')->value('id');
        $gestionnairePermissions = DB::table('permissions')
            ->where('module', '!=', 'roles')
            ->where('nom', 'not like', '%.supprimer')
            ->pluck('id');
        
        foreach ($gestionnairePermissions as $permissionId) {
            DB::table('role_permission')->insert([
                'id_role' => $gestionnaireId,
                'id_permission' => $permissionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Attribuer permissions à agent (voir uniquement)
        $agentId = DB::table('roles')->where('nom', 'agent')->value('id');
        $agentPermissions = DB::table('permissions')
            ->where('nom', 'like', '%.voir')
            ->pluck('id');
        
        foreach ($agentPermissions as $permissionId) {
            DB::table('role_permission')->insert([
                'id_role' => $agentId,
                'id_permission' => $permissionId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Mettre à jour les utilisateurs existants avec role='admin' vers super_admin
        DB::table('utilisateurs')
            ->where('role', 'admin')
            ->update(['id_role' => $superAdminId]);
    }

    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->dropForeign(['id_role']);
            $table->dropColumn('id_role');
        });
        
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
