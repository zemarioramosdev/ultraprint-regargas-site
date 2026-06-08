<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketingEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo_evento',
        'detalhes',
        'ip_address',
    ];

    protected $casts = [
        'detalhes' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
