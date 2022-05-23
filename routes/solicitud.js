const { Router } = require('express');
const { check } = require('express-validator');
const { crearSolicitud, actualizarSolicitud, obtenerSolicitudes, crearDetalleSolicitud } = require('../controllers/solicitud');
const { existeJardineroPorId, existeSolicitudPorId, existeTipoServicioPorId } = require('../helpers');
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

router.post('/detalle/', [
    validarJWT,
    check('idSolicitud', 'No es un ID válido').isMongoId(),
    check('idSolicitud').custom( existeSolicitudPorId ),
    check('idTipoServicio', 'No es un ID válido').isMongoId(),
    check('idTipoServicio').custom( existeTipoServicioPorId ),
    validarCampos,

], crearDetalleSolicitud)


module.exports = router;