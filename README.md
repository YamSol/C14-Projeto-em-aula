# Vital Sync Backend

Backend para requisições HTTP do projeto **Vital Sync** (Monitoramento Remoto de Sinais Vitais).
Implementado em **Node.js** com **TypeScript**.

## Features

*   **Autenticação de Usuários:** Sistema de login seguro para acesso à plataforma.
*   **Banco de Dados com Prisma:** Utiliza o ORM Prisma para uma interação simplificada e segura com o banco de dados SQLite.
*   **Estrutura MVC:** Código organizado seguindo o padrão Model-View-Controller para maior clareza e manutenibilidade.

## Requisitos

*   Node.js 18+
*   npm 9+ (ou yarn/pnpm)
*   TypeScript

## Instalação

1.  **Clonar o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/vital-sync-backend.git
    cd vital-sync-backend
    ```

2.  **Instalar as dependências:**

    ```bash
    npm install
    ```

3.  **Configurar o banco de dados:**

    Crie uma cópia do arquivo `.env.example` e renomeie para `.env`. O arquivo já está configurado para usar o banco de dados SQLite.

    Execute as migrações do Prisma para criar as tabelas do banco de dados:

    ```bash
    npx prisma migrate dev
    ```

## Scripts

*   **Desenvolvimento:**

    ```bash
    npm run dev
    ```

    Executa o servidor usando `ts-node` com recarga automática.

*   **Build:**

    ```bash
    npm run build
    ```

    Compila os arquivos TypeScript para JavaScript na pasta `dist/`.

*   **Produção:**

    ```bash
    npm start
    ```

    Executa o build compilado.

*   **Criar um novo usuário:**

    ```bash
    npm run user:create
    ```

    Executa um script para criar um novo usuário no banco de dados.

## Banco de Dados

O projeto utiliza **SQLite** como banco de dados, gerenciado pelo **Prisma ORM**.

*   O schema do banco de dados está definido em `prisma/schema.prisma`.
*   As migrações são salvas na pasta `prisma/migrations`.

Para gerar um novo migration após alterar o `schema.prisma`, execute:

```bash
npx prisma migrate dev --name "nome-da-migration"
```

## Autenticação

A autenticação é baseada em rotas seguras. Para acessar os endpoints protegidos, é necessário obter um token de acesso.

## Configuração

As configurações (porta, chaves, etc.) devem ser definidas via variáveis de ambiente ou arquivo `.env`.

---

## Como rodar em um novo computador

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd VitalSync-Backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o ambiente:**
   - Copie `.env.example` para `.env` e ajuste as variáveis se necessário.

4. **Gere o banco de dados e o client do Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **(Opcional) Crie um usuário de teste:**
   ```bash
   npx ts-node src/scripts/createTestUser.ts
   ```

6. **Inicie o servidor em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

7. **Acesse a API:**
   - API: [http://localhost:3001](http://localhost:3001)
   - Swagger: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
