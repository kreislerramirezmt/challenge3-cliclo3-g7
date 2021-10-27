window.addEventListener("load", () => {
    const url = {
        base_url: {
            kreisler: 'http://localhost:8080',
            david: '',
            jhon: ''
        },
        api: () => {
            return `${url.base_url.kreisler}/api/`;
        },
        sities: {
            computer: 'Computer',
            client: 'Client',
            message: 'Message',
            category: 'Category',
            reservation: 'Reservation'
        },
        computer: (id=false) => {
            return `${url.api()}${url.sities.computer}${(!id)?'':`/${id}`}`;
        },
        client: (id=false) => {
            return `${url.api()}${url.sities.client}${(!id)?'':`/${id}`}`;
        },
        message: (id=false) => {
            return `${url.api()}${url.sities.message}${(!id)?'':`/${id}`}`;
        },
        category: (id=false) => {
            return `${url.api()}${url.sities.category}${(!id)?'':`/${id}`}`;
        },
        reservation: (id=false) => {
            return `${url.api()}${url.sities.reservation}${(!id)?'':`/${id}`}`;
        }
    };
    console.log(url.api());
    //const dummyTarget = document.getElementById('temp');
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
    })
    const router = new Navigo("/", {hash: true}, '#!');
    timeOutRuta=(url)=>{
        setTimeout(function (){
            router.navigate(url);
        },2000);
    }
    getCategory=(id=false)=>{
        $.ajax({
            url: url.category()+'/all',
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                content= ``;
                for (let i = 0; i < respuesta.length; i++) {
                    content+=`<option value="${respuesta[i].id}">${respuesta[i].name}</option>`;
                }
                $("#category-id-select").html(content);

            },
            error: function (xhr, status) {
                Toast.fire('Ha sucedido un problema');
            },
            complete: function (xhr, status) {
                if (id){
                    $("#category-id-select").val(id);
                }
            }
        });
    }
    drawTable = (thead, data, option = {icon: '', title: '',template:''}) => {
        o = {thead: thead, data: data, option: option};
        document.getElementById('temp').innerHTML = tmpl(option.template, o);
    };
    drawTableCategory=()=>{
        $.ajax({
            url: url.category()+'/all',
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                drawTable(['Categoria','Computadores'/*, 'Acciones'*/], {items:respuesta}, {
                    icon: 'hashtag',
                    title: 'Añadir categoria',
                    template: 'tmpl-tableCategory'
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Se cargo la tabla'
                });
            },
            error: function (xhr, status) {
                Toast.fire('Ha sucedido un problema');
            },
            complete: function (xhr, status) {
                $(`#btn-crear-category`).on({
                    click: function () {
                        createAndUpdateCategory();
                    }
                });
            }
        });
    };
    drawTableComputer=()=>{
        $.ajax({
            url: url.computer()+'/all',
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                drawTable(['Nombre','Año', 'Marca', 'Descripcion', 'Categoria'/*, 'Acciones'*/], {items:respuesta}, {
                    icon: 'computer',
                    title: 'Añadir Computador',
                    template: 'tmpl-tableComputer'
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Se cargo la tabla'
                });
            },
            error: function (xhr, status) {
                Toast.fire('Ha sucedido un problema');
            },
            complete: function (xhr, status) {
                $(`#btn-crear-computer`).on({
                    click: function () {
                        createAndUpdate();
                    }
                });
            }
        });
    };
    drawTableMessage=()=>{
        $.ajax({
            url: url.message(),
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                drawTable(['Id', 'Mensaje', 'Acciones'], respuesta, {
                    icon: 'computer',
                    title: 'Añadir Mensaje',
                    template: 'tmpl-tableMessage'
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Se cargo la tabla'
                });
            },
            error: function (xhr, status) {
                Toast.fire('Ha sucedido un problema');
            },
            complete: function (xhr, status) {
                $(`#btn-crear-message`).on({
                    click: function () {
                        createAndUpdateMessage();
                    }
                });
            }
        });
    };
    drawTableClient=()=>{
        $.ajax({
            url: url.client()+'/all',
            type: 'GET',
            dataType: 'json',
            success: function (respuesta) {
                drawTable(['Nombre', 'Email', 'Edad'/*, 'Acciones'*/], {items:respuesta}, {
                    icon: 'user',
                    title: 'Añadir Cliente',
                    template: 'tmpl-tableClient'
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Se cargo la tabla'
                });
            },
            error: function (xhr, status) {
                Toast.fire('Ha sucedido un problema');
            },
            complete: function (xhr, status) {
                $(`#btn-crear-client`).on({
                    click: function () {
                        createAndUpdateClient();
                    }
                });
            }
        });
    };
    ajaxSaveAndUpdate = (data, url, type) => {
        $.ajax({
            url: `${url}${(type==="PUT")?'/update':'/save'}`,
            type: type,
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            statusCode: {
                201: function () {
                    Toast.fire({
                        icon: 'success',
                        title: type === "POST" ? 'Se guardo el registro' : 'Se actualizo el registro'
                    });
                }
            },
        });
    };
    createAndUpdate = (x = false) => {
        Swal.fire({
            title: (!x) ? 'Registrar un computador' : 'Actualizar computador',
            html: `
                <div class="ui tiny form">
  <div class="ui padded grid two fields">
    <div class="field ${(!x) ? '' : ''}">
      <label>Id</label>
      <input placeholder="Id" min="1" id="id-computer" type="number" ${(!x) ? '' : `value="${x.items[0]['id']}"`} disabled>
    </div>
    <div class="field">
      <label>Nombre</label>
      <input placeholder="Nombre" maxlength="45" id="name-computer" ${(!x) ? '' : `value="${x.items[0]['name']}"`} type="text">
    </div>
    
  </div>
  <div class="ui padded grid two fields">
  <div class="field">
      <label>Marca</label>
      <input placeholder="Marca" maxlength="45" id="brand-computer" ${(!x) ? '' : `value="${x.items[0]['brand']}"`} type="text">
    </div>
    <div class="field">
      <label>Año</label>
      <input placeholder="Año" max="9999" min="1000" id="year-computer" ${(!x) ? '' : `value="${x.items[0]['model']}"`} type="number">
    </div>
</div>
<div class="ui padded grid two fields">
<div class="field">
      <label>Categoria</label>
      <select id="category-id-select"></select>
    </div>
</div>
<div class="sixteen wide wide field">
      <label>Descripcion</label>
      <textarea placeholder="Descripcion" maxlength="250" id="description-computer">${(!x) ? '' : `${x.items[0]['description']}`}</textarea>
    </div>
</div>`,
            confirmButtonText: (!x) ? 'Guardar' : 'Actualizar',
            focusConfirm: false,
            preConfirm: () => {
                const idComputer = Swal.getPopup().querySelector('#id-computer').value;
                const nameComputer = Swal.getPopup().querySelector('#name-computer').value;
                const brandComputer = Swal.getPopup().querySelector('#brand-computer').value;
                const yearComputer = Swal.getPopup().querySelector('#year-computer').value;
                const categoryComputer = Swal.getPopup().querySelector('#category-id-select').value;
                const descripComputer = Swal.getPopup().querySelector('#description-computer').value;
                if (!nameComputer || !brandComputer || !yearComputer || !categoryComputer || !descripComputer) {
                    Swal.showValidationMessage(`Todos los campos son obligatorios`);
                }
                return {
                    id: (!idComputer)?null:+idComputer,
                    name: nameComputer,
                    brand: brandComputer,
                    year: +yearComputer,
                    description: descripComputer,
                    category: {
                        id:+categoryComputer
                    }
                };
            }
        }).then((result) => {
            if (typeof result.value === "undefined") {

            } else {
                Toast.fire({
                    icon: 'info',
                    title: !x?'Guardando....':'Actualizando...'
                });
                ajaxSaveAndUpdate(result.value, url.computer(), !x?'POST':'PUT');
            }
            timeOutRuta('/computer');
        });
        getCategory();
    };
    createAndUpdateCategory = (x = false) => {
        Swal.fire({
            title: (!x) ? 'Registrar un categoria' : 'Actualizar categoria',
            html: `
                <div class="ui tiny form">
  <div class="ui padded grid fields">
    <div class="sixteen wide wide field">
      <label>Id</label>
      <input placeholder="Id" min="1" id="id-category" type="number" ${(!x) ? '' : `value="${x.items[0]['id']}"`} disabled>
    </div>
    <div class="sixteen wide wide field">
      <label>Nombre</label>
      <input placeholder="Nombre" min="1" id="name-category" type="text" ${(!x) ? '' : `value="${x.items[0]['name']}"`}>
    </div>
    <div class="sixteen wide wide field">
      <label>Descripcion</label>
      <textarea placeholder="Descripcion" id="description-category">${(!x) ? '' : `${x.items[0]['description']}`}</textarea>
    </div>
  </div>
</div>`,
            confirmButtonText: (!x) ? 'Guardar' : 'Actualizar',
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                const idCategory = Swal.getPopup().querySelector('#id-category').value;
                const nameCategory = Swal.getPopup().querySelector('#name-category').value;
                const descriptionCategory = Swal.getPopup().querySelector('#description-category').value;
                if (!nameCategory || !descriptionCategory) {
                    Swal.showValidationMessage(`Todos los campos son obligatorios`);
                }
                return {
                    id: (!idCategory)?null:+idCategory,
                    name: nameCategory,
                    description: descriptionCategory
                };
            }
        }).then((result) => {
            if (typeof result.value === "undefined") {

            } else {
                Toast.fire({
                    icon: 'info',
                    title: !x?'Guardando....':'Actualizando...'
                });
                ajaxSaveAndUpdate(result.value, url.category(), !x?'POST':'PUT');
            }
            timeOutRuta('/category');
        });
    };
    createAndUpdateMessage = (x = false) => {
        Swal.fire({
            title: (!x) ? 'Registrar un mensaje' : 'Actualizar mensaje',
            html: `
                <div class="ui tiny form">
  <div class="ui padded grid fields">
    <div class="sixteen wide wide field">
      <label>Id</label>
      <input placeholder="Id" min="1" id="id-message" type="number" ${(!x) ? '' : `value="${x.items[0]['id']}"`} ${(!x) ? '' : 'disabled'}>
    </div>
    <div class="sixteen wide wide field">
      <label>Mensaje</label>
      <textarea placeholder="Mensaje" id="messagetext-message">${(!x) ? '' : `${x.items[0]['messagetext']}`}</textarea>
    </div>
    
  </div>
</div>`,
            confirmButtonText: (!x) ? 'Guardar' : 'Actualizar',
            focusConfirm: false,
            preConfirm: () => {
                const idMessage = Swal.getPopup().querySelector('#id-message').value;
                const messagtextMessage = Swal.getPopup().querySelector('#messagetext-message').value;
                if (!idMessage || !messagtextMessage) {
                    Swal.showValidationMessage(`Todos los campos son obligatorios`);
                }
                return {
                    id: +idMessage,
                    messagetext: messagtextMessage
                };
            }
        }).then((result) => {
            if (typeof result.value === "undefined") {

            } else {
                Toast.fire({
                    icon: 'info',
                    title: !x?'Guardando....':'Actualizando...'
                });
                ajaxSaveAndUpdate(result.value, url.message(), !x?'POST':'PUT');
            }
            router.navigate('/message');
        });
    };
    createAndUpdateClient = (x = false) => {
        Swal.fire({
            title: (!x) ? 'Registrar un cliente' : 'Actualizar cliente',
            html: `
                <div class="ui tiny form">
  <div class="ui padded grid two fields">
    <div class="field">
      <label>Id</label>
      <input placeholder="Id" min="1" id="id-client" type="number" ${(!x) ? '' : `value="${x.items[0]['id']}"`} disabled>
    </div>
    <div class="field">
      <label>Nombre</label>
      <input placeholder="Nombre" maxlength="250" id="name-client" ${(!x) ? '' : `value="${x.items[0]['name']}"`} type="text">
    </div>
  </div>
  <div class="ui padded grid two fields">
  <div class="field">
      <label>Email</label>
      <input placeholder="Email" maxlength="45" id="email-client" ${(!x) ? '' : `value="${x.items[0]['email']}"`} type="email">
    </div>
  <div class="field">
      <label>Edad</label>
      <input placeholder="Edad" min="1" max="9999" id="age-client" ${(!x) ? '' : `value="${x.items[0]['age']}"`} type="number">
    </div>
</div>
<div class="ui padded grid two fields">
  <div class="field">
      <label>Contraseña</label>
      <input placeholder="**********" maxlength="45" id="password-client" ${(!x) ? '' : `value="${x.items[0]['password']}"`} type="password">
    </div>
</div>
</div>`,
            confirmButtonText: (!x) ? 'Guardar' : 'Actualizar',
            focusConfirm: false,
            preConfirm: () => {
                const idClient = Swal.getPopup().querySelector('#id-client').value;
                const nameClient = Swal.getPopup().querySelector('#name-client').value;
                const emailClient = Swal.getPopup().querySelector('#email-client').value;
                const ageClient = Swal.getPopup().querySelector('#age-client').value;
                const passwordClient = Swal.getPopup().querySelector('#password-client').value;
                if (!nameClient || !emailClient || !ageClient || !passwordClient) {
                    Swal.showValidationMessage(`Todos los campos son obligatorios`);
                }
                return {
                    idClient: (!idClient)?null:+idClient,
                    name: nameClient,
                    email: emailClient,
                    password: passwordClient,
                    age: +ageClient
                };
            }
        }).then((result) => {
            if (typeof result.value === "undefined") {

            } else {
                Toast.fire({
                    icon: 'info',
                    title: !x?'Guardando....':'Actualizando...'
                });
                ajaxSaveAndUpdate(result.value, url.client(), !x?'POST':'PUT');
            }
            timeOutRuta("/client");
        });
    };
    router
        .on('/', () => {
            router.navigate('/category');
        })
        .on('/category',()=>{
            Toast.fire({
                icon: 'success',
                title: 'Cargando tabla de categorias...'
            });
            drawTableCategory();
        },{
            already: function (params) { drawTableCategory(); }
        })
        .on('/computer', () => {
            Toast.fire({
                icon: 'success',
                title: 'Cargando tabla de computadores...'
            });
            drawTableComputer();
        },{
            already: function (params) { drawTableComputer(); }
        })
        .on('/computer/:id/edit', function (params) {

            $.ajax({
                url: url.computer(params.data.id),
                type: 'GET',
                dataType: 'json',
                success: function (respuesta) {
                    createAndUpdate(respuesta);
                },
                error: function (xhr, status) {
                    Toast.fire('Ha sucedido un problema');
                },
                complete: function (xhr, status) {

                }
            });
        })
        .on('/computer/:id/delete', function (params) {
            Toast.fire({
                icon: 'info',
                title: 'Eliminando computador'
            });
            $.ajax({
                url: url.computer(),
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({id:params.data.id}),
                statusCode: {
                    204: function () {
                        Toast.fire({
                            icon: 'success',
                            title: 'Se elimino el computador'
                        });
                        router.navigate('/computer');
                    }
                },
            });
        })
        .on('/client', () => {
            Toast.fire({
                icon: 'success',
                title: 'Cargando tabla de clientes...'
            });
            drawTableClient();
        },{
            already: function (params) { drawTableClient(); }
        })
        .on('/client/:id/edit', function (params) {
            $.ajax({
                url: url.client(params.data.id),
                type: 'GET',
                dataType: 'json',
                success: function (respuesta) {
                    createAndUpdateClient(respuesta);
                },
                error: function (xhr, status) {
                    Toast.fire('Ha sucedido un problema');
                },
                complete: function (xhr, status) {

                }
            });
        })
        .on('/client/:id/delete', function (params) {
            Toast.fire({
                icon: 'info',
                title: 'Eliminando cliente'
            });
            $.ajax({
                url: url.client(),
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({id:params.data.id}),
                statusCode: {
                    204: function () {
                        Toast.fire({
                            icon: 'success',
                            title: 'Se elimino el cliente'
                        });
                        router.navigate('/client');
                    }
                },
            });
        })
        .on('/message', () => {
            Toast.fire({
                icon: 'success',
                title: 'Cargando tabla de mensajes...'
            });
            drawTableMessage();
        },{
            already: function (params) { drawTableMessage(); }
        })
        .on('/message/:id/edit', function (params) {
            $.ajax({
                url: url.message(params.data.id),
                type: 'GET',
                dataType: 'json',
                success: function (respuesta) {
                    createAndUpdateMessage(respuesta);
                },
                error: function (xhr, status) {
                    Toast.fire('Ha sucedido un problema');
                },
                complete: function (xhr, status) {

                }
            });
        })
        .on('/message/:id/delete', function (params) {
            Toast.fire({
                icon: 'info',
                title: 'Eliminando mensaje'
            });
            $.ajax({
                url: url.message(),
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({id:params.data.id}),
                statusCode: {
                    204: function () {
                        Toast.fire({
                            icon: 'success',
                            title: 'Se elimino el mensaje'
                        });
                        router.navigate('/message');
                    }
                },
            });
        });
    router.notFound(function (){
        window.location.href = "/404.html";
    })
    router.resolve();
    //Funciones del navbar
    navbar = (x = false) => {
        $("a.item").removeClass("active");
        if (x) {
            $(x).addClass("active");
        } else {
            $(`[href="${window.location.hash.substring(1)}"]`).addClass("active");
        }
    }
    navbar();
    $("a.item").on({
        click: function () {
            navbar(this);
        }
    });
});
