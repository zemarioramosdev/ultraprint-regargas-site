<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketingEvent;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MarketingController extends Controller
{
    /**
     * Obter lista de eventos de conversão gravados localmente (Painel Admin)
     */
    public function index(Request $request)
    {
        $events = MarketingEvent::orderBy('created_at', 'desc')->take(100)->get();

        // Agregar métricas rápidas de conversões
        $stats = MarketingEvent::select('tipo_evento', DB::raw('count(*) as total'))
            ->groupBy('tipo_evento')
            ->pluck('total', 'tipo_evento')
            ->toArray();

        return response()->json([
            'data' => [
                'events' => $events,
                'stats' => [
                    'visualizacao_pagina' => $stats['visualizacao_pagina'] ?? 0,
                    'clique_whatsapp_orcamento' => $stats['clique_whatsapp_orcamento'] ?? 0,
                    'clique_whatsapp_geral' => $stats['clique_whatsapp_geral'] ?? 0,
                    'agendamento_concluido' => $stats['agendamento_concluido'] ?? 0,
                    'visualizacao_produto' => $stats['visualizacao_produto'] ?? 0,
                    'total' => array_sum($stats)
                ]
            ]
        ]);
    }

    /**
     * Registrar um evento de conversão do internauta (Público)
     */
    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'tipo_evento' => 'required|string|max:100',
            'detalhes' => 'nullable|array',
        ]);

        $event = MarketingEvent::create([
            'tipo_evento' => $validated['tipo_evento'],
            'detalhes' => $validated['detalhes'] ?? null,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $event
        ], 201);
    }

    /**
     * Listar Campanhas do Google Ads (Metricas & Gestão)
     */
    public function getGoogleAdsCampaigns()
    {
        // Se as credenciais do Google Ads estiverem configuradas, buscaríamos da API real.
        // Como estamos em ambiente de teste/local, retornamos dados simulados estruturados de alta fidelidade.
        $campaigns = [
            [
                'id' => '1001',
                'nome' => 'Recargas Betim - Jato de Tinta',
                'status' => 'ativa',
                'orcamento' => 30.00,
                'cliques' => 482,
                'impressoes' => 12540,
                'ctr' => '3.84%',
                'cpc_medio' => 0.59,
                'custo' => 284.38,
                'conversoes' => 45,
                'custo_conversao' => 6.32
            ],
            [
                'id' => '1002',
                'nome' => 'Toner Compatível & Recarga Laser',
                'status' => 'ativa',
                'orcamento' => 40.00,
                'cliques' => 618,
                'impressoes' => 15410,
                'ctr' => '4.01%',
                'cpc_medio' => 0.63,
                'custo' => 389.34,
                'conversoes' => 58,
                'custo_conversao' => 6.71
            ],
            [
                'id' => '1003',
                'nome' => 'Locação de Impressoras Corporativas',
                'status' => 'pausada',
                'orcamento' => 25.00,
                'cliques' => 108,
                'impressoes' => 4250,
                'ctr' => '2.54%',
                'cpc_medio' => 0.91,
                'custo' => 98.28,
                'conversoes' => 12,
                'custo_conversao' => 8.19
            ]
        ];

        return response()->json([
            'data' => $campaigns
        ]);
    }

    /**
     * Palavras-chave do Google Ads e SEO
     */
    public function getGoogleAdsKeywords()
    {
        $keywords = [
            [
                'id' => 'k1',
                'palavra' => 'Recarga de Toner',
                'impressoes' => 5800,
                'cliques' => 380,
                'ctr' => '6.55%',
                'cpc_medio' => 0.85,
                'custo' => 323.00,
                'posicao_media' => 1.4,
                'status' => 'relevancia_alta'
            ],
            [
                'id' => 'k2',
                'palavra' => 'Venda de Toner',
                'impressoes' => 3200,
                'cliques' => 195,
                'ctr' => '6.09%',
                'cpc_medio' => 1.20,
                'custo' => 234.00,
                'posicao_media' => 2.1,
                'status' => 'relevancia_alta'
            ],
            [
                'id' => 'k3',
                'palavra' => 'Recarga de cartucho de tinta',
                'impressoes' => 8400,
                'cliques' => 580,
                'ctr' => '6.90%',
                'cpc_medio' => 0.45,
                'custo' => 261.00,
                'posicao_media' => 1.1,
                'status' => 'relevancia_alta'
            ],
            [
                'id' => 'k4',
                'palavra' => 'Venda de cartucho de tinta',
                'impressoes' => 4100,
                'cliques' => 248,
                'ctr' => '6.05%',
                'cpc_medio' => 0.95,
                'custo' => 235.60,
                'posicao_media' => 1.8,
                'status' => 'relevancia_alta'
            ],
            [
                'id' => 'k5',
                'palavra' => 'Locação de Impressoras',
                'impressoes' => 1900,
                'cliques' => 92,
                'ctr' => '4.84%',
                'cpc_medio' => 1.80,
                'custo' => 165.60,
                'posicao_media' => 2.5,
                'status' => 'relevancia_media'
            ],
            [
                'id' => 'k6',
                'palavra' => 'Venda de tinta Epson',
                'impressoes' => 2700,
                'cliques' => 148,
                'ctr' => '5.48%',
                'cpc_medio' => 0.70,
                'custo' => 103.60,
                'posicao_media' => 2.0,
                'status' => 'relevancia_media'
            ],
            [
                'id' => 'k7',
                'palavra' => 'Toner compatível',
                'impressoes' => 6900,
                'cliques' => 460,
                'ctr' => '6.67%',
                'cpc_medio' => 0.75,
                'custo' => 345.00,
                'posicao_media' => 1.5,
                'status' => 'relevancia_alta'
            ],
        ];

        return response()->json([
            'data' => $keywords
        ]);
    }

    /**
     * Métricas de performance de pesquisas orgânicas do Google Search Console
     */
    public function getSearchConsolePerformance()
    {
        $performance = [
            'overview' => [
                'total_cliques' => 1250,
                'total_impressoes' => 18400,
                'ctr_medio' => '6.79%',
                'posicao_media' => 1.8
            ],
            'queries' => [
                [
                    'query' => 'recarga de cartucho betim',
                    'cliques' => 312,
                    'impressoes' => 1420,
                    'ctr' => '21.97%',
                    'posicao' => 1.1
                ],
                [
                    'query' => 'recarga de toner betim',
                    'cliques' => 245,
                    'impressoes' => 1280,
                    'ctr' => '19.14%',
                    'posicao' => 1.3
                ],
                [
                    'query' => 'toner compativel betim entrega rapida',
                    'cliques' => 188,
                    'impressoes' => 980,
                    'ctr' => '19.18%',
                    'posicao' => 1.4
                ],
                [
                    'query' => 'aluguel de impressora betim',
                    'cliques' => 74,
                    'impressoes' => 620,
                    'ctr' => '11.94%',
                    'posicao' => 2.6
                ],
                [
                    'query' => 'recarga cartucho epson betim',
                    'cliques' => 68,
                    'impressoes' => 510,
                    'ctr' => '13.33%',
                    'posicao' => 1.8
                ]
            ],
            'sitemaps' => [
                [
                    'url' => '/sitemap.xml',
                    'tipo' => 'Sitemap',
                    'enviado' => '2026-05-01',
                    'ultimo_processamento' => '2026-06-07',
                    'status' => 'sucesso',
                    'paginas_descobertas' => 12
                ]
            ]
        ];

        return response()->json([
            'data' => $performance
        ]);
    }
}
