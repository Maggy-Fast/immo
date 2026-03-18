<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParcelleCooperative extends Model
{
    use MultiTenancy;

    protected $table = 'parcelles_cooperative';

    protected $fillable = [
        'id_tenant',
        'id_groupe',
        'numero',
        'surface',
        'prix',
        'statut',
        'id_adherent',
        'date_attribution',
        'description',
        'latitude',
        'longitude',
        'photo',
    ];

    protected $casts = [
        'date_attribution' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(GroupeCooperative::class, 'id_groupe');
    }

    public function adherent(): BelongsTo
    {
        return $this->belongsTo(Adherent::class, 'id_adherent');
    }

    public function adherents(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Adherent::class, 'attributions_parcelles', 'id_parcelle', 'id_adherent')
            ->withPivot('pourcentage_possession', 'date_attribution')
            ->withTimestamps();
    }

    public function historique(): HasMany
    {
        return $this->hasMany(HistoriqueAttribution::class, 'id_parcelle');
    }
}
