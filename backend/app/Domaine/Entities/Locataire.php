<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Locataire extends Model
{
    use MultiTenancy;

    protected $table = 'locataires';

    protected $fillable = [
        'id_tenant',
        'nom',
        'telephone',
        'email',
        'cin',
        'profession',
        'photo',
        'id_utilisateur',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function contrats(): HasMany
    {
        return $this->hasMany(Contrat::class, 'id_locataire');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}
