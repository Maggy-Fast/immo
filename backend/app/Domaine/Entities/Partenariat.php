<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partenariat extends Model
{
    use MultiTenancy;

    protected $table = 'partenariats';

    protected $fillable = [
        'id_tenant',
        'id_lotissement',
        'id_promoteur',
        'id_proprietaire',
        'ticket_entree',
        'pourcentage_promoteur',
        'pourcentage_proprietaire',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function lotissement(): BelongsTo
    {
        return $this->belongsTo(Lotissement::class, 'id_lotissement');
    }

    public function promoteur(): BelongsTo
    {
        return $this->belongsTo(Promoteur::class, 'id_promoteur');
    }

    public function proprietaire(): BelongsTo
    {
        return $this->belongsTo(Proprietaire::class, 'id_proprietaire');
    }
}
