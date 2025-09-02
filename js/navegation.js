// ========================================
// NAVIGATION.JS - Manejo de navegación y menú
// ========================================

// Obtener elementos del DOM
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const headerActions = document.querySelector('.header-actions');

// ========================================
// MENÚ MÓVIL
// ========================================

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    // Crear menú móvil si no existe
    let mobileMenu = document.getElementById('mobileMenu');
    
    if (!mobileMenu) {
        mobileMenu = createMobileMenu();
        document.body.appendChild(mobileMenu);
    }
    
    // Toggle del menú
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Cambiar icono del botón
    menuToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
}

function createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobileMenu';
    mobileMenu.className = 'mobile-menu';
    
    const currentUser = JSON.parse(localStorage.getItem('fakestore_current_user'));
    
    mobileMenu.innerHTML = `
        <div class="mobile-menu-overlay"></div>
        <div class="mobile-menu-content">
            <div class="mobile-menu-header">
                ${currentUser ? `
                    <div class="user-info">
                        <span class="user-icon">👤</span>
                        <div>
                            <p class="user-name">${currentUser.firstName} ${currentUser.lastName}</p>
                            <p class="user-email">${currentUser.email}</p>
                        </div>
                    </div>
                ` : `
                    <div class="auth-buttons-mobile">
                        <a href="login.html" class="btn-login-mobile">Iniciar Sesión</a>
                        <a href="register.html" class="btn-register-mobile">Registrarse</a>
                    </div>
                `}
            </div>
            
            <nav class="mobile-nav">
                <a href="home.html" class="mobile-nav-link" onclick="closeMobileMenu()">
                    <span class="nav-icon">🏠</span>
                    <span>Inicio</span>
                </a>
                <a href="index.html" class="mobile-nav-link" onclick="closeMobileMenu()">
                    <span class="nav-icon">🛍️</span>
                    <span>Productos</span>
                </a>
                <a href="about.html" class="mobile-nav-link" onclick="closeMobileMenu()">
                    <span class="nav-icon">ℹ️</span>
                    <span>Nosotros</span>
                </a>
                <a href="contact.html" class="mobile-nav-link" onclick="closeMobileMenu()">
                    <span class="nav-icon">📧</span>
                    <span>Contacto</span>
                </a>
                ${currentUser ? `
                    <div class="mobile-nav-separator"></div>
                    <a href="#" class="mobile-nav-link" onclick="viewProfile(); closeMobileMenu();">
                        <span class="nav-icon">👤</span>
                        <span>Mi Perfil</span>
                    </a>
                    <a href="#" class="mobile-nav-link" onclick="viewOrders(); closeMobileMenu();">
                        <span class="nav-icon">📦</span>
                        <span>Mis Pedidos</span>
                    </a>
                    <a href="#" class="mobile-nav-link" onclick="logout()">
                        <span class="nav-icon">🚪</span>
                        <span>Cerrar Sesión</span>
                    </a>
                ` : ''}
            </nav>
            
            <div class="mobile-menu-footer">
                <a href="https://wa.me/573227556850" class="whatsapp-link" target="_blank">
                    <span>💬</span> WhatsApp: +57 322 755 6850
                </a>
            </div>
        </div>
    `;
    
    // Agregar event listener para cerrar al hacer click en el overlay
    const overlay = mobileMenu.querySelector('.mobile-menu-overlay');
    overlay.addEventListener('click', closeMobileMenu);
    
    return mobileMenu;
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.textContent = '☰';
    }
}

// ========================================
// GESTIÓN DE SESIÓN
// ========================================

function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('fakestore_current_user'));
    
    if (currentUser) {
        updateHeaderForLoggedUser(currentUser);
        // Si está en página de productos, habilitar compras
        if (window.location.pathname.includes('index.html')) {
            enableShopping();
        }
    } else {
        // Si está en página de productos, mostrar mensaje
        if (window.location.pathname.includes('index.html')) {
            checkShoppingPermission();
        }
    }
}

