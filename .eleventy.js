// .eleventy.js - VERSÃO FINAL COM ORDENAÇÃO EXPLÍCITA

const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // ===================================================================
  // AQUI ESTÁ A CORREÇÃO: ADICIONANDO UMA ORDENAÇÃO EXPLÍCITA
  // ===================================================================
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_products/*.md")
      .sort((a, b) => {
        // Ordena os produtos pela data de adição, do mais novo para o mais antigo
        return new Date(b.data.dateAdded) - new Date(a.data.dateAdded);
      });
  });
  // ===================================================================

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
      
      const rawId = product.data.id || product.url;
      const safeId = String(rawId)
        .replace(/^\/|\/$/g, '')
        .replace(/\//g, '-');

      const cleanProduct = {
        id: safeId,
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
