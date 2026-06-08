<?php

try {
    $pdo = new PDO('pgsql:host=127.0.0.1;port=5433;dbname=ultraprint_recargas', 'postgres', '1234567');
    echo "Database connection successful!\n";
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}