// Funciones comunes para todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const closeSidebar = document.getElementById('closeSidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Verificar autenticación al cargar
    checkAuthentication();
    
    // Funcionalidad del menú móvil
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            closeSidebarMenu();
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeSidebarMenu();
        });
    }
    
    // Funcionalidad de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });
    
    // Funcionalidad de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
    
    // Verificar actividad del usuario cada minuto
    setInterval(checkUserActivity, 60000);
    
    // Actualizar última actividad en eventos del usuario
    ['click', 'scroll', 'keypress'].forEach(event => {
        document.addEventListener(event, updateLastActivity, true);
    });
});

// Función para verificar autenticación
function checkAuthentication() {
    // Verificar si hay una sesión activa
    const activeSession = localStorage.getItem('activeSession');
    const savedCredentials = localStorage.getItem('savedCredentials');
    
    // Si no hay sesión activa ni credenciales guardadas, redirigir al login
    if (!activeSession && !savedCredentials) {
        console.log('No hay sesión activa ni credenciales guardadas');
        redirectToLogin();
        return;
    }
    
    // Si hay sesión activa, verificar si no ha expirado
    if (activeSession) {
        try {
            const sessionData = JSON.parse(activeSession);
            const now = Date.now();
            const sessionExpiry = sessionData.expiresAt;
            
            // Verificar si la sesión no ha expirado (7 días)
            if (now < sessionExpiry) {
                console.log('Sesión activa válida');
                // Actualizar última actividad
                updateLastActivity();
                return;
            } else {
                console.log('Sesión expirada, limpiando datos');
                clearSessionData();
                redirectToLogin();
                return;
            }
        } catch (e) {
            console.log('Error al parsear sesión, limpiando datos');
            clearSessionData();
            redirectToLogin();
            return;
        }
    }
    
    // Si solo hay credenciales guardadas (recordarme), crear sesión activa
    if (savedCredentials) {
        try {
            const credentials = JSON.parse(savedCredentials);
            // Verificar si las credenciales no son muy antiguas (30 días)
            const daysSinceSaved = (Date.now() - credentials.timestamp) / (1000 * 60 * 60 * 24);
            if (daysSinceSaved < 30) {
                console.log('Credenciales válidas, creando sesión activa');
                createActiveSession(credentials);
                return;
            } else {
                console.log('Credenciales muy antiguas');
                clearSessionData();
                redirectToLogin();
                return;
            }
        } catch (e) {
            console.log('Error al parsear credenciales');
            clearSessionData();
            redirectToLogin();
            return;
        }
    }
    
    // Si llegamos aquí, algo salió mal
    console.log('Estado de autenticación no válido, redirigiendo al login');
    redirectToLogin();
}

// Función para alternar sidebar en móvil
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevenir scroll del body cuando el sidebar está abierto
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
}

// Función para cerrar sidebar
function closeSidebarMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Función para manejar navegación
function handleNavigation(linkElement) {
    // Remover clase active de todos los elementos de navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al elemento clickeado
    linkElement.parentElement.classList.add('active');
    
    // Cerrar sidebar en móvil después de la navegación
    if (window.innerWidth < 768) {
        closeSidebarMenu();
    }
    
    // Obtener la URL del enlace
    const href = linkElement.getAttribute('href');
    if (href && href !== '#') {
        // Navegar a la página
        window.location.href = href;
    }
}

// Función para crear sesión activa
function createActiveSession(credentials) {
    const sessionData = {
        username: credentials.username,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 días
    };
    
    localStorage.setItem('activeSession', JSON.stringify(sessionData));
    console.log('Sesión activa creada');
}

// Función para actualizar última actividad
function updateLastActivity() {
    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
        try {
            const sessionData = JSON.parse(activeSession);
            sessionData.lastActivity = Date.now();
            localStorage.setItem('activeSession', JSON.stringify(sessionData));
        } catch (e) {
            console.log('Error al actualizar última actividad');
        }
    }
}

// Función para limpiar datos de sesión
function clearSessionData() {
    localStorage.removeItem('activeSession');
    localStorage.removeItem('savedCredentials');
}

// Función para redirigir al login
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Función para verificar actividad del usuario
function checkUserActivity() {
    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
        try {
            const sessionData = JSON.parse(activeSession);
            const now = Date.now();
            
            // Si han pasado más de 30 minutos sin actividad, mostrar advertencia
            const minutesSinceActivity = (now - sessionData.lastActivity) / (1000 * 60);
            if (minutesSinceActivity > 30 && minutesSinceActivity < 35) {
                showMessage('Tu sesión expirará pronto por inactividad', 'warning');
            }
            
            // Si han pasado más de 60 minutos sin actividad, cerrar sesión
            if (minutesSinceActivity > 60) {
                showMessage('Sesión cerrada por inactividad', 'info');
                setTimeout(() => {
                    clearSessionData();
                    redirectToLogin();
                }, 2000);
            }
        } catch (e) {
            console.log('Error al verificar actividad del usuario');
        }
    }
}

// Función para manejar cierre de sesión
function handleLogout() {
    // Mostrar confirmación
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos de sesión
        clearSessionData();
        
        // Mostrar mensaje de despedida
        showMessage('Cerrando sesión...', 'info');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Función para mostrar mensajes
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
        font-size: 14px;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f44336';
    } else if (type === 'info') {
        messageDiv.style.backgroundColor = '#2196F3';
    } else if (type === 'warning') {
        messageDiv.style.backgroundColor = '#ff9800';
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

// Manejar redimensionamiento de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        // En pantallas grandes, cerrar sidebar móvil si está abierto
        closeSidebarMenu();
    }
});

// Manejar tecla Escape para cerrar sidebar
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            closeSidebarMenu();
        }
    }
});
