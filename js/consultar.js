
function consultar(){

    $.ajax({
        url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
        type: 'GET',
        dataType: 'json',
        success: function(respuesta){
            console.log(respuesta);
            mostrarRespuesta(respuesta.items);

        },
        error: function (xhr, status) {
            alert('ha sucedido un problema');
        },
        complete: function (xhr, status) {
            //console.log(status);
        }
    });

}

function mostrarRespuesta(items){
    var tabla = `<table border="1">
                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>EDAD</th>
                    <th>COLOR</th>
                    <th>ACCIONES</th>
                  </tr>`;


    for (var i=0; i < items.length; i++) {
        tabla +=`<tr>
                   <td>${items[i].id}</td>
                   <td>${items[i].nombre}</td>
                   <td>${items[i].edad}</td>
                   <td>${items[i].color}</td>
                   <td>
                   <button style="{background-color: red;}" onclick="eliminar(${items[i].id})">Eliminar</button>
                   <a href="${items[i].id}">Eliminar</a>
                   </td> 
                   </tr>`;
    }
    tabla +=`</table>`;

    $("#tabla").html(tabla);
}
function renderHello(data={}) {
    var template = document.getElementById('template').innerHTML;
    var rendered = Mustache.render(template, data);
    document.getElementById('target').innerHTML = rendered;
}
function guardar(){
    let gato = {
        id: +$("#id").val(),
        nombre:  $("#nombre").val(),
        edad: +$("#edad").val(),
        color: $("#color").val()
    };

    console.log("voy a guardar", gato);

    $.ajax({
        url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
        type: 'POST',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(gato),
        statusCode:{
            201:function(){
                alert('Se ha registrado el gato');
            }
        },
    });
}

