// .eleventy.js - COMPLETO E ATUALIZADO

const yaml = require("js-yaml");
const markdownIt = require("markdown-it"); // Adiciona a biblioteca de markdown

module.exports = function(eleventyConfig) {
  // Configuração para ler arquivos .yml
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // --- NOVA ADIÇÃO: FILTRO PARA CONVERTER MARKDOWN ---
  const md = new markdownIt({
    html: true // Permite que HTML dentro do markdown seja renderizado
  });
  eleventyConfig.addFilter("markdown", (content) => {
    return md.renderInline(content);
  });
  // --- FIM DA NOVA ADIÇÃO ---

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
