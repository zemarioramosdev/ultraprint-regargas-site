<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'recaptcha_check' => 'required|accepted', // slider/robot validation check on frontend
        ]);

        $email = $request->email;
        $ip = $request->ip();

        // 1. Rate Limiting: Max 3 code requests per 10 minutes per IP/email
        $sendKey = 'send-reset-code:' . md5($email . '|' . $ip);
        if (RateLimiter::tooManyAttempts($sendKey, 3)) {
            $seconds = RateLimiter::availableIn($sendKey);
            return response()->json([
                'message' => 'Muitas solicitações de código de segurança. Tente novamente em ' . ceil($seconds / 60) . ' minutos.'
            ], 429);
        }
        RateLimiter::hit($sendKey, 600); // 10 min throttle

        // 2. Procurar usuário
        $user = User::where('email', $email)->first();

        // Se o usuário não existir, retornamos sucesso genérico por segurança (evita enumeração de email)
        if (!$user) {
            Log::info("Solicitação de recuperação de senha para email não cadastrado: {$email}");
            return response()->json([
                'message' => 'Se o e-mail estiver cadastrado, um código de verificação foi enviado.'
            ]);
        }

        // 3. Gerar código numérico de 6 dígitos
        $code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // 4. Salvar na tabela de tokens (ou atualizar se já existir)
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($code),
                'created_at' => now(),
            ]
        );

        // 5. Enviar e-mail simulado / gravar nos logs do Laravel e de fácil verificação
        Log::info("Código de verificação para {$email}: {$code}");

        // Gravação em arquivo dedicado para agilidade no teste local do lojista
        try {
            $logPath = storage_path('logs/recovery_codes.log');
            $logDir = dirname($logPath);
            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }
            file_put_contents(
                $logPath,
                "[" . date('Y-m-d H:i:s') . "] Código para {$email}: {$code}\n",
                FILE_APPEND
            );
        } catch (\Exception $e) {
            Log::error("Erro ao salvar código no arquivo dedicado: " . $e->getMessage());
        }

        // Enviar e-mail real utilizando o SMTP configurado
        try {
            $messageContent = "Olá, {$user->name}.\n\nSeu código de verificação para redefinir sua senha na Ultraprint Recargas é: {$code}\n\nEste código expira em 15 minutos e protege seu acesso contra acessos robóticos não autorizados.\n\nSe você não solicitou esta alteração, ignore este e-mail.";
            Mail::raw($messageContent, function ($message) use ($email) {
                $message->to($email)
                    ->subject("Código de Recuperação - Ultraprint Recargas");
            });
            Log::info("E-mail enviado via SMTP com sucesso para: {$email}");
        } catch (\Exception $e) {
            Log::error("Falha ao enviar e-mail real via SMTP: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Se o e-mail estiver cadastrado, um código de verificação foi enviado.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $email = $request->email;
        $code = $request->code;
        $ip = $request->ip();

        // 1. Rate Limiting de Verificação: Limitar a 5 tentativas incorretas a cada 15 minutos
        $verifyKey = 'verify-reset-code:' . md5($email . '|' . $ip);
        if (RateLimiter::tooManyAttempts($verifyKey, 5)) {
            $seconds = RateLimiter::availableIn($verifyKey);
            return response()->json([
                'message' => 'Muitas tentativas malsucedidas de verificação. Acesso bloqueado por ' . ceil($seconds / 60) . ' minutos.'
            ], 429);
        }

        // 2. Buscar token cadastrado
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            RateLimiter::hit($verifyKey, 900); // penaliza a tentativa
            return response()->json([
                'message' => 'Código de verificação inválido ou expirado.'
            ], 422);
        }

        // 3. Verificar se expirou (limite de 15 minutos)
        $createdAt = Carbon::parse($record->created_at);
        if ($createdAt->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            RateLimiter::hit($verifyKey, 900);
            return response()->json([
                'message' => 'O código de verificação expirou (limite de 15 minutos). Peça outro.'
            ], 422);
        }

        // 4. Verificar se o código de 6 dígitos coincide
        if (!Hash::check($code, $record->token)) {
            RateLimiter::hit($verifyKey, 900);
            return response()->json([
                'message' => 'Código de verificação incorreto.'
            ], 422);
        }

        // 5. Redefinir a senha do usuário
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        // 6. Limpar registros e limites
        DB::table('password_reset_tokens')->where('email', $email)->delete();
        RateLimiter::clear($verifyKey);

        return response()->json([
            'message' => 'Senha redefinida com sucesso! Você já pode entrar.'
        ]);
    }
}

