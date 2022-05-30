const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers');
const { Jardinero, Usuario } = require('../models');


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
    
    const { usuario, especialidad, descripcion, activo} = req.body;
    try {

        const [jardineroDB] = await Jardinero.find({ usuario: usuario });
        
        if ( jardineroDB ) {
            return res.status(400).json({
                ok: false,
                msg: `El Jardinero ya se encuentra registrado`
            });
        }

        const jardinero = new Jardinero({ usuario, especialidad, descripcion, activo });
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

const actualizarJardinero = async(req, res = response) => {

    const { id } = req.params;
    const { _id, usuario, ...resto } = req.body;


    const jardinero = await Jardinero.findByIdAndUpdate( id, resto, {new: true}).populate('usuario', 'nombre apellido correo');
    

    res.json({
        ok: true,
        jardinero
    });
}

const obtenerJardinero = async(req, res = response ) => {

    const { usuario } = req.params;
    // const usuarioRol = req.usuario.rol

    // if ( usuarioRol !== 'ADMIN_ROLE'){
    //     return res.status(401).json({
    //         ok: false,
    //         msg: `Eres ${usuarioRol} no tienes autorización`
    //     });
    // }


    const [jardinero] = await Jardinero.find({ usuario: usuario }).populate('usuario', 'nombre apellido correo')
    
    if(!jardinero){
        return res.status(200).json({
            ok: false,
            msg: 'No Existe Registro'
        })
    }

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

const obtenerJardinerosActivos = async( req, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;
    // const query = { rol: 'OTRO_ROLE', estado: true};
    const [ usuarios, totales ] = await Promise.all([ Usuario.aggregate(
        [
            {
                $lookup:
                {
                    from: "jardineros",
                    localField: "_id",
                    foreignField: "usuario",
                    as: 'jardinero'
                }
            },
            { $unwind: "$jardinero" },
            { $match: { 
                "estado": true, 
                "jardinero.activo": true,
                "jardinero.estado": true,
                "rol": "OTRO_ROLE"
                },
            },
            {
                $project: {
                    password: 0,
                    __v: 0,
                    "jardinero.__v":0
                }
            }
        ]), Usuario.aggregate(
            [
                {
                    $lookup:
                    {
                        from: "jardineros",
                        localField: "_id",
                        foreignField: "usuario",
                        as: 'jardinero'
                    }
                },
                { $unwind: "$jardinero" },
                { $match: { 
                    "estado": true, 
                    "jardinero.activo": true,
                    "jardinero.estado": true,
                    "rol": "OTRO_ROLE"
                    },
                },
                {
                    $project: {
                        password: 0,
                        __v: 0,
                        "jardinero.__v":0
                    }
                },
                {
                    $count: "total"
                },

        ])
    ])
    const [ contador ] = totales; 
    const { total } = contador 


    res.json({
        ok:true,
        total,
        usuarios,
    });
}

const loginJardin = async(req, res = response) => {

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
        
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Verificar si es usuario
        if ( usuario.rol === 'USER_ROLE' ) {
            return res.status(401).json({
                ok: false,
                msg: `${ usuario.nombre } no es un rol permitido - No puede iniciar sesión aquí`
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

module.exports = {
    obtenerJardineros,
    crearJardinero,
    obtenerJardinero,
    actualizarJardinero,
    obtenerJardinerosActivos,
    loginJardin
}