module.exports = function(eleventyConfig) {
  // Copia a pasta 'admin' para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("admin");

  // Filtro personalizado para formatar números como preço (ex: 30 -> 30,00)
  eleventyConfig.addFilter("formatPrice", function(value) {
    if (typeof value !== 'number') {
      return value;
    }
    return Number(value).toFixed(2).replace('.', ',');
  });

  // CORRIGIDO: Registra a função como um FILTRO para Liquid, não como uma função JS.
  // Isso resolve o erro "undefined filter: getProductList".
  eleventyConfig.addLiquidFilter("getProductList", function(collection) {
    if (!collection) {
      return [];
    }
    const productList = collection.map(product => {
      return {
        id: product.data.id,
        name: product.data.name,
        price: product.data.price,
        originalPrice: product.data.originalPrice,
        image: product.data.image,
        category: product.data.category,
        size: product.data.size,
        badge: product.data.badge,
        dateAdded: product.data.dateAdded,
        url: product.url,
        description: product.templateContent.trim()
      };
    });
    // Converte a lista limpa para uma string JSON
    return JSON.stringify(productList);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
