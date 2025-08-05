module.exports = function(eleventyConfig) {
  // Copia a pasta 'admin' para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("admin");

  // NOVO: Filtro personalizado para formatar números como preço (ex: 30 -> 30,00)
  eleventyConfig.addFilter("formatPrice", function(value) {
    if (typeof value !== 'number') {
      return value;
    }
    return Number(value).toFixed(2).replace('.', ',');
  });

  return {
    // Estas são as pastas padrão, mas é bom tê-las aqui
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
