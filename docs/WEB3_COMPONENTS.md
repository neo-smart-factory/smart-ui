# NΞØ Smart Factory — Web3 Components Documentation

**Data:** 2026-01-24  
**Status:** Em desenvolvimento  
**Categoria:** Componentes  
**Audiência:** Desenvolvedores

> **⚠️ Nota:** Estes componentes são para **Phase 2 (Web3 Integration)** e só funcionam quando `FEATURES.phase2.web3 = true`.

---

## 📋 Componentes Disponíveis

### 1. WalletConnect

Componente para conexão de wallet usando **Dynamic.xyz**.

**Localização:** `src/components/WalletConnect.jsx`

**Dependências:**

- `@dynamic-labs/sdk-react-core`
- `@dynamic-labs/ethers-v6`

**Variável de Ambiente:**

- `VITE_DYNAMIC_ENVIRONMENT_ID`

**Uso Básico:**

```jsx
import WalletConnect from "./components/WalletConnect";

function MyComponent() {
  const [userAddress, setUserAddress] = useState(null);

  return (
    <WalletConnect
      userAddress={userAddress}
      setUserAddress={setUserAddress}
      onConnect={(address) => {
        console.log("Wallet connected:", address);
      }}
      onDisconnect={() => {
        console.log("Wallet disconnected");
      }}
    />
  );
}
```

**Props:**

| Prop             | Tipo       | Obrigatório | Descrição                         |
| ---------------- | ---------- | ----------- | --------------------------------- |
| `className`      | `string`   | Não         | Classes CSS adicionais            |
| `onConnect`      | `Function` | Não         | Callback quando wallet conecta    |
| `onDisconnect`   | `Function` | Não         | Callback quando wallet desconecta |
| `userAddress`    | `string`   | Não         | Endereço da wallet (controlado)   |
| `setUserAddress` | `Function` | Não         | Setter para endereço (controlado) |

**Comportamento:**

- Se `FEATURES.phase2.web3 = false`, mostra botão desabilitado com tooltip
- Se Dynamic Environment ID não estiver configurado, mostra botão desabilitado
- Suporta múltiplas wallets: MetaMask, WalletConnect, Coinbase
- Configurado para Base e Polygon networks

**Hook Relacionado:**

```jsx
import { useDynamicWallet } from "./components/WalletConnect";

function MyComponent() {
  const { address, isConnected, provider, signer } = useDynamicWallet();

  // Usar provider/signer para interações blockchain
}
```

---

### 2. TransactionStatus

Componente para exibir status de transações blockchain.

**Localização:** `src/components/TransactionStatus.jsx`

**Uso Básico:**

```jsx
import TransactionStatus, {
  useTransactionStatus,
} from "./components/TransactionStatus";
import { TRANSACTION_STATUS } from "../types/cli";

function MyComponent() {
  const { transaction, setTransaction, clearTransaction } =
    useTransactionStatus();

  const handleDeploy = async () => {
    // Iniciar transação
    setTransaction({
      status: TRANSACTION_STATUS.PENDING,
      txHash: null,
      network: "base",
    });

    try {
      // Executar deploy...
      const result = await deployToken();

      // Atualizar status
      setTransaction({
        status: TRANSACTION_STATUS.CONFIRMED,
        txHash: result.txHash,
        contractAddress: result.contractAddress,
        network: "base",
        blockNumber: result.blockNumber,
      });
    } catch (error) {
      setTransaction({
        status: TRANSACTION_STATUS.FAILED,
        error: error.message,
      });
    }
  };

  return (
    <div>
      {transaction && (
        <TransactionStatus
          status={transaction.status}
          txHash={transaction.txHash}
          network={transaction.network}
          contractAddress={transaction.contractAddress}
          error={transaction.error}
          blockNumber={transaction.blockNumber}
          onDismiss={clearTransaction}
        />
      )}
    </div>
  );
}
```

**Props:**

| Prop              | Tipo       | Obrigatório | Descrição                                     |
| ----------------- | ---------- | ----------- | --------------------------------------------- |
| `status`          | `string`   | Sim         | Status (pending, confirmed, failed, rejected) |
| `txHash`          | `string`   | Não         | Hash da transação                             |
| `network`         | `string`   | Não         | Rede (base, polygon, ethereum)                |
| `contractAddress` | `string`   | Não         | Endereço do contrato                          |
| `error`           | `string`   | Não         | Mensagem de erro                              |
| `blockNumber`     | `number`   | Não         | Número do bloco                               |
| `onDismiss`       | `Function` | Não         | Callback para fechar                          |
| `className`       | `string`   | Não         | Classes CSS adicionais                        |

