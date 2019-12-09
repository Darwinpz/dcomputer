const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const facturasSchema = new Schema({

    cod_fact:{type:Number},
    email_user: {type: String},
    producto_id:{type: ObjectId},
    cantidad:{type:Number},
    precio_venta:{type: Number},
    timestamp: {type: Date, default: Date.now},
    
});

facturasSchema.virtual('producto')
    .set(function(producto){
        this._producto = producto;
    })
    .get(function(){
        return this._producto;
    });

module.exports = mongoose.model('facturas',facturasSchema);