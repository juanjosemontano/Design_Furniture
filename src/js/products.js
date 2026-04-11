const botones = document.querySelectorAll('.menu-categorias button');
const productos = document.querySelectorAll('.producto');
const botonesCarrito = document.querySelectorAll('.btn-carrito');


let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

botones.forEach(function(boton) {

    boton.addEventListener('click', function() {

        botones.forEach(function(btn) {
            btn.classList.remove('activo');
        });

        boton.classList.add('activo');

        const categoria = boton.getAttribute('data-categoria');

        productos.forEach(function(producto) {

            if (categoria === 'all') {
                producto.style.display = 'block';
            } 
            else if (producto.classList.contains(categoria)) {
                producto.style.display = 'block';
            } 
            else {
                producto.style.display = 'none';
            }

        });

    });

});

botonesCarrito.forEach(function(boton) {

    boton.addEventListener('click', function() {

        const producto = boton.parentElement;

        const nombre = producto.getAttribute('data-nombre');
        const precio = producto.getAttribute('data-precio');
        const imagen = producto.querySelector('img').getAttribute('src'); 

        const productoCarrito = {
            nombre: nombre,
            precio: precio,
            imagen: imagen 
        };

        const yaExiste = carrito.some(function(item) {
            return item.nombre === nombre;
        });

        if (yaExiste) {
            alert(`"${nombre}" ya está en el carrito.`);
            return;
        }

        carrito.push(productoCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));

        boton.textContent = "Agregado";
        boton.disabled = true;

        console.log("Carrito actual:", carrito);
    });
});

window.addEventListener('DOMContentLoaded', function() {

    const botonesCarrito = document.querySelectorAll('.btn-carrito');

    botonesCarrito.forEach(function(boton) {

        const producto = boton.parentElement;
        const nombre = producto.getAttribute('data-nombre');
        const existe = carrito.some(function(item) {
            return item.nombre === nombre;
        });

        if (existe) {
            boton.textContent = "Agregado";
            boton.disabled = true;
        }

    });

});
