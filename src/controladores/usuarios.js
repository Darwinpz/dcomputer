const User  = require('../models/user');
const passport = require('passport');
const Historial = require('../models/historial');
const ctrl = {};


ctrl.iniciar_sesion_index = (req,res)=>{

    res.render('users/signin.hbs');

};


ctrl.autenticarse =  passport.authenticate('local',{
        
        successRedirect: '/productos',
        failureRedirect: '/users/signin',
        failureFlash: true
        
});


ctrl.registrarse_index =  (req,res)=>{

    res.render('users/signup.hbs');

}


ctrl.guardar_usuario = async (req,res)=>{

    const {nombre,email,tipo,password,confirm_password} = req.body;

    const errors = [];

    if(nombre.length <=0){
        errors.push({text: 'Ingresa tu nombre'});
    }

    const emailUser = await User.findOne({email: email});

    if(emailUser){

         errors.push({text: 'Email ya existente'})
    }

    if(password.length < 4){

        errors.push({text: 'La contraseña debe tener mas de 4 caracteres'})

    }

    if(password!= confirm_password){

        errors.push({text: 'Las contraseñas no coinciden'})

    }

    if(errors.length > 0){

        res.render('users/signup',{errors,nombre,email,tipo,password,confirm_password});
    
    }else{

        const newUser = new User({nombre,email,password,tipo});

        newUser.password = await newUser.encryptPassword(password);

        await newUser.save();

        const newHistorial = new Historial({

            usuario_id: newUser._id,
            actividad: "Se registró"
    
        });
    
        await newHistorial.save();
        
        req.flash('success_msg','Usuario registrado');
            
        res.redirect('/users/signin');
        
    }    

}


ctrl.cerrar_sesion = async(req,res)=>{

    const newHistorial = new Historial({

        usuario_id: req.user._id,
        actividad: "Cerró sesión "

    });

    await newHistorial.save();

    req.logout();
    res.redirect('/');

}


module.exports = ctrl;
