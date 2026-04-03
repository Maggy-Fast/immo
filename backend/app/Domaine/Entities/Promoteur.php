<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promoteur extends Model
{
    use MultiTenancy;

    protected $table = 'promoteurs';

    protected $fillable = [
        'id_tenant',
        'nom',
        'telephone',
        'email',
        'adresse',
        'cin',
        'photo',
        'id_utilisateur',
        'licence',
        'registre_commerce',
        'statut_juridique',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function partenariats(): HasMany
    {
        return $this->hasMany(Partenariat::class, 'id_promoteur');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'id_utilisateur');
    }
}
