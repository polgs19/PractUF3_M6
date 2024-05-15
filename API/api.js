//Requiere instalar: npm install mysql2
//Si es postgres: npm install pg
//Requiere crear un archivo package.json, que contendrá la información el proyecto y sus dependencias: npm init -y
//Requiere instalar: npm install express


const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mysql = require('mysql2'); //pg con postgres

// Configura la conexión a la base de datos MySQL

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'footlocker',
});

// Middleware para el análisis del cuerpo de solicitudes en formato JSON
app.use(express.json());
app.use(cors());

//TABLA PRODUCTO

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
      if (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener productos' });
      } else {
        res.json({ producto: results });
      }
    });
  });
  
  // Ruta para obtener un producto por su ID
  app.get('/api/productos/:id', (req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM productos WHERE id = ?', [productId], (err, results) => {
      if (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ error: 'Error al obtener el producto' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Producto no encontrado' });
        } else {
          res.json({ producto: results[0] });
        }
      }
    });
  });
  
  // Ruta para crear un nuevo producto
  app.post('/api/productos', (req, res) => {
    const newProduct = req.body;
    db.query('INSERT INTO productos (id, referencia, nombre, precio, genero, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)', [newProduct.id_producto, newProduct.referencia, newProduct.nombre, newProduct.precio, newProduct.genero, newProduct.descripcion, newProduct.imagen], (err, results) => {
      if (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ error: 'Error al crear el producto' });
      } else {
        res.json({ message: 'Producto creado con éxito', producto: newProduct });
      }
    });
  });
  
  // Ruta para actualizar un producto por su ID
  app.put('/api/productos/:id', (req, res) => {
    const id_product = req.params.id;
    const updatedProduct = req.body;
    db.query('UPDATE productos SET referencia = ?, nombre = ?, precio = ?, genero = ?, descripcion = ?, imagen = ? WHERE id_producto = ?', [updatedProduct.referencia, updatedProduct.nombre, updatedProduct.precio, updatedProduct.genero, updatedProduct.descripcion, updatedProduct.imagen, id_product], (err, results) => {
      if (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
      } else {
        res.json({ message: 'Producto actualizado con éxito', producto: updatedProduct });
      }
    });
  });
  
  
  
  // Ruta para eliminar un producto por su ID
  app.delete('/api/productos/:id', (req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM productos WHERE id = ?', [productId], (err, results) => {
      if (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
      } else {
        res.json({ message: 'Producto eliminado con éxito' });
      }
    });
  });
  app.listen(port, () => {
    console.log(`API Express corriendo en http://localhost:${port}`);
});
