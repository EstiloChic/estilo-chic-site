// .eleventy.js - VERSÃO FINAL E CORRIGIDA

const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Ensina o Eleventy a entender arquivos .yml na pasta _data
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Copia a pasta 'admin' e as imagens para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // ===================================================================
  // CORREÇÃO CRÍTICA: Definindo a coleção de produtos explicitamente
  // Isso diz ao Eleventy para procurar por todos os arquivos que têm a tag "products".
  // É a forma mais robusta de garantir que a coleção seja criada.
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByTag("products");
  });
  // ===================================================================

  // Filtro para formatar um número como um preço em Reais (BRL).
  eleventyConfig.addFilter("formatPrice", function(price) {
    if (typeof price !== 'number') {
      return "Preço indisponível";
    }
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  });

  // Filtro para criar a lista de produtos em formato JSON para a página inicial.
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return "[]";
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
        description: product.templateContent ? product.templateContent.trim().replace(/<p>|<\/p>/g, "") : ""
      };
      if (product.data.size) {
        cleanProduct.size = product.data.size;
      }
      return cleanProduct;
    }).filter(p => p); // Garante que nenhum item nulo entre na lista

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
