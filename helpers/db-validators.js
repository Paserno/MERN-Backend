const Role = require('../models/role');
const { Usuario, Categoria, Producto, Jardinero } = require('../models');
const Solicitud = require('../models/solicitud');
const TipoServicio = require('../models/tipoServicio');
const DetalleSolicitud = require('../models/detalleSolicitud');


const esRoleValido = async(rol = 'USER_ROLE') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si la id de usuario existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeJardineroPorId = async( id ) => {

    // Verificar si la id del jardinero existe
    const existeJardinero = await Jardinero.findById(id);
    if ( !existeJardinero ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeSolicitudPorId = async( id ) => {

    // Verificar si la id de la solicitud existe
    const existeSolicitud = await Solicitud.findById(id);
    if ( !existeSolicitud ) {
        throw new Error(`El idSolicitud no existe ${ id } `);
    }
}

const existeDetalleSolicitudPorId = async( id ) => {

    // Verificar si la id de la solicitud existe
    const existeDetalleSolicitud = await DetalleSolicitud.findById(id);
    if ( !existeDetalleSolicitud ) {
        throw new Error(`El id no existe ${ id } `);
    }
}

const existeTipoServicioPorId = async( id ) => {

    // Verificar si la id del tipo de servicio existe
    const existeTipoServicio = await TipoServicio.findById(id);
    if ( !existeTipoServicio ) {
        throw new Error(`El idTipoServicio no existe ${ id }`);
    }
}

/**
 * Categorias
 */
const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeProductoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeJardineroPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
    existeSolicitudPorId,
    existeTipoServicioPorId,
    existeDetalleSolicitudPorId,
}

