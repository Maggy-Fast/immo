<?php

namespace App\Domaine\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $table = 'plans';
    
    protected $fillable = [
        'nom',
        'slug',
        'prix',
        'duree_mois',
        'description',
        'actif'
    ];

    /**
     * Tenants having this plan
     */
    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class, 'id_plan');
    }
}
