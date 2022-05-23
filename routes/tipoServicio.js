/*
   Path:  /api/tipo
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearTipoServicio, obtenerTipoServicios, actualizarTipoServicio, eliminarTipoServicio, obtenerTipoServi } = require('../controllers/tipoServicio');
const { existeTipoServicioPorId } = require('../helpers');
const { validarJWT, esAdminRole, validarCampos } = require('../middlewares');

const router = Router();


router.get('/',  obtenerTipoServicios);

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeTipoServicioPorId ),
    validarCampos
], obtenerTipoServi);


router.post('/', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearTipoServicio );

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarTipoServicio);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos
], eliminarTipoServicio);


module.exports = router;