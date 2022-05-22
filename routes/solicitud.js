const { Router } = require('express');
const { check } = require('express-validator');
const { crearSolicitud, actualizarSolicitud, obtenerSolicitudes } = require('../controllers/solicitud');
const { existeJardineroPorId } = require('../helpers');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();


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



module.exports = router;