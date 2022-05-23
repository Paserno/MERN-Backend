const { response } = require('express');
const { Jardinero } = require('../models');
const DetalleSolicitud = require('../models/detalleSolicitud');
const Solicitud = require('../models/solicitud');

// ------------------------- Solicitud -----------------------------


const obtenerSolicitudes = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;

    const [ total, solicitudes ] = await Promise.all([
        Solicitud.countDocuments(),
        Solicitud.find()
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
    const { idUsuario, idJardinero , ...data } = req.body;
    
    const solicitud = await Solicitud.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        solicitud
    });

}

// ------------------------- Detalle Solicitud -----------------------------


const obtenerDetalleSolicitud = async( req, res = response ) => {

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

module.exports = {
    obtenerSolicitudes,
    crearSolicitud,
    actualizarSolicitud,
    crearDetalleSolicitud
}