const mongoose = require('mongoose');
const path = require('path');

const {Schema} = mongoose;

const ProductoSchema = new Schema({
    nombre: {type: String},
    categoria:{type: String},
    descripcion: {type: String},
    filename: {type: String},
    stock:{type: Number,default:0},
    precio:{type: Number},
    views: {type: Number,default: 0},
    likes: {type: Number, default: 0},
    timestamp: {type: Date, default: Date.now}
});

ProductoSchema.virtual('uniqueId')
 .get(function(){
    return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('Productos',ProductoSchema);



