// Importa o pacote js-yaml para ler os arquivos de dados
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Ensina o Eleventy a entender arquivos .yml na pasta _data
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Copia a pasta 'admin' para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("admin");

  // Filtro personalizado para formatar números como preço (ex: 30 -> 30,00)
  eleventyConfig.addFilter("formatPrice", function(value) {
    if (typeof value !== 'number') {
      return value;
    }
    return Number(value).toFixed(2).replace('.', ',');
  });

  // Filtro para criar uma lista limpa de produtos para o JavaScript
  eleventyConfig.addLiquidFilter("getProductList", function(collection) {
    if (!collection) {
      return [];
    }
    const productList = collection.map(product => {
      // Cria um objeto base com os campos que sempre existem
      const cleanProduct = {
        id: product.data.id,
        name: product.data.name,
        price: product.data.price,
        originalPrice: product.data.originalPrice,
        image: product.data.image,
        category: product.data.category,
        badge: product.data.badge,
        dateAdded: product.data.dateAdded,
        url: product.url,
        description: product.templateContent.trim()
      };

      // *** A CORREÇÃO ESTÁ AQUI ***
      // Só adiciona a propriedade 'size' se ela existir no arquivo .md
      if (product.data.size) {
        cleanProduct.size = product.data.size;
      }

      return cleanProduct;
    });
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
