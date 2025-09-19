// Funcionalidad específica del Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del dashboard
    loadDashboardData();
    
    // Actualizar datos cada 5 minutos
    setInterval(loadDashboardData, 300000);
    
    // Funcionalidad de búsqueda
    setupSearchFunctionality();
});

// Función para configurar funcionalidad de búsqueda
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            performSearch();
        });
    }
}

// Función para realizar búsqueda
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const query = searchInput ? searchInput.value.trim() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';
    
    if (query.length < 2) {
        showNoResults();
        return;
    }
    
    // Simular búsqueda
    const results = simulateSearch(query, category);
    displaySearchResults(results);
}

// Función para simular búsqueda
function simulateSearch(query, category) {
    // Datos de ejemplo para búsqueda
    const allData = {
        talleres: [
            { name: 'Taller de Moda Femenina', type: 'talleres', description: 'Especializado en vestidos y blusas' },
            { name: 'Taller de Sastrería', type: 'talleres', description: 'Trajes y camisas para caballeros' },
            { name: 'Taller de Reparaciones', type: 'talleres', description: 'Arreglos y ajustes generales' }
        ],
        proveedores: [
            { name: 'Telas del Norte', type: 'proveedores', description: 'Proveedor de telas de calidad' },
            { name: 'Hilos Premium', type: 'proveedores', description: 'Hilos y accesorios de costura' },
            { name: 'Accesorios Moda', type: 'proveedores', description: 'Botones, cremalleras y más' }
        ],
        servicios: [
            { name: 'Arreglo de Vestido', type: 'servicios', description: 'Servicio de arreglo y ajuste de vestidos' },
            { name: 'Confección de Blusa', type: 'servicios', description: 'Confección personalizada de blusas' },
            { name: 'Ajuste de Pantalón', type: 'servicios', description: 'Ajuste y arreglo de pantalones' }
        ]
    };
    
    let results = [];
    
    if (category === 'all') {
        Object.values(allData).forEach(categoryData => {
            results = results.concat(categoryData);
        });
    } else {
        results = allData[category] || [];
    }
    
    // Filtrar por query
    return results.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
}

// Función para mostrar resultados de búsqueda
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        showNoResults();
        return;
    }
    
    let html = '<div class="search-results-list">';
    results.forEach(result => {
        html += `
            <div class="search-result-item">
                <div class="result-icon">${getResultIcon(result.type)}</div>
                <div class="result-content">
                    <h4>${result.name}</h4>
                    <p>${result.description}</p>
                    <span class="result-type">${getResultTypeLabel(result.type)}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    searchResults.innerHTML = html;
}

// Función para mostrar "sin resultados"
function showNoResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda o cambia el filtro de categoría.</p>
            </div>
        `;
    }
}

// Función para obtener icono según tipo
function getResultIcon(type) {
    const icons = {
        talleres: '🧵',
        proveedores: '🏪',
        servicios: '✂️'
    };
    return icons[type] || '📄';
}

// Función para obtener etiqueta de tipo
function getResultTypeLabel(type) {
    const labels = {
        talleres: 'Taller',
        proveedores: 'Proveedor',
        servicios: 'Servicio'
    };
    return labels[type] || 'Elemento';
}

// Función para cargar datos del dashboard
function loadDashboardData() {
    // Simular carga de datos desde API
    updateStats();
    updateRecentActivity();
    updateRecentWorkshops();
}

// Función para actualizar estadísticas
function updateStats() {
    // En una aplicación real, estos datos vendrían de una API
    const stats = {
        talleres: Math.floor(Math.random() * 3) + 6, // 6-8
        proveedores: Math.floor(Math.random() * 5) + 13, // 13-17
        servicios: Math.floor(Math.random() * 15) + 80, // 80-95
        ingresos: Math.floor(Math.random() * 2000) + 11000 // 11000-13000
    };
    
    // Actualizar números en el DOM
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = stats.talleres;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = stats.proveedores.toLocaleString();
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = stats.servicios.toLocaleString();
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = `$${stats.ingresos.toLocaleString()}`;
    
    // Animar números
    animateNumbers();
}

// Función para actualizar actividad reciente
function updateRecentActivity() {
    const activities = [
        {
            icon: '✂️',
            title: 'Nuevo servicio registrado',
            description: 'Arreglo de vestido - María González',
            time: 'Hace 2 horas'
        },
        {
            icon: '👥',
            title: 'Cliente registrado',
            description: 'Ana Martínez - Nuevo cliente',
            time: 'Hace 4 horas'
        },
        {
            icon: '💰',
            title: 'Factura generada',
            description: 'Factura #001234 - $85.00',
            time: 'Hace 6 horas'
        }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }
}

// Función para actualizar talleres recientes
function updateRecentWorkshops() {
    // Simular actualización de datos de talleres
    console.log('Actualizando datos de talleres...');
}

// Función para animar números
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(number => {
        const finalValue = number.textContent;
        const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
        
        if (!isNaN(numericValue)) {
            animateValue(number, 0, numericValue, 1000, finalValue);
        }
    });
}

// Función para animar valor numérico
function animateValue(element, start, end, duration, originalText) {
    const startTime = performance.now();
    const isCurrency = originalText.includes('$');
    const isFormatted = originalText.includes(',');
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (end - start) * easeProgress);
        
        let displayValue = currentValue.toString();
        
        if (isFormatted) {
            displayValue = currentValue.toLocaleString();
        }
        
        if (isCurrency) {
            displayValue = '$' + displayValue;
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}