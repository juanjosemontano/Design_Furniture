document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#registerForm');
    const nombre = document.querySelector('#regNombre');
    const email = document.querySelector('#regEmail');
    const password = document.querySelector('#regPassword');
    const confirm = document.querySelector('#regConfirm')
    const error = document.querySelector('#regError')

    form.addEventListener('submit', (e) => {

        e.preventDefault();
    
        const nombreVal = nombre.value.trim();
        const emailVal = email.value.trim();
        const passVal = password.value;
        const confirmVal = confirm.value;

        if (!nombreVal || !emailVal || !passVal) {
            error.textContent = 'Completa todos los campos';
            error.style.display = 'block';
            return;
        }

        if (passVal !== confirmVal) {
            error.textContent = 'Las contraseñas no coinciden';
            error.style.display = 'block';
            return;
        }

        if (passVal.length < 6) {
            error.textContent = 'La contraseña debe tener minimo 6 caracteres';
            error.style.display = 'block';
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('df_usuarios')) || [];
        const yaExiste = usuarios.find(u => u.email === emailVal);

        if (yaExiste) {
            error.textContent = 'Ya existe una cuenta con ese correo';
            error.style.display = 'block';
            return;
        }

        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombreVal,
            email: emailVal,
            password: passVal
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('df_usuarios', JSON.stringify(usuarios));

        alert('¡Cuenta creada! Ahora inicia sesion');
        window.location.href = '/src/HTML/login.html'

    });
});