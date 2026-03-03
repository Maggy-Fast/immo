<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lotissement extends Model
{
    use MultiTenancy;

    protected $table = 'lotissements';

    protected $fillable = [
        'id_tenant',
        'nom',
        'localisation',
        'superficie_totale',
        'nombre_parcelles',
        'latitude',
        'longitude',
        'statut',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function parcelles(): HasMany
    {
        return $this->hasMany(Parcelle::class, 'id_lotissement');
    }

    public function partenariats(): HasMany
    {
        return $this->hasMany(Partenariat::class, 'id_lotissement');
    }
}
