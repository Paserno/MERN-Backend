const { Router } = require('express');
const { obtenerJardinerosActivos } = require('../controllers/jardin');
const { validarJWT } = require('../middlewares');

/*
    Path: api/jardin
*/ 

const router = Router();

router.get('/',[
    validarJWT
],  obtenerJardinerosActivos);


module.exports = router;
