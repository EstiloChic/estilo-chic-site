// .eleventy.js - VERSÃO COM ID SANITIZADA

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

  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return "[]";
    }
    const productList = collection.map(product => {
      if (!product || !product.data) return null;
      
      // ===================================================================
      // CORREÇÃO DEFINITIVA DA ID
      // Transforma a URL (ex: /produtos/meu-vestido/) em uma ID segura
      // (ex: produtos-meu-vestido) removendo as barras.
      const safeId = product.url
        .replace(/^\/|\/$/g, '') // Remove a primeira e a última barra
        .replace(/\//g, '-');     // Substitui as barras do meio por hífens
      // ===================================================================

      const cleanProduct = {
        id: safeId, // Usamos a ID segura e única.
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

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};
