// .eleventy.js - VERSÃO FINAL, ROBUSTA E CORRIGIDA

const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // Agora, lê corretamente da pasta unificada "_products"
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_products/*.md");
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
      // LÓGICA DE ID À PROVA DE FALHAS:
      // 1. Tenta usar a ID do arquivo (product.data.id).
      // 2. Se não existir, usa a URL como fallback.
      // 3. Limpa a ID para ser segura para o HTML.
      // ===================================================================
      const rawId = product.data.id || product.url;
      const safeId = String(rawId)
        .replace(/^\/|\/$/g, '')
        .replace(/\//g, '-');

      const cleanProduct = {
        id: safeId, // Usa a ID segura e garantida
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
