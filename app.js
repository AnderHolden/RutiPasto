/**
 * Rutas Pasto Offline - Main Application Controller
 * Desarrollado con JavaScript Vanilla ES6+ y Leaflet
 * Funciona 100% offline tras la primera carga.
 */

// Estado global de la aplicación
const AppState = {
    rutas: [],
    rutaSeleccionada: null,
    sentidoActivo: 'IDA', // 'IDA' | 'RETORNO'
    filtroTipo: 'TODAS',  // 'TODAS' | 'COMPLEMENTARIA' | 'ESTRATEGICA'
    mapa: null,
    capaRutasTodas: null,
    capaRutaActiva: null,
    capaParadas: null,
    capaLugares: null,
    marcadorUsuario: null,
    circuloUsuario: null,
    marcadoresParadasMap: new Map(),
    deferredPrompt: null,
    isOnline: navigator.onLine
};

// Paleta de colores distintiva para las 23 rutas
const COLORES_RUTAS = {
    'C1': '#E11D48',  // Rose
    'C2': '#2563EB',  // Blue
    'C3': '#059669',  // Emerald
    'C4': '#D97706',  // Amber
    'C5': '#7C3AED',  // Violet
    'C6': '#0891B2',  // Cyan
    'C7': '#EA580C',  // Orange
    'C8': '#4F46E5',  // Indigo
    'C9': '#16A34A',  // Green
    'C10': '#C026D3', // Fuchsia
    'C11': '#0D9488', // Teal
    'C12': '#9333EA', // Purple
    'C13': '#DC2626', // Red
    'C14': '#475569', // Slate
    'C15': '#CA8A04', // Yellow
    'C16': '#0284C7', // Sky
    'E1': '#B91C1C',  // Dark Red
    'E2': '#1D4ED8',  // Dark Blue
    'E3': '#047857',  // Dark Emerald
    'E4': '#B45309',  // Dark Amber
    'E5': '#6D28D9',  // Dark Violet
    'E6': '#0E7490',  // Dark Cyan
    'E7': '#C2410C'   // Dark Orange
};

// Punto central de Pasto, Nariño
const CENTRO_PASTO = [1.213, -77.281];
const ZOOM_INICIAL = 13;

/* ==========================================================================
   INICIALIZACIÓN Y VALIDACIÓN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    cargarRutas();
    validarDatos();
    inicializarTema();
    inicializarMapa();
    inicializarEventos();
    renderizarTarjetas();
    mostrarTodasLasRutas();
    registrarPWA();
    actualizarEstadoConexion();
});

/**
 * Carga el conjunto de datos desde data/rutas.js
 */
function cargarRutas() {
    if (typeof RUTAS_PASTO !== 'undefined' && Array.isArray(RUTAS_PASTO)) {
        AppState.rutas = RUTAS_PASTO;
    } else {
        console.error('No se pudo encontrar el dataset RUTAS_PASTO en data/rutas.js');
        mostrarToast('Error al cargar la base de datos de rutas.');
    }
}

/**
 * Valida la consistencia de los datos del sistema
 */
function validarDatos() {
    const total = AppState.rutas.length;
    const ids = new Set();
    let hayErrores = false;

    if (total !== 23) {
        console.warn(`⚠ Se esperaban 23 rutas, pero se encontraron: ${total}`);
        hayErrores = true;
    }

    AppState.rutas.forEach((r) => {
        if (ids.has(r.id)) {
            console.warn(`⚠ ID duplicado detectado: ${r.id}`);
            hayErrores = true;
        }
        ids.add(r.id);

        if (!r.origen || !r.destino) {
            console.warn(`⚠ Ruta ${r.id} no tiene origen o destino definido.`);
            hayErrores = true;
        }

        if (!r.paradasIda || r.paradasIda.length === 0) {
            console.warn(`⚠ Ruta ${r.id} tiene paradasIda vacías.`);
            hayErrores = true;
        }

        if (!r.coordenadasIda || r.coordenadasIda.length === 0) {
            console.warn(`⚠ Ruta ${r.id} tiene coordenadasIda pendientes.`);
            hayErrores = true;
        }

        // Validar rango geográfico de Pasto
        if (r.coordenadasIda && r.coordenadasIda.length > 0) {
            const firstPt = r.coordenadasIda[0];
            if (firstPt[0] < 1.10 || firstPt[0] > 1.30 || firstPt[1] < -77.40 || firstPt[1] > -77.20) {
                console.warn(`⚠ Coordenadas de ruta ${r.id} fuera del rango urbano de Pasto:`, firstPt);
            }
        }
    });

    if (!hayErrores) {
        console.log(`✓ ${total} rutas cargadas`);
        console.log('✓ Datos validados');
    }
}

/* ==========================================================================
   CONFIGURACIÓN DEL MAPA LEAFLET
   ========================================================================== */

/**
 * Inicializa la instancia del mapa Leaflet
 */
