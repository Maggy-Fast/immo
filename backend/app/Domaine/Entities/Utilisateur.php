<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, Notifiable, MultiTenancy;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'id_tenant',
        'nom',
        'email',
        'password',
        'role',
        'id_role',
        'telephone',
        'photo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function roleEntity(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'id_role');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roleEntity && $this->roleEntity->hasPermission($permission);
    }

    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    public function isSuperAdmin(): bool
    {
        return $this->roleEntity && $this->roleEntity->nom === 'super_admin';
    }

    public function preferences()
    {
        return $this->hasOne(PreferencesUtilisateur::class, 'id_utilisateur');
    }
}
