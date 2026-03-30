<?php

namespace App\Domaine\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $table = 'tenants';
    protected $fillable = ['nom', 'domaine', 'id_plan', 'actif'];

    public function plan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Plan::class, 'id_plan');
    }

    public function utilisateurs(): HasMany
    {
        return $this->hasMany(Utilisateur::class, 'id_tenant');
    }

    public function biens(): HasMany
    {
        return $this->hasMany(Bien::class, 'id_tenant');
    }
}