function inicializarMapa() {
    try {
        AppState.mapa = L.map('map', {
            center: CENTRO_PASTO,
            zoom: ZOOM_INICIAL,
            zoomControl: true
        });

        // Capa de mosaicos OpenStreetMap
        const osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tileLayer = L.tileLayer(osmTileUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | SETPasto',
            maxZoom: 19,
            minZoom: 11
        });

        tileLayer.addTo(AppState.mapa);

        // Grupo de capas
        AppState.capaRutasTodas = L.featureGroup().addTo(AppState.mapa);
        AppState.capaRutaActiva = L.featureGroup().addTo(AppState.mapa);
        AppState.capaParadas = L.featureGroup().addTo(AppState.mapa);
        AppState.capaLugares = L.featureGroup().addTo(AppState.mapa);

        // Control de zoom en posición inferior derecha para facilitar uso táctil
        AppState.mapa.zoomControl.setPosition('bottomright');
    } catch (e) {
        console.error('Error al inicializar Leaflet:', e);
    }
}

/* ==========================================================================
   RENDERIZADO DE RUTAS Y VISTA GENERAL
   ========================================================================== */

/**
 * Dibuja todas las 23 rutas en el mapa simultáneamente con colores diferenciados
 */
function mostrarTodasLasRutas() {
    if (!AppState.mapa) return;

    limpiarCapasMapa();
    AppState.rutaSeleccionada = null;

    // Ocultar ficha de ruta
    const panel = document.getElementById('routePanel');
    if (panel) panel.style.display = 'none';

    AppState.rutas.forEach((ruta) => {
        const coords = ruta.coordenadasIda && ruta.coordenadasIda.length > 0 
            ? ruta.coordenadasIda 
            : ruta.coordenadasRetorno;

        if (coords && coords.length > 0) {
            const color = COLORES_RUTAS[ruta.id] || '#FF6B00';
            const polyline = L.polyline(coords, {
                color: color,
                weight: 4,
                opacity: 0.8,
                smoothFactor: 1
            });

            // Popup al hacer click en el recorrido
            polyline.bindPopup(`
                <div style="font-family: var(--font-family); text-align: center; min-width: 140px;">
                    <div style="font-weight: 800; font-size: 1.1rem; color: ${color};">${ruta.id}</div>
                    <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 4px;">${ruta.tipo}</div>
                    <div style="font-size: 0.85rem; color: #334155; margin-bottom: 8px;">${ruta.origen} ↔ ${ruta.destino}</div>
                    <button onclick="seleccionarRuta('${ruta.id}')" style="background: ${color}; color: #fff; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 0.8rem;">Ver recorrido</button>
                </div>
            `);

            polyline.on('click', () => {
                seleccionarRuta(ruta.id);
            });

            AppState.capaRutasTodas.addLayer(polyline);
        }
    });

    AppState.mapa.setView(CENTRO_PASTO, ZOOM_INICIAL);
}

/**
 * Selecciona una ruta específica, dibuja su trazado, marcadores y abre la ficha
 * @param {string} rutaId Código de la ruta (ej. 'C10')
 * @param {string} sentido 'IDA' | 'RETORNO'
 * @param {Object} [destinoLugar] Lugar de destino opcional con coordenadas {nombre, lat, lng, direccion}
 */
function seleccionarRuta(rutaId, sentido = 'IDA', destinoLugar = null) {
    const ruta = AppState.rutas.find(r => r.id === rutaId);
    if (!ruta || !AppState.mapa) return;

    AppState.rutaSeleccionada = ruta;
    AppState.sentidoActivo = sentido;

    limpiarCapasMapa();

    // Dibujar el recorrido del sentido activo
    mostrarRutaEnMapa(ruta, sentido);

    // Dibujar las paradas correspondientes
    mostrarParadas(ruta, sentido);

    // Actualizar la ficha de información
    mostrarFichaRuta(ruta, sentido);

    // Si se seleccionó desde un lugar de destino (ej. Instituto Mutis, Farma Center, etc.)
    if (destinoLugar && destinoLugar.lat && destinoLugar.lng) {
        const poiIcon = L.divIcon({
            className: 'leaflet-poi-icon',
            html: `
                <div class="custom-poi-marker" title="${destinoLugar.nombre}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
            `,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -19]
        });

        const poiMarker = L.marker([destinoLugar.lat, destinoLugar.lng], { icon: poiIcon });
        poiMarker.bindPopup(`
            <div style="font-family: var(--font-family); min-width: 190px; text-align: center; line-height: 1.4;">
                <div style="font-size: 0.72rem; color: #E11D48; font-weight: 800; text-transform: uppercase;">Destino Buscado</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin: 4px 0;">${destinoLugar.nombre}</div>
                ${destinoLugar.direccion ? `<div style="font-size: 0.75rem; color: #64748B; margin-bottom: 6px;">📍 ${destinoLugar.direccion}</div>` : ''}
                <div style="font-size: 0.75rem; background: #FFF1F2; color: #E11D48; padding: 4px 8px; border-radius: 4px; font-weight: 700;">
                    Ruta ${ruta.id} (${sentido})
                </div>
            </div>
        `);

        AppState.capaLugares.addLayer(poiMarker);

        // Centrar y enfocar directamente en el lugar buscado con zoom detallado
        setTimeout(() => {
            AppState.mapa.setView([destinoLugar.lat, destinoLugar.lng], 16, { animate: true });
            poiMarker.openPopup();
        }, 250);
    }

    // Llevar la vista inmediatamente al mapa interactivo
    const mapBox = document.getElementById('mapSection');
    if (mapBox) {
        mapBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Mostrar el panel de detalles
    const panel = document.getElementById('routePanel');
    if (panel) {
        panel.style.display = 'block';
    }
}

