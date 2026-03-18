<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Adherent extends Model
{
    use MultiTenancy;

    protected $table = 'adherents';

    protected $fillable = [
        'id_tenant',
        'id_groupe',
        'numero',
        'nom',
        'prenom',
        'cin',
        'telephone',
        'email',
        'adresse',
        'date_adhesion',
        'statut',
        'echeances_en_retard',
        'photo',
    ];

    protected $casts = [
        'date_adhesion' => 'date',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(GroupeCooperative::class, 'id_groupe');
    }

    public function echeances(): HasMany
    {
        return $this->hasMany(Echeance::class, 'id_adherent');
    }

    public function parcelleAttribuee(): HasOne
    {
        return $this->hasOne(ParcelleCooperative::class, 'id_adherent');
    }

    public function parcellesCooperative(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(ParcelleCooperative::class, 'attributions_parcelles', 'id_adherent', 'id_parcelle')
            ->withPivot('pourcentage_possession', 'date_attribution')
            ->withTimestamps();
    }

    public function historiqueAttributions(): HasMany
    {
        return $this->hasMany(HistoriqueAttribution::class, 'id_adherent');
    }
}
