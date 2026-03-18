<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

// Lister les tables
$tables = Illuminate\Support\Facades\DB::select('SELECT name FROM sqlite_master WHERE type="table"');
foreach ($tables as $table) {
    if (str_contains($table->name, 'notification')) {
        echo $table->name . PHP_EOL;
    }
}
