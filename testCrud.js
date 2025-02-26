require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // Puerto por defecto de PostgreSQL
});

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Respuesta HTML</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Â¡Hola, mundo!</h1>
            <p>Este es un ejemplo de respuesta HTML enviada desde el backend.</p>
        </div>
    </body>
    </html>`);
});

app.get('/articulos',async (req, res) => {
  try {
    const result = await pool.query(`SELECT
        *
      FROM
        articulos;`);
    res.json({ message: 'Consulta de Articulos', time: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Crear un nuevo artÃ­culo
app.post('/articulo', async (req, res) => {
  
  const { nombre, marca, precio, cantidad } = req.body;  // Usamos req.body para obtener los datos del artÃ­culo.
  
  if (!nombre || !marca || !precio || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos para crear el artÃ­culo' });
  }
      
  try {
    const result = await pool.query(
      `INSERT INTO articulos (nombre, marca, precio, cantidad) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, marca, precio, cantidad]
    );
    
    res.status(201).json({ message: 'ArtÃ­culo creado exitosamente', articulo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/articulo/:id', async (req, res) => {
  console.log("Aqui viene una peticion",req);
  const { id } = req.params;
  const { nombre, marca, precio, cantidad } = req.body;

  if (!nombre || !marca || !precio || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos para actualizar el artÃ­culo' });
  }

  try {
    const result = await pool.query(
      `UPDATE articulos 
       SET nombre = $1, marca = $2, precio = $3, cantidad = $4 
       WHERE id = $5 RETURNING *`,
      [nombre, marca, precio, cantidad, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ArtÃ­culo no encontrado' });
    }

    res.json({ message: 'ArtÃ­culo actualizado', articulo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/articulo/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM articulos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'ArtÃ­culo no encontrado' });
    }

    res.json({ message: 'ArtÃ­culo eliminado', articulo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
  