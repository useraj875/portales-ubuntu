require('dotenv').config();
const express =  require('express');
const {Pool} = require('pg');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

const pool = new Pool({
user: process.env.DB_USER,
host: process.env.DB_HOST,
database: process.env.DB_NAME,
password: process.env.DB_PASS,
port: 5432,

});

app.get('/', async(req, res)=>{
try{
const result = await pool.query('SELECT NOW()');
res.json({message: 'Servidor funcionando', time: result.rows[0]});
}catch(error){
res.status(500).json({error: error.message});
}
});


// Petición GET simple con datos predefinidos y marca de tiempo
app.get('/datosPrueba', (req, res) => {
    // Define un array de objetos con datos predefinidos (hardcoded data)
    const datosHardcodeados = [
        { id: 1, nombre: 'Objeto 1', valor: 10 },
        { id: 2, nombre: 'Objeto 2', valor: 20 },
        { id: 3, nombre: 'Objeto 3', valor: 30 },
    ];

    // Obtiene la marca de tiempo actual en formato ISO 8601
    const timestamp = new Date().toISOString(); // Obtiene la marca de tiempo actual en formato ISO 8601

    // Imprime en la consola del servidor un mensaje indicando que se están enviando los datos predefinidos y la marca de tiempo
    console.log(`GET /datosPrueba - Enviando datos hardcodeados. Timestamp: ${timestamp}`);
    // Crea un objeto que contiene los datos predefinidos y la marca de tiempo para la respuesta
    const responseData = { datos: datosHardcodeados, timestamp: timestamp };
    // Envía la respuesta al cliente con un código de estado 200 (OK) y los datos en formato JSON
    res.status(200).json(responseData); // Establece explícitamente el código de estado a 200 (OK)
    // Imprime en la consola del servidor un mensaje indicando el código de estado 200 y la respuesta enviada
    console.log(`GET /datosPrueba - Status: 200 - Response sent:`, responseData); // Registra el estado y la respuesta enviada
});

// Petición POST simple (sin interacción con la base de datos)
app.post('/crearElemento', (req, res) => {
    // Extrae el cuerpo de la solicitud (datos enviados por el cliente en el POST)
    const nuevoElemento = req.body;
    // Obtiene la marca de tiempo actual para la petición POST
    const timestamp = new Date().toISOString(); // Marca de tiempo para la petición POST

    // Imprime en la consola del servidor los datos recibidos en la petición POST
    console.log(`POST /crearElemento - Datos recibidos (POST):`, nuevoElemento);

    // Validación básica: verifica si el cuerpo de la solicitud está vacío
    if (Object.keys(nuevoElemento).length === 0) {
        // Crea un objeto de respuesta de error con un mensaje en español
        const errorResponse = { error: "El cuerpo de la solicitud no puede estar vacío." };
        // Envía una respuesta al cliente con un código de estado 400 (Bad Request) y el objeto de error en formato JSON
        res.status(400).json(errorResponse); // Envía el código de estado 400 para una solicitud incorrecta
        // Imprime en la consola del servidor un mensaje indicando el código de estado 400 y la respuesta de error enviada
        console.log(`POST /crearElemento - Status: 400 - Response sent:`, errorResponse); // Registra la respuesta 400
        return; // Importante: termina la ejecución de la función para evitar que se siga procesando
    }

    // Simula la creación de un nuevo elemento (solo añade un ID y una marca de tiempo)
    nuevoElemento.id = Date.now(); // Usa la marca de tiempo actual como un ID simple
    nuevoElemento.createdAt = timestamp; // Añade la marca de tiempo de creación al elemento

    // Responde con el elemento "creado" (código de estado 201 Created)
    res.status(201).json(nuevoElemento); // Envía el código de estado 201 para indicar creación exitosa
    // Imprime en la consola del servidor un mensaje indicando el código de estado 201 y la respuesta enviada (el nuevo elemento)
    console.log(`POST /crearElemento - Status: 201 - Response sent:`, nuevoElemento); // Registra la respuesta 201
}); 

app.listen(port,()=>{
console.log(`Servidor corriendo (vscodetestt) en http://localhost:${port}`);
});