/**
 * Dibuja la polilínea de la ruta para el sentido dado y ajusta el zoom
 */
function mostrarRutaEnMapa(ruta, sentido) {
    const coords = (sentido === 'IDA' ? ruta.coordenadasIda : ruta.coordenadasRetorno) || [];
    if (!coords || coords.length === 0) return;

    const color = COLORES_RUTAS[ruta.id] || '#FF6B00';

    const polyline = L.polyline(coords, {
        color: color,
        weight: 6,
        opacity: 0.9,
        lineJoin: 'round'
    });

    AppState.capaRutaActiva.addLayer(polyline);
    AppState.mapa.fitBounds(polyline.getBounds(), { padding: [30, 30] });
}

/**
 * Dibuja los marcadores de paradas para la ruta y sentido seleccionados
 */
function mostrarParadas(ruta, sentido) {
    AppState.capaParadas.clearLayers();
    AppState.marcadoresParadasMap.clear();

    const paradas = (sentido === 'IDA' ? ruta.paradasIda : ruta.paradasRetorno) || [];
    const color = COLORES_RUTAS[ruta.id] || '#FF6B00';
    const origenActual = sentido === 'IDA' ? ruta.origen : ruta.destino;
    const destinoActual = sentido === 'IDA' ? ruta.destino : ruta.origen;

    paradas.forEach((p, index) => {
        if (p.lat && p.lng) {
            const isFirst = index === 0;
            const isLast = index === paradas.length - 1;
            
            let extraClass = '';
            if (isFirst) extraClass = 'first';
            else if (isLast) extraClass = 'last';

            const icon = L.divIcon({
                className: 'leaflet-data-marker',
                html: `<div class="custom-stop-marker ${extraClass}" style="border-color: ${color};">${index + 1}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            const marker = L.marker([p.lat, p.lng], { icon: icon });

            const popupContent = `
                <div style="font-family: var(--font-family); min-width: 170px; line-height: 1.4;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                        <span style="background: ${color}; color: #fff; font-weight: 800; font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;">${ruta.id}</span>
                        <span style="font-size: 0.72rem; color: #64748B; font-weight: 700;">Parada #${index + 1}</span>
                    </div>
                    <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A; margin: 4px 0;">${p.nombre}</div>
                    <div style="font-size: 0.75rem; color: #64748B;"><strong>Sentido:</strong> ${origenActual} → ${destinoActual}</div>
                    ${p.id ? `<div style="font-size: 0.7rem; color: #94A3B8; margin-top: 4px;">Código: ${p.id}</div>` : ''}
                </div>
            `;

            marker.bindPopup(popupContent);
            AppState.capaParadas.addLayer(marker);
            AppState.marcadoresParadasMap.set(index, marker);
        }
    });

    renderizarParadasLista(paradas, ruta, sentido);
}

/**
 * Renderiza el listado desplazable de paradas debajo de la ficha de ruta
 */
function renderizarParadasLista(paradas, ruta, sentido) {
    const contenedor = document.getElementById('stopsListScroll');
    const contador = document.getElementById('stopsCounter');
    
    if (!contenedor) return;

    if (contador) {
        contador.textContent = `${paradas.length} paradas`;
    }

    contenedor.innerHTML = '';

    if (paradas.length === 0) {
        contenedor.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--color-text-muted);">No hay paradas registradas para este sentido.</div>';
        return;
    }

    paradas.forEach((p, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'stop-item-btn';
        btn.innerHTML = `
            <span class="stop-num">${index + 1}</span>
            <span class="stop-name">${p.nombre}</span>
            <span class="stop-action-icon">🔍 Ver</span>
        `;

        btn.addEventListener('click', () => {
            if (p.lat && p.lng) {
                AppState.mapa.setView([p.lat, p.lng], 16, { animate: true });
                const marker = AppState.marcadoresParadasMap.get(index);
                if (marker) {
                    marker.openPopup();
                }
            } else {
                mostrarToast(`La parada "${p.nombre}" no cuenta con coordenadas verificadas.`);
            }
        });

        contenedor.appendChild(btn);
    });
}

/**
 * Muestra la ficha de detalles de la ruta seleccionada
 */
function mostrarFichaRuta(ruta, sentido) {
    const badge = document.getElementById('panelRouteCode');
    const typeTag = document.getElementById('panelRouteType');
    const trajOrigen = document.getElementById('panelTrajOrigen');
    const trajDestino = document.getElementById('panelTrajDestino');
    const summary = document.getElementById('directionSummary');

    const infoHorario = document.getElementById('infoHorario');
    const infoFrecuencia = document.getElementById('infoFrecuencia');
    const infoTarifa = document.getElementById('infoTarifa');
    const infoParadas = document.getElementById('infoParadas');

    const origenActual = sentido === 'IDA' ? ruta.origen : ruta.destino;
    const destinoActual = sentido === 'IDA' ? ruta.destino : ruta.origen;

    if (badge) badge.textContent = ruta.id;
    if (typeTag) typeTag.textContent = ruta.tipo;
    if (trajOrigen) trajOrigen.textContent = origenActual;
    if (trajDestino) trajDestino.textContent = destinoActual;
    if (summary) summary.textContent = `${origenActual} → ${destinoActual}`;

    // Horario del sentido
    let horarioTexto = ruta.horarios ? ruta.horarios.lunesViernes : '05:50 - 20:00';
    if (infoHorario) infoHorario.textContent = horarioTexto;
    if (infoFrecuencia) infoFrecuencia.textContent = ruta.frecuencia || '8 - 12 min';
    if (infoTarifa) infoTarifa.textContent = ruta.tarifa || '$2.700 COP';

    const countParadas = (sentido === 'IDA' ? ruta.paradasIda : ruta.paradasRetorno).length;
    const totalParadas = (ruta.paradasIda.length + ruta.paradasRetorno.length);
    if (infoParadas) infoParadas.textContent = `${countParadas} en este sentido (${totalParadas} total)`;

    // Actualizar botones de sentido
    const btnIda = document.getElementById('btnSentidoIda');
    const btnRetorno = document.getElementById('btnSentidoRetorno');
    if (btnIda && btnRetorno) {
        btnIda.classList.toggle('active', sentido === 'IDA');
        btnRetorno.classList.toggle('active', sentido === 'RETORNO');
    }
}

/**
 * Alterna el sentido entre IDA y RETORNO
 */
function mostrarSentido(nuevoSentido) {
    if (!AppState.rutaSeleccionada) return;
    seleccionarRuta(AppState.rutaSeleccionada.id, nuevoSentido);
}

/**
 * Limpia las capas del mapa
 */
function limpiarCapasMapa() {
    if (AppState.capaRutasTodas) AppState.capaRutasTodas.clearLayers();
    if (AppState.capaRutaActiva) AppState.capaRutaActiva.clearLayers();
    if (AppState.capaParadas) AppState.capaParadas.clearLayers();
    if (AppState.capaLugares) AppState.capaLugares.clearLayers();
    AppState.marcadoresParadasMap.clear();
}

/* ==========================================================================
   CATÁLOGO GENERAL DE TARJETAS (TODAS LAS RUTAS)
   ========================================================================== */

/**
 * Renderiza las tarjetas de todas las rutas agrupadas por tipo
 */
function renderizarTarjetas() {
    const gridComplementarias = document.getElementById('gridComplementarias');
    const gridEstrategicas = document.getElementById('gridEstrategicas');

    if (!gridComplementarias || !gridEstrategicas) return;

    gridComplementarias.innerHTML = '';
    gridEstrategicas.innerHTML = '';

    AppState.rutas.forEach((ruta) => {
        const card = document.createElement('div');
        const tipoClase = ruta.tipo === 'Estratégica' ? 'tipo-estrategica' : 'tipo-complementaria';
        card.className = `route-card ${tipoClase}`;
        
        const totalParadas = (ruta.paradasIda ? ruta.paradasIda.length : 0);
        const horarioLv = ruta.horarios ? ruta.horarios.lunesViernes : '05:50 - 20:00';

        card.innerHTML = `
            <div class="route-card-top">
                <span class="card-code">${ruta.id}</span>
                <span class="card-type">${ruta.tipo}</span>
            </div>
            <div class="card-path">${ruta.origen} ↔ ${ruta.destino}</div>
            <div class="card-meta">
                <span class="meta-item">🚏 ${totalParadas} paradas (Ida)</span>
                <span class="meta-item">🕒 ${horarioLv}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            seleccionarRuta(ruta.id, 'IDA');
            const mapBox = document.getElementById('mapSection');
            if (mapBox) mapBox.scrollIntoView({ behavior: 'smooth' });
        });

        if (ruta.tipo === 'Estratégica') {
            gridEstrategicas.appendChild(card);
        } else {
            gridComplementarias.appendChild(card);
        }
    });
}

/* ==========================================================================
   BUSCADOR INTELIGENTE
   ========================================================================== */

/**
 * Normaliza un texto removiendo acentos, tildes, signos y mayúsculas
 */
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Realiza la búsqueda de rutas por nombre, código, paradas, lugares y barrios
 */
/**
 * Calcula la distancia en metros entre dos puntos geográficos (Fórmula de Haversine)
 */
function calcularDistanciaMetros(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Realiza la búsqueda inteligente de rutas por nombre, código, paradas,
 * lugares populares, colegios, clínicas, comercios de Google Maps y barrios de Pasto
 */
function buscarRutas(query) {
    const qNorm = normalizarTexto(query);
    const panel = document.getElementById('searchResultsPanel');
    const grid = document.getElementById('resultsGrid');
    const countLabel = document.getElementById('searchResultsCount');

    if (!panel || !grid) return;

    if (!qNorm || qNorm.length < 2) {
        panel.style.display = 'none';
        return;
    }

    const coincidencias = [];

    // 1. Búsqueda en el Directorio Extenso de Lugares Populares de Pasto (LUGARES_PASTO)
    let lugaresEncontrados = [];
    if (typeof LUGARES_PASTO !== 'undefined' && Array.isArray(LUGARES_PASTO)) {
        lugaresEncontrados = LUGARES_PASTO.filter(lugar => {
            const nombreNorm = normalizarTexto(lugar.nombre);
            const dirNorm = normalizarTexto(lugar.direccion);
            const catNorm = normalizarTexto(lugar.categoria);
            const paradaNorm = normalizarTexto(lugar.paradaCercana);
            const aliasMatch = (lugar.alias || []).some(al => {
                const alNorm = normalizarTexto(al);
                return alNorm.includes(qNorm) || qNorm.includes(alNorm);
            });

            return nombreNorm.includes(qNorm) || dirNorm.includes(qNorm) || catNorm.includes(qNorm) || paradaNorm.includes(qNorm) || aliasMatch;
        });
    }

    // Si encontramos lugares registrados (ej. Instituto Mutis, Farma Center, Alkosto, etc.)
    if (lugaresEncontrados.length > 0) {
        lugaresEncontrados.forEach(lugar => {
            (lugar.rutas || []).forEach(rutaId => {
                const ruta = AppState.rutas.find(r => r.id === rutaId);
                if (ruta && !coincidencias.some(c => c.ruta.id === ruta.id)) {
                    coincidencias.push({
                        ruta,
                        razon: `📍 Cerca de: ${lugar.nombre}`,
                        paradaInfo: `🚏 Parada sugerida: ${lugar.paradaCercana}`,
                        lugarRef: lugar
                    });
                }
            });
        });
    }

    // 2. Búsqueda directa en Rutas Oficiales (Código, Origen, Destino, Paradas)
    AppState.rutas.forEach((ruta) => {
        if (coincidencias.some(c => c.ruta.id === ruta.id)) return;

        let razon = null;
        let paradaInfo = null;

        // A. Código directo (ej. "C10", "E1")
        if (normalizarTexto(ruta.id) === qNorm || normalizarTexto(ruta.id).includes(qNorm)) {
            razon = `Ruta oficial ${ruta.id}`;
        }
        // B. Origen o Destino
        else if (normalizarTexto(ruta.origen).includes(qNorm)) {
            razon = `Origen: ${ruta.origen}`;
        } else if (normalizarTexto(ruta.destino).includes(qNorm)) {
            razon = `Destino: ${ruta.destino}`;
        }
        // C. Coincidencia por Paradas (Ida y Retorno)
        else {
            const paradaIda = (ruta.paradasIda || []).find(p => normalizarTexto(p.nombre).includes(qNorm));
            if (paradaIda) {
                razon = `Parada ida: ${paradaIda.nombre}`;
                paradaInfo = `🚏 En sentido hacia ${ruta.destino}`;
            } else {
                const paradaRet = (ruta.paradasRetorno || []).find(p => normalizarTexto(p.nombre).includes(qNorm));
                if (paradaRet) {
                    razon = `Parada retorno: ${paradaRet.nombre}`;
                    paradaInfo = `🚏 En sentido hacia ${ruta.origen}`;
                }
            }
        }

        // D. Sinónimos adicionales y calles/carreras frecuentes
        if (!razon) {
            if (qNorm.includes('centro') || qNorm.includes('plaza de narino') || qNorm.includes('parque narino')) {
                const tieneCentro = (ruta.paradasIda || []).concat(ruta.paradasRetorno || [])
                    .some(p => normalizarTexto(p.nombre).match(/centro|plaza|carnaval|alcaldia|bombona|san juan bosco|san agustin/));
                if (tieneCentro) {
                    razon = 'Conecta con el Centro de Pasto';
                }
            } else if (qNorm.includes('udenar') || qNorm.includes('universidad de narino')) {
                const tieneUdenar = (ruta.paradasIda || []).concat(ruta.paradasRetorno || [])
                    .some(p => normalizarTexto(p.nombre).match(/udenar|universidad de narino|torobajo/));
                if (tieneUdenar) {
                    razon = 'Pasa por Universidad de Nariño (UDENAR)';
                }
            } else if (qNorm.includes('cesmag')) {
                const tieneCesmag = (ruta.paradasIda || []).concat(ruta.paradasRetorno || [])
                    .some(p => normalizarTexto(p.nombre).match(/cesmag|carrera 20|calle 16|centro/));
                if (tieneCesmag) {
                    razon = 'Sector Universitario CESMAG';
                }
            } else if (qNorm.includes('terminal')) {
                const tieneTerminal = (ruta.paradasIda || []).concat(ruta.paradasRetorno || [])
                    .some(p => normalizarTexto(p.nombre).match(/terminal/));
                if (tieneTerminal) {
                    razon = 'Pasa por la Terminal de Transportes';
                }
            }
        }

        if (razon) {
            coincidencias.push({ ruta, razon, paradaInfo });
        }
    });

    grid.innerHTML = '';

    if (coincidencias.length === 0) {
        if (countLabel) countLabel.textContent = '0 resultados';
        grid.innerHTML = `
            <div style="padding: 1.25rem; color: var(--color-text-muted); grid-column: 1/-1; text-align: center; background: var(--color-surface); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
                <p style="font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text);">No se encontraron rutas para "${query}"</p>
                <p style="font-size: 0.85rem; line-height: 1.5;">Puedes buscar por colegios (ej. <em>Mutis, San Felipe, Javeriano</em>), droguerías (ej. <em>Farma Center</em>), clínicas (ej. <em>Fátima, San Pedro</em>), centros comerciales (ej. <em>Unicentro, Alkosto</em>) o barrios y paradas.</p>
            </div>
        `;
        panel.style.display = 'block';
        return;
    }

    if (countLabel) {
        countLabel.textContent = `${coincidencias.length} ruta${coincidencias.length > 1 ? 's' : ''} encontrada${coincidencias.length > 1 ? 's' : ''}`;
    }

    coincidencias.forEach(({ ruta, razon, paradaInfo, lugarRef }) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 900; font-size: 1.15rem; color: var(--color-accent);">${ruta.id}</span>
                <span style="font-size: 0.72rem; color: var(--color-text-muted); font-weight: 700;">${ruta.tipo}</span>
            </div>
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${ruta.origen} → ${ruta.destino}</div>
            <div class="result-badge">${razon}</div>
            ${paradaInfo ? `<div class="result-badge-stop">${paradaInfo}</div>` : ''}
            <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.2rem;">
                ${(ruta.paradasIda ? ruta.paradasIda.length : 0) + (ruta.paradasRetorno ? ruta.paradasRetorno.length : 0)} paradas registradas
            </div>
        `;

        card.addEventListener('click', () => {
            panel.style.display = 'none';
            seleccionarRuta(ruta.id, 'IDA', lugarRef);
        });

        grid.appendChild(card);
    });

    panel.style.display = 'block';
}

/**
 * Busca y presenta las rutas cuyas paradas están a menos de 750 metros de la ubicación del usuario
 */
function buscarRutasCercaDeMi() {
    if (!navigator.geolocation) {
        mostrarToast('Tu navegador no soporta geolocalización.');
        return;
    }

    mostrarToast('📍 Localizando tu posición en Pasto...');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const MAX_DISTANCIA = 700; // 700 metros a la redonda

            // Centrar mapa y colocar marcador de usuario
            dibujarMarcadorUsuario(latitude, longitude, accuracy);

            const rutasCercanas = [];

            AppState.rutas.forEach(ruta => {
                let mejorParada = null;
                let minDist = Infinity;
                let mejorSentido = 'IDA';

                (ruta.paradasIda || []).forEach(p => {
                    if (p.lat && p.lng) {
                        const d = calcularDistanciaMetros(latitude, longitude, p.lat, p.lng);
                        if (d < minDist) {
                            minDist = d;
                            mejorParada = p;
                            mejorSentido = 'IDA';
                        }
                    }
                });

                (ruta.paradasRetorno || []).forEach(p => {
                    if (p.lat && p.lng) {
                        const d = calcularDistanciaMetros(latitude, longitude, p.lat, p.lng);
                        if (d < minDist) {
                            minDist = d;
                            mejorParada = p;
                            mejorSentido = 'RETORNO';
                        }
                    }
                });

                if (mejorParada && minDist <= MAX_DISTANCIA) {
                    rutasCercanas.push({
                        ruta,
                        parada: mejorParada,
                        distancia: Math.round(minDist),
                        sentido: mejorSentido
                    });
                }
            });

            // Ordenar de la más cercana a la más lejana
            rutasCercanas.sort((a, b) => a.distancia - b.distancia);

            const panel = document.getElementById('searchResultsPanel');
            const grid = document.getElementById('resultsGrid');
            const countLabel = document.getElementById('searchResultsCount');

            if (!panel || !grid) return;

            grid.innerHTML = '';

            if (rutasCercanas.length === 0) {
                if (countLabel) countLabel.textContent = '0 rutas cercanas';
                grid.innerHTML = `
                    <div style="padding: 1.25rem; color: var(--color-text-muted); grid-column: 1/-1; text-align: center;">
                        <p style="font-weight: 700; margin-bottom: 0.4rem; color: var(--color-text);">No encontramos paradas de bus a menos de 700m de tu posición actual.</p>
                        <p style="font-size: 0.85rem;">Si estás fuera del perímetro urbano de San Juan de Pasto, puedes usar el buscador para consultar cualquier barrio o destino.</p>
                    </div>
                `;
                panel.style.display = 'block';
                return;
            }

            if (countLabel) {
                countLabel.textContent = `${rutasCercanas.length} rutas a menos de 700m`;
            }

            rutasCercanas.forEach(({ ruta, parada, distancia, sentido }) => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 900; font-size: 1.15rem; color: var(--color-accent);">${ruta.id}</span>
                        <span style="font-size: 0.72rem; color: #16A34A; font-weight: 800; background: #DCFCE7; padding: 0.15rem 0.45rem; border-radius: 4px;">A ${distancia} m</span>
                    </div>
                    <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${ruta.origen} → ${ruta.destino}</div>
                    <div class="result-badge-stop">🚏 Parada más cercana: <strong>${parada.nombre}</strong> (${sentido})</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Toca para abrir el trazado y ver la parada</div>
                `;

                card.addEventListener('click', () => {
                    panel.style.display = 'none';
                    seleccionarRuta(ruta.id, sentido);

                    if (AppState.mapa && parada.lat && parada.lng) {
                        setTimeout(() => {
                            AppState.mapa.setView([parada.lat, parada.lng], 16, { animate: true });
                        }, 350);
                    }

                    const mapBox = document.getElementById('mapSection');
                    if (mapBox) mapBox.scrollIntoView({ behavior: 'smooth' });
                });

                grid.appendChild(card);
            });

            panel.style.display = 'block';
            mostrarToast(`✓ Encontradas ${rutasCercanas.length} rutas cerca de ti.`);
        },
        (error) => {
            console.warn('Error GPS:', error.message);
            mostrarToast('No se pudo acceder a tu ubicación. Verifica los permisos de GPS.');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        }
    );
}

