<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueAttribution extends Model
{
    use MultiTenancy;

    protected $table = 'historique_attributions';

    protected $fillable = [
        'id_tenant',
        'id_parcelle',
        'id_adherent',
        'date_attribution',
        'date_retrait',
        'motif',
    ];

    protected $casts = [
        'date_attribution' => 'date',
        'date_retrait' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function parcelle(): BelongsTo
    {
        return $this->belongsTo(ParcelleCooperative::class, 'id_parcelle');
    }

    public function adherent(): BelongsTo
    {
        return $this->belongsTo(Adherent::class, 'id_adherent');
    }
}
