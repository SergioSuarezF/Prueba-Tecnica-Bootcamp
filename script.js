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

async function ejecutarServicio() {
    const userService = new RandomUserService();
    
    try {
        console.log('🎭 Generando 10 personas aleatorias...\n');
        
        const usuarios = await userService.generateUsers(10);
        
        console.log('Lista de 10 personas generada exitosamente:\n');
        console.log('='.repeat(60));
        
        usuarios.forEach((usuario, index) => {
            console.log(`\n👤 PERSONA ${index + 1}:`);
            console.log(`   Nombre: ${usuario.nombre}`);
            console.log(`   Género: ${usuario.genero === 'male' ? '👨 Masculino' : '👩 Femenino'}`);
            console.log(`   Ubicación: ${usuario.ubicacion}`);
            console.log(`   Email: ${usuario.correo}`);
            console.log(`   Fecha de Nacimiento: 🎂 ${usuario.fechaNacimiento}`);
            console.log(`   Edad: ${usuario.edad} años`);
            console.log(`   Teléfono: ${usuario.telefono}`);
            console.log(`   Foto: ${usuario.foto}`);
            console.log('-'.repeat(40));
        });
        
        return usuarios;
        
    } catch (error) {
        console.error('Error al generar usuarios:', error.message);
        throw error;
    }
}

async function obtenerPersonasAleatorias(cantidad = 10) {
    const userService = new RandomUserService();
    return await userService.generateUsers(cantidad);
}
