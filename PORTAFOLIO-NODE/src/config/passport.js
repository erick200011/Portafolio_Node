//IMPORTACION DE PASSPORT
const passport = require('passport')

//IMPORTACION DE SU MODELO
const User = require('../models/User')

//DEFINICION DE LA ESTRATEGIA
const LocalStrategy = require('passport-local').Strategy

//CONFIGURACION DE LA ESRATEGIA
passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},async(email,password,done)=>{
    //TRAER AL UISUARIO EN BASE AL EMAIL
    const userBDD = await User.findOne({email})
    //VALIDACION DEL USUARIO
    if(!userBDD) return done("Lo sentimos, el email no se encuentra registrado",false,)
    //UNA VALIDACION DE LAS CONTRASEÑAS
    const passwordUser = await userBDD.matchPassword(password)
    //VALIDACION DEL PASSWORD DEL FORMULARIO VS EL DE LA BDD
    if(!passwordUser) return done("Lo sentimos, los passwords no coinciden",false)
    //VALIDACION DEL TOKEN EN LA BDD
    if(userBDD.confirmEmail===false) return done("Lo sentimos, debe verificar la cuenta en su correo electrónico",false)
    //RETORNAR AL USUARIO
    return done(null,userBDD)
}))


//SEREALIZACION DEL USUARIO 
passport.serializeUser((user,done)=>{
    done(null,user.id)
})

//DESEREALIZCION DEL USUARIO 
passport.deserializeUser(async (id, done) => {
    const userDB  = await User.findById(id).exec();
    return done(null,userDB)
});