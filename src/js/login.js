document.addEventListener('DOMContentLoaded', () => { 

    const form = document.querySelector('#loginForm'); 
    const usuario = document.querySelector('#loginUser');
    const password = document.querySelector('#loginPassword');
    const error = document.querySelector('#loginError');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
    
    const usuarioVal = usuario.value.trim();
    const passwordVal = password.value;

    if (!usuarioVal || !passwordVal) {
        error.textContent = 'Completa todos los campos';
        error.style.display = 'block'
        return;
    }
   
    const usuarios = JSON.parse(localStorage.getItem('df_usuarios')) || [];

    const encontrado = usuarios.find(u =>
    (u.nombre === usuarioVal || u.email === usuarioVal) && u.password ===  passwordVal
    );
    
    if (encontrado) {
        localStorage.setItem('df_sesion', JSON.stringify(encontrado));

        window.location.href = '/src/HTML/products.html'

    } else {

        error.textContent = 'Usuario o contraseña incorrectos';
        error.style.display = 'block';
    }
    
    });
});