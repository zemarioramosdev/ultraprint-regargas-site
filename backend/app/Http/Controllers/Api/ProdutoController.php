<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\ProdutoVariacao;
use App\Models\ProdutoImagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutoController extends Controller
{
    public function indexPublic()
    {
        $produtos = Produto::where('ativo', true)
            ->where('estoque', '>', 0)
            ->with(['variacoes', 'galeria'])
            ->get();
        return response()->json(['data' => $produtos]);
    }

    public function index()
    {
        $produtos = Produto::with(['variacoes', 'galeria'])->get();
        return response()->json(['data' => $produtos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'categoria' => 'required|string|max:100',
            'preco' => 'required|numeric|min:0',
            'estoque' => 'required|integer|min:0',
            'estoque_minimo' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100',
            'ativo' => 'nullable|boolean',
            // Validação de variações
            'variacoes' => 'nullable|array',
            'variacoes.*.nome' => 'required|string|max:255',
            'variacoes.*.sku' => 'nullable|string|max:100',
            'variacoes.*.preco' => 'nullable|numeric|min:0',
            'variacoes.*.estoque' => 'required|integer|min:0',
            'variacoes.*.atributos' => 'nullable|array',
            'variacoes.*.ativo' => 'nullable|boolean',
            // Validação de galeria
            'galeria' => 'nullable|array',
            'galeria.*.url' => 'required|string',
            'galeria.*.path' => 'nullable|string',
            'galeria.*.ordem' => 'nullable|integer',
            'galeria.*.principal' => 'nullable|boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            // Extrair variações e galeria do payload do produto principal
            $variacoesData = $validated['variacoes'] ?? [];
            $galeriaData = $validated['galeria'] ?? [];

            // Remover do array validado para não tentar inserir na tabela de produtos
            unset($validated['variacoes']);
            unset($validated['galeria']);

            // Gerar o array de imagens string simples para retrocompatibilidade
            $imagensUrls = [];
            foreach ($galeriaData as $img) {
                $imagensUrls[] = $img['url'];
            }
            $validated['imagens'] = $imagensUrls;

            // Criar o produto base
            $produto = Produto::create($validated);

            // Criar variações
            foreach ($variacoesData as $varData) {
                $produto->variacoes()->create([
                    'nome' => $varData['nome'],
                    'sku' => $varData['sku'] ?? null,
                    'preco' => $varData['preco'] ?? null,
                    'estoque' => $varData['estoque'] ?? 0,
                    'atributos' => $varData['atributos'] ?? null,
                    'ativo' => $varData['ativo'] ?? true,
                ]);
            }

            // Criar galeria
            foreach ($galeriaData as $index => $imgData) {
                $produto->galeria()->create([
                    'url' => $imgData['url'],
                    'path' => $imgData['path'] ?? null,
                    'ordem' => $imgData['ordem'] ?? $index,
                    'principal' => $imgData['principal'] ?? false,
                ]);
            }

            // Carregar relações e retornar
            $produto->load(['variacoes', 'galeria']);

            return response()->json(['data' => $produto], 201);
        });
    }

    public function show(Produto $produto)
    {
        $produto->load(['variacoes', 'galeria']);
        return response()->json(['data' => $produto]);
    }

    public function update(Request $request, Produto $produto)
    {
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'categoria' => 'sometimes|string|max:100',
            'preco' => 'sometimes|numeric|min:0',
            'estoque' => 'sometimes|integer|min:0',
            'estoque_minimo' => 'nullable|integer|min:0',
            'sku' => 'nullable|string|max:100',
            'ativo' => 'nullable|boolean',
            // Validação de variações
            'variacoes' => 'nullable|array',
            'variacoes.*.id' => 'nullable|integer',
            'variacoes.*.nome' => 'required_with:variacoes|string|max:255',
            'variacoes.*.sku' => 'nullable|string|max:100',
            'variacoes.*.preco' => 'nullable|numeric|min:0',
            'variacoes.*.estoque' => 'required_with:variacoes|integer|min:0',
            'variacoes.*.atributos' => 'nullable|array',
            'variacoes.*.ativo' => 'nullable|boolean',
            // Validação de galeria
            'galeria' => 'nullable|array',
            'galeria.*.id' => 'nullable|integer',
            'galeria.*.url' => 'required_with:galeria|string',
            'galeria.*.path' => 'nullable|string',
            'galeria.*.ordem' => 'nullable|integer',
            'galeria.*.principal' => 'nullable|boolean',
        ]);

        return DB::transaction(function () use ($validated, $produto) {
            $variacoesData = $validated['variacoes'] ?? null;
            $galeriaData = $validated['galeria'] ?? null;

            unset($validated['variacoes']);
            unset($validated['galeria']);

            // Sincronizar galeria e gerar o array simples JSON se galeria foi enviada
            if ($galeriaData !== null) {
                $imagensUrls = [];
                $mantidosIds = [];

                foreach ($galeriaData as $index => $imgData) {
                    $imagensUrls[] = $imgData['url'];

                    if (isset($imgData['id'])) {
                        // Atualizar imagem existente
                        $imagem = ProdutoImagem::find($imgData['id']);
                        if ($imagem && $imagem->produto_id == $produto->id) {
                            $imagem->update([
                                'url' => $imgData['url'],
                                'path' => $imgData['path'] ?? $imagem->path,
                                'ordem' => $imgData['ordem'] ?? $index,
                                'principal' => $imgData['principal'] ?? false,
                            ]);
                            $mantidosIds[] = $imagem->id;
                        }
                    } else {
                        // Criar nova imagem
                        $novaImagem = $produto->galeria()->create([
                            'url' => $imgData['url'],
                            'path' => $imgData['path'] ?? null,
                            'ordem' => $imgData['ordem'] ?? $index,
                            'principal' => $imgData['principal'] ?? false,
                        ]);
                        $mantidosIds[] = $novaImagem->id;
                    }
                }

                // Deletar imagens que não estão mais na requisição
                $produto->galeria()->whereNotIn('id', $mantidosIds)->delete();
                $validated['imagens'] = $imagensUrls;
            }

            // Atualizar produto base
            $produto->update($validated);

            // Sincronizar variações se variacoes foram enviadas
            if ($variacoesData !== null) {
                $mantidosVariacoesIds = [];

                foreach ($variacoesData as $varData) {
                    if (isset($varData['id'])) {
                        // Atualizar existente
                        $variacao = ProdutoVariacao::find($varData['id']);
                        if ($variacao && $variacao->produto_id == $produto->id) {
                            $variacao->update([
                                'nome' => $varData['nome'],
                                'sku' => $varData['sku'] ?? $variacao->sku,
                                'preco' => $varData['preco'] ?? null,
                                'estoque' => $varData['estoque'] ?? 0,
                                'atributos' => $varData['atributos'] ?? $variacao->atributos,
                                'ativo' => $varData['ativo'] ?? true,
                            ]);
                            $mantidosVariacoesIds[] = $variacao->id;
                        }
                    } else {
                        // Criar nova variação
                        $novaVariacao = $produto->variacoes()->create([
                            'nome' => $varData['nome'],
                            'sku' => $varData['sku'] ?? null,
                            'preco' => $varData['preco'] ?? null,
                            'estoque' => $varData['estoque'] ?? 0,
                            'atributos' => $varData['atributos'] ?? null,
                            'ativo' => $varData['ativo'] ?? true,
                        ]);
                        $mantidosVariacoesIds[] = $novaVariacao->id;
                    }
                }

                // Deletar variações antigas que foram removidas
                $produto->variacoes()->whereNotIn('id', $mantidosVariacoesIds)->delete();
            }

            $produto->load(['variacoes', 'galeria']);
            return response()->json(['data' => $produto]);
        });
    }

    public function destroy(Produto $produto)
    {
        $produto->delete();
        return response()->json(['message' => 'Produto removido com sucesso']);
    }

    public function reorderImages(Request $request, $id)
    {
        $request->validate([
            'imagens' => 'required|array',
            'imagens.*.id' => 'required|integer|exists:produto_imagens,id',
            'imagens.*.ordem' => 'required|integer',
        ]);

        $produto = Produto::findOrFail($id);

        DB::transaction(function () use ($request, $produto) {
            foreach ($request->imagens as $imgData) {
                ProdutoImagem::where('id', $imgData['id'])
                    ->where('produto_id', $produto->id)
                    ->update(['ordem' => $imgData['ordem']]);
            }

            // Atualizar coluna JSON simples para consistência
            $urls = $produto->galeria()->orderBy('ordem')->pluck('url')->toArray();
            $produto->update(['imagens' => $urls]);
        });

        $produto->load(['variacoes', 'galeria']);
        return response()->json(['data' => $produto]);
    }
}
