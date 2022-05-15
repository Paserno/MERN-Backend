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
            // console.log(usuario)

            socket.join(miId);
            

            socket.on('mensaje-personal', async(payload)=>{
                // console.log(payload);
               
                const mensaje = await grabarMensaje(payload);
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });

        })

    }
}


module.exports = Sockets;