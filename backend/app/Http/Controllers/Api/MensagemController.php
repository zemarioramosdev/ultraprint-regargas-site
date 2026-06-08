<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mensagem;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MensagemController extends Controller
{
    private WhatsAppService $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 50);
        $conversations = Mensagem::select('telefone', 'nome_cliente')
            ->selectRaw('MAX(created_at) as last_message_at')
            ->selectRaw('COUNT(*) as total_messages')
            ->where('direcao', Mensagem::DIRECAO_ENTRADA)
            ->groupBy('telefone', 'nome_cliente')
            ->orderByDesc('last_message_at')
            ->paginate($perPage);

        return response()->json(['data' => $conversations]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'telefone' => 'required|string|max:20',
            'nome_cliente' => 'nullable|string|max:255',
            'conteudo' => 'required|string',
            'direcao' => 'required|in:entrada,saida',
            'canal' => 'required|in:whatsapp,chat,admin',
            'session_id' => 'nullable|string|max:100',
            'origem_externa' => 'nullable|boolean',
        ]);

        $mensagem = Mensagem::create($validated);

        return response()->json(['data' => $mensagem], 201);
    }

    public function getByPhone($telefone)
    {
        $mensagens = Mensagem::where('telefone', $telefone)
            ->orderBy('created_at', 'asc')
            ->get();

        Mensagem::where('telefone', $telefone)
            ->where('direcao', Mensagem::DIRECAO_ENTRADA)
            ->where('status', '!=', Mensagem::STATUS_LIDA)
            ->update(['status' => Mensagem::STATUS_LIDA]);

        return response()->json(['data' => $mensagens]);
    }

    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'telefone' => 'required|string|max:20',
        ]);

        Mensagem::where('telefone', $validated['telefone'])
            ->where('direcao', Mensagem::DIRECAO_ENTRADA)
            ->where('status', '!=', Mensagem::STATUS_LIDA)
            ->update(['status' => Mensagem::STATUS_LIDA]);

        return response()->json(['message' => 'Mensagens marcadas como lidas']);
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'telefone' => 'required|string|max:20',
            'conteudo' => 'required|string',
            'canal' => 'required|in:whatsapp,chat',
        ]);

        $companyPhone = config('services.whatsapp.company_phone');

        if ($validated['canal'] === 'whatsapp') {
            $sent = $this->whatsappService->sendMessage($validated['telefone'], $validated['conteudo']);

            if (!$sent) {
                return response()->json(['error' => 'Falha ao enviar mensagem WhatsApp'], 500);
            }
        }

        $mensagem = Mensagem::create([
            'telefone' => $validated['telefone'],
            'nome_cliente' => null,
            'conteudo' => $validated['conteudo'],
            'direcao' => Mensagem::DIRECAO_SAIDA,
            'canal' => $validated['canal'],
            'status' => Mensagem::STATUS_ENVIADA,
            'origem_externa' => false,
        ]);

        return response()->json(['data' => $mensagem], 201);
    }

    public function sendPublic(Request $request)
    {
        $validated = $request->validate([
            'telefone' => 'nullable|string|max:20',
            'nome' => 'nullable|string|max:255',
            'conteudo' => 'required|string',
        ]);

        $mensagem = Mensagem::create([
            'telefone' => $validated['telefone'] ?? 'visitante',
            'nome_cliente' => $validated['nome'] ?? 'Visitante',
            'conteudo' => $validated['conteudo'],
            'direcao' => Mensagem::DIRECAO_ENTRADA,
            'canal' => Mensagem::CANAL_CHAT,
            'status' => Mensagem::STATUS_RECEBIDA,
            'origem_externa' => true,
        ]);

        return response()->json(['data' => $mensagem], 201);
    }

    public function getUnreadCount()
    {
        $count = Mensagem::where('direcao', Mensagem::DIRECAO_ENTRADA)
            ->where('status', '!=', Mensagem::STATUS_LIDA)
            ->count();

        return response()->json(['data' => ['count' => $count]]);
    }
}
