const { Router } = require('express');
const { obtenerChat } = require('../controllers/mensajes');
const { validarJWT } = require('../middlewares');

/*
    Path: api/mensajes
*/ 

const router = Router();


router.get('/:de', [validarJWT], obtenerChat);


module.exports = router;
