# Ultraprint Recargas - Sistema Completo

Sistema completo com frontend Next.js e backend Laravel integrados.

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Backend
- **Laravel 12** - Framework PHP
- **PostgreSQL** - Banco de dados
- **Laravel Sanctum** - Autenticação API

## 📁 Estrutura do Projeto

```
ultraprint-regargas-site/
├── frontend/          # Aplicação Next.js
│   ├── app/          # Páginas e rotas
│   ├── components/   # Componentes React
│   └── lib/          # Utilitários e serviços
│       ├── api.ts    # Cliente HTTP
│       └── auth.ts   # Serviço de autenticação
│
├── backend/          # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── routes/
│   │   └── api.php
│   └── database/
│
└── INTEGRACAO.md    # Documentação detalhada
```

## ⚙️ Configuração

### 1. Backend (Laravel)

#### Requisitos
- PHP 8.2+
- PostgreSQL
- Composer

#### Instalação

```bash
cd backend

# Instalar dependências (já feito)
composer install

# Configurar .env (já configurado)
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5433
# DB_DATABASE=ultraprintrecargas
# DB_USERNAME=postgres
# DB_PASSWORD=1234567

# Executar migrations e seeders (já feito)
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve
```

O backend estará em: **http://localhost:8000**

### 2. Frontend (Next.js)

#### Requisitos
- Node.js 18+
- npm ou pnpm

#### Instalação

```bash
cd frontend

# Instalar dependências
npm install

# Configurar .env.local (já configurado)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará em: **http://localhost:3000**

## 🔐 Credenciais de Teste

Um usuário admin foi criado automaticamente:

- **Email:** admin@ultraprint.com
- **Senha:** senha123

## 📡 API Endpoints

### Públicos
- `POST /api/login` - Autenticação
- `POST /api/register` - Registro de usuário
- `GET /api/health` - Status da API

### Protegidos (requer token)
- `GET /api/me` - Dados do usuário
- `POST /api/logout` - Encerrar sessão

## 🧪 Testando a Integração

### 1. Testar API diretamente

```bash
# Health check
curl http://localhost:8000/api/health

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ultraprint.com","password":"senha123"}'
```

### 2. Testar via Frontend

1. Acesse: http://localhost:3000/login
2. Use as credenciais de teste
3. Você será redirecionado para o dashboard

## 📝 Próximos Passos

### Backend
- [ ] Criar models e migrations para:
  - Produtos
  - Pedidos
  - Clientes
  - Agendamentos
- [ ] Implementar controllers da API
- [ ] Adicionar validações
- [ ] Configurar permissões e roles

### Frontend
- [ ] Criar context de autenticação
- [ ] Implementar proteção de rotas
- [ ] Conectar páginas do dashboard à API
- [ ] Adicionar gerenciamento de estado
- [ ] Implementar formulários completos

## 🛠️ Comandos Úteis

### Backend
```bash
# Limpar cache
php artisan config:clear
php artisan cache:clear

# Criar controller
php artisan make:controller Api/NomeController

# Criar model com migration
php artisan make:model Nome -m

# Ver rotas
php artisan route:list
```

### Frontend
```bash
# Build para produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
```

## 📚 Documentação

- [Documentação de Integração](./INTEGRACAO.md) - Detalhes técnicos completos
- [Laravel Docs](https://laravel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)

## 🐛 Troubleshooting

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando na porta 5433
- Confirme as credenciais no arquivo `.env`
- Execute: `php artisan config:clear`

### Frontend não conecta à API
- Verifique se o backend está rodando em http://localhost:8000
- Confirme o arquivo `.env.local` no frontend
- Verifique o console do navegador para erros de CORS

### Erro 401 ao fazer requisições
- Faça logout e login novamente
- Verifique se o token está sendo salvo no localStorage
- Limpe o cache do navegador

## 📄 Licença

Todos os direitos reservados - Ultraprint Recargas © 2026
