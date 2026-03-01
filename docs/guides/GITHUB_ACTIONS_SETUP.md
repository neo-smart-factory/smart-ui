# Configuração do GitHub Actions — NΞØ Smart Mint Protocol

**Data:** 2026-01-24  
**Status:** Ativo  
**Categoria:** Guia  
**Audiência:** DevOps

Este documento descreve a configuração dos workflows de GitHub Actions para o repositório Smart UI, incluindo o **Docs Guard** e o **NΞØ Protocol Health Check**.

---

## Workflow: Docs Guard

O workflow **Docs Guard** garante que todas as alterações de código sejam acompanhadas de atualizações na documentação.

### Como Funciona

1. **Análise de Arquivos**: O workflow analisa todos os arquivos modificados no PR
2. **Categorização**: Separa os arquivos em duas categorias:
   - Arquivos de código/configuração
   - Arquivos de documentação (_.md e docs/_)
3. **Verificação**: Se houver mudanças no código sem mudanças na documentação, o workflow falha
4. **Sugestões Inteligentes**: Fornece sugestões específicas sobre quais arquivos de documentação devem ser atualizados

### Logs Detalhados

O Docs Guard agora fornece logs detalhados incluindo:

- Lista completa de arquivos alterados categorizados
- Contagem de arquivos de código vs. documentação
- Sugestões específicas baseadas nos tipos de arquivos alterados
- Orientações sobre o que incluir na documentação

### Exemplos de Sugestões

- Mudanças em `.github/workflows/*` → Atualizar `docs/GITHUB_ACTIONS_SETUP.md`
- Mudanças em `src/*`, `components/*`, `pages/*` → Atualizar `README.md` ou `docs/PROJECT_OVERVIEW.md`
- Mudanças em `api/*` → Atualizar `docs/PROJECT_OVERVIEW.md`
- Mudanças em `scripts/*` ou `Makefile` → Atualizar `README.md`
- Mudanças em `package.json` ou arquivos de configuração → Atualizar `README.md`

## Workflow: NΞØ Protocol Health Check

O workflow de **Health Check** verifica a integridade do ecossistema NΞØ Smart Factory.

### Como Funciona

O workflow executa automaticamente em:

- Pushes para as branches `main` ou `master`
- Pull Requests para as branches `main` ou `master`

### Passos de Verificação

1. **Checkout dos Repositórios**: Faz checkout do Smart UI e opcionalmente do neo-smart-factory
2. **Instalação de Dependências**: Instala as dependências do projeto
3. **Health Check**: Executa `make health` para verificar o status de todos os componentes

### Logs Detalhados

O Health Check agora fornece logs formatados incluindo:

- Status de cada componente do ecossistema
- Paths dos componentes vinculados localmente
- Indicação clara de componentes opcionais vs. críticos
- Confirmação visual do status operacional

### Configuração Opcional

O workflow funciona sem configuração adicional, mas para habilitar a verificação completa do ecossistema (incluindo o repositório `neo-smart-factory`), você pode opcionalmente configurar um token de acesso.

### 1. Gerar o Personal Access Token (PAT) (Opcional)

Este token permite que o GitHub Actions do `smart-ui` "enxergue" o repositório `neo-smart-factory` para verificações completas do ecossistema. **Se não configurado, o workflow ainda funcionará, mas sem acesso ao repositório neo-smart-factory.** 2. Clique em **Generate new token (classic)**. 3. **Note**: Nomeie como `NEO_ECOSYSTEM_ACTION_TOKEN`. 4. **Expiration**: Escolha uma data de expiração ou "No expiration" (conforme sua política de segurança). 5. **Scopes**: Selecione apenas o escopo **`repo`** (Full control of private repositories). 6. Clique em **Generate token**. 7. **IMPORTANTE**: Copie o token gerado agora. Você não conseguirá vê-lo novamente.

## 2. Configurar o Secret no Repositório `smart-ui`

Agora, adicione esse token como uma variável segura no repositório da interface:

1. Vá para a página do seu repositório **`smart-ui`** no GitHub.
2. Clique na aba **Settings** (do repositório).
3. No menu lateral, vá em **Secrets and variables** > **Actions**.
4. Clique em **New repository secret**.
5. **Name**: `NEO_ECOSYSTEM_TOKEN` (Deve ser exatamente este nome).
6. **Value**: Cole o token que você copiou no passo anterior.
7. Clique em **Add secret**.

## 3. Verificação

Após a configuração (ou sem ela):

- O próximo **Push** ou **Pull Request** disparará automaticamente o workflow `.github/workflows/protocol-health.yml`.
- Você poderá acompanhar o status na aba **Actions** do repositório.
- **Nota**: Se o token `NEO_ECOSYSTEM_TOKEN` não estiver configurado, o checkout do repositório `neo-smart-factory` será ignorado, mas o workflow continuará e será bem-sucedido.

---

### Diagnóstico Local

Para testar a saúde do ecossistema na sua máquina local antes de enviar para o GitHub, utilize:

```bash
make health
```

Isso verificará se os repositórios `smart-core` e `smart-cli` estão corretamente vinculados nos diretórios vizinhos.
