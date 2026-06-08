<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();
        return response()->json(['data' => $clientes]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'telefone' => 'nullable|string|max:20',
            'endereco' => 'nullable|string|max:500',
            'cpf' => 'nullable|string|max:14',
        ]);

        $cliente = Cliente::create($validated);
        return response()->json(['data' => $cliente], 201);
    }

    public function show(Cliente $cliente)
    {
        return response()->json(['data' => $cliente]);
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clientes,email,' . $cliente->id,
            'telefone' => 'nullable|string|max:20',
            'endereco' => 'nullable|string|max:500',
            'cpf' => 'nullable|string|max:14',
        ]);

        $cliente->update($validated);
        return response()->json(['data' => $cliente]);
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();
        return response()->json(['message' => 'Cliente removido com sucesso']);
    }
}
