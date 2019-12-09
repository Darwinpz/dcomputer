const passport = require('passport');

const localStrategy= require('passport-local');

const Historial = require('../models/historial');

const User = require('../models/user');

passport.use(new localStrategy({

    usernameField: 'email'

},async (email,password,done)=>{

    const user = await User.findOne({email:email});

    if(!user){
        return done(null,false,{message:'Usuario no encontrado'});
    }else{

      const match =  await  user.matchPassword(password);
        
      if(match){

            const newHistorial = new Historial({

                usuario_id: user._id,
                actividad: "Ingresó al sistema"
        
            });
        
            await newHistorial.save();

            return done(null,user);
      
        }else{
      
            return done(null, false,{message: "Contraseña Incorrecta"});
        }
        
    }

}));


passport.serializeUser((user,done)=>{

    done(null,user.id);

});

passport.deserializeUser((id,done)=>{

    User.findById(id,(err,user)=>{

        done(err,user);
    });

});