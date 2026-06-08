<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private string $accountSid;
    private string $authToken;
    private string $fromNumber;
    private string $apiUrl;

    public function __construct()
    {
        $this->accountSid = config('services.whatsapp.account_sid');
        $this->authToken = config('services.whatsapp.auth_token');
        $this->fromNumber = config('services.whatsapp.from_number');
        $this->apiUrl = "https://api.twilio.com/2010-04-01/Accounts/{$this->accountSid}/Messages.json";
    }

    public function sendMessage(string $to, string $message): bool
    {
        if (!$this->isConfigured()) {
            Log::warning('WhatsApp not configured, skipping notification');
            return false;
        }

        try {
            $response = Http::withBasicAuth($this->accountSid, $this->authToken)
                ->post($this->apiUrl, [
                    'From' => 'whatsapp:' . $this->fromNumber,
                    'To' => 'whatsapp:' . $to,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                Log::info("WhatsApp notification sent to {$to}");
                return true;
            }

            Log::error("WhatsApp error: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("WhatsApp exception: " . $e->getMessage());
            return false;
        }
    }

    public function sendAppointmentNotification(array $appointment, string $companyPhone): bool
    {
        $clienteNome = $appointment['cliente_nome'] ?? 'Cliente';
        $servico = $appointment['servico'] ?? 'Serviço';
        $dataHora = $this->formatDateTime($appointment['data_hora'] ?? now());

        $message = "🏥 *Novo Agendamento!*\n\n";
        $message .= "👤 *Cliente:* {$clienteNome}\n";
        $message .= "📋 *Serviço:* {$servico}\n";
        $message .= "🗓️ *Data:* {$dataHora}\n\n";
        $message .= "Acesse o painel administrativo para mais detalhes.";

        return $this->sendMessage($companyPhone, $message);
    }

    public function sendAppointmentReminder(array $appointment, string $companyPhone): bool
    {
        $clienteNome = $appointment['cliente_nome'] ?? 'Cliente';
        $servico = $appointment['servico'] ?? 'Serviço';
        $dataHora = $this->formatDateTime($appointment['data_hora'] ?? now());

        $message = "⏰ *Lembrete de Agendamento*\n\n";
        $message .= "👤 *Cliente:* {$clienteNome}\n";
        $message .= "📋 *Serviço:* {$servico}\n";
        $message .= "🗓️ *Data/Hora:* {$dataHora}\n\n";
        $message .= "Não esqueça!";

        return $this->sendMessage($companyPhone, $message);
    }

    private function formatDateTime(string $dateTime): string
    {
        $date = new \DateTime($dateTime);
        return $date->format('d/m/Y à\s H:i');
    }

    public function isConfigured(): bool
    {
        return !empty($this->accountSid) &&
               !empty($this->authToken) &&
               !empty($this->fromNumber);
    }
}