/**
 * Coloca o actualiza el marcador y círculo de precisión del usuario en Leaflet
 */
function dibujarMarcadorUsuario(latitude, longitude, accuracy) {
    if (!AppState.mapa) return;

    if (AppState.marcadorUsuario) {
        AppState.mapa.removeLayer(AppState.marcadorUsuario);
    }
    if (AppState.circuloUsuario) {
        AppState.mapa.removeLayer(AppState.circuloUsuario);
    }

    const userIcon = L.divIcon({
        className: 'leaflet-user-icon',
        html: '<div class="user-location-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    AppState.marcadorUsuario = L.marker([latitude, longitude], { icon: userIcon });
    AppState.circuloUsuario = L.circle([latitude, longitude], {
        radius: accuracy || 40,
        color: '#0284C7',
        fillColor: '#0284C7',
        fillOpacity: 0.15,
        weight: 1
    });

    AppState.marcadorUsuario.bindPopup(`
        <div style="font-family: var(--font-family); text-align: center;">
            <strong>Tu ubicación actual</strong><br>
            <span style="font-size: 0.75rem; color: #64748B;">Precisión: ±${Math.round(accuracy)}m</span>
        </div>
    `).openPopup();

    AppState.marcadorUsuario.addTo(AppState.mapa);
    AppState.circuloUsuario.addTo(AppState.mapa);

    AppState.mapa.setView([latitude, longitude], 15, { animate: true });
}

/* ==========================================================================
   MI UBICACIÓN (GEOLOCALIZACIÓN)
   ========================================================================== */

/**
 * Obtiene y visualiza la posición GPS del usuario en el mapa
 */
function centrarEnUbicacion() {
    if (!navigator.geolocation) {
        mostrarToast('Tu navegador no soporta geolocalización.');
        return;
    }

    mostrarToast('Obteniendo tu ubicación actual...');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            dibujarMarcadorUsuario(latitude, longitude, accuracy);
            mostrarToast('✓ Ubicación obtenida.');
        },
        (error) => {
            console.warn('Error de geolocalización:', error.message);
            mostrarToast('No fue posible obtener tu ubicación.');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        }
    );
}

