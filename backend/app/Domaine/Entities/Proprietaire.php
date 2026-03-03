<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proprietaire extends Model
{
    use MultiTenancy;

    protected $table = 'proprietaires';

    protected $fillable = [
        'id_tenant',
        'nom',
        'telephone',
        'email',
        'adresse',
        'cin',
        'id_utilisateur',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function biens(): HasMany
    {
        return $this->hasMany(Bien::class, 'id_proprietaire');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}
