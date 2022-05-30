const { Router } = require('express');
const { obtenerJardinerosActivos, loginJardin, actualizarJardinero } = require('../controllers/jardin');
const { validarJWT, validarCampos } = require('../middlewares');
const { check } = require('express-validator');
const { existeJardineroPorId } = require('../helpers');


/*
    Path: api/jardin
*/ 

const router = Router();

router.get('/',[
    validarJWT
],  obtenerJardinerosActivos);


router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginJardin);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeJardineroPorId ),
    validarCampos
], actualizarJardinero)

module.exports = router;
