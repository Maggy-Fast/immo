<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DepensePartenariat extends Model
{
    use MultiTenancy;

    protected $table = 'depenses_partenariat';

    protected $fillable = [
        'id_tenant',
        'id_partenariat',
        'description',
        'montant',
        'date',
        'piece_jointe',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function partenariat(): BelongsTo
    {
        return $this->belongsTo(Partenariat::class, 'id_partenariat');
    }
}
