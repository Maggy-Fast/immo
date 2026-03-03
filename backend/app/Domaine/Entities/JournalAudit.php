<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JournalAudit extends Model
{
    use MultiTenancy;

    protected $table = 'journaux_audit';

    protected $fillable = [
        'id_tenant',
        'id_utilisateur',
        'action',
        'table_concernee',
        'id_enregistrement',
        'details',
        'adresse_ip',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}