/* ==========================================================================
   TEMA CLARO / OSCURO (CSS CUSTOM PROPERTIES)
   ========================================================================== */

/**
 * Inicializa la preferencia de tema desde localStorage o sistema
 */
function inicializarTema() {
    const temaGuardado = localStorage.getItem('rutas_pasto_theme');
    if (temaGuardado === 'dark' || (!temaGuardado && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        actualizarIconoTema(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        actualizarIconoTema(false);
    }
}

/**
 * Alterna entre modo claro y oscuro
 */
function activarModoOscuro() {
    const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
    const nuevoTema = esOscuro ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('rutas_pasto_theme', nuevoTema);
    actualizarIconoTema(!esOscuro);
}

function actualizarIconoTema(esOscuro) {
    const iconSpan = document.getElementById('themeIcon');
    if (iconSpan) {
        iconSpan.innerHTML = esOscuro 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
}

/* ==========================================================================
   PWA SERVICE WORKER E INSTALACIÓN
   ========================================================================== */

/**
 * Registra el Service Worker
 */
function registrarPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then((reg) => {
                    console.log('✓ Service Worker registrado con éxito');
                })
                .catch((err) => {
                    console.warn('Error al registrar Service Worker:', err);
                });
        });
    }

    // Capturar evento de instalación
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        AppState.deferredPrompt = e;
        const btnInstall = document.getElementById('btnInstallApp');
        if (btnInstall) {
            btnInstall.style.display = 'inline-flex';
        }
    });

    const btnInstall = document.getElementById('btnInstallApp');
    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (AppState.deferredPrompt) {
                AppState.deferredPrompt.prompt();
                const { outcome } = await AppState.deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    btnInstall.style.display = 'none';
                }
                AppState.deferredPrompt = null;
            }
        });
    }
}

