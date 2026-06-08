<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function indexPublic()
    {
        $banners = Banner::ativos()->get();
        return response()->json(['data' => $banners]);
    }

    public function index()
    {
        $banners = Banner::orderBy('ordem')->get();
        return response()->json(['data' => $banners]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'imagem' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_texto' => 'nullable|string|max:100',
            'cor_fundo' => 'nullable|string|max:50',
            'ordem' => 'nullable|integer|min:0',
            'ativo' => 'nullable|boolean',
        ]);

        $banner = Banner::create($validated);
        return response()->json(['data' => $banner], 201);
    }

    public function show(Banner $banner)
    {
        return response()->json(['data' => $banner]);
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'descricao' => 'nullable|string',
            'imagem' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'link_texto' => 'nullable|string|max:100',
            'cor_fundo' => 'nullable|string|max:50',
            'ordem' => 'nullable|integer|min:0',
            'ativo' => 'nullable|boolean',
        ]);

        $banner->update($validated);
        return response()->json(['data' => $banner]);
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return response()->json(['message' => 'Banner removido com sucesso']);
    }
}
