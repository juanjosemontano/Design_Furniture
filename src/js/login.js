document.addEventListener('DOMContentLoaded', () => { // Espera que el HTML este listo

    const form = document.querySelector('#loginForm'); // selecciona el formulario por id 
    const usuario = document.querySelector('#loginUser');
    const password = document.querySelector('#loginPassword');
    const error = document.querySelector('#loginError');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Con eso se evita que la pagina recargue
    
    const usuarioVal = usuario.value.trim();
    const passwordVal = password.value;

    if (!usuarioVal || !passwordVal) {
        error.textContent = 'Completa todos los campos';
        error.computedStyleMap.display = 'block'
        return;
    }
    // Aqui esta la conexion con el register, el register guardo los usuarios con la clave 
    // 'df_usuarios' el login los lee con esa misma clave 
    // si no hay nadie registrado usamos array vacio
    const usuarios = JSON.parse(localStorage.getItem('df_usuarios')) || [];


    // find recorre el array y devuelve el primer elemento que cumpla con la condicion 
    // o unidefined si no encuenta nada
    // se permite iniciar sesion con nombre o con email 
    // la condicion usa OR para aceptar cualquiera 
    // el and exige que ademas la contraeña coincida

    const encontrado = usuarios.find(u =>
    (u.nombre === usuarioVal || u.email === usuarioVal) && u.password ===  passwordVal
    );
    
    if (encontrado) {
        localStorage.setItem('df_sesion', JSON.stringify(encontrado));

        window.location.href = '/src/HTML/products.html'

    } else {

        error.textContent = 'Usuario o contraseña incorrectos';
        error.computedStyleMap.display = 'block';
    }
    
    });
});