**Status Suportados:**

- `pending` - Transação pendente (ícone animado)
- `confirmed` - Transação confirmada (verde)
- `failed` - Transação falhou (vermelho)
- `rejected` - Transação rejeitada (laranja)

**Features:**

- Link para explorador de blockchain (Basescan, Polygonscan, Etherscan)
- Botão para copiar hash/endereço
- Animação de loading para transações pendentes
- Auto-dismiss opcional

---

## 🔄 Fluxos de UI

### Fluxo 1: Conexão de Wallet

```
1. Usuário clica em "Connect Wallet"
   ↓
2. Dynamic.xyz modal abre
   ↓
3. Usuário seleciona wallet (MetaMask, WalletConnect, etc.)
   ↓
4. Wallet conecta
   ↓
5. onConnect callback é chamado
   ↓
6. userAddress é atualizado
   ↓
7. UI mostra endereço conectado
```

### Fluxo 2: Deploy de Token

```
1. Usuário preenche formulário de token
   ↓
2. Usuário clica em "Deploy Token"
   ↓
3. Validação do formulário
   ↓
4. TransactionStatus mostra "pending"
   ↓
5. Request é enviado ao CLI
   ↓
6. CLI processa e retorna txHash
   ↓
7. TransactionStatus atualiza com txHash
   ↓
8. Polling do status da transação
   ↓
9. Quando confirmado:
   - TransactionStatus mostra "confirmed"
   - Link para explorador disponível
   - Endereço do contrato exibido
```

### Fluxo 3: Tratamento de Erros

```
1. Transação falha ou é rejeitada
   ↓
2. TransactionStatus mostra "failed" ou "rejected"
   ↓
3. Mensagem de erro é exibida
   ↓
4. Usuário pode:
   - Ver detalhes no explorador (se houver txHash)
   - Tentar novamente
   - Fechar o componente
```

---

## 🔧 Integração com CLI

### Tipos e Interfaces

Todos os tipos estão definidos em `src/types/cli.js`:

- `TokenConfig` - Configuração do token
- `TransactionResult` - Resultado da transação
- `DeployRequest` - Request para deploy
- `DeployResponse` - Response do CLI
- `CLIClient` - Cliente para comunicação com CLI

**Exemplo de uso:**

```jsx
import { TokenConfig, DeployRequest, CLIClient } from "../types/cli";

const cliClient = new CLIClient("/api/cli");

const tokenConfig = new TokenConfig({
  tokenName: "My Token",
  tokenSymbol: "MTK",
  tokenSupply: "1000000",
  network: "base",
  description: "My awesome token",
});

const request = new DeployRequest({
  tokenConfig,
  userAddress: "0x...",
  sessionId: "session_123",
});

const response = await cliClient.deployToken(request);

if (response.success) {
  // Atualizar TransactionStatus
  setTransaction({
    status: TRANSACTION_STATUS.CONFIRMED,
    txHash: response.transaction.txHash,
    contractAddress: response.transaction.contractAddress,
  });
} else {
  // Mostrar erro
  setTransaction({
    status: TRANSACTION_STATUS.FAILED,
    error: response.error,
  });
}
```

---

## 📚 Referências

- [Dynamic.xyz Documentation](https://docs.dynamic.xyz/)
- [Ethers.js v6 Documentation](https://docs.ethers.org/v6/)
- `docs/adr/0001-smart-ui-backend-boundary.md` - Limites arquiteturais
- `docs/NEXT_STEPS.md` - Roadmap e fases

---

## 🚧 Status de Implementação

### ✅ Implementado

- [x] Componente WalletConnect básico
- [x] Componente TransactionStatus
- [x] Tipos e interfaces para CLI
- [x] Hooks auxiliares (useDynamicWallet, useTransactionStatus)

### 🚧 Em Desenvolvimento

- [ ] Integração completa com Dynamic.xyz
- [ ] Integração com Smart CLI
- [ ] Polling de status de transação
- [ ] Tratamento de erros robusto
- [ ] Testes unitários

### 📋 Planejado

- [ ] Suporte a múltiplas redes simultâneas
- [ ] Histórico de transações
- [ ] Notificações push para transações
- [ ] Suporte a assinatura de mensagens

---

## 📅 Última atualização

**Data:** 2026-01-24
