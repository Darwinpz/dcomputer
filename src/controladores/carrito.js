const ctrl = {};


const Producto = require('../models/productos');
const Carrito = require('../models/carrito');

ctrl.index = async(req,res)=>{

    const carrito = await Carrito.find({email_user:req.user.email});
        
    elementos = [];

    compra_total = 0;

    for (const productos of carrito){

        const producto = await Producto.findOne({_id:productos.producto_id});
       
        total = producto.precio*productos.cantidad;

        elementos.push({
                id : productos._id,
                nombre:producto.nombre,
                filename:producto.filename,
                cantidad:productos.cantidad,
                precio:producto.precio,
                stock:producto.stock,
                categoria:producto.categoria,
                descripcion:producto.descripcion,
                tiempo: productos.timestamp,
                total: total
            });

        compra_total+=total;
        
    }

    res.render('carrito/carrito.hbs',{carrito:elementos,compra_total:compra_total});

};

ctrl.agregar = async(req,res)=>{

    const producto = await Producto.findOne({filename: {$regex: req.params.producto_id}});

    if(producto){

        if(producto.stock > 0){

            const carrito = await Carrito.findOne({email_user:req.user.email,producto_id:producto._id});

            if(carrito){
                
                acumulado = (parseInt(carrito.cantidad) + parseInt(req.body.cantidad));

                if(acumulado > producto.stock)
                {
                    req.flash('error_msg',"Tu carrito sobrepasa el stock del producto: "+producto.nombre);
       
                }else{
                
                    carrito.cantidad = acumulado;

                    carrito.save();

                    req.flash('success_msg',producto.nombre+' añadido al carrito');
               
                }

            }else{
                
                const newCarrito = new Carrito(req.body);
                newCarrito.producto_id = producto._id;
                
                await newCarrito.save();

                req.flash('success_msg',producto.nombre+' añadido al carrito');
                   
            }
            
        }else{
         
            req.flash('error_msg',"No hay stock para el producto: "+producto.nombre);
       
        }
        
        
    }else{
        req.flash('error_msg',"Error al añadir al carrito el producto: "+producto.nombre);
       
    }

    res.redirect('/productos/'+req.params.producto_id);
};


ctrl.comprar = async(req,res)=>{

    const carrito = await Carrito.find({email_user:req.user.email});
        
    for (const productos of carrito){

        const producto = await Producto.findOne({_id:productos.producto_id});

        producto.stock = producto.stock - productos.cantidad;

        await producto.save();

        await productos.remove();
    
    }

    
    req.flash('success_msg','Compra realizada exitosamente');

    res.redirect('/carrito');

};


ctrl.remover = async(req,res)=>{

    const carrito = await Carrito.findOne({_id: req.params.carrito_id});

    if(carrito){

        await carrito.remove();

        req.flash('success_msg','Item removido');
        
        res.json(true);

    }


};


module.exports  = ctrl;