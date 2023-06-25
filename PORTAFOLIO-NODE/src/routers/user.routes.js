//Invocar la funcion ROUTERS
const {Router} = require('express')

//INVOCAR LAS FUNCIONES DEL CONTROLADOR
const { renderRegisterForm, registerNewUser, renderLoginForm, 
    loginUser, logoutUser,confirmEmail} = require('../controllers/user.controller')

//INICIALIZAR LA DUNCION EN LA VARIABLE ROUTER
const router = Router()

//DEFINIR LAS RUTAS
router.get('/user/register',renderRegisterForm)
router.post('/user/register',registerNewUser)
router.get('/user/login',renderLoginForm)
router.post('/user/login',loginUser)
router.post('/user/logout',logoutUser)
router.get('/user/confirmar/:token',confirmEmail)
//EXPORTACION DEFAUL
module.exports =router