
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet } = require('../controllers/usuarios');
const { adminPost, adminDelete, loginAdmin } = require('../controllers/admin');
const { obtenerJardineros, crearJardinero } = require('../controllers/jardin');


const router = Router();


router.get('/', usuariosGet );
router.get('/jardin', obtenerJardineros );

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],loginAdmin );

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo').custom( emailExiste ),
    check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    // check('rol').custom( esRoleValido ), 
    validarCampos
], adminPost)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],adminDelete );


router.post('/jardinero',[
    check('usuario','No es un id de Mongo').isMongoId(),
    check('especialidad', 'La dirección es obligatoria').not().isEmpty(),
    validarCampos
], crearJardinero)



module.exports = router;

