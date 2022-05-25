const { response } = require('express');
const { Jardinero } = require('../models');
const DetalleSolicitud = require('../models/detalleSolicitud');
const Solicitud = require('../models/solicitud');
const TipoServicio = require('../models/tipoServicio');

// ------------------------- Solicitud -----------------------------


const obtenerSolicitudes = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [ total, solicitudes ] = await Promise.all([
        Solicitud.countDocuments(query),
        Solicitud.find(query)
            // .populate({ path: 'idUsuario', model: Usuario })
            .populate({ path: 'idJardinero', model: Jardinero })
            .populate('idUsuario', 'nombre apellido correo')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        ok: true,
        total,
        solicitudes
    });
}

const obtenerSolicitudesByJardinero = async( req, res = response) => {

    const { idJardinero } = req.params;
    const { limite = 5, desde = 0 } = req.query;


    const [ total, solicitudes ] = await Promise.all([
        Solicitud.countDocuments( {idJardinero} ),
        Solicitud.find( {idJardinero} )
            .populate('idUsuario', 'nombre apellido correo rol ciudad direccion')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);
    
    

    res.json({
        ok: true,
        total,
        solicitudes 
    });

}

const crearSolicitud = async(req, res = response ) => {

    const { ...body } = req.body;

    const data = {
        ...body,
        idUsuario: req.usuario._id
    }

    try {
        const nuevaSoliticud = new Solicitud( data );
    
        const solicitud = await nuevaSoliticud.save();
    
    
        res.status(201).json({
            ok: true,
            solicitud
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el Administrador'
        });
    }
}

const actualizarSolicitud = async( req, res = response ) => {

    const { id } = req.params;
    const { idUsuario, idJardinero, estado, ...data } = req.body;
    
    const solicitud = await Solicitud.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        solicitud
    });

}

const eliminarSolicitud = async( req, res = response) => {

    const { id } = req.params;

    try {

    const solicitud = await Solicitud.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.status(200).json({
        ok: true,
        solicitud
    });

} catch (error) {
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Hablar con el administrador'
    });
}
}

// ------------------------- Detalle Solicitud -----------------------------


const obtenerDetalleSolicitud = async( req, res = response ) => {

    const { idSolicitud } = req.params;

    const solicitud = await Solicitud.findById( idSolicitud )
                                        .populate('idUsuario', 'nombre apellido correo')
    
    const detalleSolicitud = await DetalleSolicitud.find({ idSolicitud: idSolicitud, estado: true }).populate('idTipoServicio', 'nombre')

    if(!solicitud){
        return res.status(200).json({
            ok: false,
            msg: 'No Existe Solicitud'
        })
    }
    
    if(detalleSolicitud.length === 0){
        return res.status(200).json({
            ok: true,
            solicitud,
            msg: 'No Existe Detalles Solicitud ',
            detalleSolicitud,
        })
    }

    res.json({
        ok: true,
        solicitud,
        detalleSolicitud 
    });

}

const obtenerDetalleSoli = async( req, res = response) => {

    const { id } = req.params;
    
    const detalleSolicitud = await DetalleSolicitud.findById( id ).populate('idTipoServicio', 'nombre');
    
    if ( !detalleSolicitud.estado ) {
        return res.status(400).json({
            ok: false,
            msg: 'El Detalle Servicio no se encuentra - estado: false'
        });
    }

    res.json({
        ok: true,
        detalleSolicitud 
    });
}

const crearDetalleSolicitud = async( req, res = response ) => {
    
    const { ...data } = req.body;
    try {
        const nuevaDetalleSoliticud = new DetalleSolicitud( data );

        const detalleSolicitud = await nuevaDetalleSoliticud.save();

        res.status(201).json({
            ok: true,
            detalleSolicitud
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el Administrador'
        });
    }

    
}

const actualizarDetalleSolicitud = async( req, res = response) => {

    const { id } = req.params;
    const { estado, idSolicitud, idTipoServicio, ...body } = req.body;
    let data = {
        ...body
    }
    try {
        if ( idTipoServicio) {
            const existeTipoServicio = await TipoServicio.findById(idTipoServicio);

            if ( !existeTipoServicio ) {
                return res.status(404).json({
                    ok: false,
                    msg: `No se encuentra idTipoServicio: ${ idTipoServicio }`
                });
            }

            data = {
                ...body,
                idTipoServicio: idTipoServicio
            }
        }
        
        const detalleSolicitud = await DetalleSolicitud.findByIdAndUpdate(id, data, { new: true }).populate('idTipoServicio', 'nombre');
    
        return res.status(200).json({
            ok: true,
            detalleSolicitud
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el Administrador'
        });
    }
    

}

const eliminarDetalleSolicitud = async( req, res = response) => {

    const { id } = req.params;

    try {

    const detalleServicio = await DetalleSolicitud.findByIdAndUpdate( id, { estado: false }, { new: true } );

    res.status(200).json({
        ok: true,
        detalleServicio
    });

} catch (error) {
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Hablar con el administrador'
    });
}
    
}

module.exports = {
    obtenerSolicitudes,
    crearSolicitud,
    actualizarSolicitud,
    crearDetalleSolicitud,
    eliminarSolicitud,
    obtenerDetalleSolicitud,
    actualizarDetalleSolicitud,
    eliminarDetalleSolicitud,
    obtenerDetalleSoli,
    obtenerSolicitudesByJardinero,
}