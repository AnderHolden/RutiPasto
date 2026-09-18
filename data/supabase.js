/**
 * Conector oficial de Supabase para Rutas Pasto
 * Gestiona alertas comunitarias, desvíos y reportes viales en tiempo real.
 * Funciona bajo arquitectura Offline-First: si no hay conexión a internet,
 * no bloquea la aplicación y carga las últimas alertas almacenadas localmente.
 */

const SupabaseConfig = {
    url: 'https://dvefvwfhikzifujxilev.supabase.co',
    anonKey: 'sb_publishable_OEoAePymn2H8-kJpOS9m2w_fuQ8U_RG'
};

const SupabaseService = {
    // Almacén en memoria de alertas activas
    alertasActivas: [],
    listeners: [],
    pollingInterval: null,

    /**
     * Inicializa el servicio de alertas
     */
    async iniciar() {
        // 1. Cargar caché offline de alertas si existe
        this.cargarAlertasLocales();

        // 2. Si estamos online, descargar las últimas alertas desde Supabase
        if (navigator.onLine) {
            await this.obtenerAlertas();
        }

        // 3. Monitorear cambios de conectividad
        window.addEventListener('online', () => {
            this.obtenerAlertas();
            this.iniciarSondeo();
        });

        window.addEventListener('offline', () => {
            this.detenerSondeo();
        });

        // 4. Iniciar sondeo periódico cada 45 segundos cuando esté online
        if (navigator.onLine) {
            this.iniciarSondeo();
        }
    },

    iniciarSondeo() {
        if (this.pollingInterval) clearInterval(this.pollingInterval);
        this.pollingInterval = setInterval(() => {
            if (navigator.onLine) this.obtenerAlertas();
        }, 45000);
    },

    detenerSondeo() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    },

    /**
     * Consulta las alertas activas y no expiradas vía REST
     */
    async obtenerAlertas() {
        try {
            const url = `${SupabaseConfig.url}/rest/v1/alertas?select=*&activo=eq.true&order=creado_en.desc&limit=30`;
            const response = await fetch(url, {
                headers: {
                    'apikey': SupabaseConfig.anonKey,
                    'Authorization': `Bearer ${SupabaseConfig.anonKey}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Filtrar solo las que no hayan expirado
                const ahora = new Date();
                this.alertasActivas = data.filter(a => new Date(a.expira_en) > ahora);

                // Guardar en almacenamiento local para acceso 100% offline
                localStorage.setItem('rutas_pasto_alertas_cache', JSON.stringify(this.alertasActivas));
                
                this.notificarCambios();
            }
        } catch (e) {
            console.warn('[Supabase] Error al consultar alertas:', e.message);
        }
    },

    /**
     * Carga las alertas desde el almacenamiento local
     */
    cargarAlertasLocales() {
        try {
            const guardado = localStorage.getItem('rutas_pasto_alertas_cache');
            if (guardado) {
                const parseado = JSON.parse(guardado);
                const ahora = new Date();
                this.alertasActivas = parseado.filter(a => new Date(a.expira_en) > ahora);
                this.notificarCambios();
            }
        } catch (e) {
            console.warn('[Supabase] Error al leer caché local de alertas:', e);
        }
    },

    /**
     * Publica un nuevo reporte ciudadano en Supabase
     * @param {Object} reporte { tipo, titulo, descripcion, ruta_afectada, lat, lng }
     */
    async crearAlerta(reporte) {
        if (!navigator.onLine) {
            throw new Error('Necesitas conexión a internet para publicar un reporte en tiempo real.');
        }

        const url = `${SupabaseConfig.url}/rest/v1/alertas`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SupabaseConfig.anonKey,
                'Authorization': `Bearer ${SupabaseConfig.anonKey}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                tipo: reporte.tipo,
                titulo: reporte.titulo,
                descripcion: reporte.descripcion || '',
                ruta_afectada: reporte.ruta_afectada || null,
                lat: reporte.lat,
                lng: reporte.lng
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`No se pudo enviar el reporte: ${err}`);
        }

        const nueva = await response.json();
        if (nueva && nueva.length > 0) {
            this.alertasActivas.unshift(nueva[0]);
            this.notificarCambios();
        }

        return nueva;
    },

    /**
     * Registra un observador para cuando cambien las alertas
     */
    suscribir(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
            callback(this.alertasActivas);
        }
    },

    notificarCambios() {
        this.listeners.forEach(cb => {
            try { cb(this.alertasActivas); } catch(e) { console.error(e); }
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SupabaseService, SupabaseConfig };
}
