/*
   Path:  /api/tipo
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearTipoServicio, obtenerTipoServicios, actualizarTipoServicio, eliminarTipoServicio } = require('../controllers/tipoServicio');
const { validarJWT, esAdminRole, validarCampos } = require('../middlewares');

const router = Router();


router.get('/', obtenerTipoServicios);

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