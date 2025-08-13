# Vital Sync Backend

Backend para requisições HTTP do projeto **Vital Sync** (Monitoramento Remoto de Sinais Vitais).
Implementado em **Node.js** com **TypeScript**.

## Requisitos

* Node.js 18+
* npm 9+ (ou yarn/pnpm)
* TypeScript

## Instalação

```bash
git clone https://github.com/seu-usuario/vital-sync-backend.git
cd vital-sync-backend
npm install
```

## Scripts

* **Desenvolvimento**

  ```bash
  npm run dev
  ```

  Executa o servidor usando `ts-node` com recarga automática (se configurado com nodemon).

* **Build**

  ```bash
  npm run build
  ```

  Compila os arquivos TypeScript para JavaScript na pasta `dist/`.

* **Produção**

  ```bash
  npm start
  ```

  Executa o build compilado.

## Estrutura do Projeto

```
src/
  index.ts        # Ponto de entrada da aplicação
package.json
tsconfig.json
```

## Configuração

As configurações (porta, chaves, etc.) devem ser definidas via variáveis de ambiente ou arquivo `.env`.