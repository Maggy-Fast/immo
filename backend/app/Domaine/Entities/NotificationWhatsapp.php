<?php

namespace App\Domaine\Entities;

use App\Domaine\MultiTenancy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationWhatsapp extends Model
{
    use MultiTenancy;

    protected $table = 'notifications_whatsapp';

    protected $fillable = [
        'id_tenant',
        'id_adherent',
        'type',
        'message',
        'telephone',
        'statut',
        'date_envoi',
        'erreur',
    ];

    protected $casts = [
        'date_envoi' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'id_tenant');
    }

    public function adherent(): BelongsTo
    {
        return $this->belongsTo(Adherent::class, 'id_adherent');
    }
}
