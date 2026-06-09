<?php
/**
 * Ultraprint Recargas — Deploy Hook
 * Chamado automaticamente pelo GitHub Actions após o FTP deploy.
 * Protegido pelo DEPLOY_TOKEN configurado no .env de produção.
 *
 * Responsabilidades:
 *  1. Extrai o vendor.zip para criar a pasta vendor/
 *  2. Roda as migrations do banco de dados
 *  3. Gera o cache de config e rotas do Laravel
 *
 * Uso: https://api.ultraprintrecargas.com.br/deploy-hook.php?token=SEU_DEPLOY_TOKEN
 */

// ── Segurança ────────────────────────────────────────────────────────────────
// Lê o .env manualmente para não depender do Laravel (que pode não estar pronto)
$envFile = dirname(__DIR__) . '/.env';
$deployToken = '';

if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), 'DEPLOY_TOKEN=')) {
            $deployToken = trim(explode('=', $line, 2)[1]);
            break;
        }
    }
}

$providedToken = $_GET['token'] ?? '';

if (empty($deployToken) || !hash_equals($deployToken, $providedToken)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Forbidden — token inválido ou ausente.']);
    exit;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
$results = [];
$rootDir = dirname(__DIR__);
$php     = PHP_BINARY;
$artisan = $rootDir . '/artisan';

function runCommand(string $cmd, string $label, array &$results): bool {
    $output   = [];
    $exitCode = 0;
    exec($cmd . ' 2>&1', $output, $exitCode);
    $results[] = [
        'step'    => $label,
        'output'  => implode("\n", $output),
        'success' => $exitCode === 0,
    ];
    return $exitCode === 0;
}

// ── Passo 1: Extrair vendor.zip ───────────────────────────────────────────────
$vendorZip = $rootDir . '/vendor.zip';
if (file_exists($vendorZip)) {
    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($vendorZip) === true) {
            $zip->extractTo($rootDir);
            $zip->close();
            unlink($vendorZip); // remove o zip após extrair
            $results[] = ['step' => 'extract vendor.zip', 'output' => 'vendor/ extraído com sucesso.', 'success' => true];
        } else {
            $results[] = ['step' => 'extract vendor.zip', 'output' => 'ERRO: não foi possível abrir vendor.zip.', 'success' => false];
        }
    } else {
        // fallback via unzip CLI
        runCommand("unzip -o $vendorZip -d $rootDir", 'extract vendor.zip (cli)', $results);
        if (file_exists($vendorZip)) unlink($vendorZip);
    }
} else {
    $results[] = ['step' => 'extract vendor.zip', 'output' => 'vendor.zip não encontrado — pulando (vendor já pode existir).', 'success' => true];
}

// Verifica se o artisan existe e o autoloader foi criado
if (!file_exists($artisan) || !file_exists($rootDir . '/vendor/autoload.php')) {
    http_response_code(500);
    header('Content-Type: application/json');
    $results[] = ['step' => 'sanity-check', 'output' => 'ERRO: artisan ou vendor/autoload.php não encontrado. O deploy pode ter falhado.', 'success' => false];
    echo json_encode(['status' => 'error', 'results' => $results], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Passo 2: Migrations ───────────────────────────────────────────────────────
runCommand("$php $artisan migrate --force", 'php artisan migrate --force', $results);

// ── Passo 3: Seed (apenas se for primeira vez — tabela users vazia) ───────────
$results[] = ['step' => 'db:seed', 'output' => 'Seed ignorado — rode manualmente se necessário.', 'success' => true];

// ── Passo 4: Cache de config e rotas ─────────────────────────────────────────
runCommand("$php $artisan config:clear",  'php artisan config:clear',  $results);
runCommand("$php $artisan config:cache",  'php artisan config:cache',  $results);
runCommand("$php $artisan route:clear",   'php artisan route:clear',   $results);
runCommand("$php $artisan route:cache",   'php artisan route:cache',   $results);

// ── Resposta final ────────────────────────────────────────────────────────────
$allOk = array_reduce($results, fn($carry, $r) => $carry && $r['success'], true);

header('Content-Type: application/json');
http_response_code($allOk ? 200 : 207);
echo json_encode([
    'status'  => $allOk ? 'ok' : 'partial',
    'results' => $results,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
