const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
// const { socketController } = require('../sockets/controller');
const Sockets = require('./sockets');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        // HTTP server
        this.server = createServer( this.app );
        this.io = require('socket.io')( this.server );

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
            admin:      '/api/admin',
            jardin:      '/api/jardin',
            mensajes:      '/api/mensajes',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        // this.configurarSockets()
        // this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth,       require('../routes/auth'));
        this.app.use( this.paths.buscar,     require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos,  require('../routes/productos'));
        this.app.use( this.paths.usuarios,   require('../routes/usuarios'));
        this.app.use( this.paths.admin,      require('../routes/admin'));
        this.app.use( this.paths.jardin,     require('../routes/jardineros'));
        this.app.use( this.paths.uploads,    require('../routes/uploads'));
        this.app.use( this.paths.mensajes,   require('../routes/mensajes'));
        
    }


    configurarSockets() {
        new Sockets(this.io);
    }
    // sockets(){
    //     this.io.on('connection',(socket) =>  socketController(socket, this.io ))

    // };

    listen() {
        
        this.configurarSockets();

        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
