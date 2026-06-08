<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'categoria',
        'preco',
        'estoque',
        'estoque_minimo',
        'imagens',
        'sku',
        'ativo',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'estoque' => 'integer',
        'estoque_minimo' => 'integer',
        'imagens' => 'array',
        'ativo' => 'boolean',
    ];

    public function variacoes(): HasMany
    {
        return $this->hasMany(ProdutoVariacao::class);
    }

    public function galeria(): HasMany
    {
        return $this->hasMany(ProdutoImagem::class)->orderBy('ordem');
    }
}

