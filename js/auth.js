// ========================================
// AUTH.JS - Manejo de Login y Registro
// ========================================

// Estado de usuarios registrados
const users = JSON.parse(localStorage.getItem('fakestore_users')) || [];
const currentUser = JSON.parse(localStorage.getItem('fakestore_current_user')) || null;

// ========================================
// LOGIN FUNCTIONALITY
// ========================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validación
    if (!validateEmail(email)) {
        showError('emailError', 'Por favor ingresa un email válido');
        return;
    }
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login exitoso
        const sessionUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            department: user.department
        };
        
        localStorage.setItem('fakestore_current_user', JSON.stringify(sessionUser));
        
        if (rememberMe) {
            localStorage.setItem('fakestore_remember', 'true');
        }
        
        showMessage('loginMessage', 'Login exitoso! Redirigiendo...', 'success');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showError('passwordError', 'Email o contraseña incorrectos');
        showMessage('loginMessage', 'Credenciales inválidas. Por favor intenta de nuevo.', 'error');
    }
}

// ========================================
// REGISTER FUNCTIONALITY
// ========================================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    
    // Validación de contraseña en tiempo real
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    // Obtener todos los datos del formulario
    const formData = {
        id: Date.now(), // ID único basado en timestamp
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value,
        birthDate: document.getElementById('birthDate').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        department: document.getElementById('department').value,
        password: document.getElementById('password').value,
        newsletter: document.getElementById('newsletter').checked,
        terms: document.getElementById('terms').checked,
        registrationDate: new Date().toISOString()
    };
    
    // Validaciones
    if (!validateRegistrationForm(formData)) {
        return;
    }
    
    // Verificar si el email ya existe
    if (users.find(u => u.email === formData.email)) {
        showMessage('registerMessage', 'Este email ya está registrado. Por favor usa otro o inicia sesión.', 'error');
        nextStep(2); // Volver al paso 2 donde está el email
        return;
    }
    
    // Verificar si el documento ya existe
    if (users.find(u => u.idNumber === formData.idNumber)) {
        showMessage('registerMessage', 'Este número de documento ya está registrado.', 'error');
        nextStep(1); // Volver al paso 1 donde está el documento
        return;
    }
    
    // Guardar usuario
    users.push(formData);
    localStorage.setItem('fakestore_users', JSON.stringify(users));
    
    // Auto login después del registro
    const sessionUser = {
        id: formData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        department: formData.department
    };
    
    localStorage.setItem('fakestore_current_user', JSON.stringify(sessionUser));
    
    showMessage('registerMessage', '¡Registro exitoso! Bienvenido a FakeStore. Redirigiendo...', 'success');
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// ========================================
// MULTI-STEP FORM NAVIGATION
// ========================================

function nextStep(step) {
    // Validar paso actual antes de avanzar
    const currentStep = document.querySelector('.form-step.active');
    const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
    
    if (step > currentStepNumber && !validateStep(currentStepNumber)) {
        return;
    }
    
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Mostrar el paso seleccionado
    document.getElementById(`step${step}`).classList.add('active');
    
    // Actualizar indicador de progreso
    document.querySelectorAll('.progress-step').forEach(s => {
        s.classList.remove('active');
    });
    
    for (let i = 1; i <= step; i++) {
        document.querySelector(`.progress-step[data-step="${i}"]`).classList.add('active');
    }
}

