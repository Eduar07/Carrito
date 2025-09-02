// ========================================
// ESTADO DE LA APLICACIÓN
// ========================================

const state = {
    products: [],
    filteredProducts: [],
    cart: [],
    categories: []
};

// ========================================
// SELECTORES DOM
// ========================================

const elements = {
    productsGrid: document.getElementById('productsGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    sortFilter: document.getElementById('sortFilter'),
    priceRangeFilter: document.getElementById('priceRangeFilter'),
    cartButton: document.getElementById('cartButton'),
    cartModal: document.getElementById('cartModal'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    cartCount: document.getElementById('cartCount'),
    cartFooter: document.getElementById('cartFooter'),
    totalValue: document.getElementById('totalValue'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    notification: document.getElementById('notification')
};

// ========================================
// FUNCIONES DE LA API
// ========================================

async function fetchProducts() {
    try {
        console.log('Intentando cargar productos desde la API...');
        elements.productsGrid.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
        
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        console.log('Respuesta recibida:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        console.log('Productos cargados:', products.length);
        
        state.products = products;
        state.filteredProducts = products;
        extractCategories();
        renderProducts();
        showNotification('Productos cargados exitosamente', 'success');
    } catch (error) {
        console.error('Error detallado:', error);
        console.log('Cargando datos de respaldo...');
        loadBackupData();
    }
}

// ========================================
// DATOS DE RESPALDO
// ========================================

function loadBackupData() {
    const backupProducts = [
        {
            id: 1,
            title: "Mochila Fjallraven - Foldsack No. 1",
            price: 109.95,
            description: "Tu mochila perfecta para el día a día y paseos por el bosque.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating: { rate: 3.9, count: 120 }
        },
        {
            id: 2,
            title: "Camiseta Premium para Hombre",
            price: 22.3,
            description: "Camisetas ajustadas de corte slim con cuello redondo.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
            rating: { rate: 4.1, count: 259 }
        },
        {
            id: 3,
            title: "Chaqueta de Algodón para Hombre",
            price: 55.99,
            description: "Gran chaqueta de abrigo para primavera/otoño/invierno.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: { rate: 4.7, count: 500 }
        },
        {
            id: 4,
            title: "Camisa Casual Slim Fit",
            price: 15.99,
            description: "El color puede variar ligeramente entre la pantalla y la realidad.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
            rating: { rate: 2.1, count: 430 }
        },
        {
            id: 5,
            title: "Pulsera de Mujer con Cadena de Dragón",
            price: 695,
            description: "De nuestra colección Legends, el Naga se inspiró en el mítico dragón de agua.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 4.6, count: 400 }
        },
        {
            id: 6,
            title: "Anillo de Oro Sólido",
            price: 168,
            description: "Satisfacción garantizada. Devuelve o cambia cualquier pedido dentro de 30 días.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 3.9, count: 70 }
        },
        {
            id: 7,
            title: "Anillo de Diamante Blanco",
            price: 9.99,
            description: "Anillo de promesa clásico creado para ella.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 3, count: 400 }
        },
        {
            id: 8,
            title: "Aros de Acero Inoxidable",
            price: 10.99,
            description: "Aros con túnel doble chapados en oro rosa.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 1.9, count: 100 }
        },
        {
            id: 9,
            title: "Disco Duro Portátil WD 2TB",
            price: 64,
            description: "Compatibilidad con USB 3.0 y USB 2.0.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
            rating: { rate: 3.3, count: 203 }
        },
        {
            id: 10,
            title: "SSD Interno SanDisk",
            price: 109,
            description: "Fácil actualización para un arranque más rápido.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
            rating: { rate: 2.9, count: 470 }
        },
        {
            id: 11,
            title: "Monitor Gaming ASUS 27 pulgadas",
            price: 599,
            description: "Monitor gaming de 27 pulgadas con 144Hz de frecuencia de actualización.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
            rating: { rate: 4.8, count: 319 }
        },
        {
            id: 12,
            title: "Chaqueta de Lluvia para Mujer",
            price: 39.99,
            description: "Chaqueta ligera con capucha, ideal para clima lluvioso.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
            rating: { rate: 3.8, count: 679 }
        },
        {
            id: 13,
            title: "Chaqueta de Cuero para Mujer",
            price: 29.95,
            description: "Chaqueta de cuero sintético con capucha removible.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
            rating: { rate: 2.9, count: 340 }
        },
        {
            id: 14,
            title: "Vestido Floral de Verano",
            price: 28.99,
            description: "Vestido ligero perfecto para días de verano.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
            rating: { rate: 4.2, count: 145 }
        },
        {
            id: 15,
            title: "Blusa Elegante para Mujer",
            price: 16.99,
            description: "Blusa de manga corta con diseño elegante.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
            rating: { rate: 3.6, count: 235 }
        }
    ];

    state.products = backupProducts;
    state.filteredProducts = backupProducts;
    extractCategories();
    renderProducts();
    showNotification('Usando datos de demostración (API no disponible)', 'error');
}

// ========================================
// FUNCIONES DE RENDERIZADO
// ========================================

function extractCategories() {
    const categories = [...new Set(state.products.map(p => p.category))];
    state.categories = categories;
    populateCategoryFilter();
}

function populateCategoryFilter() {
    elements.categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = capitalizeFirst(category);
        elements.categoryFilter.appendChild(option);
    });
}

function renderProducts() {
    if (state.filteredProducts.length === 0) {
        elements.productsGrid.innerHTML = '<div class="text-center mt-2">No se encontraron productos</div>';
        return;
    }

    elements.productsGrid.innerHTML = state.filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                ${product.rating?.rate >= 4 ? '<span class="product-badge">Popular</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating?.rate || 0)}</span>
                    <span class="rating-text">${product.rating?.rate || 0} (${product.rating?.count || 0})</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <span>+</span>
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + '☆'.repeat(halfStar) + '☆'.repeat(emptyStars);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// FUNCIONES DEL CARRITO
// ========================================

function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${product.title} agregado al carrito`, 'success');
    
    // Animar el botón
    const btn = document.querySelector(`[data-id="${productId}"] .add-to-cart-btn`);
    if (btn) {
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 500);
    }
}

function updateQuantity(productId, change) {
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Producto eliminado del carrito', 'success');
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        state.cart = [];
        saveCart();
        updateCartUI();
        showNotification('Carrito vaciado', 'success');
    }
}

function processCheckout() {
    if (state.cart.length === 0) return;
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (confirm(`¿Confirmas tu compra?\n\nTotal de productos: ${items}\nTotal a pagar: ${total.toFixed(2)}`)) {
        showNotification('¡Compra realizada con éxito! Gracias por tu preferencia.', 'success');
        state.cart = [];
        saveCart();
        updateCartUI();
        closeCartModal();
    }
}

// ========================================
// PERSISTENCIA EN LOCALSTORAGE
// ========================================

function saveCart() {
    localStorage.setItem('fakestore_cart', JSON.stringify(state.cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('fakestore_cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// ========================================
// ACTUALIZACIÓN DE UI
// ========================================

function updateCartUI() {
    // Actualizar contador
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    elements.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Actualizar contenido del carrito
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Tu carrito está vacío</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">¡Agrega algunos productos!</p>
            </div>
        `;
        elements.cartFooter.style.display = 'none';
    } else {
        elements.cartItems.innerHTML = state.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        elements.cartFooter.style.display = 'block';
        
        // Calcular total
        const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        elements.totalValue.textContent = `${total.toFixed(2)}`;
    }
}

// ========================================
// FILTROS Y BÚSQUEDA
// ========================================

function filterProducts() {
    let filtered = [...state.products];

    // Filtro de búsqueda
    const searchTerm = elements.searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    // Filtro de categoría
    const selectedCategory = elements.categoryFilter.value;
    if (selectedCategory) {
        filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtro de rango de precio
    const priceRange = elements.priceRangeFilter.value;
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(v => v === '+' ? Infinity : parseFloat(v) || 0);
        filtered = filtered.filter(product => {
            if (max === Infinity) return product.price >= min;
            return product.price >= min && product.price <= max;
        });
    }

    // Ordenamiento
    const sortOption = elements.sortFilter.value;
    if (sortOption) {
        filtered.sort((a, b) => {
            switch(sortOption) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'rating':
                    return (b.rating?.rate || 0) - (a.rating?.rate || 0);
                default:
                    return 0;
            }
        });
    }

    state.filteredProducts = filtered;
    renderProducts();
}

// ========================================
// NOTIFICACIONES
// ========================================

function showNotification(message, type = 'success') {
    const notification = elements.notification;
    const icon = notification.querySelector('.notification-icon');
    const msg = notification.querySelector('.notification-message');
    
    icon.textContent = type === 'success' ? '✓' : '⚠';
    msg.textContent = message;
    
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ========================================
// MODAL DEL CARRITO
// ========================================

function openCartModal() {
    elements.cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    elements.cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
    // Búsqueda
    elements.searchInput.addEventListener('input', debounce(filterProducts, 300));
    
    // Filtros
    elements.categoryFilter.addEventListener('change', filterProducts);
    elements.sortFilter.addEventListener('change', filterProducts);
    elements.priceRangeFilter.addEventListener('change', filterProducts);
    
    // Carrito
    elements.cartButton.addEventListener('click', openCartModal);
    elements.closeCart.addEventListener('click', closeCartModal);
    elements.cartModal.addEventListener('click', (e) => {
        if (e.target === elements.cartModal) closeCartModal();
    });
    
    elements.checkoutBtn.addEventListener('click', processCheckout);
    elements.clearCartBtn.addEventListener('click', clearCart);
    
    // Tecla ESC para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.cartModal.classList.contains('active')) {
            closeCartModal();
        }
    });
}

// ========================================
// INICIALIZACIÓN
// ========================================

async function init() {
    console.log('Inicializando aplicación...');
    loadCart();
    initEventListeners();
    await fetchProducts();
}

// Hacer funciones globales para onclick en HTML
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);