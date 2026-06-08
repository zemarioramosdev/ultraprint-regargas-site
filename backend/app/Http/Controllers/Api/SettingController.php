<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        return response()->json(['data' => $settings]);
    }

    public function show($group)
    {
        $settings = Setting::getGroup($group);
        return response()->json(['data' => $settings]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|max:255',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'sometimes|string|max:100',
        ]);

        foreach ($validated['settings'] as $item) {
            Setting::setValue(
                $item['key'],
                $item['value'] ?? null,
                $item['group'] ?? 'geral'
            );
        }

        Log::info('Settings updated', ['count' => count($validated['settings'])]);

        return response()->json(['message' => 'Configurações salvas com sucesso']);
    }

    public function updateGroup(Request $request, $group)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::setValue($key, $value, $group);
        }

        return response()->json(['message' => 'Configurações salvas com sucesso']);
    }
}
