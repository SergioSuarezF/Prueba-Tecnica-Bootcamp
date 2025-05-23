class RandomUserService{
    constructor() {
        this.apiUrl = 'https://randomuser.me/api/';
        this.cache = new Map();
        this.requestCount = 0;
    }

    async generateUsers(count = 10) {
        const startTime = performance.now();
        this.requestCount++;
        
        try {
            const params = new URLSearchParams({
                results: count,
                nat: 'us,gb,es,fr,de,mx,br,au,ca',
                inc: 'name,gender,location,email,dob,picture,phone',
                noinfo: true
            });

            const response = await fetch(`${this.apiUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            const users = this.formatUsers(data.results);
            
            const endTime = performance.now();
            const loadTime = Math.round(endTime - startTime);
            
            this.showStats(users.length, loadTime);
            
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    formatUsers(users) {
        return users.map((user, index) => ({
            id: `user-${this.requestCount}-${index + 1}`,
            nombre: `${user.name.first} ${user.name.last}`,
            genero: user.gender,
            ubicacion: `${user.location.city}, ${user.location.state}, ${user.location.country}`,
            correo: user.email,
            fechaNacimiento: this.formatDate(user.dob.date),
            edad: user.dob.age,
            foto: user.picture.large,
            telefono: user.phone
        }));
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showStats(count, loadTime) {
        const stats = document.getElementById('stats');
        stats.innerHTML = `
            📊 <strong>${count} personas</strong> generadas en <strong>${loadTime}ms</strong> 
            • Solicitud #${this.requestCount}
        `;
        stats.style.display = 'block';
    }

}

const userService = new RandomUserService();

async function generateUsers() {
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('cargando');
    const error = document.getElementById('error');
    const stats = document.getElementById('stats');
    const container = document.getElementById('usersContainer');

    generateBtn.disabled = true;
    loading.style.display = 'block';
    error.style.display = 'none';
    stats.style.display = 'none';
    container.innerHTML = '';

    try {
        const users = await userService.generateUsers(10);
        displayUsers(users);
    } catch (err) {
        showError(`Error al cargar usuarios: ${err.message}`);
    } finally {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersContainer');
    
    users.forEach((user, index) => {
        const userCard = createUserCard(user, index);
        container.appendChild(userCard);
    });
}

function createUserCard(user, index){
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const genderClass = user.genero === 'male' ? 'gender-male' : 'gender-female';
    const genderIcon = user.genero === 'male' ? '👨' : '👩';
    
    card.innerHTML = `
        <div class="user-header">
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <div class="user-name">${user.nombre}</div>
            <div class="user-id">${user.id}</div>
        </div>
        <div class="user-info">
            <div class="info-item ${genderClass}">
                <div class="info-icon">${genderIcon}</div>
                <div class="info-content">
                    <span class="info-label">Género</span>
                    <span class="info-value">${user.genero === 'male' ? 'Masculino' : 'Femenino'}</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-icon">📍</div>
                <div class="info-content">
                    <span class="info-label">Ubicación</span>
                    <span class="info-value">${user.ubicacion}</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-icon">📧</div>
                <div class="info-content">
                    <span class="info-label">Email</span>
                    <span class="info-value">${user.correo}</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-icon">🎂</div>
                <div class="info-content">
                    <span class="info-label">Nacimiento</span>
                    <span class="info-value">${user.fechaNacimiento}</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-icon">⏰</div>
                <div class="info-content">
                    <span class="info-label">Edad</span>
                    <span class="info-value">${user.edad} años</span>
                </div>
            </div>
            <div class="info-item">
                <div class="info-icon">📞</div>
                <div class="info-content">
                    <span class="info-label">Teléfono</span>
                    <span class="info-value">${user.telefono}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}

window.addEventListener('load', () => {
    console.log('🚀 Servicio Random User API cargado');
    console.log('📊 Listo para generar personas aleatorias');
});
