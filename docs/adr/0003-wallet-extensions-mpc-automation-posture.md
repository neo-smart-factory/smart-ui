# ADR 0003: Postura sobre Extensões de Carteiras, MPC e Automação

**Status**: Aceito  
**Data**: 2026-01-22  
**Versão**: 1.0.0  
**Decisores**: Governança Técnica NΞØ Smart Factory  
**Contexto**: Arquitetura de Segurança e Governança

---

## Contexto

O ecossistema Web3 está em rápida evolução, com novas abstrações surgindo constantemente:

- **Wallet Snaps** (MetaMask e outros): Extensões de terceiros instaláveis em carteiras
- **MPC Wallets**: Carteiras baseadas em Multi-Party Computation
- **MCP** (Model Context Protocol): Protocolos de interação entre agentes inteligentes
- **Automação de transações**: Delegação de autoridade para agentes autônomos

Essas tecnologias prometem melhorar UX, segurança e interoperabilidade, mas também introduzem novos vetores de risco.

---

## Decisão

**A NΞØ Smart Factory adota uma postura deliberadamente cautelosa em relação a:**

1. **Extensões de carteiras de terceiros** (Snaps, plugins, etc.)
2. **Wallets MPC em estágio experimental/beta**
3. **Automação de transações sem controle explícito**
4. **Delegação de autoridade para agentes não auditados**

**Não incorporaremos essas tecnologias até que:**

- ✓ Atinjam maturidade técnica comprovada
- ✓ Tenham histórico consolidado de auditorias
- ✓ Demonstrem uso prolongado em produção
- ✓ Apresentem modelo de governança claro
- ✓ Reduzam risco sistêmico ao invés de ampliá-lo

---

## Justificativa

### 1. Superfície de Ataque Ampliada

Extensões de terceiros transferem parte da superfície de segurança para código mantido por desenvolvedores independentes com diferentes níveis de:

- Maturidade técnica
- Processos de auditoria
- Governança
- Responsabilidade legal

### 2. Complexidade Operacional

MPC wallets em estágio inicial introduzem:

- Complexidade de implementação
- Dificuldade de debugging
- Pontos únicos de falha não óbvios
- Dependências de infraestrutura distribuída

### 3. Atração de Agentes Oportunistas

Tecnologias experimentais historicamente atraem:

- Exploração de fragilidades técnicas
- Aproveitamento de lacunas de responsabilidade
- Ataques de engenharia social
- Exploits de superfícies de ataque não mapeadas

### 4. Responsabilidade Institucional

Como infraestrutura crítica, priorizamos:

- **Controle explícito** sobre **automação opaca**
- **Rastreabilidade** sobre **conveniência**
- **Simplicidade verificável** sobre **abstração complexa**
- **Governança clara** sobre **delegação distribuída**

---

## Consequências

### Positivas

- ✓ Redução de risco sistêmico
- ✓ Controle arquitetural mantido
- ✓ Clareza operacional
- ✓ Confiança de stakeholders preservada
- ✓ Responsabilidade legal clara
- ✓ Superfície de ataque minimizada

### Negativas

- ❌ Possível percepção de "atraso tecnológico"
- ❌ UX potencialmente menos "moderna"
- ❌ Menor integração com ecossistema de extensões
- ❌ Necessidade de comunicação clara da decisão

### Mitigações

- Documentação transparente da decisão (este ADR)
- Comunicação proativa sobre princípios de segurança
- Monitoramento contínuo de maturidade das tecnologias
- Reavaliação periódica conforme ecossistema evolui

---

## Critérios de Reavaliação

Esta decisão será reavaliada quando:

1. **Auditorias independentes** de alta qualidade forem publicadas
2. **Uso em produção** por organizações de referência for consolidado
3. **Padrões de governança** claros forem estabelecidos
4. **Histórico de incidentes** demonstrar baixo risco sistêmico
5. **Frameworks de responsabilidade legal** forem definidos

---

## Alternativas Consideradas

### Alternativa 1: Adoção Imediata

**Rejeitada** porque:

- Risco sistêmico alto
- Maturidade técnica insuficiente
- Responsabilidade legal não clara

### Alternativa 2: Implementação Experimental Isolada

**Considerada para futuro** quando:

- Ambiente de sandbox estiver disponível
- Equipe de segurança puder auditar
- Usuários puderem optar conscientemente

### Alternativa 3: Integração Seletiva

**Possível no futuro** para:

- Extensões auditadas por terceiros confiáveis
- MPC wallets com histórico comprovado
- Automação com controle explícito do usuário

---

## Referências

- [ARCHITECTURAL_ADDENDUMS.md](../ARCHITECTURAL_ADDENDUMS.md)
- [MetaMask Snaps Documentation](https://docs.metamask.io/snaps/)
- [MPC Wallet Security Considerations](https://eprint.iacr.org/2020/492.pdf)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

---

## Notas

Esta decisão **não é uma rejeição permanente** dessas tecnologias, mas um **posicionamento consciente de timing e maturidade**.

A NΞØ Smart Factory reconhece o valor dessas inovações e acompanha ativamente sua evolução, mas prioriza **segurança de longo prazo** sobre **adoção prematura**.

---

**Próxima Revisão**: Trimestral ou mediante evento significativo no ecossistema
