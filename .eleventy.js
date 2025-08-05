module.exports = function(eleventyConfig) {
  // Copia a pasta 'admin' para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("admin");

  return {
    // Estas são as pastas padrão, mas é bom tê-las aqui
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};