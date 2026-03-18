<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupeCooperative extends Model
{
    use MultiTenancy;

    protected $table = 'groupes_cooperative';

    protected $fillable = [
        'id_tenant',
        'nom',
        'description',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function adherents(): HasMany
    {
        return $this->hasMany(Adherent::class, 'id_groupe');
    }

    public function parcelles(): HasMany
    {
        return $this->hasMany(ParcelleCooperative::class, 'id_groupe');
    }

    public function parametresCotisation(): HasMany
    {
        return $this->hasMany(ParametreCotisation::class, 'id_groupe');
    }
}
