const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dcomputer',{useUnifiedTopology: true,useNewUrlParser: true})
.then(db=>console.log("BD CONECTADA"))
.catch(err=>console.log(err));

//npm 