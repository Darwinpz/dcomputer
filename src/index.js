const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const method0verride = require('method-override');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');
const errorHandler = require('error-handler');
const SocketIO = require('socket.io');

//MODELOS
const Historial = require('./models/historial');
const Usuarios = require('./models/user');

//inicializar
const app = express();
require('./database');
require('./config/passport');

//settings

app.set('port',process.env.PORT || 3000);

app.set('views',path.join(__dirname,'views'));

app.engine('.hbs',exphbs({

    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('../src/helpers/libs')
}));

app.set('view engine','.hbs');

// Middelwares

app.use(multer({dest: path.join(__dirname,'../src/public/upload/temp')}).single('image'));  
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(method0verride('_method'));
app.use(session({

    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(morgan('dev'));

//global variables
app.use((req,res,next)=>{

    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');    
    res.locals.user = req.user || null;
    next();

});

//routes

require('./routes/index')(app); 


//static files

app.use(express.static(path.join(__dirname,'public')));

// Servidor escuchando
const server = app.listen(app.get('port'),()=>{

    console.log("Servidor iniciado",app.get('port'));

})


//errohandlers
if ('development' === app.get('env')){
    app.use(errorHandler);
}

//SOCKETS

const io = SocketIO.listen(server);

io.on('connection',(socket)=>{

    console.log("nueva conexion: ",socket.handshake.address);

    socket.on('historial',async(usuario_id)=>{

        if(usuario_id != "general" && usuario_id!=""){
    
            const historial = await Historial.find({usuario_id: usuario_id});

            io.sockets.emit('historial',{"historial": historial,"usuario":usuario_id});

        }

        if(usuario_id == "general"){

            historial1 = [];

            const historial = await Historial.find();

            for (const historia of historial){
            
                const  usuario = await Usuarios.findOne({_id:historia.usuario_id});
                
                historial1.push({
                    
                    email: usuario.email,
                    actividad: historia.actividad,
                    timestamp: historia.timestamp

                });
                
            }

            io.sockets.emit('historial',{"historial": historial1,"usuario":"general"});

        }
        
    });

    
});

