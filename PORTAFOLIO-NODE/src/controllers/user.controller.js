//IMPORTAR PASSPOT
const passport = require("passport")
const User = require('../models/User')

const renderRegisterForm =(req,res)=>{
    res.render('user/registerForm')
}

//Capturar los datos y guardarlos en la BDD
const registerNewUser = async(req,res)=>{
    
    //DESTRUCTURAR LOS DATOS DEL FORMULARIO
    const{name,email,password,confirmpassword} = req.body
    //VALIDAR SO TODOS LOS AMPOS ESTAN COMPLETOS
    if (Object.values(req.body).includes("")) return res.send("Lo sentimos, debes llenar todos los campos")

    if(password != confirmpassword) return res.send("Lo sentimos, los passwords no coinciden")
    //VALIDACIÓN DE LAS CONSTRASEÑAS
    const userBDD = await User.findOne({email})

    //VALIDAR SI YA EXISTE EL USUARIO    
    if(userBDD) return res.send("Lo sentimos, el email ya se encuentra registrado")

    //GUARDAR EL REGISTRO EN LA BDD
    const newUser = await new User({name,email,password,confirmpassword})

    //ENCRIPTAR EL PASSWORD
    newUser.password = await newUser.encrypPassword(password)

    //Crear Token
    const token = newUser.crearToken()
    sendMailToUser(email,token)
    //GUARDAR EL USUARIO
    newUser.save()
    
    //REFIRIGIR AL LOGIN
    res.redirect('/user/login')
}
const renderLoginForm =(req,res)=>{
    res.render('user/loginForm')
}

//APTURAR DATOS DEL FORMULARIO DEL LOGIN A LA BDD
/* const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})*/
const loginUser = passport.authenticate('local',{
    failureRedirect:'/user/login',
    successRedirect:'/portafolios'
})

const logoutUser =(req,res)=>{
    req.logout((err)=>{
        if (err) return res.send("Ocurrio un error") 
        res.redirect('/');
    });
}
//CONFIRMACION DEL TOKEN
const confirmEmail = async(req,res)=>{
    // 
    if(!(req.params.token)) return res.send("Lo sentimos, no se puede validar la cuenta")
    //CARGAR EL USUARIO EN LA BASE AL TOKEN RECEPTADO 
    const userBDD = await User.findOne({token:req.params.token})
    //SETER EL TOKEN A NULL
    userBDD.token = null
    //GUARDAR EN LA BDD
    userBDD.confirmEmail=true
    await userBDD.save()
    res.send('Token confirmado, ya puedes iniciar sesión');
}

module.exports={
    renderRegisterForm,
    registerNewUser,
    renderLoginForm,
    loginUser,
    logoutUser,
    confirmEmail
    
}