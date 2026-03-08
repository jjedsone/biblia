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
- **`npm run build`** — build para produção (pasta `dist/`)
- **`npm run preview`** — preview do build

## Estrutura

- **`src/`** — React: páginas (Início, Livro), componentes, dados dos livros
- **`public/estudo/`** — arquivos Markdown dos 27 livros (copiados de `estudo/`)
- **`estudo/`** — fontes dos estudos em `.md` (edite aqui; para atualizar o app, copie de novo para `public/estudo/`)

## Tecnologias

- React 18
- Vite 5
- React Router DOM
- react-markdown (renderização do conteúdo)
