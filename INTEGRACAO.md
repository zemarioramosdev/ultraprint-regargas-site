# Integração Frontend + Backend

## ✅ Configuração Concluída

### Backend (Laravel)
- ✅ Laravel Sanctum instalado e configurado
- ✅ CORS configurado para aceitar requisições do frontend
- ✅ Rotas de API criadas e funcionando
- ✅ Controllers de autenticação implementados
- ✅ Controllers de CRUD (Produtos, Clientes, Pedidos, Agendamentos, Mensagens)
- ✅ SettingController + Model + Migration (configurações chave-valor)
- ✅ Rota pública `POST /api/chat/public` (registra mensagens do chat)
- ✅ Rota pública `GET /api/produtos/public` (lista produtos com estoque)
- ✅ Migrations executadas
- ✅ FRONTEND_URL configurado

### Frontend (Next.js)
- ✅ Cliente API criado (`lib/api.ts`)
- ✅ Serviço de autenticação criado (`lib/auth.ts`)
- ✅ Context de autenticação global (`contexts/AuthContext.tsx`)
- ✅ Middleware de proteção de rotas (`middleware.ts`)
- ✅ Página de login integrada com a API
- ✅ Hooks personalizados para API (`hooks/useProdutos.ts`, `hooks/useClientes.ts`, etc.)
- ✅ Dashboard com dados reais da API
- ✅ **Página de Configurações** integrada com API (`hooks/useSettings.ts`)
- ✅ **Chat Widget** registra mensagens via API pública
- ✅ **Scheduling (agendamento)** envia dados para a API + WhatsApp
- ✅ **Products (catálogo)** carrega produtos da API pública
- ✅ Variáveis de ambiente configuradas (`.env.local`)

## 🚀 Como Usar

### 1. Iniciar o Backend

```bash
cd backend
php artisan migrate
php artisan serve
```

O backend estará disponível em: `http://localhost:8000`

### 2. Iniciar o Frontend

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

### 3. Testar a Integração

#### Criar um usuário de teste:

```bash
cd backend
php artisan tinker
```

No tinker, execute:

```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'seu_email@exemplo.com';
$user->password = bcrypt('sua_senha_segura');
$user->save();
exit
```

#### Fazer login:

1. Acesse: `http://localhost:3000/login`
2. Use as credenciais que você acabou de criar:
   - Email: `seu_email@exemplo.com`
   - Senha: `sua_senha_segura`

## 📡 Endpoints da API

### Públicos (sem autenticação)

- `POST /api/login` - Fazer login
- `POST /api/register` - Registrar novo usuário
- `GET /api/health` - Verificar status da API
- `POST /api/chat/public` - Registrar mensagem do chat público
- `GET /api/produtos/public` - Listar produtos disponíveis (com estoque)

### Protegidos (requer autenticação com Bearer token)

- `POST /api/logout` - Fazer logout
- `GET /api/me` - Obter dados do usuário autenticado

#### Recursos (CRUD completo):
- `GET/POST /api/produtos` - Listar/Criar produtos
- `GET/PUT/DELETE /api/produtos/{id}` - Ver/Editar/Remover produto
- `GET/POST /api/clientes` - Listar/Criar clientes
- `GET/PUT/DELETE /api/clientes/{id}` - Ver/Editar/Remover cliente
- `GET/POST /api/pedidos` - Listar/Criar pedidos
- `GET/PUT/DELETE /api/pedidos/{id}` - Ver/Editar/Remover pedido
- `GET/POST /api/agendamentos` - Listar/Criar agendamentos
- `GET/PUT/DELETE /api/agendamentos/{id}` - Ver/Editar/Remover agendamento
- `GET/POST /api/mensagens/conversas` - Listar conversas
- `GET /api/mensagens/telefone/{tel}` - Mensagens por telefone
- `POST /api/mensagens/enviar` - Enviar mensagem
- `POST /api/mensagens/marcar-lida` - Marcar como lida
- `GET /api/mensagens/nao-lidas` - Contagem de não lidas

#### Configurações (Settings):
- `GET /api/settings` - Listar todas as configurações (agrupadas)
- `GET /api/settings/{grupo}` - Listar configurações de um grupo
- `PUT /api/settings` - Atualizar múltiplas configurações
- `PUT /api/settings/{grupo}` - Atualizar configurações de um grupo

## 🔐 Autenticação

O sistema usa **Laravel Sanctum** com tokens de API:

1. Ao fazer login, o backend retorna um token
2. O frontend armazena o token no `localStorage` e em cookie
3. Todas as requisições autenticadas incluem o header:
   ```
   Authorization: Bearer {token}
   ```
4. O middleware do Next.js protege as rotas do dashboard

## 🛠️ Estrutura de Arquivos

### Backend
```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           ├── ProdutoController.php
│   │           ├── ClienteController.php
│   │           ├── PedidoController.php
│   │           ├── AgendamentoController.php
│   │           ├── MensagemController.php
│   │           └── SettingController.php      ← NOVO
│   ├── Services/
│   │   └── WhatsAppService.php
│   └── Models/
│       ├── User.php
│       ├── Produto.php
│       ├── Cliente.php
│       ├── Pedido.php
│       ├── Agendamento.php
│       ├── Mensagem.php
│       └── Setting.php                        ← NOVO
├── routes/
│   └── api.php
├── database/
│   └── migrations/
│       ├── 2026_05_11_000001_create_produtos_table.php
│       ├── 2026_05_11_000002_create_clientes_table.php
│       ├── 2026_05_11_000003_create_pedidos_table.php
│       ├── 2026_05_11_000004_create_agendamentos_table.php
│       ├── 2026_05_11_000005_create_mensagens_table.php
│       └── 2026_05_11_000006_create_settings_table.php ← NOVO
└── config/
    ├── cors.php
    └── sanctum.php
```

### Frontend
```
frontend/
├── contexts/
│   └── AuthContext.tsx      # Context de autenticação global
├── hooks/
│   ├── useProdutos.ts       # Hook para produtos
│   ├── useClientes.ts       # Hook para clientes
│   ├── usePedidos.ts        # Hook para pedidos
│   ├── useAgendamentos.ts   # Hook para agendamentos
│   ├── useMensagens.ts      # Hook para mensagens WhatsApp
│   └── useSettings.ts       ← NOVO (configurações)
├── lib/
│   ├── api.ts               # Cliente HTTP
│   └── auth.ts              # Serviço de autenticação
├── middleware.ts             # Proteção de rotas
├── components/
│   ├── chat-widget.tsx       ← Integrado com API pública
│   ├── products.tsx          ← Integrado com API pública
│   └── scheduling.tsx        ← Integrado com API pública
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── agendamentos/page.tsx
│   │   ├── configuracoes/page.tsx ← Agora com dados reais da API
│   │   └── relatorios/page.tsx
│   └── layout.tsx
└── .env.local
```

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se o backend está rodando em `http://localhost:8000`
- Verifique se o frontend está rodando em `http://localhost:3000`
- Limpe o cache do Laravel: `php artisan config:clear`

### Token não está sendo enviado
- Verifique o localStorage no navegador (DevTools > Application > Local Storage)
- Verifique se o cookie `auth_token` está sendo criado

### Erro 401 (Não autorizado)
- Verifique se o token está válido
- Faça logout e login novamente
- Verifique se a rota requer autenticação

### Erro 404 nas rotas da API
- Execute `php artisan route:list` para verificar as rotas
- Certifique-se de que as migrations foram executadas: `php artisan migrate`
