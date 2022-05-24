const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');
const Solicitud = require('../models/solicitud');



const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        ok:true,
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, apellido, correo, password, ciudad, direccion} = req.body;
    const usuario = new Usuario({ nombre,apellido, correo, password, ciudad, direccion });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true});

    res.json(usuario);
}


// --------------- Solicitud Pendiente --------------------

const solicitudPendiente = async( req, res = response) => {


    const { idJardinero } = req.params;
    const uid  = req.usuario._id; 
    query = { estado:true, idUsuario: uid, idJardinero, finish: false }

    // Obtienes la solicitud pendiente de parte del usuario con un Jardinero.
    const [solicitud] = await Solicitud.find( query );

    if (!solicitud){
        return res.json({
            ok: false,
            msg: 'No existen solicitudes asociadas'
        })
    }
    
    res.json({
        ok:true,
        solicitud
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    solicitudPendiente,
    // usuariosDelete,
}