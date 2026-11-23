// 1. Traemos el módulo 'http' que ya viene integrado en Node.js para crear un servidor web
const http = require('http');

// 2. Creamos un arreglo vacío para guardar los usuarios registrados mientras el servidor está encendido
const usuarios = [];

// 3. Creamos el servidor y definimos qué hacer cada vez que llega una petición (req = petición, res = respuesta)
const servidor = http.createServer((req, res) => {
  // 4. Preparamos una variable para ir armando los datos que envía quien llama al servicio
  let cuerpo = '';

  // 5. Cada vez que llega un pedazo de información (ej. usuario y contraseña), lo sumamos a 'cuerpo'
  req.on('data', (pedazo) => {
    cuerpo += pedazo.toString();
  });

  // 6. Cuando ya terminó de llegar toda la información de la petición, procesamos la respuesta
  req.on('end', () => {
    // 7. Indicamos que la respuesta se enviará en formato JSON
    res.setHeader('Content-Type', 'application/json');

    // 8. Convertimos el texto recibido (JSON) en un objeto de JavaScript para leer usuario y contraseña
  let datos = {};
try {
  datos = cuerpo ? JSON.parse(cuerpo) : {};
} catch (error) {
  res.writeHead(400);
  res.end(JSON.stringify({ mensaje: 'JSON inválido' }));
  return;
}
const { usuario, contrasena } = datos;

    // 9. Si la ruta pedida es '/registro' y el método es POST, guardamos el usuario
    if (req.url === '/registro' && req.method === 'POST') {
      usuarios.push({ usuario, contrasena });
      res.writeHead(200);
      res.end(JSON.stringify({ mensaje: 'Usuario registrado correctamente' }));
      return;
    }

    // 10. Si la ruta pedida es '/login' y el método es POST, revisamos si coincide
    if (req.url === '/login' && req.method === 'POST') {
      const valido = usuarios.some(
        (u) => u.usuario === usuario && u.contrasena === contrasena
      );

      // 11. Si existe y coincide, respondemos éxito; si no, error de autenticación
      if (valido) {
        res.writeHead(200);
        res.end(JSON.stringify({ mensaje: 'Autenticación satisfactoria' }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ mensaje: 'Error en la autenticación' }));
      }
      return;
    }

    // 12. Si entran a cualquier otra ruta que no existe, respondemos 404
    res.writeHead(404);
    res.end(JSON.stringify({ mensaje: 'Ruta no encontrada' }));
  });
});

// 13. Ponemos el servidor a escuchar en el puerto 3000 de tu computador
servidor.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});