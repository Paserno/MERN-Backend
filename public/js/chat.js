
const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8082/api/auth/'
: 'https://atj-backend.herokuapp.com/api/auth/';
let usuario = null;
let socket  = null;

// Referncias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuario  = document.querySelector('#ulUsuario');
const ulMensaje  = document.querySelector('#ulMensaje');
const btnSalir   = document.querySelector('#btnSalir');

// Validar el token de LocalStorage
const validarJWT = async() => {

    const tokens =  localStorage.getItem('token') || '';

    if ( tokens.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': tokens }
    });

    const { usuario: userDB, token:  tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}


const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online')
    });

    socket.on('disconnect', () => {
        console.log('Socket offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload )
    });
}

const dibujarUsuarios = ( usuario = []) => {

    let usersHTML = '';
    usuario.forEach( ({ nombre, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });
    ulUsuario.innerHTML = usersHTML;
}


const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary"> ${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });
    ulMensaje.innerHTML = mensajesHTML;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if(keyCode !== 13 ){ return; }
    if( mensaje.length === 0 ){ return; }

    socket.emit('enviar-mensaje', { mensaje, uid } );
    
    txtMensaje.value = '';

})


const main = async() => {

    // Validar JWT
    await validarJWT();

}

main();