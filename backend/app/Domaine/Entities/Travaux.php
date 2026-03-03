<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Travaux extends Model
{
    use MultiTenancy;

    protected $table = 'travaux';

    protected $fillable = [
        'id_tenant',
        'id_bien',
        'intitule',
        'description',
        'montant_estime',
        'date_debut',
        'date_fin',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function bien(): BelongsTo
    {
        return $this->belongsTo(Bien::class, 'id_bien');
    }
}
