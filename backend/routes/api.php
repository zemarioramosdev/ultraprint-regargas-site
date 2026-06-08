<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdutoController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\AgendamentoController;
use App\Http\Controllers\Api\MensagemController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\MarketingController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/chat/public', [MensagemController::class, 'sendPublic']);
Route::post('/agendamentos/public', [AgendamentoController::class, 'storePublic']);
Route::get('/produtos/public', [ProdutoController::class, 'indexPublic']);
Route::get('/banners/public', [BannerController::class, 'indexPublic']);
Route::post('/marketing/events/public', [MarketingController::class, 'storePublic']);
Route::post('/esqueci-senha/enviar', [AuthController::class, 'sendResetCode']);
Route::post('/esqueci-senha/redefinir', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/upload', [UploadController::class, 'upload']);

    Route::get('/marketing/events', [MarketingController::class, 'index']);
    Route::get('/google-ads/campaigns', [MarketingController::class, 'getGoogleAdsCampaigns']);
    Route::get('/google-ads/keywords', [MarketingController::class, 'getGoogleAdsKeywords']);
    Route::get('/search-console/performance', [MarketingController::class, 'getSearchConsolePerformance']);

    Route::put('/produtos/{id}/imagens/reorder', [ProdutoController::class, 'reorderImages']);
    Route::apiResource('produtos', ProdutoController::class);
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('pedidos', PedidoController::class);
    Route::apiResource('agendamentos', AgendamentoController::class);
    Route::apiResource('mensagens', MensagemController::class);

    Route::get('/mensagens/conversas', [MensagemController::class, 'index']);
    Route::get('/mensagens/telefone/{telefone}', [MensagemController::class, 'getByPhone']);
    Route::post('/mensagens/marcar-lida', [MensagemController::class, 'markAsRead']);
    Route::post('/mensagens/enviar', [MensagemController::class, 'send']);
    Route::get('/mensagens/nao-lidas', [MensagemController::class, 'getUnreadCount']);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::get('/settings/{group}', [SettingController::class, 'show']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::put('/settings/{group}', [SettingController::class, 'updateGroup']);

    Route::apiResource('banners', BannerController::class)->except(['create', 'edit']);
});

Route::post('/webhook/n8n', [MensagemController::class, 'store']);
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
