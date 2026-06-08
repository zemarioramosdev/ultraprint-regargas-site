<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdutoVariacao extends Model
{
    use HasFactory;

    protected $table = 'produto_variacoes';

    protected $fillable = [
        'produto_id',
        'nome',
        'sku',
        'preco',
        'estoque',
        'atributos',
        'ativo',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'estoque' => 'integer',
        'atributos' => 'array',
        'ativo' => 'boolean',
    ];

    public function produto(): BelongsTo
    {
        return $this->belongsTo(Produto::class);
    }
}
