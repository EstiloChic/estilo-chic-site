// Importa o pacote js-yaml para ler os arquivos de dados
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Ensina o Eleventy a entender arquivos .yml na pasta _data
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  // Copia a pasta 'admin' para a pasta de saída '_site' (para o painel funcionar)
  eleventyConfig.addPassthroughCopy("admin");
  // Copia as imagens dos produtos para a pasta de saída '_site'
  eleventyConfig.addPassthroughCopy("assets/uploads");

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
