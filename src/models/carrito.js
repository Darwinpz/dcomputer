const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const CarritoSchema = new Schema({

    producto_id:{type: ObjectId},
    cantidad:{type: Number,default:0},
    timestamp: {type: Date, default: Date.now},
    email_user: {type: String}
});

CarritoSchema.virtual('producto')
    .set(function(producto){
        this._producto = producto;
    })
    .get(function(){
        return this._producto;
    });

module.exports = mongoose.model('Carrito',CarritoSchema);