function updateHeaderForLoggedUser(user) {
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    if (loginBtn && registerBtn) {
        // Crear dropdown de usuario
        const headerActions = document.querySelector('.header-actions');
        headerActions.innerHTML = `
            <div class="user-dropdown">
                <button class="user-dropdown-btn">
                    <span>👤</span>
                    <span>${user.firstName}</span>
                    <span>▼</span>
                </button>
                <div class="user-dropdown-content">
                    <div class="user-dropdown-header">
                        <p class="user-name">${user.firstName} ${user.lastName}</p>
                        <p class="user-email">${user.email}</p>
                    </div>
                    <div class="user-dropdown-divider"></div>
                    <a href="#" onclick="viewProfile()">Mi Perfil</a>
                    <a href="#" onclick="viewOrders()">Mis Pedidos</a>
                    <a href="#" onclick="viewWishlist()">Favoritos</a>
                    <div class="user-dropdown-divider"></div>
                    <a href="#" onclick="logout()" class="logout-link">Cerrar Sesión</a>
                </div>
            </div>
        `;
        
        // Agregar funcionalidad al dropdown
        const dropdownBtn = document.querySelector('.user-dropdown-btn');
        const dropdownContent = document.querySelector('.user-dropdown-content');
        
        dropdownBtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-dropdown')) {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

// ========================================
// FUNCIONES DE USUARIO
// ========================================

function viewProfile() {
    const user = JSON.parse(localStorage.getItem('fakestore_current_user'));
    if (user) {
        alert(`Perfil de Usuario:\n\nNombre: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nTeléfono: ${user.phone}\nCiudad: ${user.city}`);
    }
}

function viewOrders() {
    const orders = JSON.parse(localStorage.getItem('fakestore_orders')) || [];
    const userOrders = orders.filter(order => {
        const user = JSON.parse(localStorage.getItem('fakestore_current_user'));
        return user && order.userId === user.id;
    });
    
    if (userOrders.length > 0) {
        alert(`Tienes ${userOrders.length} pedido(s)\n\nÚltimo pedido: ${new Date(userOrders[userOrders.length - 1].date).toLocaleDateString()}`);
    } else {
        alert('No tienes pedidos aún. ¡Empieza a comprar!');
    }
}

function viewWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('fakestore_wishlist')) || [];
    alert(`Tienes ${wishlist.length} producto(s) en tu lista de favoritos`);
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('fakestore_current_user');
        localStorage.removeItem('fakestore_remember');
        window.location.href = 'home.html';
    }
}

// ========================================
// CONTROL DE COMPRAS
// ========================================

function checkShoppingPermission() {
    const currentUser = JSON.parse(localStorage.getItem('fakestore_current_user'));
    
    if (!currentUser) {
        // Agregar mensaje en la página de productos
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid && !document.getElementById('loginPrompt')) {
            const loginPrompt = document.createElement('div');
            loginPrompt.id = 'loginPrompt';
            loginPrompt.className = 'login-prompt';
            loginPrompt.innerHTML = `
                <div class="login-prompt-content">
                    <span class="login-prompt-icon">🔒</span>
                    <p>Para realizar compras debes iniciar sesión</p>
                    <div class="login-prompt-buttons">
                        <a href="login.html" class="btn-login-prompt">Iniciar Sesión</a>
                        <a href="register.html" class="btn-register-prompt">Crear Cuenta</a>
                    </div>
                </div>
            `;
            productsGrid.parentNode.insertBefore(loginPrompt, productsGrid);
        }
        
        // Deshabilitar botones de agregar al carrito
        disableAddToCartButtons();
    }
}

function disableAddToCartButtons() {
    // Esta función se sobrescribirá en app.js si es necesario
    setTimeout(() => {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(btn => {
            btn.onclick = function(e) {
                e.preventDefault();
                showLoginRequired();
                return false;
            };
        });
    }, 1000);
}

function enableShopping() {
    // Remover mensaje de login si existe
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
        loginPrompt.remove();
    }
}

