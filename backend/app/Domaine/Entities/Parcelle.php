<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Parcelle extends Model
{
    use MultiTenancy;

    protected $table = 'parcelles';

    protected $fillable = [
        'id_tenant',
        'id_lotissement',
        'numero',
        'superficie',
        'prix',
        'statut',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function lotissement(): BelongsTo
    {
        return $this->belongsTo(Lotissement::class, 'id_lotissement');
    }
}
