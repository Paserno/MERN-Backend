const { grabarMensaje, cambiosSolicitudSocket } = require('../controllers/socket');
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
            socket.on('mensaje-personal', async(payload) =>{
               
                const mensaje = await grabarMensaje(payload);
                payload.de = JSON.stringify(payload.de)
                payload.para = JSON.stringify(payload.para)
               
                
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });


            // Escuchar cuando haya un cambio en la solicitud
            socket.on('cambio-solicitud', async(payload) => {

                const solicitud = await cambiosSolicitudSocket(payload);
                const uid = JSON.stringify(solicitud.idUsuario);
                const jid = JSON.stringify(solicitud.idJardinero.usuario);

                console.log(uid);
                console.log(jid);

                this.io.to(uid).emit('cambio-solicitud', solicitud);
                this.io.to(jid).emit('cambio-solicitud', solicitud);
            })

        })

    }
}


module.exports = Sockets;