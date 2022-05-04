const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');


const loginAdmin = async(req, res = response) => {

    const { correo, password } = req.body;
    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar si es Admin
        if ( usuario.rol !== 'ADMIN_ROLE' ) {
            return res.status(401).json({
                ok: false,
                msg: `${ usuario.nombre } no es administrador - No puede iniciar sesión aquí`
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }   

}

const adminPost = async(req, res = response) => {
    
    const { nombre, apellido, correo, password, ciudad, direccion} = req.body;
    try {
        const usuario = new Usuario({ nombre,apellido, correo, password, ciudad, direccion });
    
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync( password, salt );
    
        // Guardar en BD
        await usuario.save();
    
        // Generar el JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }  
}

const adminDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json({
        ok: true,
        usuario
    });
}

const obtenerUsuario = async(req, res = response ) => {

    const { id } = req.params;
    const usuarioRol = req.usuario.rol

    if ( usuarioRol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            msg: `Eres ${usuarioRol} no tienes autorización`
        });
    }

    const usuario = await Usuario.findById( id )
    
    if ( !usuario.estado ) {
        return res.status(400).json({
            ok: false,
            msg: 'Usuario no se encuentra - estado: false'
        });
    }

    res.json({
        ok: true,
        usuario 
    });
}




module.exports = {
    adminPost,
    adminDelete,
    loginAdmin,
    obtenerUsuario
}