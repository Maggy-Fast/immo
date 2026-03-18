<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Depense extends Model
{
    use MultiTenancy;

    protected $table = 'depenses';

    protected $fillable = [
        'id_tenant',
        'id_bien',
        'id_travaux',
        'intitule',
        'description',
        'montant',
        'date_depense',
        'type_depense',
        'statut_paiement',
        'fichier_facture',
    ];

    protected $casts = [
        'date_depense' => 'date',
        'montant' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function bien(): BelongsTo
    {
        return $this->belongsTo(Bien::class, 'id_bien');
    }

    public function travaux(): BelongsTo
    {
        return $this->belongsTo(Travaux::class, 'id_travaux');
    }
}
