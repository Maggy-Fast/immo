use App\Domaine\Entities\NotificationWhatsapp;

$notifications = NotificationWhatsapp::where('statut', 'en_attente')->get();

foreach ($notifications as $notification) {
    echo sprintf(
        "ID: %d | Tel: %s | Adherent: %d | Type: %s" . PHP_EOL,
        $notification->id,
        $notification->telephone,
        $notification->id_adherent,
        $notification->type
    );
}

echo "Total: " . count($notifications) . " notifications en attente" . PHP_EOL;
