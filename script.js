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
            console.error('Error al obtener usuarios:', error);
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



}