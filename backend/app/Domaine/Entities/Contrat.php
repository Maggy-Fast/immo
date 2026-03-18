<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contrat extends Model
{
    use MultiTenancy;

    protected $table = 'contrats';

    protected $fillable = [
        'id_tenant',
        'id_bien',
        'id_locataire',
        'date_debut',
        'date_fin',
        'loyer_mensuel',
        'caution',
        'statut',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'loyer_mensuel' => 'decimal:2',
        'caution' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function bien(): BelongsTo
    {
        return $this->belongsTo(Bien::class, 'id_bien');
    }

    public function locataire(): BelongsTo
    {
        return $this->belongsTo(Locataire::class, 'id_locataire');
    }

    public function loyers(): HasMany
    {
        return $this->hasMany(Loyer::class, 'id_contrat');
    }

    // Accesseurs pour transformer en camelCase (frontend)
    public function getDateDebutAttribute()
    {
        return $this->attributes['date_debut'] ?? null;
    }

    public function getDateFinAttribute()
    {
        return $this->attributes['date_fin'] ?? null;
    }

    public function getLoyerMensuelAttribute()
    {
        return $this->attributes['loyer_mensuel'] ?? 0;
    }

    public function getCautionAttribute()
    {
        return $this->attributes['caution'] ?? 0;
    }

    // Surcharger toArray pour inclure les attributs camelCase
    public function toArray()
    {
        $array = parent::toArray();
        
        // Ajouter les versions camelCase
        $array['dateDebut'] = $this->getDateDebutAttribute();
        $array['dateFin'] = $this->getDateFinAttribute();
        $array['loyerMensuel'] = $this->getLoyerMensuelAttribute();
        $array['caution'] = $this->getCautionAttribute();
        
        return $array;
    }
}
