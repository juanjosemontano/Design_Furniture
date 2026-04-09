// ================================================================
// dashboard.js — Design Furniture
//
// Este archivo controla TODO el comportamiento del dashboard.
// Se conecta con el HTML a través de los id que pusimos en cada
// elemento. Funciona así:
//
//   HTML tiene:  <p id="totalVentas">$0</p>
//   JS hace:     document.querySelector('#totalVentas').textContent = '$500'
//   Resultado:   el usuario ve $500 en pantalla
//
// Orden de ejecución:
//   1. Verificar que hay sesión activa
//   2. Mostrar el nombre del usuario
//   3. Configurar la navegación del sidebar
//   4. Cargar los datos iniciales del dashboard
// ================================================================


// ================================================================
// PASO 1 — VERIFICAR SESIÓN
//
// Cuando el usuario inicia sesión en login.js, guardamos sus datos:
//   localStorage.setItem('df_sesion', JSON.stringify(usuario))
//
// Aquí lo primero que hacemos es leerlos.
// Si no hay nada → el usuario no está logueado → lo mandamos al login.
// Si hay datos   → continuamos normal.
// ================================================================

// JSON.parse convierte el texto guardado en localStorage
// de vuelta a un objeto JavaScript que podemos usar.
const sesion = JSON.parse(localStorage.getItem('df_sesion'));

// Si sesion es null (no existe), redirigimos al login inmediatamente.
// El código que está debajo de este if NO se ejecuta.
if (!sesion) {
    window.location.href = '/src/HTML/login.html';
}

// Si llegamos aquí, el usuario SÍ está logueado.
// Escribimos su nombre en el sidebar.
// querySelector('#nombreUsuario') encuentra el <p id="nombreUsuario"> del HTML.
// .textContent reemplaza el texto que hay dentro.
document.querySelector('#nombreUsuario').textContent = sesion.nombre;


// ================================================================
// PASO 2 — HELPERS DE LOCALSTORAGE
//
// En lugar de escribir JSON.parse(localStorage.getItem('...')) || []
// cada vez que necesitamos datos, creamos funciones pequeñas.
// Así el código es más limpio y fácil de leer.
// ================================================================

// Lee el array de productos guardado. Si no hay nada devuelve [].
function getProductos() {
    return JSON.parse(localStorage.getItem('df_productos')) || [];
}

// Lee el array de ventas guardado. Si no hay nada devuelve [].
function getVentas() {
    return JSON.parse(localStorage.getItem('df_ventas')) || [];
}

// Guarda cualquier array en localStorage.
// JSON.stringify convierte el array/objeto a texto para poder guardarlo.
function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}


// ================================================================
// PASO 3 — NAVEGACIÓN ENTRE VISTAS
//
// El dashboard tiene 5 secciones (vistas) en el mismo HTML.
// Solo una se ve a la vez.
//
// El CSS hace:
//   .vista         { display: none  }   ← todas ocultas
//   .vista.activa  { display: block }   ← solo la activa se ve
//
// Esta función cambia qué vista tiene la clase "activa".
// Se llama cada vez que el usuario hace clic en el sidebar.
// ================================================================

function mostrarVista(idVista) {

    // querySelectorAll('.vista') devuelve TODOS los elementos con clase "vista".
    // forEach recorre cada uno y le quita la clase "activa".
    // Resultado: todas las vistas quedan ocultas.
    document.querySelectorAll('.vista').forEach(function(seccion) {
        seccion.classList.remove('activa');
    });

    // Ahora le ponemos "activa" solo a la vista que pidió el usuario.
    // '#' + idVista construye el selector, por ejemplo: '#vista-productos'
    document.querySelector('#' + idVista).classList.add('activa');

    // También actualizamos cuál nav-item está marcado como activo.
    document.querySelectorAll('.nav-item').forEach(function(link) {
        link.classList.remove('active');
    });

    // El nav-item que tiene data-vista igual al idVista pedido
    // recibe la clase "active" (que en el CSS lo pone dorado).
    document.querySelector('[data-vista="' + idVista + '"]').classList.add('active');

    // Cuando el usuario entra a ciertas vistas, recargamos los datos.
    // Así siempre ve la información más actualizada.
    if (idVista === 'vista-dashboard')  actualizarDashboard();
    if (idVista === 'vista-ventas')     cargarProductosEnSelect();
    if (idVista === 'vista-historial')  renderTablaHistorial();
    if (idVista === 'vista-productos')  renderGridProductos();
}

