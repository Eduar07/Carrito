// ========================================
//   forgot-password.js - SISTEMA DE RECUPERACIÓN DE CONTRASEÑA
// ========================================

// Estado global de la aplicación
let currentStep = 1;
let verificationCode = '';
let timerInterval = null;
let timeLeft = 300; // 5 minutos en segundos
let userEmail = '';
let canResend = false;

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupCodeInputs();
    setupPasswordValidation();
});

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    // Formulario de email
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }

    // Formulario de código
    const codeForm = document.getElementById('codeForm');
    if (codeForm) {
        codeForm.addEventListener('submit', handleCodeSubmit);
    }

    // Formulario de contraseña
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordSubmit);
    }

    // Botón de reenvío de código
    const resendBtn = document.getElementById('resendCode');
    if (resendBtn) {
        resendBtn.addEventListener('click', resendCode);
    }
}

// ========================================
// NAVEGACIÓN ENTRE PASOS
// ========================================

function goToStep(step) {
    // Ocultar todos los pasos
    document.querySelectorAll('.forgot-card').forEach(card => {
        card.classList.add('hidden');
    });

    // Mostrar el paso actual
    const currentCard = document.getElementById(`step${step}`);
    if (currentCard) {
        currentCard.classList.remove('hidden');
        // Animación de entrada
        currentCard.style.animation = 'fadeIn 0.5s ease';
    }

    currentStep = step;

    // Iniciar timer si es el paso 2
    if (step === 2) {
        startTimer();
    } else {
        stopTimer();
    }
}

// ========================================
// PASO 1: MANEJO DE EMAIL
// ========================================

async function handleEmailSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('recoveryEmail');
    const email = emailInput.value.trim();
    const emailError = document.getElementById('emailError');

    // Resetear error
    emailError.textContent = '';

    // Validar formato de email
    if (!validateEmail(email)) {
        emailError.textContent = 'Por favor, ingresa un email válido';
        shakeElement(emailInput);
        return;
    }

    // Simular verificación con el servidor
    showNotification('Verificando email...', 'info');
    
    // Deshabilitar botón mientras procesa
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verificando...';

    // Simular delay de servidor
    await sleep(1500);

    // Simular respuesta exitosa
    userEmail = email;
    document.getElementById('userEmail').textContent = maskEmail(email);
    
    // Generar código de verificación
    verificationCode = generateVerificationCode();
    console.log('Código de verificación:', verificationCode); // Para testing

    // Mostrar notificación
    showNotification('Código enviado a tu email', 'success');

    // Restaurar botón
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Código de Verificación';

    // Ir al siguiente paso
    goToStep(2);
}

// ========================================
// PASO 2: MANEJO DE CÓDIGO DE VERIFICACIÓN
// ========================================

function setupCodeInputs() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    codeInputs.forEach((input, index) => {
        // Auto-avanzar al siguiente input
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            if (value.length === 1) {
                input.classList.add('filled');
                
                // Mover al siguiente input
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                } else {
                    // Si es el último, verificar automáticamente
                    checkAutoSubmit();
                }
            }
        });

        // Manejar tecla backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });

        // Permitir pegar código completo
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const digits = pastedData.replace(/\D/g, '').slice(0, 6);
            
            digits.split('').forEach((digit, i) => {
                if (codeInputs[i]) {
                    codeInputs[i].value = digit;
                    codeInputs[i].classList.add('filled');
                }
            });

            // Focus en el último input lleno o el siguiente vacío
            const lastFilledIndex = Math.min(digits.length - 1, codeInputs.length - 1);
            if (lastFilledIndex < codeInputs.length - 1) {
                codeInputs[lastFilledIndex + 1].focus();
            } else {
                codeInputs[lastFilledIndex].focus();
                checkAutoSubmit();
            }
        });
    });
}

function checkAutoSubmit() {
    const codeInputs = document.querySelectorAll('.code-input');
    const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
    
    if (allFilled) {
        // Pequeño delay para mejor UX
        setTimeout(() => {
            document.getElementById('codeForm').dispatchEvent(new Event('submit'));
        }, 300);
    }
}

async function handleCodeSubmit(e) {
    e.preventDefault();
    
    const codeInputs = document.querySelectorAll('.code-input');
    const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
    const codeError = document.getElementById('codeError');

    // Resetear error
    codeError.textContent = '';

    // Validar longitud
    if (enteredCode.length !== 6) {
        codeError.textContent = 'Por favor, ingresa el código completo';
        return;
    }

    // Verificar código
    if (enteredCode !== verificationCode) {
        codeError.textContent = 'Código incorrecto. Por favor, intenta nuevamente';
        codeInputs.forEach(input => {
            input.classList.add('error');
            shakeElement(input);
        });
        
        // Limpiar inputs después del error
        setTimeout(() => {
            codeInputs.forEach(input => {
                input.value = '';
                input.classList.remove('filled', 'error');
            });
            codeInputs[0].focus();
        }, 1000);
        
        return;
    }

    // Código correcto
    showNotification('Código verificado correctamente', 'success');
    
    // Animar inputs de éxito
    codeInputs.forEach((input, index) => {
        setTimeout(() => {
            input.style.borderColor = 'var(--success-color)';
            input.style.background = 'rgba(16, 185, 129, 0.1)';
        }, index * 50);
    });

    // Esperar un momento y pasar al siguiente paso
    await sleep(1000);
    goToStep(3);
}

