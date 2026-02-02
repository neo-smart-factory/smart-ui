/**
 * Hook useDebounce para debouncing de valores
 * Útil para otimizar performance em inputs e buscas
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Debounce de valor
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms
 * @returns {any} - Valor debounced
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar timeout se valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook useDebounceCallback para debouncing de callbacks
 * @param {Function} callback - Callback a ser executado
 * @param {number} delay - Delay em ms
 * @param {Array} deps - Dependências
 * @returns {Function} - Callback debounced
 */
export function useDebounceCallback(callback, delay = 500, deps = []) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Atualizar ref quando callback mudar
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };

  return debouncedCallback;
}

export default useDebounce;
