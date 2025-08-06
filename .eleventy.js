// .eleventy.js - VERSÃO FINAL E CORRIGIDA

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
  // CORREÇÃO DEFINITIVA: A "ponte" de dados.
  // Agora, o ID de cada produto será a sua URL, que é sempre única.
  // Isso garante que todos os produtos, antigos e novos, tenham um ID.
  // ===================================================================
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return "[]";
    }
    const productList = collection.map(product => {
      if (!product || !product.data) return null;
      
      const cleanProduct = {
        // A MUDANÇA CRÍTICA ESTÁ AQUI:
        id: product.url, // Usamos a URL como ID único e confiável.
        name: product.data.name,
        price: product.data.price,
        originalPrice: product.data.originalPrice,
        image: product.data.image,
        category: product.data.category,
        badge: product.data.badge,
        dateAdded: product.data.dateAdded,
        url: product.url,
        description: product.templateContent ? product.templateContent.trim().replace(/<p>|<\/p>/g, "") : "",
        size: product.data.size || null
      };
      return cleanProduct;
    }).filter(p => p);

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
