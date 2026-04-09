// ===================== SELECCIONAR ELEMENTOS =====================

// Botones de categorías
const botones = document.querySelectorAll('.menu-categorias button');

// Productos
const productos = document.querySelectorAll('.producto');

// Botones del carrito
const botonesCarrito = document.querySelectorAll('.btn-carrito');


// ===================== CARRITO (LOCAL STORAGE) =====================

// Si ya existe carrito lo carga, si no crea uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


// ===================== FILTRO + BOTÓN ACTIVO =====================

botones.forEach(function(boton) {

    boton.addEventListener('click', function() {

        // -------- BOTÓN ACTIVO --------
        botones.forEach(function(btn) {
            btn.classList.remove('activo');
        });

        boton.classList.add('activo');


        // -------- FILTRO --------
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


// ===================== AGREGAR AL CARRITO =====================

botonesCarrito.forEach(function(boton) {

    boton.addEventListener('click', function() {

        const producto = boton.parentElement;

        const nombre = producto.getAttribute('data-nombre');
        const precio = producto.getAttribute('data-precio');
        const imagen = producto.querySelector('img').getAttribute('src'); // ✅ nuevo

        const productoCarrito = {
            nombre: nombre,
            precio: precio,
            imagen: imagen // ✅ nuevo
        };

        // Verificar si ya existe antes de agregar
        const yaExiste = carrito.some(function(item) {
            return item.nombre === nombre;
        });

        if (yaExiste) {
            alert(`"${nombre}" ya está en el carrito.`);
            return;
        }

        carrito.push(productoCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));

        boton.textContent = "Agregado ✅";
        boton.disabled = true;

        console.log("Carrito actual:", carrito);
    });
});


// ===================== RECUPERAR ESTADO AL RECARGAR =====================

// Esto hace que si ya agregaste productos, el botón quede deshabilitado
window.addEventListener('DOMContentLoaded', function() {

    const botonesCarrito = document.querySelectorAll('.btn-carrito');

    botonesCarrito.forEach(function(boton) {

        const producto = boton.parentElement;
        const nombre = producto.getAttribute('data-nombre');

        // Verificar si ya está en el carrito
        const existe = carrito.some(function(item) {
            return item.nombre === nombre;
        });

        if (existe) {
            boton.textContent = "Agregado ✅";
            boton.disabled = true;
        }

    });

});
//console.log(localStorage.getItem('carrito'));