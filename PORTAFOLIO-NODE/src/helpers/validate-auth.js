//Exportando una función isAuthenticated
module.exports.isAuthenticated = (req,res,next)=>{
    
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/user/login')
}