const helpers = {};

helpers.randonNumber = () =>{

    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let randomnumber = 0;

    for (let i= 0 ;i<6;i++){
        
        randomnumber += possible.charAt(Math.floor(Math.random()*possible.length));

    }

    return randomnumber;

};

helpers.tipo_usuario = (tipo)=>{

    if(tipo=="cliente"){
        return false;
    }else{
        return true;
    }

}

module.exports = helpers;