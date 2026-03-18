<?php

namespace App\Domaine\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $table = 'roles';

    protected $fillable = [
        'nom',
        'libelle',
        'description',
        'systeme',
    ];

    protected $casts = [
        'systeme' => 'boolean',
    ];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'role_permission',
            'id_role',
            'id_permission'
        )->withTimestamps();
    }

    public function utilisateurs(): HasMany
    {
        return $this->hasMany(Utilisateur::class, 'id_role');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('nom', $permission)->exists();
    }

    public function hasAnyPermission(array $permissions): bool
    {
        return $this->permissions()->whereIn('nom', $permissions)->exists();
    }

    public function hasAllPermissions(array $permissions): bool
    {
        return $this->permissions()->whereIn('nom', $permissions)->count() === count($permissions);
    }
}
