<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contrat extends Model
{
    use MultiTenancy;

    protected $table = 'contrats';

    protected $fillable = [
        'id_tenant',
        'id_bien',
        'id_locataire',
        'date_debut',
        'date_fin',
        'loyer_mensuel',
        'caution',
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

    public function locataire(): BelongsTo
    {
        return $this->belongsTo(Locataire::class, 'id_locataire');
    }

    public function loyers(): HasMany
    {
        return $this->hasMany(Loyer::class, 'id_contrat');
    }
}