// Conectamos cada nav-item del sidebar con la función mostrarVista.
// querySelectorAll devuelve todos los elementos con clase "nav-item".
// forEach recorre cada uno y le pone un addEventListener.
document.querySelectorAll('.nav-item').forEach(function(link) {

    // 'click' es el evento — se dispara cuando el usuario hace clic.
    link.addEventListener('click', function(e) {

        // Evitamos que el href="#" haga scroll al tope de la página.
        e.preventDefault();

        // dataset.vista lee el atributo data-vista del elemento.
        // Por ejemplo: <a data-vista="vista-productos"> → link.dataset.vista = "vista-productos"
        mostrarVista(link.dataset.vista);
    });
});


// ================================================================
// PASO 4 — DASHBOARD: TARJETAS DE RESUMEN
//
// Lee los datos de localStorage y actualiza los 3 números
// que aparecen en las tarjetas del dashboard.
// ================================================================

function actualizarDashboard() {
    const productos = getProductos();
    const ventas    = getVentas();

    // --- Total de ventas ---
    // reduce() recorre el array acumulando un resultado.
    // Empieza en 0 (el segundo parámetro) y suma precio*cantidad de cada venta.
    // Ejemplo: [{precio:100, cantidad:2}, {precio:50, cantidad:1}]
    //          → 0 + (100*2) + (50*1) = 250
    const total = ventas.reduce(function(suma, venta) {
        return suma + (venta.precio * venta.cantidad);
    }, 0);

    // toLocaleString() formatea el número con separadores de miles: 1500 → 1,500
    document.querySelector('#totalVentas').textContent = '$' + total.toLocaleString();

    // --- Total de productos ---
    // .length devuelve cuántos elementos tiene el array.
    document.querySelector('#totalProductos').textContent = productos.length;

    // --- Producto más vendido ---
    if (ventas.length > 0) {

        // reduce() convierte el array de ventas en un objeto de conteo.
        // Ejemplo: [{producto:'Sofá', cantidad:3}, {producto:'Sofá', cantidad:1}, {producto:'Mesa', cantidad:2}]
        //          → { 'Sofá': 4, 'Mesa': 2 }
        const conteo = ventas.reduce(function(acc, venta) {
            // Si el producto ya existe en acc, suma la cantidad.
            // Si no existe, empieza en 0 y le suma la cantidad.
            acc[venta.producto] = (acc[venta.producto] || 0) + venta.cantidad;
            return acc;
        }, {});

        // Object.entries convierte el objeto en array de pares [nombre, total].
        // .sort() lo ordena de mayor a menor (b[1] - a[1]).
        // [0] toma el primero (el más vendido).
        // [0] del resultado es el nombre del producto.
        const masVendido = Object.entries(conteo).sort(function(a, b) {
            return b[1] - a[1];
        })[0][0];

        document.querySelector('#masVendido').textContent = masVendido;
    }

    // --- Últimas 5 ventas en la tabla ---
    // [...ventas] crea una copia del array (para no modificar el original).
    // .reverse() invierte el orden (las más recientes primero).
    // .slice(0, 5) toma solo los primeros 5 elementos.
    const ultimas = [...ventas].reverse().slice(0, 5);
    renderTabla('tablaUltimasVentas', ultimas, 4);
}


// ================================================================
// PASO 5 — PRODUCTOS: CRUD
//
// CRUD = Create, Read, Update, Delete
// Aquí manejamos agregar, mostrar y eliminar productos.
// ================================================================

// Muestra u oculta el formulario de agregar producto.
// El botón "+ Agregar producto" llama a esta función.
document.querySelector('#btnToggleFormProducto').addEventListener('click', function() {
    const formulario = document.querySelector('#formProductoWrapper');

    // Si el formulario está oculto (display:'none'), lo mostramos.
    // Si está visible, lo ocultamos.
    // Esto es un toggle manual con style.display.
    if (formulario.style.display === 'block') {
        formulario.style.display = 'none';
    } else {
        formulario.style.display = 'block';
    }
});

