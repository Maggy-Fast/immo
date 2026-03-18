<?php

namespace App\Domaine\Entities;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreferencesUtilisateur extends Model
{
    use HasFactory;

    protected $table = 'preferences_utilisateur';

    protected $fillable = [
        'id_utilisateur',
        'theme',
        'langue',
        'notifications_email',
        'notifications_whatsapp',
        'format_date',
        'devise',
    ];

    protected $casts = [
        'notifications_email' => 'boolean',
        'notifications_whatsapp' => 'boolean',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}
