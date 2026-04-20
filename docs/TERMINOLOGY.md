# Terminologia Canônica — Smart UI Core

Este documento define a nomenclatura oficial para evitar ambiguidade entre repositórios e agentes.

## Nome oficial deste repositório

- **Smart UI Core** (`smart-ui`)

## Escopo oficial

- Interface principal do produto (Demo and Intent Layer)
- PWA e fluxo Web3 do Smart Factory
- API routes de suporte em `api/` (não autoritativas de protocolo)

## Fora do escopo deste repositório

- Landing page de marketing (usar `smart-ui-landing`)
- App mobile/MiniApp (usar `smart-ui-mobile`)
- Autoridade de protocolo e contratos (usar `smart-core`)

## Termos permitidos

- `Smart UI Core`
- `smart-ui`
- `UI Core`

## Termos legados (evitar em novos arquivos)

- `dashboard` (usar apenas quando necessário para compatibilidade histórica)
- `app principal`
- `landing` para se referir a este repositório

## Regra para scripts e docs novos

- Preferir nomes canônicos: `dev-ui`, `build-ui`, `test-ui`.
- Se mantiver aliases legados, marcar explicitamente como "compatibilidade".
- Em docs operacionais, sempre citar o projeto Vercel canônico em uso.
