const ctrl = {};
const fs = require('fs-extra');
const path  = require('path');

const Producto = require('../models/productos');

//HELPERS
const {randonNumber} = require('../helpers/libs.js');


ctrl.index  = async (req,res) =>{

    const productos = await Producto.find().sort({timestamp: -1});
        
    res.render('productos/productos.hbs',{productos:productos});

};

ctrl.crear = (req,res)=>{

    const saveProducto = async () => {

        const imgUrl = randonNumber();

        const productos = await Producto.find({filename: imgUrl});

        if (productos.length > 0){

            saveProducto();

        }else{

            const imageTempPath = req.file.path;
            
            const extension = path.extname(req.file.originalname).toLowerCase();

            const nombre_imagen = imgUrl+extension;

            const targetPath = path.resolve('src/public/upload/'+nombre_imagen);

            if(extension === '.png'|| extension ==='.jpg'||extension ==='.jpeg'){

                await fs.rename(imageTempPath,targetPath);

                const newProducto = new Producto({
                    nombre: req.body.nombre_prod,
                    categoria: req.body.categoria_prod,
                    descripcion: req.body.descripcion_prod,
                    stock: req.body.stock,
                    precio: req.body.precio,
                    filename: nombre_imagen,
                
                });

                const imageSaved = await newProducto.save();

                req.flash('success_msg','Producto Guardado');
         
            }else{
                
                await fs.unlink(imageTempPath);

                req.flash('error_msg','Solo imagenes estan permitidas');


            }

            res.redirect('/productos/');
            
        }

    };

    saveProducto();

};

ctrl.ver_producto = async(req,res)=>{

    const producto = await Producto.findOne({filename: {$regex: req.params.producto_id}});

    if(producto){
        
        res.render('productos/detalle.hbs',{producto:producto});
    
    }else{
        res.redirect('/');
    }

};

ctrl.eliminar_producto = async(req,res)=>{

    const producto = await Producto.findOne({filename:{$regex: req.params.producto_id}});

    if(producto){
        
        await fs.unlink(path.resolve('./src/public/upload/'+producto.filename));
        await producto.remove();
        
        req.flash('success_msg',producto.nombre+' eliminado');
        
        res.json(true);
        

    }

   
};

ctrl.editar_producto_index = async(req,res)=>{

    const producto = await Producto.findOne({filename: {$regex: req.params.producto_id}});

    if(producto){
        
        res.render('productos/editar.hbs',{producto:producto});
    
    }else{
        res.redirect('/');
    }

};


ctrl.editar_producto = async(req,res)=>{

    console.log(req);

    //const producto = await Producto.findOne({filename:{$regex: req.params.producto_id}});


};

module.exports = ctrl;
