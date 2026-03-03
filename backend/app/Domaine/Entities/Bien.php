<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bien extends Model
{
    use MultiTenancy;

    protected $table = 'biens';

    protected $fillable = [
        'id_tenant',
        'id_proprietaire',
        'type',
        'adresse',
        'superficie',
        'prix',
        'statut',
        'latitude',
        'longitude',
        'description',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire');
    }
}
