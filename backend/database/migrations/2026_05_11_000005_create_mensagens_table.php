<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mensagens', function (Blueprint $table) {
            $table->id();
            $table->string('telefone', 20);
            $table->string('nome_cliente', 255)->nullable();
            $table->text('conteudo');
            $table->enum('direcao', ['entrada', 'saida']);
            $table->enum('canal', ['whatsapp', 'chat', 'admin']);
            $table->enum('status', ['recebida', 'lida', 'enviada', 'entregue'])->default('recebida');
            $table->string('session_id', 100)->nullable();
            $table->boolean('origem_externa')->default(false);
            $table->timestamps();

            $table->index('telefone');
            $table->index('canal');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mensagens');
    }
};
