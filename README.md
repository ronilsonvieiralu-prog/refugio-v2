# 🏠 Refúgio — Ajuda Mútua

Plataforma de ajuda mútua para desktop e celular. Conecta pessoas que precisam de ajuda com pessoas que querem ajudar.

## ✨ Funcionalidades

- **🙏 Pedir Ajuda** — Publique um pedido de ajuda descrevendo sua necessidade
- **🌟 Oferecer Ajuda** — Publique o que você pode oferecer à comunidade
- **📋 Listagens** — Veja todos os pedidos e ofertas com filtros por tipo, categoria e busca por texto
- **📱 Responsivo** — Funciona em celular, tablet e desktop
- **🖥️ App Desktop** — Empacotado com Electron para Windows, macOS e Linux
- **💾 Persistência local** — Dados salvos automaticamente no dispositivo

## 🗂️ Categorias de Ajuda

| Categoria | Exemplos |
|---|---|
| 🍽️ Alimentação | Cestas básicas, refeições, alimentos |
| 🏠 Moradia | Abrigo temporário, ajuda com aluguel |
| 🚗 Transporte | Caronas, passagem, frete |
| 🏥 Saúde | Medicamentos, consultas, cuidados |
| 👕 Roupas | Vestuário, calçados |
| 💙 Apoio Emocional | Escuta, companhia, suporte |
| 📚 Educação | Aulas, material escolar, cursos |
| 💼 Trabalho | Emprego, renda extra, habilidades |
| 🤝 Outro | Qualquer outra necessidade |

## 🚀 Como Usar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+

### Instalação

```bash
npm install
```

### Rodar no Navegador (web/mobile)

```bash
npm start
```

Acesse em [http://localhost:3000](http://localhost:3000). Também funciona em dispositivos móveis na mesma rede local.

### Rodar como App Desktop (Electron)

```bash
npm run electron:start
```

Isso inicia o servidor React e abre a janela do Electron automaticamente.

### Compilar App Desktop

```bash
npm run electron:build
```

Os instaladores serão gerados na pasta `dist/`.

### Testes

```bash
npm test
```

## 📁 Estrutura do Projeto

```
refugio-v2/
├── electron/
│   └── main.js          # Processo principal do Electron
├── public/
│   └── index.html       # Template HTML
├── src/
│   ├── components/
│   │   ├── Header.js    # Cabeçalho com navegação
│   │   ├── Footer.js    # Rodapé
│   │   ├── HelpCard.js  # Card de pedido/oferta
│   │   └── HelpForm.js  # Formulário de publicação
│   ├── hooks/
│   │   └── useHelpItems.js  # Hook para localStorage
│   ├── pages/
│   │   ├── Home.js      # Página inicial
│   │   ├── RequestHelp.js   # Pedir ajuda
│   │   ├── OfferHelp.js     # Oferecer ajuda
│   │   └── Listings.js      # Listagens
│   ├── App.js           # Roteamento principal
│   └── index.js         # Ponto de entrada
└── package.json
```

## 🛠️ Tecnologias

- [React](https://reactjs.org/) — Interface do usuário
- [React Router](https://reactrouter.com/) — Roteamento de páginas
- [Electron](https://www.electronjs.org/) — App desktop
- [electron-builder](https://www.electron.build/) — Empacotamento desktop
- CSS responsivo nativo — Sem dependências de UI

## 📜 Licença

MIT
