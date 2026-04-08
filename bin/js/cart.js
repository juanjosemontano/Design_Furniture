document.addEventListener('DOMContentLoaded', function() {

    // ---- 1. SELECCIÓN DE MÉTODO DE PAGO ----
    const metodos = document.querySelectorAll('.text');

    metodos.forEach(function(metodo) {
        metodo.addEventListener('click', function() {

            // Quitamos selección anterior
            metodos.forEach(function(m) {
                m.classList.remove('seleccionado');
            });

            // Marcamos el elegido
            metodo.classList.add('seleccionado');
        });
    });

    // ---- 2. BOTÓN COMPRAR ----
    const btnComprar = document.querySelector('.btn-neon');
    const resumen = document.getElementById('resumen_compra');

    btnComprar.addEventListener('click', function(e) {
        e.preventDefault();

        const seleccionado = document.querySelector('.text.seleccionado');

        // Validación: debe elegir método primero
        if (!seleccionado) {
            resumen.innerHTML = '⚠️ Por favor elige un método de pago.';
            resumen.style.color = '#ff4d4d';
            return;
        }

        // Confirmación de compra
        const metodoElegido = seleccionado.textContent;
        const precio = document.querySelector('.shop_precio').textContent;

        resumen.innerHTML = `
            ✅ Compra confirmada<br>
            Método: <strong>${metodoElegido}</strong><br>
            Total: <strong>${precio}</strong>
        `;
        resumen.style.color = '#6eff3e';

        // Desactivar botón
        btnComprar.style.pointerEvents = 'none';
        btnComprar.style.opacity = '0.5';
    });

});