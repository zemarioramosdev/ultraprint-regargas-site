<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2764', // max 2.7MB (2764 KB)
            'files' => 'nullable|array',
            'files.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2764',
        ]);

        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            $file = $request->file('file');
            
            // Generate a unique file name
            $filename = \Illuminate\Support\Str::random(20) . '.' . $file->getClientOriginalExtension();
            
            // Store the file in the 'public/produtos' directory
            $path = $file->storeAs('produtos', $filename, 'public');
            
            // Get the public URL
            $url = \Illuminate\Support\Facades\Storage::disk('public')->url($path);
            
            // Return the full URL
            return response()->json([
                'url' => $url,
                'path' => $path
            ], 200);
        }

        if ($request->hasFile('files')) {
            $uploaded = [];
            foreach ($request->file('files') as $file) {
                if ($file->isValid()) {
                    $filename = \Illuminate\Support\Str::random(20) . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('produtos', $filename, 'public');
                    $url = \Illuminate\Support\Facades\Storage::disk('public')->url($path);
                    $uploaded[] = [
                        'url' => $url,
                        'path' => $path
                    ];
                }
            }
            return response()->json(['files' => $uploaded], 200);
        }

        return response()->json(['error' => 'Nenhum arquivo válido enviado'], 400);
    }
}
