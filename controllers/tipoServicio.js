const { response } = require('express');
const TipoServicio = require('../models/tipoServicio');

const obtenerTipoServicios = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };


    const [ total, servicios ] = await Promise.all([
        TipoServicio.countDocuments(query),
        TipoServicio.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        ok: true,
        total,
        servicios
    });
}

const crearTipoServicio = async(req, res = response) => {

    const { nombre, tarifa } = req.body;

    try {
        const servicio = new TipoServicio({ nombre, tarifa })
    
        await servicio.save();
    
        res.status(201).json({
            ok: true,
            servicio
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }
}

const actualizarTipoServicio = async( req, res = response) => {
    const { id } = req.params;
    const { estado, ...data } = req.body;
    try {

        const servicio = await TipoServicio.findByIdAndUpdate(id, data, { new: true });
    
        res.status(200).json({
            ok: true,
            servicio
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }
    
}

const eliminarTipoServicio = async( req, res = response ) => {

    const { id } = req.params;

    try {

    const servicio = await TipoServicio.findByIdAndUpdate( id, { estado: false } );

    res.status(200).json({
        ok: true,
        servicio
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
    crearTipoServicio,
    obtenerTipoServicios,
    actualizarTipoServicio,
    eliminarTipoServicio,
}