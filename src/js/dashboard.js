document.addEventListener('DOMContentLoaded', () => {

    const sesion = JSON.parse(localStorage.getItem('df_sesion'));

    if (!sesion) {
        window.location.href = '/src/HTML/login.html';
        return; 
    }

    const nombreUsuario = document.querySelector('#nombreUsuario');
    if (nombreUsuario) nombreUsuario.textContent = sesion.nombre;

    if (localStorage.getItem('df_productos')) {
        localStorage.removeItem('df_productos');
    }

    function getVentas() { return JSON.parse(localStorage.getItem('df_ventas')) || []; }
    function guardar(clave, datos) { localStorage.setItem(clave, JSON.stringify(datos)); }

    function mostrarVista(idVista) {
        document.querySelectorAll('.vista').forEach(seccion => seccion.classList.remove('activa'));
        
        const vistaActiva = document.querySelector('#' + idVista);
        if (vistaActiva) vistaActiva.classList.add('activa');

        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.vista === idVista) {
                link.classList.add('active');
            }
        });

        if (idVista === 'vista-dashboard') actualizarDashboard();
        if (idVista === 'vista-historial') renderTablaHistorial();
    }

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (link.dataset.vista) mostrarVista(link.dataset.vista);
        });
    });

    function renderTablaGeneral(idTbody, arrayVentas, colspanVacia, esHistorial) {
        const tbody = document.getElementById(idTbody);
        if (!tbody) return;

        tbody.innerHTML = '';
        
        if (arrayVentas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${colspanVacia}" class="tabla-vacia">Sin datos disponibles</td></tr>`;
            return;
        }

        const fragmento = document.createDocumentFragment();
        
        arrayVentas.forEach((venta, indice) => {
            const fila = document.createElement('tr');
            let vTot = venta.total ? parseFloat(venta.total) : (parseFloat(venta.precio) * parseInt(venta.cantidad));
            if (isNaN(vTot)) vTot = 0;
            
            if (esHistorial) {
                let vUnit = venta.precio ? '$' + parseFloat(venta.precio).toLocaleString() : 'N/A';
                fila.innerHTML = `
                    <td>${venta.id || (arrayVentas.length - indice)}</td>
                    <td>${venta.cliente || 'Anónimo'}</td>
                    <td>${venta.producto || 'Desconocido'}</td>
                    <td>${venta.cantidad || 0}</td>
                    <td>${vUnit}</td>
                    <td>$${vTot.toLocaleString()}</td>
                    <td>${venta.fecha || 'Sin fecha'}</td>
                    <td><button class="btn-eliminar" data-id="${venta.id}">×</button></td>
                `;
                
                const btn = fila.querySelector('.btn-eliminar');
                if (btn) {
                    btn.addEventListener('click', () => {
                        if (!confirm('¿Seguro de eliminar este registro del historial?')) return;
                        const vc = getVentas().filter(v => v.id !== venta.id);
                        guardar('df_ventas', vc);
                        renderTablaHistorial();
                        actualizarDashboard();
                    });
                }
            } else {
                fila.innerHTML = `
                    <td>${venta.producto || 'Desconocido'}</td>
                    <td>${venta.cantidad || 0}</td>
                    <td>$${vTot.toLocaleString()}</td>
                    <td>${venta.fecha || 'Sin fecha'}</td>
                `;
            }
            fragmento.appendChild(fila);
        });
        
        tbody.appendChild(fragmento);
    }

    function actualizarDashboard() {
        const ventas = getVentas();

        const total = ventas.reduce((suma, venta) => {
            let vTot = venta.total ? parseFloat(venta.total) : (parseFloat(venta.precio) * parseInt(venta.cantidad));
            if (isNaN(vTot)) vTot = 0;
            return suma + vTot;
        }, 0);

        const elTotalVentas = document.querySelector('#totalVentas');
        if (elTotalVentas) elTotalVentas.textContent = '$' + total.toLocaleString();

        const elMasVendido = document.querySelector('#masVendido');
        if (elMasVendido) {
            if (ventas.length > 0) {
                const conteo = ventas.reduce((acc, venta) => {
                    if (venta.producto) acc[venta.producto] = (acc[venta.producto] || 0) + (parseInt(venta.cantidad) || 1);
                    return acc;
                }, {});

                const masVendidoArr = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
                elMasVendido.textContent = masVendidoArr.length > 0 ? masVendidoArr[0][0] : 'Ninguno';
            } else {
                elMasVendido.textContent = 'Ninguno';
            }
        }

        const ultimas = [...ventas].reverse().slice(0, 5);
        renderTablaGeneral('tablaUltimasVentas', ultimas, 4, false);
    }

    function renderTablaHistorial() {
        const ventas = getVentas();
        renderTablaGeneral('tablaHistorial', [...ventas].reverse(), 8, true);
    }

    const btnAnalisis = document.querySelector('#btnAnalisis');
    const panelIA = document.querySelector('#iaPanel');

    if (btnAnalisis && panelIA) {
        btnAnalisis.addEventListener('click', async () => {
            const ventas = getVentas();

            if (ventas.length === 0) {
                panelIA.innerHTML = '<p>Se necesitan datos de ventas para analizar.</p>';
                return;
            }

            panelIA.innerHTML = '<p>Conectando y validando Inteligencia Gemini...</p>';

            const tVen = ventas.reduce((s, v) => {
                let m = v.total ? parseFloat(v.total) : (parseFloat(v.precio) * parseInt(v.cantidad));
                return s + (isNaN(m) ? 0 : m);
            }, 0);

            const conteo = ventas.reduce((acc, v) => {
                if(v.producto) acc[v.producto] = (acc[v.producto] || 0) + (parseInt(v.cantidad) || 1);
                return acc;
            }, {});

            const mva = Object.entries(conteo).sort((a,b) => b[1]-a[1]);
            const bestP = mva.length > 0 ? mva[0][0] : 'Desconocido';
            const bestC = mva.length > 0 ? mva[0][1] : 0;

            const resText = Object.entries(conteo).map(p => `${p[0]}: ${p[1]}`).join(', ');

            const prompt = `Actúa como analista de datos. 
            Métricas de las ventas: Total facturado $${tVen}. Transacciones globales: ${ventas.length}. Artículos: ${resText}. 
            Dame HTML respondiendo de la siguiente manera excluyente:
            <h3>Analytics de Rendimiento</h3>
            <p><strong> Top Rendimiento:</strong> (tu recomendacion top breve)</p>
            <p><strong>Gestión de Stock Sugerida:</strong> (tu opinion de gestiones)</p>
            (Maximo 100 palabras. Limpio y conciso).`;

            let falloIA = false;

            try {
                const API_KEY = 'AIzaSyB_QFDutfUYkjWaUZv1vfj-zF51H_NI1lU';
                const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + API_KEY;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });

                if (!response.ok) throw new Error('Status Error: ' + response.status);

                const data = await response.json();

                if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    panelIA.innerHTML = data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error('Esquema JSON del proveedor IA corrupto o incompleto');
                }

            } catch (err) {
                console.warn('Activando Fallback offline seguro por:', err.message);
                falloIA = true;
            }

            if (falloIA) {
                panelIA.innerHTML = `
                    <h3>Análisis Nativo (Modo Offline)</h3>
                    <ul>
                        <li>Ventas Netas: $${tVen.toLocaleString()}</li>
                        <li>Rendimiento Óptimo: El artículo '${bestP}' lidera con ${bestC} ventas completadas.</li>
                        <li>Gestión Sugerida: Concentrar estrategias para no perder el impulso de ventas de '${bestP}'.</li>
                    </ul>
                `;
            }
        });
    }

    const btnLogout = document.querySelector('#btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('df_sesion');
            window.location.href = '/src/HTML/login.html';
        });
    }

    actualizarDashboard();
});
