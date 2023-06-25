const Portfolio = require('../models/Portafolio')
const { uploadImage,deleteImage } = require('../config/cloudinary')
const fs = require('fs-extra')

const renderAllPortafolios = async(req,res)=>{
    //A partir deñ modelp usar el método find y luego el método Lean
    const portfolios = await Portfolio.find().lean()
    res.render("portafolio/allPortfolios",{portfolios})
}

const renderPortafolio = (req,res)=>{
    res.send('Mostrar el detalle de un portafolio')
}
//PRESENTAR EL FORMULARIO
const renderPortafolioForm = (req,res)=>{
    res.render('portafolio/newFormPortafolio')
}
//CAPTURAR LOS DATOS DEL FORMULARIO A LA BDD
const createNewPortafolio =async(req,res)=>{
    const {title, category,description} = req.body
    const newPortfolio = new Portfolio({title,category,description})
    //LE AGREGO AHORA EL USUARIO
    newPortfolio.user = req.user._id
    //EJECUTAR EL METODO SAVE
    if(!(req.files?.image)) return res.send("Se requiere una imagen")
    const imageUpload = await uploadImage(req.files.image.tempFilePath)
    newPortfolio.image = {
        public_id:imageUpload.public_id,
        secure_url:imageUpload.secure_url
    }
    
    await fs.unlink(req.files.image.tempFilePath)
    await newPortfolio.save()
    res.redirect('/portafolios')
}
const renderEditPortafolioForm =async(req,res)=>{
    //A PARTIR DEL MODELO LLAMARLO AL MÉTODO FindById
    const portfolio = await Portfolio.findById(req.params.id).lean()
    const portfolios = await Portfolio.find({user:req.user._id}).lean()
    //Con la variable portafolio pintar en la vista del formulario
    res.render('portafolio/editPortfolio',{portfolio})
}
const updatePortafolio = async(req,res)=>{
    
    const portfolio = await Portfolio.findById(req.params.id).lean()
    
    if(req.files?.image) {
        if(!(req.files?.image)) return res.send("Se requiere una imagen")
        await deleteImage(portfolio.image.public_id)
        const imageUpload = await uploadImage(req.files.image.tempFilePath)
        const data ={
            title:req.body.title || portfolio.name,
            category: req.body.category || portfolio.category,
            description:req.body.description || portfolio.description,
            image : {
            public_id:imageUpload.public_id,
            secure_url:imageUpload.secure_url
            }
        }
        await fs.unlink(req.files.image.tempFilePath)
        await Portfolio.findByIdAndUpdate(req.params.id,data)
    }
    else{
        const {title,category,description}= req.body
        await Portfolio.findByIdAndUpdate(req.params.id,{title,category,description})
    }
    res.redirect('/portafolios')
}
const deletePortafolio = async(req,res)=>{
    //A PARTIR DEL MODELO USAR EL METODO findByIdAndDelete
    const portafolio = await Portfolio.findByIdAndDelete(req.params.id)
    //INVOCAR METODO Y HACER ID
    await deleteImage(portafolio.image.public_id)
    //HACER REDIRECT
    res.redirect('/portafolios')
}

// EXPORT NOMBRADO   
module.exports ={
    renderAllPortafolios,
    renderPortafolio,
    renderPortafolioForm,
    createNewPortafolio,
    renderEditPortafolioForm,
    updatePortafolio,
    deletePortafolio
}

