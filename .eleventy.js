// .eleventy.js - VERSÃO FINAL CORRIGIDA PARA LIQUID

const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByTag("products");
  });

  eleventyConfig.addFilter("formatPrice", function(price) {
    if (typeof price !== 'number') return "Preço indisponível";
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  });

  // ===================================================================
  // CORREÇÃO CRÍTICA: O filtro VOLTA a usar JSON.stringify.
  // Isso é necessário porque o Liquid não tem um filtro 'dump'.
  // O filtro agora entrega a string JSON pronta para o HTML.
  // ===================================================================
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return "[]"; // Retorna uma string de array vazio
    }
    const productList = collection.map(product => {
      if (!product || !product.data) return null;
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
    }).filter(p => p);

    // Converte a lista de objetos em texto JSON
    return JSON.stringify(productList);
  });
  // ===================================================================

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
