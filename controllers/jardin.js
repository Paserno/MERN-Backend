const { response } = require('express');
const { Jardinero } = require('../models');


const obtenerJardineros = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, jardineros ] = await Promise.all([
        Jardinero.countDocuments(query),
        Jardinero.find(query)
            .populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        ok: true,
        total,
        jardineros
    });
}


const crearJardinero = async(req, res = response) => {
    
    const { usuario, especialidad, descripcion} = req.body;
    try {

        const [jardineroDB] = await Jardinero.find({ usuario: usuario });
        
        if ( jardineroDB ) {
            return res.status(400).json({
                ok: false,
                msg: `El Jardinero ya se encuentra registrado`
            });
        }

        const jardinero = new Jardinero({ usuario, especialidad, descripcion });
        // Guardar en BD
        await jardinero.save();

        res.json({
            ok: true,
            jardinero
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }  
}

const obtenerJardinero = async(req, res = response ) => {

    const { usuario } = req.params;
    const usuarioRol = req.usuario.rol

    if ( usuarioRol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            msg: `Eres ${usuarioRol} no tienes autorización`
        });
    }

    const [jardinero] = await Jardinero.find({ usuario: usuario }).populate('usuario', 'nombre')
    
    if ( !jardinero.estado ) {
        return res.status(400).json({
            ok: false,
            msg: 'Jardinero no se encuentra - estado: false'
        });
    }

    res.json({
        ok: true,
        jardinero 
    });
}


module.exports = {
    obtenerJardineros,
    crearJardinero,
    obtenerJardinero,
}