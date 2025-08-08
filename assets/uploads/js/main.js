// --- CONTEÚDO PARA: assets/js/main.js ---

// Função para abrir o modal com os dados do produto
function openModal(card) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-name').textContent = card.dataset.name;
    document.getElementById('modal-image').src = card.dataset.image;
    
    const priceElement = document.getElementById('modal-price');
    const originalPriceElement = document.getElementById('modal-original-price');

    if (card.dataset.originalPrice && parseFloat(card.dataset.originalPrice) > parseFloat(card.dataset.price)) {
        originalPriceElement.textContent = `De R$ ${parseFloat(card.dataset.originalPrice).toFixed(2).replace('.', ',')}`;
        originalPriceElement.classList.remove('hidden');
    } else {
        originalPriceElement.classList.add('hidden');
    }
    
    priceElement.textContent = `Por R$ ${parseFloat(card.dataset.price).toFixed(2).replace('.', ',')}`;
    
    document.getElementById('modal-description').innerHTML = card.dataset.description.replace(/\n/g, '<br>');

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// Lógica que roda quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortOptions = document.getElementById('sort-options');
    const productList = document.getElementById('product-list');

    function applyFiltersAndSort() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.category;
        const sortValue = sortOptions.value;

        // Filtra os produtos
        let filteredProducts = Array.from(productCards);
        if (activeFilter !== 'all') {
            filteredProducts = filteredProducts.filter(card => card.dataset.category === activeFilter);
        }

        // Ordena os produtos filtrados
        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
        } else if (sortValue === 'name-asc') {
            filteredProducts.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
        }

        // Limpa a lista atual e adiciona os produtos filtrados e ordenados
        productList.innerHTML = '';
        filteredProducts.forEach(card => productList.appendChild(card));
    }

    // Adiciona os eventos aos botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyFiltersAndSort();
        });
    });

    // Adiciona o evento ao seletor de ordenação
    sortOptions.addEventListener('change', applyFiltersAndSort);
});
