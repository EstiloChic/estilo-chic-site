// .eleventy.js - VERSÃO FINAL E SEGURA

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
  // MUDANÇA IMPORTANTE: O filtro agora retorna o array de objetos diretamente.
  // Eleventy irá lidar com a conversão para JSON de forma segura com o filtro 'dump'.
  // ===================================================================
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return [];
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

    return productList;
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
