//Variables
const contenedorBtn = document.querySelector('#contenedorBtn');
const contenedor = document.querySelector('#content-main');
let btnAgregar, btnRegistrar, btnActualizar; //BotónAgregar  = Botón del index  BotónRegistrar = botón de registrar formulario BotónActualizar = botón para actualizar un usuario
let nombre, apellido, email; //Datos usuario

const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let usuarios = [
    {
        id: 0,
        nombre: 'Steven',
        apellido: 'Núñez',
        email: 'StevenNnz@stevennnz.com'
    }
];



//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', ()=>{
        usuariosStorage = JSON.parse( localStorage.getItem('usuarios') );
        usuarios = usuariosStorage && usuariosStorage!=0 ? [...usuariosStorage] : [...usuarios];
        
        readUsers(); //Leer usuarios
        
        contenedor.addEventListener('click', preventBubbling)
    });
}
    


//Funciones

//Prevenir efecto bubbling, lanzar evento Eliminar y Update
function preventBubbling(e){
    if(e.target.classList.contains('btnDelete')){
        e.preventDefault();
        const id = parseInt(e.target.attributes[1].value);
        eliminarUsuario(id);
    }
    
    if(e.target.classList.contains('btnUpdate')){
        e.preventDefault();
        const id = parseInt(e.target.attributes[1].value);
        eventUpdateUsuario(id);
    }
}
//Leer usuarios
function readUsers(){
    limpiarHTML();//Limpiar el contenido principal
    cargarBtnAgregar();//Cargar botón de agregar
    fixBug();//Evitar romper estructura HTML

    if(usuarios.length > 0){
        usuarios.forEach(usuario=>{
            const divUser = document.createElement('div');
            const {id, nombre, apellido, email} = usuario; //Destructuring
        
            //Visualizar usuarios HTML
            divUser.innerHTML = `
            <div class="caja_usuario">
                <i class="far fa-user"></i>
                <h3>${nombre} ${apellido}</h3>
                <p>${email}</p>
                <div class="acciones">
                    <a href="#" id='${id}' class='btnDelete'>Eliminar</a>
                    <a href="#" id='${id}' class='btnUpdate'>Actualizar</a>
                </div>
            </div>
            `;
            contenedor.appendChild(divUser)
        });
    }

    insertLocalStorage();
}

//Limpiar HTML
function limpiarHTML(){
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }
}

//Calcular id de usuarios
function calcularId(){
    let id = 0;
    usuarios.forEach(usuario =>{
        id = usuario.id;
    });
    id += 1;

    return id;
}

//Agregar usuarios
function agregarUsuario(nombre, apellido, email){
    const id = calcularId();
    const usuario = {
        id,
        nombre,
        apellido,
        email
    };

    usuarios = [...usuarios, usuario];

    readUsers();
}

//Eliminar usuarios
function eliminarUsuario(id){
    usuarios = usuarios.filter(usuario =>usuario.id !== id);
    readUsers();
}

//Actualizar usuarios
function eventUpdateUsuario(id){
    const usuarioFilter = usuarios.filter(usuario =>usuario.id === id);
    cargarBtnVisualizar();

    cargarHTMLFormUpdate(usuarioFilter[0]);

}

//Cargar botón de agregar
function cargarBtnAgregar(){
    contenedorBtn.innerHTML = `
    <input type="button" id="agregar" value="Agregar">`;
    btnAgregar = document.querySelector('#agregar');
    eventBtnAgregar()
}

//Evento del botón agregar
function eventBtnAgregar(){
    btnAgregar.addEventListener('click', () =>{
        cargarBtnVisualizar();
        
        cargarHTMLForm()
    });
}

//Cargar botón de leer usuarios
function cargarBtnVisualizar(){
    contenedorBtn.innerHTML = `
    <input type="button" id="visualizar" value="Visualizar">`;

    btnVisualizar = document.querySelector('#visualizar');
    eventBtnVisualizar();
}

//Evento del botón leer usuarios
function eventBtnVisualizar(){
    btnVisualizar.addEventListener('click', ()=>{
        readUsers();
    }); //FORMAGREGAR
}

//Cargar HTML formulario de usuarios
function cargarHTMLForm(){
    limpiarHTML();

    contenedor.innerHTML = `
    <form id="form" class="form">
        <div>
            <label for="nombre"> Nombre</label>
            <input type="text" id="nombre" placeholder="First name">
        </div>
        <div>
            <label for="apellido"> Apellido</label>
            <input type="text" id="apellido" placeholder="Last name">
        </div>
        <div>
            <label for="email"> Email</label>
            <input type="email" id="email" placeholder="example@example.com">
        </div>
        <div>
            <input id='registrar' type="submit" value="Registrar" disabled>
        </div>
    </form>
    `;

    const form = document.querySelector('#form');
    nombre = document.querySelector('#nombre');
    apellido = document.querySelector('#apellido');
    email = document.querySelector('#email');
    btnRegistrar = document.querySelector('#registrar');
    
    eventoBtnRegistrar(form);
}

