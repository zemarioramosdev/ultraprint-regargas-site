# Instruções de Instalação do Laravel

## ✅ Laravel instalado com sucesso!

O Laravel foi instalado na pasta `backend` com todas as dependências.

## ⚠️ Configurações Necessárias

### 1. Habilitar Extensões PHP para PostgreSQL

Você precisa habilitar as seguintes extensões no arquivo `php.ini` (localizado em `C:\php\php.ini`):

```ini
extension=fileinfo
extension=pdo_pgsql
extension=pgsql
```

**Como fazer:**
1. Abra o arquivo `C:\php\php.ini` em um editor de texto
2. Procure pelas linhas acima (podem estar com `;` na frente)
3. Remova o `;` do início de cada linha para descomentá-las
4. Salve o arquivo
5. Reinicie o terminal ou servidor web

### 2. Configurar Banco de Dados PostgreSQL

O arquivo `.env` já foi configurado para PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ultraprintrecargas
DB_USERNAME=postgres
DB_PASSWORD=
```

**Ajuste se necessário:**
- `DB_USERNAME`: seu usuário do PostgreSQL
- `DB_PASSWORD`: sua senha do PostgreSQL (se houver)

### 3. Executar Migrations

Após habilitar as extensões PHP, execute:

```bash
cd backend
php artisan migrate
```

### 4. Iniciar o Servidor

Para iniciar o servidor de desenvolvimento:

```bash
cd backend
php artisan serve
```

O servidor estará disponível em: `http://localhost:8000`

## 📝 Próximos Passos

- Configurar CORS para permitir requisições do frontend
- Criar controllers e models para sua aplicação
- Configurar autenticação (Laravel Sanctum ou Passport)
- Criar rotas da API

## 🔧 Comandos Úteis

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Criar controller
php artisan make:controller NomeController

# Criar model
php artisan make:model NomeModel -m

# Criar migration
php artisan make:migration create_nome_table
```
