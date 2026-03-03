<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Loyer extends Model
{
    use MultiTenancy;

    protected $table = 'loyers';

    protected $fillable = [
        'id_tenant',
        'id_contrat',
        'mois',
        'montant',
        'statut',
        'mode_paiement',
        'date_paiement',
    ];

    protected $casts = [
        'date_paiement' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function contrat(): BelongsTo
    {
        return $this->belongsTo(Contrat::class, 'id_contrat');
    }

    public function quittance(): HasOne
    {
        return $this->hasOne(Quittance::class, 'id_loyer');
    }
}
