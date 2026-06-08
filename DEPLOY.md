# Guia de Configuração de Deploy Automático para cPanel

Este guia descreve o passo a passo para configurar as credenciais SSH no cPanel e cadastrá-las no GitHub para ativar o deploy automático via GitHub Actions.

---

## 🔑 Passo 1: Gerar e Autorizar Chave SSH no cPanel

Para que a pipeline do GitHub Actions possa enviar os arquivos com segurança via `rsync`/`ssh`, é necessário gerar uma chave de segurança:

1. **Acesse o cPanel** da Ultraprint.
2. Na barra de busca, procure por **Acesso SSH** (ou *SSH Access*).
3. Clique em **Gerenciar chaves SSH** (ou *Manage SSH Keys*).
4. Clique em **Gerar uma nova chave** (ou *Generate a New Key*):
   - **Nome da chave**: Mantenha o padrão (`id_rsa`) ou mude se preferir.
   - **Senha da chave**: Deixe o campo de senha **em branco** (para que a pipeline do GitHub consiga usá-la de forma automatizada).
   - **Tipo de chave**: `RSA`.
   - **Tamanho da chave**: `2048` ou `4096`.
   - Clique em **Gerar chave**.
5. **Autorizar a chave (Muito Importante)**:
   - Volte para a lista de chaves SSH.
   - Na tabela "Chaves públicas" (*Public Keys*), procure pela chave criada e clique em **Gerenciar** (*Manage*).
   - Clique no botão **Authorize** para habilitar o acesso com esta chave.
6. **Obter a chave privada**:
   - De volta à lista de chaves, na tabela "Chaves privadas" (*Private Keys*), localize a chave gerada e clique em **Visualizar/Baixar** (*View/Download*).
   - Copie todo o conteúdo em formato de texto (incluindo as tags `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`).
   - Guarde este texto, você irá cadastrá-lo como secret no GitHub.

---

## 🛠️ Passo 2: Configurar Segredos no GitHub

Acesse o repositório do projeto no GitHub e vá em **Settings > Secrets and variables > Actions**.

### 1. Adicionar Secrets (Sensíveis)

Clique em **New repository secret** para cada um dos itens abaixo:

| Nome do Secret | Conteúdo |
| :--- | :--- |
| `SSH_PRIVATE_KEY` | Cole a chave privada completa que você copiou no Passo 1. |
| `SSH_HOST` | O endereço IP do seu servidor cPanel (ou hostname de SSH, ex: `ssh.ultraprintrecargas.com.br`). |
| `SSH_USER` | Seu usuário principal do cPanel (utilizado para login). |
| `SSH_PORT` | A porta do SSH (Geralmente `22`. Se a hospedagem for Hostgator, Locaweb, etc., pode ser `2200` ou `2222`). |

### 2. Adicionar Variables (Não Sensíveis)

Clique na aba **Variables** (ao lado de Secrets) e selecione **New repository variable** para configurar os diretórios:

| Nome da Variável | Conteúdo sugerido | Descrição |
| :--- | :--- | :--- |
| `FRONTEND_REMOTE_PATH` | `/home/usuario_cpanel/public_html` | Diretório no cPanel onde a pasta do Frontend estará mapeada. |
| `BACKEND_REMOTE_PATH` | `/home/usuario_cpanel/ultraprint-backend` | Diretório no cPanel onde a pasta do Laravel ficará guardada. |
| `NEXT_PUBLIC_API_URL` | `https://api.ultraprintrecargas.com.br/api` | A URL de produção da API do backend. |

---

## 🚀 Passo 3: Escolhendo como rodar o Next.js no cPanel

No arquivo criado em [deploy.yml](file:///.github/workflows/deploy.yml), deixamos duas opções prontas para o Frontend. Por padrão, a pipeline está configurada para **OPÇÃO 2: Aplicação Node.js Ativa**.

### Se preferir usar Exportação Estática (Sem Node.js ativo)
1. Abra o arquivo [next.config.mjs](file:///d:/dev/ultraprint-regargas-site/frontend/next.config.mjs) e adicione a linha `output: 'export'`:
   ```javascript
   const nextConfig = {
     output: 'export',
     typescript: { ignoreBuildErrors: true },
     images: { unoptimized: true }
   }
   ```
2. Abra o arquivo [deploy.yml](file:///.github/workflows/deploy.yml) e comente o bloco da **OPÇÃO 2** e descomente a linha da **OPÇÃO 1**:
   ```yaml
   # OPÇÃO 1 (Exportação Estática):
   rsync -avz -e "ssh -p ${PORT:-22}" frontend/out/ ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:${{ vars.FRONTEND_REMOTE_PATH }}/
   ```

---

## ⚙️ Passo 4: Primeiro Deploy e Ativação

Depois que configurar os secrets no GitHub:

1. Faça o commit e envie as alterações do repositório local para a branch `main`:
   ```bash
   git add .
   git commit -m "feat: setup github actions deploy workflow to cpanel"
   git push origin main
   ```
2. Acesse a aba **Actions** no seu repositório do GitHub para acompanhar o progresso em tempo real.
3. Se escolheu a **Opção 2 (Node.js)**, certifique-se de ter configurado a aplicação Node no cPanel apontando o diretório inicial para a pasta correspondente à variável `FRONTEND_REMOTE_PATH`.
