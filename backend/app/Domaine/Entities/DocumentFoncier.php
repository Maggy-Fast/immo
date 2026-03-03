<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentFoncier extends Model
{
    use MultiTenancy;

    protected $table = 'documents_fonciers';

    protected $fillable = [
        'id_tenant',
        'id_bien',
        'titre',
        'type',
        'chemin_fichier',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function bien(): BelongsTo
    {
        return $this->belongsTo(Bien::class, 'id_bien');
    }
}
