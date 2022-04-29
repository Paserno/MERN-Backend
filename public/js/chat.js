
const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8082/api/auth/'
: '';
let usuario = null;
let socket  = null;

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

    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

}


const main = async() => {

    // Validar JWT
    await validarJWT();

}

main();