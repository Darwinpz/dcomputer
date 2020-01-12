const socket = io();

let usuario_id = document.getElementById('user_id');

$('#post-producto').hide();

$('#btn-toggle-producto').click(e => {

    e.preventDefault();

    $('#post-producto').slideToggle("fast");

});

$('#btn-eliminar').click(function (e) {

    e.preventDefault();

    let $this = $(this);

    const response = confirm('Estas seguro de eliminar este producto?');

    if (response) {

        let productoId = $this.data('id');

        $.ajax({

            url: '/productos/' + productoId,
            type: 'DELETE'

        }).done(function (result) {

            window.location.href = "/productos";

        });

    }

});



$('.btn-eliminar-item').click(function (e) {

    e.preventDefault();

    let $this = $(this);

    const response = confirm('Estas seguro de remover este producto?');

    if (response) {

        let carritoId = $this.data('id');

        $.ajax({

            url: '/carrito/' + carritoId,
            type: 'DELETE'

        }).done(function (result) {

            window.location.href = "/carrito";

        });

    }

});

/*
$('.user').click(function (e) {

    e.preventDefault();
    
    let historial = document.getElementById('historial');

    let $this = $(this);


    let usuario_id = $this.data('id');

    $.ajax({

        url: '/historial/' + usuario_id,
        type: 'GET'

    }).done(function (result) {

        historial.innerHTML = "";

        if(result.length != 0){
            result.forEach(datos => {
                
                historial.innerHTML += (`<p class="card-text mb-1"><strong>Accion: </strong>${datos.actividad}</p> 
                
                <p class="card-text" style="margin-top: -10px;"><small class="text-muted">- ${datos.timestamp}</small></p>

                `);

            });
        }else{
            historial.innerHTML = (`<p class="card-text mb-1"><strong>Accion: </strong>No existe historial</p> `);
        }
        

    });

});*/

$('.user').click(function (e) {

    e.preventDefault();

    let $this = $(this);

    let usuario_id = $this.data('id');

    if(usuario_id == "general"){
        
        //$('#historial').attr("data-id", "general");

        usuario_id = "general";

        document.getElementById('actividad').innerHTML = `<Strong>ACTIVIDAD: General</Strong>`;

    }else{

        $('#historial').attr("data-id", usuario_id);

        let usuario_email = $this.data('email');

        document.getElementById('actividad').innerHTML = `<Strong>ACTIVIDAD: ${usuario_email}</Strong>`;

    }
    
    socket.emit('historial', usuario_id);

});


if(usuario_id.innerText="general"){
    
    socket.emit('historial', "general");

}else{

    socket.emit('historial', usuario_id.innerText);
}

socket.on('historial', (data) => {

    var id = document.getElementById('historial');

    if(data.usuario == "general"){
        
        let historial = document.getElementById('historial');

        historial.innerHTML = "";

        if (data.historial.length != 0) {

            data.historial.forEach(datos => {

                historial.innerHTML += (`<p class="card-text mb-1"><strong>${datos.email}: </strong>${datos.actividad}</p> 
                
                <p class="card-text" style="margin-top: -10px;"><small class="text-muted">- ${datos.timestamp}</small></p>

                `);

            }); 

            historial.scrollTop = historial.scrollHeight;

        } else {
            historial.innerHTML = (`<p class="card-text mb-1"><strong>Accion: </strong>No existe historial</p> `);
        }

    }else if (id) {
    
        if (id.dataset.id == data.usuario) {

            
            let historial = document.getElementById('historial');

            historial.innerHTML = "";

            if (data.historial.length != 0) {

                data.historial.forEach(datos => {

                    historial.innerHTML += (`<p class="card-text mb-1"><strong>Accion: </strong>${datos.actividad}</p> 
                    
                    <p class="card-text" style="margin-top: -10px;"><small class="text-muted">- ${datos.timestamp}</small></p>

                    `);

                }); 

                historial.scrollTop = historial.scrollHeight;

            } else {
                historial.innerHTML = (`<p class="card-text mb-1"><strong>Accion: </strong>No existe historial</p> `);
            }
        }
    }

});