// .eleventy.js - VERSÃO CORRIGIDA

// Importa o pacote js-yaml para ler os arquivos de dados
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Ensina o Eleventy a entender arquivos .yml na pasta _data
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Copia a pasta 'admin' para a pasta de saída '_site' (para o painel funcionar)
  eleventyConfig.addPassthroughCopy("admin");
  // Copia as imagens dos produtos para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // Filtro para formatar um número como um preço em Reais (BRL).
  eleventyConfig.addFilter("formatPrice", function(price) {
    if (typeof price !== 'number') {
      return "Preço indisponível";
    }
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  });

  // Filtro para criar a lista de produtos que será usada na página inicial.
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      // ===================================================================
      // AQUI ESTÁ A CORREÇÃO CRÍTICA:
      // Devemos retornar uma string de array vazio, e não um objeto array.
      return "[]"; 
      // ===================================================================
    }
    const productList = collection.map(product => {
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
        description: product.templateContent.trim().replace(/<p>|<\/p>/g, "")
      };
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
