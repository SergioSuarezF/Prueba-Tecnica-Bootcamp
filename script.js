class RandomUserService {
    constructor(){
        this.apiurl = 'https://randomuser.me/api/';
    }

    async generateUsers(count = 10) {
        try {
            const response = await fetch(`${this.apiUrl}?results=${count}&nat=us,gb,es,fr,de,mx,br`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            return this.formatUsers(data.results);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    }

    formatUsers(users) {
        return users.map(user => ({
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


}

const userService = new RandomUserService();

async function generateUsers() {
    const generateBtn = document.getElementById('generateBtn');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const container = document.getElementById('usersContainer');

    generateBtn.disabled = true;
    loading.style.display = 'block';
    error.style.display = 'none';
    container.innerHTML = '';

    try {
        const users = await userService.generateUsers(10);
        displayUsers(users);
    } catch (err) {
        showError('Error al cargar los usuarios. Por favor, intenta nuevamente.');
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





