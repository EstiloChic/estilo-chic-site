// .eleventy.js

// Importa o pacote js-yaml para ler os arquivos de dados
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Ensina o Eleventy a entender arquivos .yml na pasta _data
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Copia a pasta 'admin' para a pasta de saída '_site' (para o painel funcionar)
  eleventyConfig.addPassthroughCopy("admin");
  // Copia as imagens dos produtos para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("assets/uploads");

  // ===================================================================
  // FILTRO CORRIGIDO E ADICIONADO ABAIXO
  // ===================================================================
  /**
   * Filtro para formatar um número como um preço em Reais (BRL).
   * Exemplo de uso no template: {{ product.price | formatPrice }}
   */
  eleventyConfig.addFilter("formatPrice", function(price) {
    // Verifica se o preço é um número válido antes de formatar
    if (typeof price !== 'number') {
      return "Preço indisponível";
    }
    // Formata o número para ter 2 casas decimais e troca o ponto por vírgula
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  });
  // ===================================================================

  // Filtro para criar a lista de produtos que será usada na página inicial.
  // Esta é a "mágica" que conecta o painel ao site.
  eleventyConfig.addFilter("getProductList", function(collection) {
    if (!collection) {
      return [];
    }
    const productList = collection.map(product => {
      // Cria um objeto limpo para cada produto com os dados do painel
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
        description: product.templateContent.trim().replace(/<p>|<\/p>/g, "") // Limpa tags <p> da descrição
      };

      // Adiciona o campo 'size' apenas se ele existir no produto
      if (product.data.size) {
        cleanProduct.size = product.data.size;
      }

      return cleanProduct;
    });
    // Converte a lista de objetos em um texto JSON que o JavaScript entende
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
