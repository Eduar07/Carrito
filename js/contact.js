// ========================================
// CONTACT.JS - Manejo del formulario de contacto
// ========================================

// Obtener elementos del DOM
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Array para almacenar mensajes de contacto
let contactMessages = JSON.parse(localStorage.getItem('fakestore_contact_messages')) || [];

// ========================================
// MANEJO DEL FORMULARIO
// ========================================

if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        newsletter: document.getElementById('newsletter').checked,
        date: new Date().toISOString(),
        status: 'pending' // Estado: pending, contacted, resolved
    };
    
    // Validar formulario
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Guardar mensaje en localStorage
    contactMessages.push(formData);
    localStorage.setItem('fakestore_contact_messages', JSON.stringify(contactMessages));
    
    // Mostrar mensaje de éxito
    showFormMessage('success', '¡Mensaje enviado exitosamente! Te contactaremos pronto.');
    
    // Limpiar formulario
    contactForm.reset();
    
    // Simular envío de email (en producción esto sería una llamada a un API)
    console.log('Mensaje de contacto recibido:', formData);
    
    // Si el usuario quiere newsletter, agregarlo a la lista
    if (formData.newsletter) {
        addToNewsletter(formData.email, formData.firstName);
    }
    
    // Enviar notificación por WhatsApp (simulado)
    if (formData.phone) {
        sendWhatsAppNotification(formData);
    }
}

// ========================================
// VALIDACIÓN
// ========================================

function validateContactForm(data) {
    let isValid = true;
    
    // Validar nombre
    if (!data.firstName || data.firstName.length < 2) {
        showFieldError('firstName', 'El nombre es requerido (mínimo 2 caracteres)');
        isValid = false;
    }
    
    // Validar apellido
    if (!data.lastName || data.lastName.length < 2) {
        showFieldError('lastName', 'El apellido es requerido (mínimo 2 caracteres)');
        isValid = false;
    }
    
    // Validar email
    if (!validateEmail(data.email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    // Validar teléfono
    if (!data.phone || !validatePhone(data.phone)) {
        showFieldError('phone', 'Por favor ingresa un número de teléfono válido');
        isValid = false;
    }
    
    // Validar asunto
    if (!data.subject) {
        showFieldError('subject', 'Por favor selecciona un asunto');
        isValid = false;
    }
    
    // Validar mensaje
    if (!data.message || data.message.length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    if (!isValid) {
        showFormMessage('error', 'Por favor corrige los errores en el formulario');
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Remover espacios y caracteres especiales
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Verificar que tenga al menos 10 dígitos
    return /^\+?\d{10,}$/.test(cleanPhone);
}

// ========================================
// FUNCIONES DE UI
// ========================================

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        // Crear o actualizar mensaje de error
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        
        // Remover error después de 5 segundos
        setTimeout(() => {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
        }, 5000);
    }
}

function showFormMessage(type, message) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll al mensaje
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Ocultar mensaje después de 10 segundos si es exitoso
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }
}

// ========================================
// FUNCIONES ADICIONALES
// ========================================

function addToNewsletter(email, name) {
    let newsletter = JSON.parse(localStorage.getItem('fakestore_newsletter')) || [];
    
    // Verificar si el email ya está suscrito
    if (!newsletter.find(sub => sub.email === email)) {
        newsletter.push({
            email: email,
            name: name,
            subscribedDate: new Date().toISOString()
        });
        localStorage.setItem('fakestore_newsletter', JSON.stringify(newsletter));
        console.log(`${name} agregado a la lista de newsletter`);
    }
}

function sendWhatsAppNotification(data) {
    // En producción, esto se conectaría con la API de WhatsApp Business
    console.log('Notificación WhatsApp simulada:', {
        to: data.phone,
        message: `Nuevo mensaje de contacto de ${data.firstName} ${data.lastName} sobre: ${data.subject}`
    });
}

// ========================================
// MANEJO DE CAMPOS EN TIEMPO REAL
// ========================================

// Formatear teléfono mientras se escribe
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Formatear como número colombiano
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length <= 10) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else {
                value = '+57 ' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
            }
        }
        
        e.target.value = value;
    });
}

// Validación en tiempo real del email
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            showFieldError('email', 'Email inválido');
        }
    });
}

// ========================================
// ESTADÍSTICAS DE CONTACTO
// ========================================

function getContactStats() {
    const messages = JSON.parse(localStorage.getItem('fakestore_contact_messages')) || [];
    
    return {
        total: messages.length,
        pending: messages.filter(m => m.status === 'pending').length,
        contacted: messages.filter(m => m.status === 'contacted').length,
        resolved: messages.filter(m => m.status === 'resolved').length,
        bySubject: messages.reduce((acc, m) => {
            acc[m.subject] = (acc[m.subject] || 0) + 1;
            return acc;
        }, {})
    };
}

// ========================================
// ESTILOS DINÁMICOS PARA ERRORES
// ========================================

const style = document.createElement('style');
style.textContent = `
    .field-error {
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: var(--danger-color) !important;
    }
    
    .form-message {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Formulario de contacto listo');
    
    // Mostrar estadísticas en consola (para desarrollo)
    if (window.location.hostname === 'localhost') {
        console.log('Estadísticas de contacto:', getContactStats());
    }
});