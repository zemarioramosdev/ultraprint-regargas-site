<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use Illuminate\Http\Request;

class PedidoController extends Controller
{
    public function index()
    {
        $pedidos = Pedido::with(['cliente', 'produto'])->get();
        return response()->json(['data' => $pedidos]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'required|integer|min:1',
            'valor_total' => 'required|numeric|min:0',
            'status' => 'required|in:pendente,em_andamento,concluido,cancelado',
            'observacoes' => 'nullable|string',
        ]);

        $pedido = Pedido::create($validated);
        $pedido->load(['cliente', 'produto']);
        return response()->json(['data' => $pedido], 201);
    }

    public function show(Pedido $pedido)
    {
        $pedido->load(['cliente', 'produto']);
        return response()->json(['data' => $pedido]);
    }

    public function update(Request $request, Pedido $pedido)
    {
        $validated = $request->validate([
            'cliente_id' => 'sometimes|exists:clientes,id',
            'produto_id' => 'sometimes|exists:produtos,id',
            'quantidade' => 'sometimes|integer|min:1',
            'valor_total' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pendente,em_andamento,concluido,cancelado',
            'observacoes' => 'nullable|string',
        ]);

        $pedido->update($validated);
        $pedido->load(['cliente', 'produto']);
        return response()->json(['data' => $pedido]);
    }

    public function destroy(Pedido $pedido)
    {
        $pedido->delete();
        return response()->json(['message' => 'Pedido removido com sucesso']);
    }
}
