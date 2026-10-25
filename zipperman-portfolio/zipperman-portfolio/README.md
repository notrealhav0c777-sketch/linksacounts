# itsnorealblack · Portfólio Zipperman

Site de portfólio inspirado no Zipperman (Sticky Fingers) do Bruno Bucciarati.
Branco com detalhes dourados e pretos. Os zíperes clicáveis abrem um buraco e fecham normal.

## Como publicar na Vercel

**Pelo site (mais fácil)**
1. Suba esta pasta inteira num repositório do GitHub (a pasta `zipperman-portfolio`, com `package.json` na raiz).
2. Na Vercel: Add New > Project > escolha o repositório.
3. Deixe tudo no padrão (a Vercel detecta Vite) e clique em Deploy.

**Pelo terminal**
```
npm install
npm i -g vercel
vercel
```

## Rodar no seu PC
```
npm install
npm run dev
```

## Estrutura
```
zipperman-portfolio/
├─ index.html
├─ package.json
├─ vite.config.js
├─ vercel.json
├─ public/img/        (imagens do Zipperman)
└─ src/
   ├─ main.jsx
   ├─ App.jsx         (links, curiosidades e textos: edite aqui)
   ├─ Zipper.jsx      (o zíper que abre e fecha)
   └─ styles.css
```

## Editar
- Links, nome e curiosidades: no começo de `src/App.jsx` (SITE, LINKS, GAMES).
- Tamanho da abertura de cada zíper: prop `maxGap` no `<Zipper />`.
