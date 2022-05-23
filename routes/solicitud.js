const { Router } = require('express');
const { check } = require('express-validator');
const { crearSolicitud, actualizarSolicitud, obtenerSolicitudes, crearDetalleSolicitud, obtenerDetalleSolicitud, actualizarDetalleSolicitud, eliminarDetalleSolicitud } = require('../controllers/solicitud');
const { existeJardineroPorId, existeSolicitudPorId, existeTipoServicioPorId, existeDetalleSolicitudPorId } = require('../helpers');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();

// ------------------------- Solicitud -----------------------------

router.get('/', [
    validarJWT
], obtenerSolicitudes)

router.post('/', [
    validarJWT,
    check('idJardinero', 'No es un ID válido').isMongoId(),
    check('idJardinero').custom( existeJardineroPorId ),
    validarCampos
], crearSolicitud )

router.put('/:id', [
    validarJWT,
    check('start').toBoolean(),
    check('finish').toBoolean(),
    check('confirmacion').toBoolean(),
    validarCampos,
], actualizarSolicitud )

// ------------------------- Detalle Solicitud -----------------------------

router.get('/detalle/:idSolicitud',[
    check('idSolicitud', 'No es un id de Mongo válido').isMongoId(),
    check('idSolicitud').custom( existeSolicitudPorId ),
    validarCampos,
], obtenerDetalleSolicitud );

router.post('/detalle/', [
    validarJWT,
    check('idSolicitud', 'No es un ID válido').isMongoId(),
    check('idSolicitud').custom( existeSolicitudPorId ),
    check('idTipoServicio', 'No es un ID válido').isMongoId(),
    check('idTipoServicio').custom( existeTipoServicioPorId ),
    validarCampos,

], crearDetalleSolicitud);

router.put('/detalle/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeDetalleSolicitudPorId ),
    validarCampos
], actualizarDetalleSolicitud)

router.delete('/detalle/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], eliminarDetalleSolicitud)

module.exports = router;