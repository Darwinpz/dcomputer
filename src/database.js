const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27001/dcomputer')
//mongoose.connect('mongodb://192.168.1.100:27001,192.168.1.102:27002,192.168.1.103:27003/dcomputer?replicaSet=rsdcomputer',{useNewUrlParser: true,useUnifiedTopology: true })
mongoose.connect('mongodb://localhost/dcomputer',{useNewUrlParser: true,useUnifiedTopology: true })
.then(db=>console.log("BD CONECTADA"))
.catch(err=>console.log(err));


//mongodb+srv://dpilaloa:Josue_1998@cluster-dcomputer-g0skz.gcp.mongodb.net/dcomputer?retryWrites=true&w=majority
//npm mongodb://localhost/dcomputer  mongodb+srv://dpilaloa:Josue_1998@cluster-dcomputer-g0skz.gcp.mongodb.net/dcomputer?retryWrites=true&w=majority