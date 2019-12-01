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