/**
 * Escucha cambios de conectividad online/offline
 */
function actualizarEstadoConexion() {
    const badge = document.getElementById('connectionStatus');
    const banner = document.getElementById('offlineBanner');

    function check() {
        const online = navigator.onLine;
        AppState.isOnline = online;

        if (badge) {
            badge.classList.toggle('offline', !online);
            badge.innerHTML = online 
                ? '<span class="status-dot"></span> Online'
                : '<span class="status-dot"></span> Offline';
        }

        if (banner) {
            banner.style.display = online ? 'none' : 'flex';
        }
    }

    window.addEventListener('online', check);
    window.addEventListener('offline', check);
    check();
}

/* ==========================================================================
   EVENTOS DE LA INTERFAZ
   ========================================================================== */

function inicializarEventos() {
    // Buscador
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (searchClear) searchClear.style.display = val.length > 0 ? 'flex' : 'none';
            buscarRutas(val);
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            searchClear.style.display = 'none';
            buscarRutas('');
        });
    }

    // Botón especial: Rutas Cerca de Mí
    const btnCercaDeMi = document.getElementById('btnRutasCercaDeMi');
    if (btnCercaDeMi) {
        btnCercaDeMi.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (searchClear) searchClear.style.display = 'none';
            buscarRutasCercaDeMi();
        });
    }

    // Botones de sugerencias rápidas
    const tagBtns = document.querySelectorAll('.tag-btn[data-query]');
    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            if (!query) return;
            if (searchInput) {
                searchInput.value = query;
                if (searchClear) searchClear.style.display = 'flex';
            }
            buscarRutas(query);
        });
    });

    // Modo oscuro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', activarModoOscuro);
    }

    // Mi ubicación
    const btnLocation = document.getElementById('btnLocation');
    if (btnLocation) {
        btnLocation.addEventListener('click', centrarEnUbicacion);
    }

    // Ver todas las rutas
    const btnShowAll = document.getElementById('btnShowAll');
    if (btnShowAll) {
        btnShowAll.addEventListener('click', mostrarTodasLasRutas);
    }

    // Sentidos de recorrido
    const btnIda = document.getElementById('btnSentidoIda');
    const btnRetorno = document.getElementById('btnSentidoRetorno');
    if (btnIda) btnIda.addEventListener('click', () => mostrarSentido('IDA'));
    if (btnRetorno) btnRetorno.addEventListener('click', () => mostrarSentido('RETORNO'));

    // Cerrar panel de ruta
    const btnClose = document.getElementById('btnClosePanel');
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            mostrarTodasLasRutas();
        });
    }

    // Filtros del catálogo
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tipo = tab.getAttribute('data-filter');
            filtrarCatalogo(tipo);
        });
    });
}

/**
 * Filtra las tarjetas mostradas en el catálogo
 */
function filtrarCatalogo(tipo) {
    const secComp = document.getElementById('groupComplementarias');
    const secEst = document.getElementById('groupEstrategicas');

    if (!secComp || !secEst) return;

    if (tipo === 'TODAS') {
        secComp.style.display = 'block';
        secEst.style.display = 'block';
    } else if (tipo === 'COMPLEMENTARIA') {
        secComp.style.display = 'block';
        secEst.style.display = 'none';
    } else if (tipo === 'ESTRATEGICA') {
        secComp.style.display = 'none';
        secEst.style.display = 'block';
    }
}

/**
 * Notificación Toast no intrusiva
 */
function mostrarToast(mensaje) {
    let toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
