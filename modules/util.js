// util.js

// Definição manual da função debounce para evitar dependências de bibliotecas externas
function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

// Acesso ao estilo da raiz do documento para manipulação de variáveis CSS
export const rootStyle = document.documentElement.style;

// Função para recarregar a página com um pequeno atraso, evitando loops de recarregamento
export const debouncedReload = debounce(() => window.location.reload(), 100);
