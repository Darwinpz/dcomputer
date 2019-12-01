
$('#post-producto').hide();

$('#btn-toggle-producto').click(e=>{

    e.preventDefault();

    $('#post-producto').slideToggle("fast");

});

$('#btn-eliminar').click(function(e){

    e.preventDefault();

    let $this = $(this);
    
    const response = confirm('Estas seguro de eliminar este producto?');

    if(response){

        let productoId = $this.data('id');
        
        $.ajax({

            url: '/productos/'+productoId,
            type: 'DELETE'
            
        }).done (function(result){

            window.location.href="/productos";

        });

        

    }

});



$('.btn-danger').click(function(e){

    e.preventDefault();

    let $this = $(this);
    
    const response = confirm('Estas seguro de eliminar este producto?');

    if(response){

        let carritoId = $this.data('id');
        
        $.ajax({

            url: '/carrito/'+carritoId,
            type: 'DELETE'
            
        }).done (function(result){

            window.location.href="/carrito";

        });

        

    }

});
