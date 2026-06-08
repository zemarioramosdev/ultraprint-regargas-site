<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agendamento;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AgendamentoController extends Controller
{
    private WhatsAppService $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    public function index()
    {
        $agendamentos = Agendamento::with('cliente')->get();
        return response()->json(['data' => $agendamentos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'servico' => 'required|string|max:255',
            'data_hora' => 'required|date',
            'status' => 'required|in:agendado,em_andamento,concluido,cancelado',
            'observacoes' => 'nullable|string',
        ]);

        $agendamento = Agendamento::create($validated);
        $agendamento->load('cliente');

        $this->sendWhatsAppNotification($agendamento, 'created');

        return response()->json(['data' => $agendamento], 201);
    }

    public function show(Agendamento $agendamento)
    {
        $agendamento->load('cliente');
        return response()->json(['data' => $agendamento]);
    }

    public function update(Request $request, Agendamento $agendamento)
    {
        $validated = $request->validate([
            'cliente_id' => 'sometimes|exists:clientes,id',
            'servico' => 'sometimes|string|max:255',
            'data_hora' => 'sometimes|date',
            'status' => 'sometimes|in:agendado,em_andamento,concluido,cancelado',
            'observacoes' => 'nullable|string',
        ]);

        $oldStatus = $agendamento->status;
        $agendamento->update($validated);
        $agendamento->load('cliente');

        if ($validated['status'] ?? false) {
            $this->sendWhatsAppNotification($agendamento, 'updated');
        }

        return response()->json(['data' => $agendamento]);
    }

    public function destroy(Agendamento $agendamento)
    {
        $agendamento->delete();
        return response()->json(['message' => 'Agendamento removido com sucesso']);
    }

    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'telefone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'servico' => 'required|string|max:255',
            'data_hora' => 'required|date',
            'observacoes' => 'nullable|string',
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
            $cliente = \App\Models\Cliente::firstOrCreate(
                ['telefone' => $validated['telefone']],
                [
                    'nome' => $validated['nome'],
                    'email' => $validated['email'] ?? null,
                ]
            );

            $agendamento = Agendamento::create([
                'cliente_id' => $cliente->id,
                'servico' => $validated['servico'],
                'data_hora' => $validated['data_hora'],
                'status' => 'agendado',
                'observacoes' => $validated['observacoes'] ?? null,
            ]);

            $agendamento->load('cliente');

            $this->sendWhatsAppNotification($agendamento, 'created');

            return response()->json(['data' => $agendamento], 201);
        });
    }

    private function sendWhatsAppNotification(Agendamento $agendamento, string $action): void
    {
        try {
            $companyPhone = config('services.whatsapp.company_phone');

            if (empty($companyPhone)) {
                Log::info('WhatsApp company phone not configured, skipping notification');
                return;
            }

            $appointmentData = [
                'cliente_nome' => $agendamento->cliente?->nome ?? 'Cliente não encontrado',
                'servico' => $agendamento->servico,
                'data_hora' => $agendamento->data_hora,
            ];

            $this->whatsappService->sendAppointmentNotification($appointmentData, $companyPhone);
        } catch (\Exception $e) {
            Log::error('WhatsApp notification failed: ' . $e->getMessage());
        }
    }
}
