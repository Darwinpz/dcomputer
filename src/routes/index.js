const express = require("express");

const router = express.Router();

//REQUERIMOS LOS CONTROLADORES
const productos = require('../controladores/productos');
const usuarios = require('../controladores/usuarios');
const carrito = require('../controladores/carrito');
const facturas = require('../controladores/facturas');
const historial = require('../controladores/historial');

const {isAuthenticated} = require('../helpers/auth');


module.exports =(app)=>{

    router.get('/',(req,res)=>{

        res.render('index.hbs');    

    });

   //RUTAS DE USUARIOS
    router.get('/users/signin',usuarios.iniciar_sesion_index);
    router.post('/users/signin',usuarios.autenticarse);

    router.get('/users/signup',usuarios.registrarse_index);
    router.post('/users/signup',usuarios.guardar_usuario);

    router.get('/users/logout',usuarios.cerrar_sesion);
   
    //RUTAS DE PRODUCTOS

    router.get('/productos',isAuthenticated,productos.index);
    router.get('/productos/:producto_id',isAuthenticated,productos.ver_producto);
    router.post('/productos/crear',productos.crear);
    router.delete('/productos/:producto_id',productos.eliminar_producto);
    router.get('/productos/:producto_id/editar',isAuthenticated,productos.editar_producto_index);
    router.post('/productos/:producto_id/editar',isAuthenticated,productos.editar_producto);
    

    //RUTAS DE CARRITO

    router.get('/carrito',isAuthenticated,carrito.index);
    router.post('/carrito/:producto_id/agregar',carrito.agregar);
    router.delete('/carrito/:carrito_id',isAuthenticated,carrito.remover);
    router.post('/carrito/comprar',carrito.comprar);

    //RUTAS DE FACTURA

    router.get('/facturas',isAuthenticated,facturas.index);

    //HISTORIAL

    router.get('/historial',isAuthenticated,historial.index);
    router.get('/historial/:usuario_id',isAuthenticated,historial.historial);

    app.use(router);
}
