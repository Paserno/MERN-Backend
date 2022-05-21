const { Router } = require('express');
const { obtenerJardinerosActivos, loginJardin } = require('../controllers/jardin');
const { validarJWT, validarCampos } = require('../middlewares');
const { check } = require('express-validator');


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


module.exports = router;
