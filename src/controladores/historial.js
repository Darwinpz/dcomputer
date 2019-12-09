ctrl = {};

const Usuarios = require('../models/user');
const Historial = require('../models/historial');

ctrl.index = async(req,res)=>{

    let usuarios;

    if(req.user.tipo == "admin"){

        usuarios = await Usuarios.find().sort({fecha: +1});
    
    }else{
        
        usuarios = await Usuarios.find({email:req.user.email});
    }
    
    res.render('historial/historial.hbs',{"usuarios":usuarios});

};

ctrl.historial = async(req,res)=>{

    const historial = await Historial.find({usuario_id: req.params.usuario_id});

    if(historial){
        
        res.json(historial);

    }

};

module.exports = ctrl;