// Guarda un nuevo producto cuando el usuario clickea "Guardar producto"
document.querySelector('#btnGuardarProducto').addEventListener('click', function() {

    // Leemos los valores de cada campo con .value
    // .trim() elimina espacios en blanco al inicio y al final
    const nombre    = document.querySelector('#prodNombre').value.trim();
    const categoria = document.querySelector('#prodCategoria').value;
    const precio    = parseFloat(document.querySelector('#prodPrecio').value);
    const stock     = parseInt(document.querySelector('#prodStock').value);
    const msg       = document.querySelector('#msgProducto');

    // --- Validaciones (NF-8) ---
    // Si algún campo está vacío o el número es inválido, mostramos error y paramos.
    if (!nombre || !categoria || isNaN(precio) || isNaN(stock)) {
        msg.className = 'mensaje error';
        msg.textContent = 'Completa todos los campos';
        return;  // return detiene la ejecución — no sigue al siguiente paso
    }

    if (precio <= 0) {
        msg.className = 'mensaje error';
        msg.textContent = 'El precio debe ser mayor a 0';
        return;
    }

    // --- Crear el objeto producto ---
    // Date.now() devuelve la hora actual en milisegundos.
    // Lo usamos como id único porque dos productos no se crean al mismo milisegundo.
    const nuevoProducto = {
        id:        Date.now(),
        nombre:    nombre,
        categoria: categoria,
        precio:    precio,
        stock:     stock
    };

    // Leemos los productos actuales, agregamos el nuevo, guardamos todo.
    const productos = getProductos();
    productos.push(nuevoProducto);   // push agrega al final del array
    guardar('df_productos', productos);

    // Mostramos mensaje de éxito
    msg.className = 'mensaje success';
    msg.textContent = 'Producto guardado correctamente';

    // Limpiamos los campos del formulario
    document.querySelector('#prodNombre').value    = '';
    document.querySelector('#prodCategoria').value = '';
    document.querySelector('#prodPrecio').value    = '';
    document.querySelector('#prodStock').value     = '';

    // Actualizamos el grid para que aparezca el nuevo producto
    renderGridProductos();

    // Ocultamos el mensaje después de 3 segundos
    // setTimeout ejecuta una función después de N milisegundos
    setTimeout(function() {
        msg.className = 'mensaje';
        msg.textContent = '';
    }, 3000);
});

// Pinta las tarjetas de productos en el grid
function renderGridProductos() {
    const productos = getProductos();
    const grid      = document.querySelector('#gridProductos');

    // Limpiamos el contenido actual del grid
    grid.innerHTML = '';

    // Si no hay productos, mostramos el mensaje vacío y terminamos
    if (productos.length === 0) {
        grid.innerHTML = '<p class="tabla-vacia">Sin productos registrados</p>';
        return;
    }

    // DocumentFragment es un contenedor en MEMORIA (no en la página).
    // Creamos todas las tarjetas aquí primero,
    // y al final las insertamos en el DOM de una sola vez.
    // Esto hace que el navegador solo repinte la página UNA vez,
    // en lugar de repintarla por cada tarjeta (más eficiente).
    const fragmento = document.createDocumentFragment();

    productos.forEach(function(producto) {

        // createElement crea un elemento HTML nuevo en memoria.
        // Todavía NO está en la página, solo en el fragmento.
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';

        // innerHTML construye el contenido interno de la tarjeta.
        // Usamos template literals (backticks) para insertar variables.
        tarjeta.innerHTML = `
            <p class="prod-categoria">${producto.categoria}</p>
            <h3>${producto.nombre}</h3>
            <p class="prod-precio">$${producto.precio.toLocaleString()}</p>
            <p class="prod-stock">Stock: ${producto.stock} unidades</p>
            <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">
                Eliminar
            </button>
        `;

        // Agregamos la tarjeta al fragmento (todavía en memoria)
        fragmento.append(tarjeta);
    });

    // UN SOLO append al DOM — solo un repintado de la página
    grid.append(fragmento);
}

// Elimina un producto por su id
function eliminarProducto(id) {

    // Pedimos confirmación antes de borrar
    if (!confirm('¿Eliminar este producto?')) return;

    // filter() devuelve un nuevo array sin el producto que tiene ese id.
    // Es como decir: "dame todos los productos EXCEPTO el que tiene id = ..."
    const productos = getProductos().filter(function(p) {
        return p.id !== id;
    });

    guardar('df_productos', productos);
    renderGridProductos();   // recargamos el grid sin el producto eliminado
}


// ================================================================
// PASO 6 — VENTAS: REGISTRAR
// ================================================================

