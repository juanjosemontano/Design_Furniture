document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#registerForm');
    const nombre = document.querySelector('#regNombre');
    const email = document.querySelector('#regEmail');
    const password = document.querySelector('#regPassword');
    const confirm = document.querySelector('#regConfirm')
    const error = document.querySelector('#regError')

    // addListener escucha un evento sobre un elemento
    // submit se dispara cuando el usuario hace clic en el boton del formulario
    // (e) es el objeto del evento contiene info de lo que paso

    form.addEventListener('submit', (e) => {

        // sin esto, el navegador recarga la pagina al enviar el formulario 
        // eso borraria todo antes de que js pueda hacer algo 
        // preventDefault() cancela ese comportamiento

        e.preventDefault();

        // .value lee lo que el usuario escribio en el input
        // . trim elimina espacios en blanco al inicio y al final
        // asi se evita que alguien registre un nombre con solo espacios
    
        const nombreVal = nombre.value.trim();
        const emailVal = email.value.trim();
        const passVal = password.value;
        const confirmVal = confirm.value;

        // Validaciones
        // Si algo falla, mostramos el error y usamos return para detener 
        // el resto del codigo, no sigue ejecutando

        if (!nombreVal || !emailVal || !passVal) {
            error.textContent = 'Completa todos los campos';
            error.style.display = 'block';
            return;
        }

        if (!passVal !== confirmVal) {
            error.textContent = 'Las contraseñas no coinciden';
            error.style.display = 'block'
        }

        if (passVal.length < 6) {
            error.textContent = 'La contraseña debe tener minimo 6 caracteres';
            error.style.display = 'block';
            return;
        }


        // LocalStorage solo guarda texto String
        // Por eso JSON,parse al leer convierte el texto en array
        // y JSON.stringify al guardar convierte el array en texto
        const usuarios = JSON.parse(localStorage.getItem('df_usuarios')) || [];
        // si no hay nada guardado, getItem devuelve null.
        // el || [] evita que usuarios sea null - lo convierte en array vacio


        // .find recorre el array buscando un elemto que cmpla la condicion
        // aqui buscamos si ya existe alguien con ese mail
        const yaExiste = usuarios.find(u => u.email === emailVal);

        if (yaExiste) {
            error.textContent = 'Ya existe una cuenta con ese correo';
            error.style.display = 'block';
            return;
        }


        // Creamos el objeto del nuevo usuario.
        // date.now() genera un numero unico basado en la hora actual
        // lo usamos cono id para diferencia usuarios 

        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombreVal,
            email: emailVal,
            password: passVal
        };

        // push agrega el nuevo usuario al final del array
        // luego guardamos el array completo devuelta en el local storage 

        usuarios.push(nuevoUsuario);
        localStorage.setItem('df_usuarios', JSON.stringify(usuarios));

        // registro exitoso y se redirige al login
        // window.location cambia la pagina actual 

        alert('¡Cuenta creada! Ahora inicia sesion');
        window.location.href = '/src/HTML/login.html'

    });
});