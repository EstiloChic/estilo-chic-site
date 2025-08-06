// .eleventy.js - VERSÃO DE DEPURAÇÃO

const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets/uploads");

  eleventyConfig.addFilter("formatPrice", function(price) {
    if (typeof price !== 'number') return "Preço indisponível";
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  });

  // ===================================================================
  // FILTRO DE DEPURAÇÃO
  // ===================================================================
  eleventyConfig.addFilter("getProductList", function(collection) {
    // Estas mensagens vão aparecer no log de build do Netlify
    console.log("--- INICIANDO DEPURAÇÃO DO FILTRO getProductList ---");

    if (!collection) {
      console.log("--- ERRO DE DEPURAÇÃO: A coleção de produtos é NULA ou INDEFINIDA! ---");
      return "[]";
    }

    if (collection.length === 0) {
      console.log("--- AVISO DE DEPURAÇÃO: A coleção de produtos foi encontrada, mas está VAZIA (0 itens). ---");
    } else {
      console.log(`--- SUCESSO DE DEPURAÇÃO: Foram encontrados ${collection.length} produtos na coleção. ---`);
      // Vamos inspecionar os dados do primeiro produto para ver se estão corretos
      console.log("--- DADOS DO PRIMEIRO PRODUTO ENCONTRADO:", JSON.stringify(collection[0].data, null, 2));
    }

    const productList = collection.map(product => {
      if (!product || !product.data) {
        console.log("--- AVISO DE DEPURAÇÃO: Item inválido encontrado na coleção. Pulando. ---");
        return null;
      }
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
    }).filter(p => p !== null); // Remove qualquer item nulo/inválido

    console.log(`--- DEPURAÇÃO FINAL: ${productList.length} produtos foram processados e serão enviados para a página. ---`);
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
