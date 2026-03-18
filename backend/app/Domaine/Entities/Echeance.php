<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Echeance extends Model
{
    use MultiTenancy;

    protected $table = 'echeances';

    protected $fillable = [
        'id_tenant',
        'id_groupe',
        'id_adherent',
        'id_parametre',
        'date_echeance',
        'montant',
        'statut',
        'date_paiement',
        'montant_paye',
        'penalite',
        'mode_paiement',
        'reference_paiement',
    ];

    protected $casts = [
        'date_echeance' => 'date',
        'date_paiement' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(GroupeCooperative::class, 'id_groupe');
    }

    public function adherent(): BelongsTo
    {
        return $this->belongsTo(Adherent::class, 'id_adherent');
    }

    public function parametre(): BelongsTo
    {
        return $this->belongsTo(ParametreCotisation::class, 'id_parametre');
    }
}
