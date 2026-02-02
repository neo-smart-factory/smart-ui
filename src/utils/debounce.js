/**
 * Utilitário de debounce otimizado para performance
 * Previne chamadas excessivas de funções
 */

/**
 * Debounce com cancelamento e leading/trailing options
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @param {Object} options - Opções (leading, trailing)
 * @returns {Function} - Função debounced
 */
export function debounce(func, wait = 300, options = {}) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastCallTime = 0;
  const { leading = false, trailing = true, maxWait = null } = options;

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    lastCallTime = time;

    return func.apply(thisArg, args);
  }

  function startTimer(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    clearTimeout(id);
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    
    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      (maxWait !== null && timeSinceLastCall >= maxWait)
    );
  }

  function leadingEdge(time) {
    lastCallTime = time;
    timeoutId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  }

  function trailingEdge(time) {
    timeoutId = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;
    return undefined;
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    const timeSinceLastCall = time - lastCallTime;
    const timeWaiting = wait - timeSinceLastCall;
    timeoutId = startTimer(timerExpired, timeWaiting);
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
      if (maxWait !== null) {
        timeoutId = startTimer(timerExpired, wait);
        return invokeFunc(time);
      }
    }
    if (timeoutId === null) {
      timeoutId = startTimer(timerExpired, wait);
    }
    return undefined;
  }

  debounced.cancel = function() {
    if (timeoutId !== null) {
      cancelTimer(timeoutId);
    }
    lastCallTime = 0;
    lastArgs = lastThis = timeoutId = null;
  };

  debounced.flush = function() {
    return timeoutId === null ? undefined : trailingEdge(Date.now());
  };

  debounced.pending = function() {
    return timeoutId !== null;
  };

  return debounced;
}

/**
 * Throttle - Garante que função seja executada no máximo uma vez por intervalo
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function throttle(func, wait = 300) {
  return debounce(func, wait, {
    leading: true,
    trailing: false,
    maxWait: wait
  });
}

export default debounce;
