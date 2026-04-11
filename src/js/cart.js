document.addEventListener('DOMContentLoaded', function() {

    const productPage = document.querySelector('.product_page');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        productPage.innerHTML = `
            <p style="color:white; text-align:center; margin-top:20px; font-size: 20px;">
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

        document.querySelector('.shop_precio').textContent =
            `$${total.toLocaleString('es-CO')}`;
    }

    productPage.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const nombre = e.target.getAttribute('data-nombre');
            let carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

            carritoActual = carritoActual.filter(p => p.nombre !== nombre);
            localStorage.setItem('carrito', JSON.stringify(carritoActual));

            location.reload();
        }
    });

    const metodos = document.querySelectorAll('.text');

    metodos.forEach(function(metodo) {
        metodo.addEventListener('click', function() {
            metodos.forEach(m => m.classList.remove('seleccionado'));
            metodo.classList.add('seleccionado');
        });
    });

    const btnComprar = document.querySelector('.btn-neon');
    const resumen = document.getElementById('resumen_compra');

    btnComprar.addEventListener('click', function(e) {
        e.preventDefault();

        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];

        if (carritoActual.length === 0) {
            resumen.innerHTML = 'No hay productos en el carrito.';
            resumen.style.color = '#ff4d4d';
            return;
        }

        const totalVenta = carritoActual.reduce(function(suma, producto) {
            let precioLimpio = producto.precio.toString().replace(/\./g, '').replace(/,/g, '');
            return suma + parseFloat(precioLimpio);
        }, 0);

        const productosComprados = carritoActual.map(p => p.nombre).join(', ');

        const sesion = JSON.parse(localStorage.getItem('df_sesion')) || { nombre: 'Cliente Web' };

        const nuevaVenta = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString('es-CO'),
            producto: productosComprados, 
            cantidad: carritoActual.length, 
            total: totalVenta,
            cliente: sesion.nombre 
        };

        const ventasGlobales = JSON.parse(localStorage.getItem('df_ventas')) || [];
        ventasGlobales.push(nuevaVenta);
        localStorage.setItem('df_ventas', JSON.stringify(ventasGlobales));

        localStorage.removeItem('carrito');
        resumen.innerHTML = `Compra procesada correctamente...`;
        resumen.style.color = '#6eff3e';

        setTimeout(function() {
            window.location.href = '/src/HTML/dashboard.html';
        }, 1500);
    });

});