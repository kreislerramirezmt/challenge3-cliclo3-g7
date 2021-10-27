window.addEventListener("load", () => {
    const dummyTarget = document.getElementById('temp'); // <-- Dummy target to fake navigation
    // Initial Navigo
    var root = null;
    var useHash = false; // Defaults to: false
    var hash = '#!'; // Defaults to: '#'
    //var router = new Navigo(root, useHash, hash);
    const router = new Navigo("/", {hash: true}, '#!');
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    function actualizar(){
        Toast.fire("ejecutando funcion para actualizar");
        let gato = {
            id: +$("#id").val(),
            nombre: $("#nombre").val(),
            edad: +$("#edad").val(),
            color: $("#color").val()
        };
        console.log(gato);
        $.ajax({
            url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
            type: 'PUT',
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(gato),
            statusCode:{
                201:function(){
                    Toast.fire('Se ha actualizado el gato');
                    setTimeout(function (){
                        router.navigate('/');
                    },2000);
                }
            },
        });
    }
    var consultarById = (id) => {
            $.ajax({
                url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros/"+id,
                type: 'GET',
                dataType: 'json',
                success: function(respuesta){
                    console.log(respuesta.items);
                    if (respuesta.items.length==1){
                        document.getElementById('result').innerHTML = tmpl('tmpl-mascotasdetalle', respuesta.items[0]);
                        $("#boton").on({
                            click: function (){
                                actualizar();
                            }
                        })
                    }else{
                        document.getElementById('result').innerHTML = "";
                        Toast.fire('No se encuentra el gato con el id '+id);
                    }
                },
                error: function (xhr, status) {
                    Toast.fire('ha sucedido un problema');
                }
            });
    };
    var cargarDetalle = (id) => {
        console.log(id);
        consultarById(id);

    };
    var cargarTabla = () => {
        $.ajax({
            url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                console.log(respuesta);
                document.getElementById('result').innerHTML = tmpl('tmpl-mascotastable', respuesta);
                Toast.fire({
                    icon: 'success',
                    title: 'Se cargo la tabla'
                })

            },
            error: function (xhr, status) {
                alert('ha sucedido un problema');
            },
            complete: function (xhr, status) {
                //console.log(status);
                //$('#result').transition('fade up');
                $("[data-mascotas-id]").on({
                    click: function () {
                        var data = {id: +$(this).attr("data-mascotas-id")};
                        $.ajax({
                            url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
                            type: 'DELETE',
                            dataType: 'json',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            data: JSON.stringify(data),
                            statusCode: {
                                204: function () {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Se elimino el gato'
                                    });
                                    cargarTabla();
                                }
                            },
                        });
                    }
                });
            }
        });

    }
    router
        .on('/pets/:id/:action', function (params) {
            // If we have http://site.com/user/42/save as a url then
            // params.id = 42
            // params.action = save
            console.log(params);
            cargarDetalle(params.data.id);
        })
        .on('/', () => { // This is actually the route
            cargarTabla();
        })
        .on('/another', () => {
            dummyTarget.innerHTML = 'Now on second page';
        }).resolve();

    $("a.item").on({
        click: function () {
            $("a.item").removeClass("active");
            $(this).addClass("active");
        }
    });
    $("#savemascotas").on({
        click: function () {
            let gato = {
                id: +$("#id").val(),
                nombre: $("#nombre").val(),
                edad: +$("#edad").val(),
                color: $("#color").val(),
                raza: $("#raza").val()
            };
            Toast.fire({
                icon: 'success',
                title: 'Voy a guardar'
            });

            $.ajax({
                url: "https://g910ad513241e15-mascotas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/mascotas/perros",
                type: 'POST',
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(gato),
                statusCode: {
                    201: function () {
                        cargarTabla();
                        Toast.fire({
                            icon: 'success',
                            title: 'Se ha registrado el gato'
                        });
                    }
                },
            });

        }
    });
});

