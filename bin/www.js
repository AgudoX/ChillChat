#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('chillchat:server');
const http = require('http');
const { disconnect } = require('process');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

//Código JS de la parte del servidor
const io = require('socket.io')(server);




// Cuando haya una connection con websocket lanza lo que se ponga en la función.
io.on('connection', (socket) => {
  console.log('Se ha conectado un nuevo cliente');
  console.log('CLIENTES', io.engine.clientsCount)
  // Con broadcast conseguimos que el mensaje se envie a todos los clientes menos al que lo ha enviado
  socket.broadcast.emit('mensaje_chat', {
    name: 'Viva el betis', mensaje: 'Otro bético'
  })

  // Emitir el número de clienets conectados
  io.emit('clientes_chat', io.engine.clientsCount)

  // Cuando se emita el evento mensaje_chat que hemos creado en en index.hbs se ejecutará la función que socket.on, el primer parámetro es el evento que se emite, y el segundo es la función que se ejecuta y que recibe como parámetro lo que hemos enviado con el evento, en este caso el objeto data.
  socket.on('mensaje_chat', (data) => {
    console.log(data);
    // Lo que me llega por un socket lo envio a todos.
    io.emit('mensaje_chat', data);
  });

  //Este es un evento de la librería que permite
  socket.on('disconnect', () => {
    io.emit('desconexion', {
      mensaje: 'Tanta paz lleves como descanso dejas'
    })
  })

})


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
