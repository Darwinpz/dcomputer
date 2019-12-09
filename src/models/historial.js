const mongoose = require('mongoose');

const {Schema} = mongoose;
const {ObjectId} = Schema;

const HistorialSchema = new Schema({

    usuario_id:{type: ObjectId},
    timestamp: {type: Date, default: Date.now},
    actividad: {type:String}
});

HistorialSchema.virtual('usuario')
    .set(function(usuario){
        this._usuario = usuario;
    })
    .get(function(){
        return this._usuario;
    });

module.exports = mongoose.model('history',HistorialSchema);