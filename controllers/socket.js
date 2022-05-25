/*
    Controlador de los eventos del Socket.
*/

const Mensaje = require('../models/mensaje');
const Solicitud = require('../models/solicitud');

const grabarMensaje = async(payload)=> {
    try {
        const mensaje = new Mensaje(payload);
        await mensaje.save();
        return mensaje;
    } catch (error) {
        console.log(error);
        return false;        
    }
}


const cambiosSolicitudSocket = async(payload) => {
    try {
        // Id de la solicitud
        const { id } = payload;
        // Datos de la Solicitud a cambiar
        const {idUsuario, idJardinero, estado, ...data} = payload;

        const solicitud = await Solicitud.findByIdAndUpdate(id, data, {new: true}).
                                            populate('idJardinero', 'usuario');
        return solicitud;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}


module.exports = {
    grabarMensaje,
    cambiosSolicitudSocket,
}