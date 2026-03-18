<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParametreCotisation extends Model
{
    use MultiTenancy;

    protected $table = 'parametres_cotisation';

    protected $fillable = [
        'id_tenant',
        'id_groupe',
        'montant',
        'frequence',
        'jour_echeance',
        'date_debut',
        'periode_grace_jours',
        'max_echeances_retard',
        'pourcentage_penalite',
        'montant_penalite_fixe',
        'mode_penalite',
        'actif',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'actif' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(GroupeCooperative::class, 'id_groupe');
    }
}
