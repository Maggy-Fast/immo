<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Tâche planifiée pour vérifier les retards de cotisations
Schedule::command('cooperative:verifier-retards')
    ->dailyAt('06:00')
    ->description('Vérifier et marquer les échéances en retard');

// Tâche planifiée pour traiter les notifications WhatsApp
Schedule::command('whatsapp:traiter-notifications')
    ->everyFiveMinutes()
    ->description('Traiter la file d\'attente des notifications WhatsApp')
    ->withoutOverlapping();

// Tâche planifiée pour envoyer les rappels automatiques
Schedule::command('whatsapp:envoyer-rappels --days=3')
    ->dailyAt('09:00')
    ->description('Envoyer les rappels WhatsApp 3 jours avant échéance')
    ->withoutOverlapping();
