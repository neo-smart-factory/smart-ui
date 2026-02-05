```/**
 * Utilitários compartilhados para integração Tavily API
 */
```
/**
 * Executa uma pesquisa na Tavily API
 * @param {string} query - Query de pesquisa
 * @param {object} options - Opções de pesquisa
 * @returns {Promise<object>} Resultado da pesquisa
 */
export async function searchTavily(query, options = {}) {
  const {
    search_depth = 'basic',
    include_answer = true,
    max_results = 10,
    include_domains = [],
  } = options;

  if (!process.env.TAVILY_API_KEY) {
    throw new Error('TAVILY_API_KEY não configurada');
  }

  // SEGURANÇA: API key nunca deve ir no body - usar header de autenticação
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth,
      include_answer,
      include_raw_content: false,
      max_results,
      ...(include_domains.length > 0 && { include_domains }),
    }),
  });

  if (!response.ok) {
    // SEGURANÇA: Não expor detalhes internos no erro
    console.error(`[TAVILY] API error: ${response.status}`);
    throw new Error(`Tavily search failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Extrai tendências do texto de resposta da Tavily
 * @param {string} answer - Texto de resposta da Tavily
 * @returns {string[]} Array de tendências identificadas
 */
export function extractTrends(answer) {
  if (!answer) return [];

  const trendKeywords = ['trending', 'growing', 'increasing', 'popular', 'emerging', 'rising'];
  return answer
    .split('.')
    .filter(sentence => {
      const lower = sentence.toLowerCase().trim();
      return lower.length > 20 && trendKeywords.some(keyword => lower.includes(keyword));
    })
    .slice(0, 5)
    .map(s => s.trim());
}

/**
 * Identifica gaps de mercado mencionados
 * @param {string} answer - Texto de resposta da Tavily
 * @returns {string[]} Array de gaps identificados
 */
export function identifyMarketGaps(answer) {
  if (!answer) return [];

  const gapIndicators = ['lack of', 'missing', 'opportunity', 'gap', 'unmet', 'underserved'];
  return answer
    .split('.')
    .filter(sentence => {
      const lower = sentence.toLowerCase().trim();
      return lower.length > 20 && gapIndicators.some(indicator => lower.includes(indicator));
    })
    .slice(0, 3)
    .map(s => s.trim());
}

/**
 * Gera sugestões alternativas de nome baseado em conflitos
 * @param {string} tokenName - Nome original do token
 * @param {string} symbol - Símbolo original
 * @returns {string[]} Array de sugestões
 */
export function generateSuggestions(tokenName, symbol) {
  const suggestions = [];

  // Adicionar sufixos comuns
  const suffixes = ['Pro', 'Plus', 'X', '2.0', 'Next', 'Prime'];
  suffixes.forEach(suffix => {
    suggestions.push(`${tokenName} ${suffix}`);
    suggestions.push(`${symbol}${suffix}`);
  });

  // Adicionar prefixos
  const prefixes = ['New', 'Super', 'Ultra', 'Meta'];
  prefixes.forEach(prefix => {
    suggestions.push(`${prefix} ${tokenName}`);
  });

  return suggestions.slice(0, 5);
}

/**
 * Valida inputs de nome e símbolo
 * @param {string} tokenName - Nome do token
 * @param {string} symbol - Símbolo do token
 * @throws {Error} Se os inputs forem inválidos
 */
export function validateTokenNameInput(tokenName, symbol) {
  if (!tokenName || typeof tokenName !== 'string') {
    throw new Error('Nome do token é obrigatório');
  }
  if (tokenName.length < 2 || tokenName.length > 50) {
    throw new Error('Nome do token deve ter entre 2 e 50 caracteres');
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Símbolo do token é obrigatório');
  }
  if (symbol.length < 2 || symbol.length > 10) {
    throw new Error('Símbolo deve ter entre 2 e 10 caracteres');
  }
}

/**
 * Extrai informações de tokenomics do texto
 * @param {string} answer - Texto de resposta da Tavily
 * @returns {object} Informações de tokenomics
 */
export function extractTokenomics(answer) {
  if (!answer) return null;

  const tokenomicsKeywords = ['supply', 'distribution', 'vesting', 'allocation', 'tokenomics'];
  const relevantSentences = answer
    .split('.')
    .filter(sentence => {
      const lower = sentence.toLowerCase();
      return tokenomicsKeywords.some(keyword => lower.includes(keyword));
    })
    .slice(0, 3);

  return relevantSentences.length > 0 ? relevantSentences.join('. ') : null;
}