function cargarHTMLFormUpdate(usuario){
    limpiarHTML();
    // let {id, nombre, apellido, email} = usuario;
    contenedor.innerHTML = `
    <form id="form" class="form">
        <div>
            <label for="id"> ID</label>
            <input type="text" id="id" placeholder="ID" value='${usuario.id}' readonly disabled>
        </div>
        <div>
            <label for="nombre"> Nombre</label>
            <input type="text" id="nombre" placeholder="First name" value='${usuario.nombre}'>
        </div>
        <div>
            <label for="apellido"> Apellido</label>
            <input type="text" id="apellido" placeholder="Last name" value='${usuario.apellido}'>
        </div>
        <div>
            <label for="email"> Email</label>
            <input type="email" id="email" placeholder="example@example.com" value='${usuario.email}'>
        </div>
        <div>
            <input id='actualizar' type="submit" value="Actualizar" disabled>
        </div>
    </form>
    `;

    const form = document.querySelector('#form');
    const id = document.querySelector('#id');
    nombre = document.querySelector('#nombre');
    apellido = document.querySelector('#apellido');
    email = document.querySelector('#email');
    btnActualizar = document.querySelector('#actualizar');
    eventoBtnActualizar(form, id);
}

//Evento del formulario agregar usuarios
function eventoBtnRegistrar(form){
    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        mostrarAlerta('Usuario registrado correctamente.');
        limpiarFormulario(btnRegistrar, false);
        //Agregar usuario
        setTimeout(()=>{
            agregarUsuario(nombre.value, apellido.value, email.value); 
            limpiarFormulario(btnRegistrar);
        }, 2000);

    });


    nombre.addEventListener('blur', validarCampoVacio);
    apellido.addEventListener('blur', validarCampoVacio);
    email.addEventListener('blur', validarCampoVacio);
}

//Evento del formulario actualizar usuarios
function eventoBtnActualizar(form, id){
    form.addEventListener('submit', (e)=>{
        e.preventDefault();

        //Actualizar usuario
        updateUsuario(parseInt(id.value), nombre.value, apellido.value, email.value); 
        
        mostrarAlerta('Usuario actualizado correctamente.');
        limpiarFormulario(btnActualizar);
        setTimeout(()=>{
            readUsers();
        }, 2000);

    });

    nombre.addEventListener('blur', validarCampoVacio);
    apellido.addEventListener('blur', validarCampoVacio);
    email.addEventListener('blur', validarCampoVacio);
}

//Actualizar Usuario
function updateUsuario(id, nombre, apellido, email){
    const datosUpdate = {
        id,
        nombre,
        apellido,
        email
    }

    usuarios[id] = datosUpdate;
    insertLocalStorage(); //Insertar usuarios al localStorage
}

//Validar formulario

//Validar campos vacios
function validarCampoVacio(e){
    if(e.target.value === ''){
        e.target.classList.remove('successInput');
        e.target.classList.add('errorInput');
        mostrarError('Todos los campos son obligatorios.');
    }else{
        e.target.classList.remove('errorInput');
        e.target.classList.add('successInput');
        eliminarError();
    }

    validarLongitudCampo(e);

    if(this.type === 'email' && this.value !== ''){
        validarEmail(this);
    }

    if(er.test(email.value.toLowerCase()) && apellido.value !== '' && email.value !== ''){
        e.target.parentElement.parentElement.lastElementChild.children[0].disabled = false;
    }else{
        e.target.parentElement.parentElement.lastElementChild.children[0].disabled = true;
    }
}

//Valodar longitud de campos
function validarLongitudCampo(e){
    if(e.target.type == 'text' || e.target.type == 'text'){
        if(e.target.value.length > 25){
            e.target.classList.remove('successInput');
            e.target.classList.add('errorInput');
            mostrarError('Su nombre no debe contener más de 25 caracteres.');
        }
    }
}

//Validar email
function validarEmail(email){
    if(er.test(email.value.toLowerCase())){
        email.classList.remove('errorInput');
        email.classList.add('successInput');
        eliminarError();
    }else{
        email.classList.remove('successInput');
        email.classList.add('errorInput');
        mostrarError('El correo tiene un formato incorrecto.');
    }
}

//Mostrar ventana de error
function mostrarError(mensaje){
    const error = document.createElement('p');
    error.classList.add('error');
    error.textContent = mensaje;

    if(contenedor.childElementCount == 1){
        contenedor.appendChild(error);
    }
}

//Elimionar ventana de error
function eliminarError(){
    if(contenedor.childElementCount > 1){
        contenedor.removeChild(contenedor.children[1]);
    }
}

//Mostrar ventana de registro satisfactorio
function mostrarAlerta(mensaje){
    const alert = document.createElement('p');
    alert.classList.add('registroSuccess')
    alert.textContent = mensaje;

    if(contenedor.childElementCount == 1){
        contenedor.appendChild(alert);
    }

}

//Arregla el espacio del footer (Para que no se suba y rompa la maquetación)
function fixBug(){
    if(usuarios.length == 0){
        const fixBug = document.createElement('div');
        fixBug.style.height = '280px'
        
        contenedor.appendChild(fixBug);
    }
}

//Limpiar los campos del formulario
function limpiarFormulario(btn, all = true){
    if(all){
        nombre.value = '';
        apellido.value = '';
        email.value = '';
    }

    btn.disabled = true;
}

//Sincronizar datos localStorage
function insertLocalStorage(){
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
}