// Llena el <select> de productos con los productos guardados en localStorage.
// Se llama cada vez que el usuario entra a la vista de ventas.
function cargarProductosEnSelect() {
    const productos = getProductos();
    const select    = document.querySelector('#ventaProducto');

    // Limpiamos el select y ponemos la opción por defecto
    select.innerHTML = '<option value="">Selecciona un producto...</option>';

    // Creamos una <option> por cada producto y la agregamos al select
    productos.forEach(function(producto) {
        const opcion = document.createElement('option');
        opcion.value       = producto.id;       // el value guarda el id
        opcion.textContent = producto.nombre;   // el texto visible es el nombre
        select.append(opcion);
    });

    // Cuando el usuario elige un producto, autocompletamos el precio
    select.addEventListener('change', function() {
        const idSeleccionado = parseInt(select.value);

        // find() busca en el array el producto cuyo id coincide con el seleccionado
        const producto = productos.find(function(p) {
            return p.id === idSeleccionado;
        });

        if (producto) {
            // Llenamos el campo precio con el precio del producto elegido
            document.querySelector('#ventaPrecio').value = producto.precio;
        } else {
            document.querySelector('#ventaPrecio').value = '';
        }

        calcularTotal();
    });

    // Recalculamos el total cada vez que cambia la cantidad
    document.querySelector('#ventaCantidad').addEventListener('input', calcularTotal);
}

// Calcula precio * cantidad y lo muestra en el span #ventaTotal
function calcularTotal() {
    const cantidad = parseFloat(document.querySelector('#ventaCantidad').value) || 0;
    const precio   = parseFloat(document.querySelector('#ventaPrecio').value)   || 0;

    document.querySelector('#ventaTotal').textContent = '$' + (cantidad * precio).toLocaleString();
}

// Registra la venta cuando el usuario clickea "Registrar venta"
document.querySelector('#btnRegistrarVenta').addEventListener('click', function() {
    const select   = document.querySelector('#ventaProducto');
    const cantidad = parseInt(document.querySelector('#ventaCantidad').value);
    const cliente  = document.querySelector('#ventaCliente').value.trim();
    const precio   = parseFloat(document.querySelector('#ventaPrecio').value);
    const msg      = document.querySelector('#msgVenta');

    // --- Validaciones ---
    if (!select.value) {
        msg.className = 'mensaje error';
        msg.textContent = 'Selecciona un producto';
        return;
    }

    if (!cantidad || cantidad <= 0) {
        msg.className = 'mensaje error';
        msg.textContent = 'La cantidad debe ser mayor a 0';
        return;
    }

    if (!cliente) {
        msg.className = 'mensaje error';
        msg.textContent = 'Ingresa el nombre del cliente';
        return;
    }

    // Verificamos que haya stock suficiente
    const productos     = getProductos();
    const idProducto    = parseInt(select.value);

    // findIndex devuelve la POSICIÓN del producto en el array (no el producto en sí).
    // Lo necesitamos así para poder modificar el stock directamente.
    const indice = productos.findIndex(function(p) {
        return p.id === idProducto;
    });

    if (productos[indice].stock < cantidad) {
        msg.className = 'mensaje error';
        msg.textContent = 'Stock insuficiente. Solo hay ' + productos[indice].stock + ' unidades';
        return;
    }

    // --- Guardar la venta ---
    const nuevaVenta = {
        id:       Date.now(),
        producto: productos[indice].nombre,
        cantidad: cantidad,
        precio:   precio,
        cliente:  cliente,
        fecha:    new Date().toLocaleDateString('es-CO')
    };

    const ventas = getVentas();
    ventas.push(nuevaVenta);
    guardar('df_ventas', ventas);

    // Descontamos del stock el número de unidades vendidas
    productos[indice].stock -= cantidad;
    guardar('df_productos', productos);

    // Mensaje de éxito
    msg.className = 'mensaje success';
    msg.textContent = 'Venta registrada correctamente';

    // Limpiamos el formulario
    document.querySelector('#ventaProducto').value   = '';
    document.querySelector('#ventaCantidad').value   = '';
    document.querySelector('#ventaCliente').value    = '';
    document.querySelector('#ventaPrecio').value     = '';
    document.querySelector('#ventaTotal').textContent = '$0';

    setTimeout(function() {
        msg.className = 'mensaje';
        msg.textContent = '';
    }, 3000);
});


// ================================================================
// PASO 7 — HISTORIAL DE VENTAS
// ================================================================

