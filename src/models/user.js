const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const UsuarioSchema = new Schema({

    nombre: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String, required:true},
    tipo:{type:String, required:true},
    imagen_perfil: {type: String},
    fecha: {type:Date, default: Date.now}

});


UsuarioSchema.methods.encryptPassword = async (password)=>{

   const salt =  await bcrypt.genSalt(10);

   const hash = bcrypt.hash(password,salt);
   
   return hash;

};

UsuarioSchema.methods.matchPassword = async function (password){

     return await bcrypt.compare(password,this.password);

};

module.exports = mongoose.model('User',UsuarioSchema);
