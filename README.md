# Estudo Bíblico — Novo Testamento

Projeto em **React** (Vite): estudo do Novo Testamento por livro, capítulo e versículo — texto, contexto e prática.

## Como rodar

```bash
npm install
npm run dev
```

Abra no navegador o endereço que aparecer (ex.: **http://localhost:5173**).

## Scripts

- **`npm run dev`** — servidor de desenvolvimento
- **`npm run build`** — build para produção (pasta `dist/`) — usado pelo Firebase
- **`npm run build:gh`** — build para GitHub Pages (base `/biblia/`)
- **`npm run preview`** — preview do build
- **`npm run deploy:firebase`** — build + deploy no Firebase Hosting
- **`npm run deploy`** — build para GitHub + publicar na branch `gh-pages`

## Deploy no Firebase Hosting

1. Instale a CLI (se ainda não tiver): **`npm install -g firebase-tools`**
2. Faça login (abre o navegador): **`firebase login`**
3. Vincule o projeto (primeira vez): **`firebase use --add`** e escolha ou crie um projeto no Firebase.
4. Gere o build e publique: **`npm run deploy:firebase`**

O site ficará em **https://seu-projeto.web.app** (ou no domínio que você configurar no Firebase).

## Estrutura

- **`src/`** — React: páginas (Início, Livro), componentes, dados dos livros
- **`public/estudo/`** — arquivos Markdown dos 27 livros (copiados de `estudo/`)
- **`estudo/`** — fontes dos estudos em `.md` (edite aqui; para atualizar o app, copie de novo para `public/estudo/`)

## Tecnologias

- React 18
- Vite 5
- React Router DOM
- react-markdown (renderização do conteúdo)
