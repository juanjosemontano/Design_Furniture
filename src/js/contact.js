document.addEventListener('DOMContentLoaded', function() {

    // para seleccionar los elementos
    const whatsapp = document.querySelector('.whatsapp');
    const instagram = document.querySelector('.instagram');
    const facebook = document.querySelector('.facebook');
    const twitter = document.querySelector('.twitter');
    const redes = document.querySelectorAll('.container_redes li');
    const mensaje = document.getElementById('mensaje_contacto');

    // Efecto visual al pasar el mouse
    redes.forEach(function(red) {
        red.addEventListener('mouseenter', function() {
            red.classList.add('activo');
        });
        red.addEventListener('mouseleave', function() {
            red.classList.remove('activo');
        });
    });

    // 3. Abrir red social + mostrar mensaje
    whatsapp.addEventListener('click', function() {
        mensaje.textContent = ' Abriendo WhatsApp...';
        window.open('https://wa.me/3106353135', '_blank');
    });

    instagram.addEventListener('click', function() {
        mensaje.textContent = ' Abriendo Instagram...';
        window.open('https://www.instagram.com/mueblesconcorde?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank');
    });

    facebook.addEventListener('click', function() {
        mensaje.textContent = ' Abriendo Facebook...';
        window.open('https://www.facebook.com/share/1DaLn6NCoE/?mibextid=wwXIfr', '_blank');
    });

    twitter.addEventListener('click', function() {
        mensaje.textContent = ' Abriendo X...';
        window.open('https://x.com/muebleskatra?s=21', '_blank');
    });

});