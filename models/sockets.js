const { grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers');


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents(){
        // on connection
        this.io.on('connection', async( socket ) => {

            
            const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
            if ( !usuario ){
                console.log('socket no identificado');
                return socket.disconnect();
            }

            const miId   = usuario._id;
            const id = JSON.stringify(miId);


            socket.join(id);

            // Escucha cuando el cliente manda un mensaje
            socket.on('mensaje-personal', async(payload)=>{
                console.log(payload);
               
                const mensaje = await grabarMensaje(payload);
                payload.de = JSON.stringify(payload.de)
                payload.para = JSON.stringify(payload.para)
               
                
                this.io.to(payload.para).emit('recibir-mensajes', mensaje);
                this.io.to(payload.de).emit('recibir-mensajes', mensaje);
            });

        })

    }
}


module.exports = Sockets;