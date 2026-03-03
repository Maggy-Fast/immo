<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commission extends Model
{
    use MultiTenancy;

    protected $table = 'commissions';

    protected $fillable = [
        'id_tenant',
        'id_contrat',
        'montant',
        'statut',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function contrat(): BelongsTo
    {
        return $this->belongsTo(Contrat::class, 'id_contrat');
    }
}
