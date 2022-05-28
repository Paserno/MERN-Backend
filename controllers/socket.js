/*
    Controlador de los eventos del Socket.
*/

const DetalleSolicitud = require('../models/detalleSolicitud');
const Mensaje = require('../models/mensaje');
const Solicitud = require('../models/solicitud');
const TipoServicio = require('../models/tipoServicio');

// -------- Chat --------------
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

// -------- Solicitud ----------
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

const eliminarSolicitudSocket = async(payload) => {
    try {
        const { id } = payload;

        const solicitud = await Solicitud.findByIdAndUpdate( id, { estado: false}, { new: true}).
                                                populate('idJardinero', 'usuario');
        
        return solicitud;
        
    } catch (error) {
        console.log(error);
        return false;
    }
}

// -------- Detalle Solicitud ----------
const crearDetalleSolicitudSocket = async(payload) => {
    try {
        let data = new DetalleSolicitud(payload);
        await data.save();
        
        const id = data.idTipoServicio;
        // Pedir TipoServicio para obtener Nombre
        const tipoServicio = await TipoServicio.findById( id )
        
        const idTipoServicio = tipoServicio
        
        const idSolicitud = data.idSolicitud;

        let detalleSolicitud = data

        detalleSolicitud.idTipoServicio = idTipoServicio
        
        const [solicitud] = await Solicitud.find( idSolicitud ).populate('idJardinero', 'usuario');



        return {detalleSolicitud, solicitud};

        
    } catch (error) {
        console.log(error);
        return false;
    }
}

const actualizarDetalleSolicitudSocket = async(payload) => {
    try {
        const { id } = payload;
        const { estado, idTipoServicio, ...body } = payload;
        let data = {
            ...body
        }

        if (idTipoServicio){
            const existeTipoServicio = await TipoServicio.findById(idTipoServicio);
            if (!existeTipoServicio) {
                return false;
            }
            data = {
                ...body,
                idTipoServicio: idTipoServicio
            }
        }
        const detalleSolicitud = await DetalleSolicitud.findByIdAndUpdate( id, data, { new: true }).populate('idTipoServicio', 'nombre');

        const idSolicitud = detalleSolicitud.idSolicitud;
        // const query = {idSolicitud, estado: true}
        const [solicitud] = await Solicitud.find( idSolicitud ).populate('idJardinero', 'usuario');



        return {detalleSolicitud, solicitud};


    } catch (error) {
        console.log(error);
        return false;
    }
}

const eliminarDetalleSolicitudSocket = async(payload) => {
    try {
        const { id } = payload;
        const detalleSolicitud = await DetalleSolicitud.findByIdAndUpdate( id, {estado: false}, {new: true});

        const idSolicitud = detalleSolicitud.idSolicitud;
        // console.log('verificar: ', idSolicitud);
        // const query = {idSolicitud, estado: true}
        const [solicitud] = await Solicitud.find( idSolicitud ).populate('idJardinero', 'usuario');


        return {detalleSolicitud, solicitud};
        
    } catch (error) {
        console.log(error);
        return false;
    }
}


module.exports = {
    grabarMensaje,
    cambiosSolicitudSocket,
    eliminarSolicitudSocket,
    crearDetalleSolicitudSocket,
    actualizarDetalleSolicitudSocket,
    eliminarDetalleSolicitudSocket,
}