function showLoginRequired() {
    const modal = document.createElement('div');
    modal.className = 'login-required-modal';
    modal.innerHTML = `
        <div class="login-required-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            <span class="modal-icon">🔐</span>
            <h3>Inicia sesión para comprar</h3>
            <p>Necesitas una cuenta para agregar productos al carrito y realizar compras.</p>
            <div class="modal-buttons">
                <a href="login.html" class="btn-primary">Iniciar Sesión</a>
                <a href="register.html" class="btn-secondary">Crear Cuenta</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ========================================
// ESTILOS PARA ELEMENTOS DINÁMICOS
// ========================================

const navigationStyles = document.createElement('style');
navigationStyles.textContent = `
    /* Mobile Menu */
    .mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: none;
    }
    
    .mobile-menu.active {
        display: block;
    }
    
    .mobile-menu-content {
        position: absolute;
        right: 0;
        top: 0;
        width: 80%;
        max-width: 320px;
        height: 100%;
        background: white;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .mobile-menu-header {
        padding: 1.5rem;
        background: var(--primary-color);
        color: white;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .user-icon {
        font-size: 2rem;
    }
    
    .user-name {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .user-email {
        font-size: 0.875rem;
        opacity: 0.9;
    }
    
    .auth-buttons {
        display: flex;
        gap: 1rem;
    }
    
    .btn-login-mobile,
    .btn-register-mobile {
        flex: 1;
        padding: 0.75rem;
        text-align: center;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
    }
    
    .btn-login-mobile {
        background: white;
        color: var(--primary-color);
    }
    
    .btn-register-mobile {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid white;
    }
    
    .mobile-nav {
        padding: 1rem 0;
    }
    
    .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        color: var(--dark-color);
        text-decoration: none;
        transition: background 0.2s;
    }
    
    .mobile-nav-link:hover {
        background: var(--light-color);
    }
    
    .mobile-nav-separator {
        height: 1px;
        background: var(--border-color);
        margin: 0.5rem 0;
    }
    
    .mobile-menu-footer {
        padding: 1.5rem;
        border-top: 1px solid var(--border-color);
    }
    
    .whatsapp-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #25d366;
        text-decoration: none;
        font-weight: 500;
    }
    
    /* User Dropdown */
    .user-dropdown {
        position: relative;
    }
    
    .user-dropdown-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: var(--transition);
    }
    
    .user-dropdown-btn:hover {
        background: var(--primary-hover);
    }
    
    .user-dropdown-content {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 0.5rem;
        min-width: 250px;
        background: white;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        display: none;
        z-index: 100;
    }
    
    .user-dropdown-content.show {
        display: block;
        animation: fadeIn 0.2s ease;
    }
    
    .user-dropdown-header {
        padding: 1rem;
        background: var(--light-color);
        border-radius: 8px 8px 0 0;
    }
    
    .user-dropdown-content a {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--dark-color);
        text-decoration: none;
        transition: background 0.2s;
    }
    
    .user-dropdown-content a:hover {
        background: var(--light-color);
    }
    
    .user-dropdown-divider {
        height: 1px;
        background: var(--border-color);
    }
    
    .logout-link {
        color: var(--danger-color) !important;
    }
    
    /* Login Prompt */
    .login-prompt {
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .login-prompt-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .login-prompt-icon {
        font-size: 2rem;
    }
    
    .login-prompt-buttons {
        display: flex;
        gap: 1rem;
    }
    
    .btn-login-prompt,
    .btn-register-prompt {
        padding: 0.625rem 1.25rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
        transition: var(--transition);
    }
    
    .btn-login-prompt {
        background: var(--primary-color);
        color: white;
    }
    
    .btn-register-prompt {
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
    }
    
    /* Login Required Modal */
    .login-required-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .login-required-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--secondary-color);
    }
    
    .modal-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
    }
    
    .modal-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .modal-buttons a {
        flex: 1;
        padding: 0.75rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 500;
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;

document.head.appendChild(navigationStyles);

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    
    // Marcar enlace activo
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href.includes(currentPath.split('/').pop())) {
            link.classList.add('active');
        }
    });
});

// Hacer funciones globales
window.logout = logout;
window.viewProfile = viewProfile;
window.viewOrders = viewOrders;
window.viewWishlist = viewWishlist;