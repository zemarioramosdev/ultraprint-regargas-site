<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Agendamento;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar usuário admin se não existir
        if (!User::where('email', 'admin@ultraprint.com')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@ultraprint.com',
                'password' => bcrypt('senha123'),
            ]);
        }

        // Criar clientes
        $cliente1 = Cliente::firstOrCreate(
            ['telefone' => '31971504213'],
            [
                'nome' => 'JOSE MARIO RAMOS',
                'email' => 'z7designcode@gmail.com',
            ]
        );

        $cliente2 = Cliente::firstOrCreate(
            ['telefone' => '31988887777'],
            [
                'nome' => 'Maria Oliveira',
                'email' => 'maria.oliveira@gmail.com',
            ]
        );

        $cliente3 = Cliente::firstOrCreate(
            ['telefone' => '31999998888'],
            [
                'nome' => 'João Silva',
                'email' => 'joao.silva@outlook.com',
            ]
        );

        // Criar agendamentos
        if (Agendamento::count() === 0) {
            Agendamento::create([
                'cliente_id' => $cliente1->id,
                'servico' => 'Recarga de Cartucho',
                'data_hora' => '2026-06-10 15:00:00',
                'status' => 'agendado',
                'observacoes' => 'Modelo Impressora: HP DeskJet 2774. Obs: Teste',
            ]);

            Agendamento::create([
                'cliente_id' => $cliente2->id,
                'servico' => 'Recarga de Toner',
                'data_hora' => '2026-06-08 10:00:00',
                'status' => 'em_andamento',
                'observacoes' => 'Modelo Impressora: Brother HL-1212W. Recarregar toner preto.',
            ]);

            Agendamento::create([
                'cliente_id' => $cliente3->id,
                'servico' => 'Manutenção de Impressora',
                'data_hora' => '2026-06-07 14:00:00',
                'status' => 'concluido',
                'observacoes' => 'Limpeza geral e lubrificação.',
            ]);

            Agendamento::create([
                'cliente_id' => $cliente2->id,
                'servico' => 'Recarga de Cartucho',
                'data_hora' => '2026-06-05 09:30:00',
                'status' => 'cancelado',
                'observacoes' => 'Cliente cancelou por telefone.',
            ]);
        }
    }
}

