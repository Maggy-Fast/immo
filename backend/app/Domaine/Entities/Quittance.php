<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quittance extends Model
{
    use MultiTenancy;

    protected $table = 'quittances';

    protected $fillable = [
        'id_tenant',
        'id_loyer',
        'numero_quittance',
        'chemin_pdf',
        'generee_le',
    ];

    protected $casts = [
        'generee_le' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function loyer(): BelongsTo
    {
        return $this->belongsTo(Loyer::class, 'id_loyer');
    }
}
