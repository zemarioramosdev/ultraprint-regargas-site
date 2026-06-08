<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Usuários no banco: " . \App\Models\User::count() . "\n";
$users = \App\Models\User::all(['name', 'email']);
foreach ($users as $u) {
    echo "- " . $u->name . " (" . $u->email . ")\n";
}