// .eleventy.js - COMPLETO E ATUALIZADO

const yaml = require("js-yaml");

// --- INÍCIO DA NOVA CONFIGURAÇÃO ---
// Importa a biblioteca de Markdown que o Eleventy usa
const markdownIt = require("markdown-it");
// --- FIM DA NOVA CONFIGURAÇÃO ---


module.exports = function(eleventyConfig) {
  // --- INÍCIO DA NOVA CONFIGURAÇÃO ---
  // Configura o Eleventy para permitir o uso de Markdown nos templates
  eleventyConfig.setLibrary("md", markdownIt({ html: true }));
  // --- FIM DA NOVA CONFIGURAÇÃO ---

  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("_products/*.md")
      .sort((a, b) => {
        return new Date(b.data.dateAdded) - new Date(a.data.dateAdded);
      });
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
        size: product.data.size || null,
        inStock: product.data.inStock
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