// Pinta todas las ventas en la tabla del historial
function renderTablaHistorial() {
    const ventas = getVentas();
    const tbody  = document.querySelector('#tablaHistorial');

    tbody.innerHTML = '';

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="tabla-vacia">Sin ventas registradas</td></tr>';
        return;
    }

    const fragmento = document.createDocumentFragment();

    // [...ventas].reverse() → copia el array y lo invierte (más recientes primero)
    [...ventas].reverse().forEach(function(venta, indice) {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${ventas.length - indice}</td>
            <td>${venta.cliente}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.precio.toLocaleString()}</td>
            <td>$${(venta.precio * venta.cantidad).toLocaleString()}</td>
            <td>${venta.fecha}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarVenta(${venta.id})">×</button>
            </td>
        `;

        fragmento.append(fila);
    });

    tbody.append(fragmento);
}

// Elimina una venta por su id
function eliminarVenta(id) {
    if (!confirm('¿Eliminar esta venta?')) return;

    const ventas = getVentas().filter(function(v) {
        return v.id !== id;
    });

    guardar('df_ventas', ventas);
    renderTablaHistorial();
}


// ================================================================
// PASO 8 — ANÁLISIS IA
//
// Tomamos los datos reales de ventas del localStorage,
// se los enviamos a Claude con un prompt descriptivo,
// y mostramos la respuesta en el panel.
// ================================================================

document.querySelector('#btnAnalisis').addEventListener('click', async function() {
    const ventas    = getVentas();
    const productos = getProductos();
    const panel     = document.querySelector('#iaPanel');

    // Si no hay ventas, no hay nada que analizar
    if (ventas.length === 0) {
        panel.textContent = 'No hay ventas registradas. Registra algunas ventas primero.';
        return;
    }

    // Mostramos un mensaje de espera mientras la API responde
    panel.textContent = 'Analizando datos...';

    // Calculamos el total de ventas
    const totalVentas = ventas.reduce(function(suma, v) {
        return suma + (v.precio * v.cantidad);
    }, 0);

    // Creamos un resumen de cuánto se vendió de cada producto
    const conteo = ventas.reduce(function(acc, v) {
        acc[v.producto] = (acc[v.producto] || 0) + v.cantidad;
        return acc;
    }, {});

    // Convertimos el objeto a texto legible para el prompt
    // Ejemplo: "Sofá: 3 unidades, Mesa: 1 unidades"
    const resumen = Object.entries(conteo)
        .map(function(par) { return par[0] + ': ' + par[1] + ' unidades'; })
        .join(', ');

    // Construimos el prompt con los datos reales del negocio
    const prompt = `
        Eres un asesor de negocios para "Design Furniture", tienda de muebles.
        Analiza estos datos y da recomendaciones cortas y concretas:

        - Total vendido: $${totalVentas.toLocaleString()}
        - Número de ventas: ${ventas.length}
        - Ventas por producto: ${resumen}
        - Productos en catálogo: ${productos.length}

        Dame:
        1. El producto estrella y por qué importa
        2. Una recomendación de inventario
        3. Una sugerencia de estrategia de ventas

        Máximo 150 palabras. Tono profesional y directo.
    `;

    try {
        // Llamada a la API de Claude
        // async/await nos permite esperar la respuesta sin bloquear la página
        const respuesta = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model:      'claude-sonnet-4-20250514',
                max_tokens: 400,
                messages:   [{ role: 'user', content: prompt }]
            })
        });

        // Convertimos la respuesta a objeto JavaScript
        const datos = await respuesta.json();

        // datos.content es un array. El primer elemento tiene el texto.
        panel.textContent = datos.content[0].text;

    } catch (error) {
        // Si algo falla (sin internet, error de API, etc.)
        panel.textContent = 'No se pudo conectar con el análisis IA.';
        console.error(error);
    }
});


// ================================================================
// PASO 9 — CERRAR SESIÓN
// ================================================================

document.querySelector('#btnLogout').addEventListener('click', function() {
    // Borramos la sesión de localStorage
    localStorage.removeItem('df_sesion');

    // Redirigimos al login
    window.location.href = '/src/HTML/login.html';
});


// ================================================================
// PASO 10 — INICIALIZAR AL CARGAR LA PÁGINA
//
// DOMContentLoaded se dispara cuando el HTML está completamente cargado.
// Aquí cargamos los datos iniciales para que las tarjetas no estén vacías.
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    actualizarDashboard();
    renderGridProductos();
});