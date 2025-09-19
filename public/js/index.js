// Funcionalidad del formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // Cargar credenciales guardadas si "Recordarme" estaba marcado
    loadSavedCredentials();

    // Manejar envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Validación básica
        if (!username || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = loginForm.querySelector('.login-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;

        // Simular proceso de login (reemplazar con autenticación real)
        setTimeout(() => {
            // Guardar credenciales si "Recordarme" está marcado
            if (remember) {
                saveCredentials(username, password);
            } else {
                clearSavedCredentials();
            }

            // Simular login exitoso
            if (username === 'admin' && password === 'admin') {
                // Crear sesión activa
                createActiveSession(username);
                
                showMessage('¡Inicio de sesión exitoso!', 'success');
                
                // Redirigir al dashboard después de un breve delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showMessage('Usuario o contraseña incorrectos', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 1500);
    });

    // Validación y estilo de inputs
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Remover estilo de error cuando el usuario empieza a escribir
            this.classList.remove('error');
        });
    });

    // Funcionalidad de "Recordarme"
    rememberCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            clearSavedCredentials();
        }
    });
});

// Funciones de validación
function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        field.classList.add('error');
        return false;
    }
    
    field.classList.remove('error');
    return true;
}

// Funciones para mostrar mensajes
function showMessage(message, type) {
    // Remover mensajes existentes
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Agregar estilos
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
    }

    document.body.appendChild(messageDiv);

    // Animar entrada
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    // Auto remover después de 4 segundos
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Funciones de almacenamiento local para "Recordarme"
function saveCredentials(username, password) {
    const credentials = {
        username: username,
        password: password,
        timestamp: Date.now()
    };
    localStorage.setItem('savedCredentials', JSON.stringify(credentials));
}

function loadSavedCredentials() {
    const saved = localStorage.getItem('savedCredentials');
    if (saved) {
        try {
            const credentials = JSON.parse(saved);
            // Verificar si las credenciales no son muy antiguas (7 días)
            const daysSinceSaved = (Date.now() - credentials.timestamp) / (1000 * 60 * 60 * 24);
            if (daysSinceSaved < 7) {
                document.getElementById('username').value = credentials.username;
                document.getElementById('password').value = credentials.password;
                document.getElementById('remember').checked = true;
            } else {
                clearSavedCredentials();
            }
        } catch (e) {
            clearSavedCredentials();
        }
    }
}

function clearSavedCredentials() {
    localStorage.removeItem('savedCredentials');
}

// Función para crear sesión activa
function createActiveSession(username) {
    const sessionData = {
        username: username,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
    };
    
    localStorage.setItem('activeSession', JSON.stringify(sessionData));
    console.log('Sesión activa creada para:', username);
}

// Agregar estilo de error al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    .form-group input.error {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
`;
document.head.appendChild(style);
