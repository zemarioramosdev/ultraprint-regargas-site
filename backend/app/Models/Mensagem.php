<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensagem extends Model
{
    use HasFactory;

    protected $fillable = [
        'telefone',
        'nome_cliente',
        'conteudo',
        'direcao',
        'canal',
        'status',
        'session_id',
        'origem_externa',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    const DIRECAO_ENTRADA = 'entrada';
    const DIRECAO_SAIDA = 'saida';

    const CANAL_WHATSAPP = 'whatsapp';
    const CANAL_CHAT = 'chat';
    const CANAL_ADMIN = 'admin';

    const STATUS_RECEBIDA = 'recebida';
    const STATUS_LIDA = 'lida';
    const STATUS_ENVIADA = 'enviada';
    const STATUS_ENTREGUE = 'entregue';
}