// ========================================
// TIMER DE CÓDIGO
// ========================================

function startTimer() {
    timeLeft = 300; // Resetear a 5 minutos
    canResend = false;
    document.getElementById('resendCode').disabled = true;
    
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            expireCode();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = display;
        
        // Cambiar color cuando queda poco tiempo
        if (timeLeft < 60) {
            timerElement.style.color = 'var(--danger-color)';
            document.querySelector('.timer-container').classList.add('expired');
        }
    }
}

function expireCode() {
    verificationCode = '';
    canResend = true;
    document.getElementById('resendCode').disabled = false;
    document.getElementById('timerText').innerHTML = 'El código ha expirado';
    showNotification('El código ha expirado. Por favor, solicita uno nuevo', 'error');
}

async function resendCode() {
    if (!canResend && timeLeft > 0) {
        showNotification(`Por favor, espera ${Math.ceil(timeLeft / 60)} minutos antes de reenviar`, 'info');
        return;
    }

    const resendBtn = document.getElementById('resendCode');
    resendBtn.disabled = true;
    resendBtn.textContent = 'Enviando...';

    // Limpiar inputs de código
    document.querySelectorAll('.code-input').forEach(input => {
        input.value = '';
        input.classList.remove('filled', 'error');
        input.style.borderColor = '';
        input.style.background = '';
    });

    await sleep(1000);

    // Generar nuevo código
    verificationCode = generateVerificationCode();
    console.log('Nuevo código:', verificationCode);

    // Reiniciar timer
    startTimer();

    resendBtn.textContent = 'Reenviar código';
    showNotification('Nuevo código enviado a tu email', 'success');
    
    // Focus en el primer input
    document.querySelector('.code-input').focus();
}

// ========================================
// PASO 3: VALIDACIÓN DE CONTRASEÑA
// ========================================

function setupPasswordValidation() {
    const passwordInput = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmPassword');

    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
        passwordInput.addEventListener('input', checkPasswordMatch);
    }

    if (confirmInput) {
        confirmInput.addEventListener('input', checkPasswordMatch);
    }
}

function validatePasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Requisitos
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };

    // Actualizar indicadores de requisitos
    Object.keys(requirements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (requirements[key]) {
                element.innerHTML = element.innerHTML.replace('✗', '✓');
                element.classList.add('valid');
            } else {
                element.innerHTML = element.innerHTML.replace('✓', '✗');
                element.classList.remove('valid');
            }
        }
    });

    // Calcular fuerza
    const strength = Object.values(requirements).filter(Boolean).length;

    // Actualizar barra de fuerza
    strengthFill.className = 'strength-fill';
    if (strength === 0) {
        strengthFill.style.width = '0';
        strengthText.textContent = '';
    } else if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Débil';
        strengthText.style.color = 'var(--danger-color)';
    } else if (strength === 3) {
        strengthFill.classList.add('fair');
        strengthText.textContent = 'Regular';
        strengthText.style.color = 'var(--warning-color)';
    } else if (strength === 4) {
        strengthFill.classList.add('good');
        strengthText.textContent = 'Buena';
        strengthText.style.color = '#3b82f6';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Fuerte';
        strengthText.style.color = 'var(--success-color)';
    }
}

function checkPasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmError = document.getElementById('confirmError');

    if (confirmPassword && password !== confirmPassword) {
        confirmError.textContent = 'Las contraseñas no coinciden';
    } else {
        confirmError.textContent = '';
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

async function handlePasswordSubmit(e) {
    e.preventDefault();

    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmError = document.getElementById('confirmError');

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        confirmError.textContent = 'Las contraseñas no coinciden';
        shakeElement(document.getElementById('confirmPassword'));
        return;
    }

    // Validar requisitos mínimos
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[@$!%*?&]/.test(password)
    };

    if (!Object.values(requirements).every(Boolean)) {
        showNotification('La contraseña no cumple con todos los requisitos', 'error');
        return;
    }

    // Simular actualización de contraseña
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Actualizando...';

    await sleep(2000);

    // Éxito
    showNotification('Contraseña actualizada exitosamente', 'success');
    goToStep(4);
}

// ========================================
// UTILIDADES
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.substring(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Animación de shake (agregar al CSS si no existe)
if (!document.querySelector('#shakeAnimation')) {
    const style = document.createElement('style');
    style.id = 'shakeAnimation';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .code-input.error {
            border-color: var(--danger-color) !important;
            animation: shake 0.5s;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const iconElement = notification.querySelector('.notification-icon');
    const messageElement = notification.querySelector('.notification-message');

    // Configurar icono según el tipo
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ️',
        warning: '⚠️'
    };

    iconElement.textContent = icons[type] || icons.info;
    messageElement.textContent = message;

    // Aplicar clases de tipo
    notification.className = 'notification show ' + type;

    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ========================================
// PREVENCIÓN DE NAVEGACIÓN ACCIDENTAL
// ========================================

window.addEventListener('beforeunload', function(e) {
    if (currentStep > 1 && currentStep < 4) {
        e.preventDefault();
        e.returnValue = 'Tienes un proceso de recuperación en curso. ¿Estás seguro de que quieres salir?';
    }
});

// ========================================
// LOG DE INFORMACIÓN PARA TESTING
// ========================================

console.log('🔐 Sistema de recuperación de contraseña cargado');
console.log('ℹ️ Para testing: El código de verificación se muestra en la consola');
console.log('📧 Puedes usar cualquier email válido para probar');