document.addEventListener('DOMContentLoaded', function() {

    // ---- 1. MOSTRAR PRODUCTOS DEL CARRITO ----
    const productPage = document.querySelector('.product_page');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        productPage.innerHTML = `
            <p style="color:white; text-align:center; margin-top:20px;">
                No hay productos en el carrito.
            </p>`;
    } else {

        let total = 0;

        carrito.forEach(function(producto) {
            total += parseFloat(producto.precio);

            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta_producto');

            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${parseFloat(producto.precio).toLocaleString('es-CO')}</p>
                <button class="btn-eliminar" data-nombre="${producto.nombre}">🗑 Eliminar</button>
            `;

            productPage.appendChild(tarjeta);
        });

        // Actualiza el precio total en shop_precio
        document.querySelector('.shop_precio').textContent =
            `$${total.toLocaleString('es-CO')}`;
    }

    // ---- 2. ELIMINAR PRODUCTO ----
    productPage.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const nombre = e.target.getAttribute('data-nombre');
            let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

            carritoActual = carritoActual.filter(p => p.nombre !== nombre);
            localStorage.setItem('carrito', JSON.stringify(carritoActual));

            location.reload();
        }
    });

    // ---- 3. SELECCIÓN DE MÉTODO DE PAGO ----
    const metodos = document.querySelectorAll('.text');

    metodos.forEach(function(metodo) {
        metodo.addEventListener('click', function() {
            metodos.forEach(m => m.classList.remove('seleccionado'));
            metodo.classList.add('seleccionado');
        });
    });

    // ---- 4. BOTÓN COMPRAR ----
    const btnComprar = document.querySelector('.btn-neon');
    const resumen = document.getElementById('resumen_compra');

    btnComprar.addEventListener('click', function(e) {
        e.preventDefault();

        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        const seleccionado = document.querySelector('.text.seleccionado');

        if (carritoActual.length === 0) {
            resumen.innerHTML = '⚠️ No hay productos en el carrito.';
            resumen.style.color = '#ff4d4d';
            return;
        }

        if (!seleccionado) {
            resumen.innerHTML = '⚠️ Por favor elige un método de pago.';
            resumen.style.color = '#ff4d4d';
            return;
        }

        const metodoElegido = seleccionado.textContent;
        const total = document.querySelector('.shop_precio').textContent;

        resumen.innerHTML = `
            ✅ Compra confirmada<br>
            Método: <strong>${metodoElegido}</strong><br>
            Total: <strong>${total}</strong>
        `;
        resumen.style.color = '#6eff3e';

        // Limpia el carrito después de comprar
        localStorage.removeItem('carrito');

        btnComprar.style.pointerEvents = 'none';
        btnComprar.style.opacity = '0.5';
    });

});