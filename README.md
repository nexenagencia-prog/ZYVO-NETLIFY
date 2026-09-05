# ZYVO APP

Interface do ZYVO construída a partir da referência visual aprovada.

## Recursos implementados

- Home 1672×941 usando a arte aprovada como fonte visual de verdade.
- Botões e navegação superiores clicáveis.
- Busca funcional com encaminhamento para `/reunioes?q=...`.
- Menu lateral expansível e recolhível, com rótulos.
- Malha facial SVG animada simulando leitura em tempo real.
- Respeito a `prefers-reduced-motion`.
- Rotas válidas para Agenda, Skills, Planos, Login, Reuniões, Anotações, Slides, Gravações, Contatos, Configurações e Notificações.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Projeto preparado para deploy na Vercel.