function validateStep(step) {
    let isValid = true;
    
    switch(step) {
        case 1:
            // Validar datos personales
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const idType = document.getElementById('idType').value;
            const idNumber = document.getElementById('idNumber').value;
            const birthDate = document.getElementById('birthDate').value;
            
            if (!firstName || firstName.length < 2) {
                showFieldError('firstName', 'El nombre debe tener al menos 2 caracteres');
                isValid = false;
            }
            
            if (!lastName || lastName.length < 2) {
                showFieldError('lastName', 'El apellido debe tener al menos 2 caracteres');
                isValid = false;
            }
            
            if (!idType) {
                showFieldError('idType', 'Por favor selecciona un tipo de documento');
                isValid = false;
            }
            
            if (!idNumber || idNumber.length < 5) {
                showFieldError('idNumber', 'Por favor ingresa un número de documento válido');
                isValid = false;
            }
            
            if (!birthDate) {
                showFieldError('birthDate', 'Por favor ingresa tu fecha de nacimiento');
                isValid = false;
            } else {
                // Verificar que sea mayor de 18 años
                const birth = new Date(birthDate);
                const today = new Date();
                const age = today.getFullYear() - birth.getFullYear();
                if (age < 18) {
                    showFieldError('birthDate', 'Debes ser mayor de 18 años');
                    isValid = false;
                }
            }
            break;
            
        case 2:
            // Validar información de contacto
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const department = document.getElementById('department').value;
            
            if (!validateEmail(email)) {
                showFieldError('email', 'Por favor ingresa un email válido');
                isValid = false;
            }
            
            if (!phone || phone.length < 10) {
                showFieldError('phone', 'Por favor ingresa un número de teléfono válido');
                isValid = false;
            }
            
            if (!address || address.length < 5) {
                showFieldError('address', 'Por favor ingresa una dirección válida');
                isValid = false;
            }
            
            if (!city || city.length < 2) {
                showFieldError('city', 'Por favor ingresa una ciudad válida');
                isValid = false;
            }
            
            if (!department) {
                showFieldError('department', 'Por favor selecciona un departamento');
                isValid = false;
            }
            break;
            
        case 3:
            // Validar contraseña
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            if (!validatePassword(password)) {
                showFieldError('password', 'La contraseña no cumple con los requisitos');
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                showFieldError('confirmPassword', 'Las contraseñas no coinciden');
                isValid = false;
            }
            
            if (!terms) {
                alert('Debes aceptar los términos y condiciones');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

function validatePasswordStrength() {
    const password = this.value;
    
    // Validar longitud
    const lengthCheck = document.getElementById('length');
    if (password.length >= 8) {
        lengthCheck.textContent = '✓ Mínimo 8 caracteres';
        lengthCheck.classList.add('valid');
    } else {
        lengthCheck.textContent = '✗ Mínimo 8 caracteres';
        lengthCheck.classList.remove('valid');
    }
    
    // Validar mayúscula
    const uppercaseCheck = document.getElementById('uppercase');
    if (/[A-Z]/.test(password)) {
        uppercaseCheck.textContent = '✓ Una letra mayúscula';
        uppercaseCheck.classList.add('valid');
    } else {
        uppercaseCheck.textContent = '✗ Una letra mayúscula';
        uppercaseCheck.classList.remove('valid');
    }
    
    // Validar minúscula
    const lowercaseCheck = document.getElementById('lowercase');
    if (/[a-z]/.test(password)) {
        lowercaseCheck.textContent = '✓ Una letra minúscula';
        lowercaseCheck.classList.add('valid');
    } else {
        lowercaseCheck.textContent = '✗ Una letra minúscula';
        lowercaseCheck.classList.remove('valid');
    }
    
    // Validar número
    const numberCheck = document.getElementById('number');
    if (/\d/.test(password)) {
        numberCheck.textContent = '✓ Un número';
        numberCheck.classList.add('valid');
    } else {
        numberCheck.textContent = '✗ Un número';
        numberCheck.classList.remove('valid');
    }
}

function validateRegistrationForm(data) {
    // Validación completa del formulario
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
        showMessage('registerMessage', 'Por favor completa todos los campos requeridos', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showMessage('registerMessage', 'Por favor ingresa un email válido', 'error');
        return false;
    }
    
    if (!validatePassword(data.password)) {
        showMessage('registerMessage', 'La contraseña no cumple con los requisitos mínimos', 'error');
        return false;
    }
    
    if (!data.terms) {
        showMessage('registerMessage', 'Debes aceptar los términos y condiciones', 'error');
        return false;
    }
    
    return true;
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
        setTimeout(() => {
            errorElement.classList.remove('active');
        }, 5000);
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
            field.classList.add('error');
            
            setTimeout(() => {
                errorElement.classList.remove('active');
                field.classList.remove('error');
            }, 5000);
        }
    }
}

function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// ========================================
// CHECK AUTHENTICATION STATUS
// ========================================

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('fakestore_current_user'));
    if (user) {
        // Usuario está logueado
        updateUIForLoggedUser(user);
    }
}

function updateUIForLoggedUser(user) {
    // Actualizar elementos de UI para usuario logueado
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    if (loginBtn && registerBtn) {
        loginBtn.textContent = user.firstName;
        loginBtn.href = '#';
        registerBtn.textContent = 'Cerrar Sesión';
        registerBtn.href = '#';
        registerBtn.onclick = logout;
    }
}

function logout() {
    localStorage.removeItem('fakestore_current_user');
    localStorage.removeItem('fakestore_remember');
    window.location.href = 'home.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', checkAuth);