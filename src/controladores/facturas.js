ctrl = {};

const Facturas = require('../models/facturas');
const Producto = require('../models/productos');

ctrl.index = async(req,res)=>{

    const facturas = await Facturas.find({email_user:req.user.email}).sort({cod_fact:+1});
    
    lista_global = [];

    elementos = [];

    codigos = [1];

    let cod_fact_aux = 1;

    let total = 0;

    for (const productos of facturas){

        const producto = await Producto.findOne({_id:productos.producto_id});

        if(productos.cod_fact != cod_fact_aux){

            lista_global.push({"cod_fact":cod_fact_aux,"total":total,"elementos":elementos});
            elementos = [];
            total = 0;
            cod_fact_aux = productos.cod_fact;
            codigos.push(productos.cod_fact);

        }
        
        total += (productos.cantidad * productos.precio_venta);
        
        
        elementos.push({
            fecha: productos.timestamp,
            nombre_prod: producto.nombre,
            precio_venta: productos.precio_venta,
            cantidad: productos.cantidad,
            subtotal: productos.cantidad * productos.precio_venta
        });
        
    }

    if(elementos.length != 0){
       lista_global.push({"cod_fact":cod_fact_aux,"total":total,"elementos":elementos});
    }
    
    res.render("facturas/facturas.hbs",{"facturas":lista_global});

};


module.exports = ctrl;