/**
 * Directorio Extenso de Puntos de Interés (POIs), Lugares Populares,
 * Comercios, Instituciones, Colegios, Universidades y Vías de San Juan de Pasto.
 * 
 * Permite que los usuarios busquen de la misma forma que lo hacen en Google Maps
 * o en el lenguaje cotidiano pastuso (ej. "Instituto Mutis", "Gran Colombiano", 
 * "Rumipamba", "Farma Center", "Clínica Fátima", "Alkosto", etc.) y encuentren
 * de inmediato qué rutas del SETPasto pasan por allí y en qué parada bajarse/subirse.
 */

const LUGARES_PASTO = [
    // ==========================================
    // 1. INSTITUCIONES EDUCATIVAS Y COLEGIOS
    // ==========================================
    {
        id: "poi-mutis",
        nombre: "Instituto José Celestino Mutis / Gran Colombiano",
        alias: ["instituto mutis", "colegio mutis", "mutis", "gran colombiano", "grancolombiano", "instituto gran colombiano", "rumipamba", "plazoleta rumipamba"],
        categoria: "Colegio / Instituto",
        direccion: "Carrera 26 con Calle 16, Sector Rumipamba",
        lat: 1.2132,
        lng: -77.2798,
        paradaCercana: "Carrera 26 Calle 16 / Plazoleta Rumipamba / Templo San Agustín",
        rutas: ["C1", "C7", "C9", "C10", "C11", "C15", "E1", "E2"]
    },
    {
        id: "poi-san-felipe",
        nombre: "Colegio San Felipe Neri",
        alias: ["san felipe", "colegio san felipe", "san felipe neri", "parroquia san felipe"],
        categoria: "Colegio",
        direccion: "Calle 11 Este / Mijitayo",
        lat: 1.2052,
        lng: -77.2925,
        paradaCercana: "Colegio San Felipe / Mijitayo",
        rutas: ["C1", "C6", "C7", "C15"]
    },
    {
        id: "poi-javeriano",
        nombre: "Colegio San Francisco Javier (Javeriano)",
        alias: ["javeriano", "colegio javeriano", "javeriano centro", "san francisco javier"],
        categoria: "Colegio",
        direccion: "Calle 21 con Carrera 22",
        lat: 1.2175,
        lng: -77.2755,
        paradaCercana: "Javeriano Calle 21 / Carrera 22",
        rutas: ["C1", "C2", "C3", "C5", "C7", "C10", "E1", "E2"]
    },
    {
        id: "poi-champagnat",
        nombre: "Colegio Champagnat",
        alias: ["champagnat", "colegio champagnat", "maristas"],
        categoria: "Colegio",
        direccion: "Carrera 32 Calle 17, Sector Palermo / Champagnat",
        lat: 1.2178,
        lng: -77.2885,
        paradaCercana: "Calle 18 Carrera 32 / Champagnat",
        rutas: ["C1", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-inem",
        nombre: "INEM Pasto (Institución Educativa INEM)",
        alias: ["inem", "colegio inem", "inem pasto"],
        categoria: "Colegio",
        direccion: "Avenida Panamericana Norte, Sector Mijitayo / Torobajo",
        lat: 1.2265,
        lng: -77.2920,
        paradaCercana: "Avenida Panamericana / INEM",
        rutas: ["C2", "C5", "C9", "E1", "E2"]
    },
    {
        id: "poi-itsim",
        nombre: "ITSIM (Instituto Técnico Industrial)",
        alias: ["itsim", "instituto tecnico industrial", "tecnico industrial"],
        categoria: "Colegio",
        direccion: "Calle 18 con Carrera 36, Torobajo",
        lat: 1.2285,
        lng: -77.2940,
        paradaCercana: "Calle 18 Torobajo / ITSIM",
        rutas: ["C5", "C9", "E1", "E2"]
    },
    {
        id: "poi-ciudad-pasto",
        nombre: "Institución Educativa Municipal Ciudad de Pasto (CCP)",
        alias: ["ciudad de pasto", "colegio ciudad de pasto", "ccp", "escuela ciudad de pasto"],
        categoria: "Colegio",
        direccion: "Calle 13 Carrera 4, Sector Miraflores / Cantarana",
        lat: 1.1965,
        lng: -77.2715,
        paradaCercana: "Colegio Ciudad de Pasto / Calle 13",
        rutas: ["C1", "C2", "C8", "C14"]
    },
    {
        id: "poi-normal-superior",
        nombre: "Escuela Normal Superior de Pasto",
        alias: ["normal superior", "la normal", "escuela normal", "normal de pasto"],
        categoria: "Colegio",
        direccion: "Avenida Mijitayo / San Ignacio",
        lat: 1.2078,
        lng: -77.2905,
        paradaCercana: "La Aurora / Normal Superior",
        rutas: ["C1", "C6", "C7", "C15"]
    },
    {
        id: "poi-bethlemitas",
        nombre: "Colegio Sagrado Corazón de Jesús (Bethlemitas)",
        alias: ["bethlemitas", "colegio bethlemitas", "sagrado corazon"],
        categoria: "Colegio",
        direccion: "Carrera 26 Calle 20, Centro",
        lat: 1.2162,
        lng: -77.2785,
        paradaCercana: "Calle 20 Carrera 26 / Centro",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-pedagogico",
        nombre: "Liceo Integrado de la Universidad de Nariño (Pedagógico)",
        alias: ["pedagogico", "liceo de la universidad", "liceo udenom", "colegio pedagogico"],
        categoria: "Colegio",
        direccion: "Sede Centro / Carrera 22",
        lat: 1.2135,
        lng: -77.2740,
        paradaCercana: "Carrera 22 Calle 18 / UDENAR Centro",
        rutas: ["C1", "C2", "C10", "C11", "E1"]
    },
    {
        id: "poi-marcos-rosa",
        nombre: "Instituto Técnico Marcos de la Rosa",
        alias: ["marcos de la rosa", "colegio marcos de la rosa", "instituto marcos"],
        categoria: "Colegio",
        direccion: "Carrera 29 Calle 19",
        lat: 1.2155,
        lng: -77.2830,
        paradaCercana: "Marcos de la Rosa / Carrera 29",
        rutas: ["C1", "C9", "C10", "E2"]
    },

    // ==========================================
    // 2. UNIVERSIDADES Y EDUCACIÓN SUPERIOR
    // ==========================================
    {
        id: "poi-udenar-torobajo",
        nombre: "Universidad de Nariño - Sede Torobajo (UDENAR)",
        alias: ["udenar", "universidad de narino", "torobajo", "udenar torobajo", "u de narino", "rectoria udenar"],
        categoria: "Universidad",
        direccion: "Calle 18 con Carrera 50, Torobajo",
        lat: 1.2312,
        lng: -77.2965,
        paradaCercana: "UDENAR Torobajo / Bloque Tecnológico",
        rutas: ["C5", "C9", "E1", "E2", "C12", "E4"]
    },
    {
        id: "poi-udenar-centro",
        nombre: "Universidad de Nariño - Sede Centro",
        alias: ["udenar centro", "u centro", "paraiso udenar", "bellas artes udenar"],
        categoria: "Universidad",
        direccion: "Carrera 22 con Calle 18, Centro",
        lat: 1.2136,
        lng: -77.2742,
        paradaCercana: "Carrera 22 Calle 18 / Plaza del Carnaval",
        rutas: ["C1", "C2", "C7", "C10", "C11", "E1"]
    },
    {
        id: "poi-cesmag",
        nombre: "Universidad CESMAG (Centro de Estudios Superiores María Goretti)",
        alias: ["cesmag", "universidad cesmag", "maria goretti", "u cesmag"],
        categoria: "Universidad",
        direccion: "Carrera 20A con Calle 14, San Felipe",
        lat: 1.2105,
        lng: -77.2750,
        paradaCercana: "CESMAG / Carrera 20A / San Juan Bosco",
        rutas: ["C1", "C2", "C3", "C4", "C7", "C10", "E1", "E3"]
    },
    {
        id: "poi-u-mariana",
        nombre: "Universidad Mariana (UNIMAR)",
        alias: ["universidad mariana", "la mariana", "mariana", "unimar", "u mariana"],
        categoria: "Universidad",
        direccion: "Calle 18 con Carrera 34, Maridíaz",
        lat: 1.2205,
        lng: -77.2895,
        paradaCercana: "Universidad Mariana / Calle 18",
        rutas: ["C1", "C9", "C10", "E1", "E2", "E6"]
    },
    {
        id: "poi-ucc",
        nombre: "Universidad Cooperativa de Colombia (UCC Pasto)",
        alias: ["ucc", "cooperativa", "universidad cooperativa", "ucc pasto"],
        categoria: "Universidad",
        direccion: "Calle 18 con Carrera 47, Torobajo",
        lat: 1.2295,
        lng: -77.2952,
        paradaCercana: "Calle 18 UCC / Torobajo",
        rutas: ["C5", "C9", "E1", "E2"]
    },
    {
        id: "poi-sena",
        nombre: "SENA Pasto (Sede Principal Lope / Centro)",
        alias: ["sena", "sena pasto", "sena lope", "sena agropecuario"],
        categoria: "Instituto Técnico",
        direccion: "Avenida Panamericana Sur, Sector Lope",
        lat: 1.1985,
        lng: -77.2680,
        paradaCercana: "SENA Lope / Avenida Panamericana",
        rutas: ["C1", "C6", "C10", "E5"]
    },
    {
        id: "poi-uan",
        nombre: "Universidad Antonio Nariño (UAN Pasto)",
        alias: ["antonio narino", "universidad antonio narino", "uan"],
        categoria: "Universidad",
        direccion: "Avenida Panamericana Norte",
        lat: 1.2250,
        lng: -77.2880,
        paradaCercana: "Avenida Panamericana / UAN",
        rutas: ["C2", "C5", "C9", "E1"]
    },

    // ==========================================
    // 3. SALUD, HOSPITALES Y CLÍNICAS
    // ==========================================
    {
        id: "poi-hosp-departamental",
        nombre: "Hospital Universitario Departamental de Nariño (HUDN)",
        alias: ["hospital departamental", "departamental", "hudn", "hospital narino"],
        categoria: "Hospital",
        direccion: "Calle 22 con Carrera 7, Sector Maridíaz / Pandiaco",
        lat: 1.2245,
        lng: -77.2835,
        paradaCercana: "Hospital Departamental / Pandiaco",
        rutas: ["C2", "C3", "C5", "C8", "C13", "E3"]
    },
    {
        id: "poi-hosp-san-pedro",
        nombre: "Hospital San Pedro (Fundación San Pedro)",
        alias: ["hospital san pedro", "san pedro", "clinica san pedro"],
        categoria: "Hospital",
        direccion: "Calle 22 con Carrera 35",
        lat: 1.2215,
        lng: -77.2910,
        paradaCercana: "Hospital San Pedro / Carrera 35",
        rutas: ["C2", "C5", "C9", "E1", "E6"]
    },
    {
        id: "poi-hosp-infantil",
        nombre: "Hospital Infantil Los Ángeles",
        alias: ["hospital infantil", "los angeles", "clinica infantil", "hospital los angeles"],
        categoria: "Hospital",
        direccion: "Carrera 32 Calle 21",
        lat: 1.2202,
        lng: -77.2865,
        paradaCercana: "Hospital Infantil / Carrera 32",
        rutas: ["C2", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-clinica-fatima",
        nombre: "Clínica Fátima",
        alias: ["clinica fatima", "fatima", "urgencias fatima"],
        categoria: "Clínica",
        direccion: "Carrera 14 con Calle 20, Sector Fátima",
        lat: 1.2185,
        lng: -77.2710,
        paradaCercana: "Fátima Carrera 13 / Carrera 14 Calle 20",
        rutas: ["C1", "C2", "C7", "C8", "C11"]
    },
    {
        id: "poi-hosp-santa-monica",
        nombre: "Hospital Santa Mónica (Pasto Salud ESE)",
        alias: ["hospital santa monica", "santa monica", "centro de salud santa monica"],
        categoria: "Hospital",
        direccion: "Comuna 3 / Sector Santa Mónica",
        lat: 1.2025,
        lng: -77.2620,
        paradaCercana: "Hospital de Santa Mónica",
        rutas: ["C13", "C14"]
    },
    {
        id: "poi-emssanar",
        nombre: "Emssanar EPS (Sede Principal)",
        alias: ["emssanar", "eps emssanar", "dispensario emssanar"],
        categoria: "Salud / EPS",
        direccion: "Obonuco / Mijitayo",
        lat: 1.1998,
        lng: -77.3054,
        paradaCercana: "Emssanar / Obonuco",
        rutas: ["C1", "C15"]
    },

    // ==========================================
    // 4. DROGUERÍAS Y FARMACIAS POPULARES
    // ==========================================
    {
        id: "poi-farma-center-centro",
        nombre: "Droguería Farma Center / Farmacenter",
        alias: ["farma center", "farmacenter", "farma senter", "drogueria farma center", "drogas farmacenter"],
        categoria: "Droguería",
        direccion: "Carrera 25 Calle 17 / Centro Rumipamba",
        lat: 1.2140,
        lng: -77.2780,
        paradaCercana: "Carrera 25 Calle 17 / Plazoleta Rumipamba",
        rutas: ["C1", "C7", "C9", "C10", "C11", "E1", "E2"]
    },
    {
        id: "poi-drogas-la-rebaja",
        nombre: "Drogas La Rebaja (Plaza del Carnaval / Centro)",
        alias: ["la rebaja", "drogas la rebaja", "rebaja", "farmacia la rebaja"],
        categoria: "Droguería",
        direccion: "Calle 19 con Carrera 20, Plaza del Carnaval",
        lat: 1.2145,
        lng: -77.2735,
        paradaCercana: "Plaza del Carnaval / Calle 19",
        rutas: ["C1", "C2", "C7", "C10", "C11", "E1"]
    },
    {
        id: "poi-pasteur",
        nombre: "Droguerías Pasteur",
        alias: ["pasteur", "drogueria pasteur", "farmacia pasteur"],
        categoria: "Droguería",
        direccion: "Calle 18 Carrera 25, Centro",
        lat: 1.2150,
        lng: -77.2770,
        paradaCercana: "Calle 18 Carrera 25 / Parque Nariño",
        rutas: ["C1", "C2", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-cruz-verde",
        nombre: "Droguería Cruz Verde",
        alias: ["cruz verde", "drogueria cruz verde", "medicamentos cruz verde"],
        categoria: "Droguería",
        direccion: "Calle 18 con Carrera 30",
        lat: 1.2165,
        lng: -77.2845,
        paradaCercana: "Calle 18 Carrera 29 / Parque Infantil",
        rutas: ["C1", "C9", "C10", "E1", "E2"]
    },

    // ==========================================
    // 5. CENTROS COMERCIALES, SUPERMERCADOS Y MERCADOS
    // ==========================================
    {
        id: "poi-unicentro",
        nombre: "Centro Comercial Unicentro Pasto",
        alias: ["unicentro", "centro comercial unicentro", "unicentro pasto", "bolera unicentro"],
        categoria: "Centro Comercial",
        direccion: "Avenida Panamericana con Calle 20, Torobajo",
        lat: 1.2270,
        lng: -77.2915,
        paradaCercana: "Avenida Panamericana / Unicentro",
        rutas: ["C2", "C5", "C9", "E1", "E2", "E6"]
    },
    {
        id: "poi-alkosto-centro",
        nombre: "Alkosto Centro",
        alias: ["alkosto centro", "alkosto carrera 22", "alkosto"],
        categoria: "Supermercado",
        direccion: "Carrera 22 con Calle 17, Centro",
        lat: 1.2130,
        lng: -77.2745,
        paradaCercana: "Calle 17 Carrera 22 / Plaza del Carnaval",
        rutas: ["C1", "C2", "C7", "C10", "C11", "E1"]
    },
    {
        id: "poi-alkosto-bolivar",
        nombre: "Alkosto Bolívar (Avenida Panamericana)",
        alias: ["alkosto bolivar", "alkosto parque bolivar", "alkosto sur"],
        categoria: "Supermercado",
        direccion: "Avenida Panamericana Sur con Calle 12",
        lat: 1.2065,
        lng: -77.2815,
        paradaCercana: "Panamericana Carrera 26 / Parque Bolívar",
        rutas: ["C1", "C4", "C6", "C7", "C15"]
    },
    {
        id: "poi-cc-unico",
        nombre: "Centro Comercial Único Outlet Pasto",
        alias: ["unico", "centro comercial unico", "outlet unico"],
        categoria: "Centro Comercial",
        direccion: "Avenida Panamericana Norte, Salida al Norte",
        lat: 1.2380,
        lng: -77.2890,
        paradaCercana: "Panamericana Norte / Único",
        rutas: ["C2", "C5", "C8", "C14"]
    },
    {
        id: "poi-bombona-pasaje",
        nombre: "Pasaje Comercial Bomboná / Parque Bomboná",
        alias: ["bombona", "parque bombona", "pasaje bombona", "sector bombona"],
        categoria: "Comercio / Parque",
        direccion: "Carrera 27 Calle 14, Centro",
        lat: 1.2120,
        lng: -77.2805,
        paradaCercana: "Bomboná Calle 14 / Carrera 27",
        rutas: ["C1", "C7", "C9", "C10", "E2"]
    },
    {
        id: "poi-sebastian-belalcazar",
        nombre: "Centro Comercial Sebastián de Belalcázar",
        alias: ["sebastian de belalcazar", "belalcazar", "cc belalcazar"],
        categoria: "Centro Comercial",
        direccion: "Calle 19 con Carrera 24, Centro",
        lat: 1.2155,
        lng: -77.2775,
        paradaCercana: "Calle 19 Carrera 24 / Plaza del Carnaval",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-exito-centro",
        nombre: "Almacenes Éxito Centro",
        alias: ["exito centro", "exito carrera 25", "el exito"],
        categoria: "Supermercado",
        direccion: "Calle 18 con Carrera 25, Centro",
        lat: 1.2148,
        lng: -77.2768,
        paradaCercana: "Éxito Centro / Complejo Bancario",
        rutas: ["C1", "C2", "C7", "C10", "E1", "E2"]
    },
    {
        id: "poi-potrerillo",
        nombre: "Mercado El Potrerillo (Plaza de Mercado)",
        alias: ["potrerillo", "mercado potrerillo", "plaza potrerillo", "avenida chile"],
        categoria: "Mercado Público",
        direccion: "Avenida Chile con Carrera 5",
        lat: 1.2005,
        lng: -77.2745,
        paradaCercana: "Avenida Chile Potrerillo / Venecia",
        rutas: ["C1", "C2", "C4", "C8", "C10", "E4"]
    },
    {
        id: "poi-dos-puentes",
        nombre: "Mercado Los Dos Puentes",
        alias: ["dos puentes", "los dos puentes", "plaza dos puentes"],
        categoria: "Mercado Público",
        direccion: "Calle 16 Carrera 23",
        lat: 1.2115,
        lng: -77.2750,
        paradaCercana: "Calle 16 Carrera 22 / Dos Puentes",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },

    // ==========================================
    // 6. PARQUES, PLAZAS Y LUGARES EMBLEMÁTICOS
    // ==========================================
    {
        id: "poi-rumipamba",
        nombre: "Plazoleta Rumipamba (Parque San Agustín)",
        alias: ["rumipamba", "plazoleta rumipamba", "parque rumipamba", "san agustin", "templo san agustin"],
        categoria: "Plaza / Parque",
        direccion: "Carrera 26 con Calle 16, Centro",
        lat: 1.2133,
        lng: -77.2796,
        paradaCercana: "Carrera 26 Calle 16 / Plazoleta Rumipamba",
        rutas: ["C1", "C7", "C9", "C10", "C11", "C15", "E1", "E2"]
    },
    {
        id: "poi-parque-narino",
        nombre: "Plaza de Nariño (Parque Nariño)",
        alias: ["parque narino", "plaza de narino", "centro historico", "estatua narino"],
        categoria: "Plaza Central",
        direccion: "Carrera 25 Calle 18 / 19, Centro",
        lat: 1.2148,
        lng: -77.2778,
        paradaCercana: "Calle 18 Carrera 25 / Alcaldía Centro",
        rutas: ["C1", "C2", "C7", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-plaza-carnaval",
        nombre: "Plaza del Carnaval y la Cultura",
        alias: ["plaza del carnaval", "plaza de carnaval", "parque del carnaval", "senda del carnaval"],
        categoria: "Plaza",
        direccion: "Calle 19 con Carrera 21",
        lat: 1.2142,
        lng: -77.2730,
        paradaCercana: "Plaza del Carnaval / Calle 19",
        rutas: ["C1", "C2", "C7", "C10", "C11", "E1"]
    },
    {
        id: "poi-parque-infantil",
        nombre: "Parque Infantil de Pasto",
        alias: ["parque infantil", "el infantil", "concha acustica"],
        categoria: "Parque",
        direccion: "Calle 18 con Carrera 30",
        lat: 1.2170,
        lng: -77.2855,
        paradaCercana: "Parque Infantil / Calle 18 Carrera 29",
        rutas: ["C1", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-terminal-transportes",
        nombre: "Terminal de Transportes de Pasto",
        alias: ["terminal", "terminal de transportes", "terminal de buses", "terminal pasto", "flotas"],
        categoria: "Terminal",
        direccion: "Avenida Chile con Carrera 6",
        lat: 1.1995,
        lng: -77.2705,
        paradaCercana: "Terminal de Transportes / Avenida Chile",
        rutas: ["C1", "C2", "C11", "C16"]
    },

    // ==========================================
    // 7. ENTIDADES PÚBLICAS Y GOBIERNO
    // ==========================================
    {
        id: "poi-alcaldia-centro",
        nombre: "Alcaldía Municipal de Pasto (Sede Centro / San Héctor)",
        alias: ["alcaldia", "alcaldia centro", "despacho alcalde", "alcaldia de pasto"],
        categoria: "Gobierno",
        direccion: "Calle 18 con Carrera 27, Centro",
        lat: 1.2145,
        lng: -77.2790,
        paradaCercana: "Alcaldía Centro / Calle 18 Carrera 27",
        rutas: ["C1", "C2", "C7", "C9", "C10", "E1", "E2"]
    },
    {
        id: "poi-cam-anganoy",
        nombre: "CAM Anganoy (Alcaldía / Tránsito / Avante SETP)",
        alias: ["anganoy", "cam anganoy", "transito anganoy", "avante anganoy", "secretaria de transito"],
        categoria: "Gobierno",
        direccion: "Barrio Anganoy / Los Rosales II",
        lat: 1.2225,
        lng: -77.3015,
        paradaCercana: "CAM Anganoy / Los Rosales",
        rutas: ["C6", "C7", "C16", "E7"]
    },
    {
        id: "poi-gobernacion",
        nombre: "Gobernación de Nariño",
        alias: ["gobernacion", "gobernacion de narino", "palacio de gobierno"],
        categoria: "Gobierno",
        direccion: "Calle 19 Carrera 25, Frente a Plaza de Nariño",
        lat: 1.2152,
        lng: -77.2782,
        paradaCercana: "Plaza de Nariño / Calle 19",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-dian",
        nombre: "DIAN Pasto",
        alias: ["dian", "dian pasto", "impuestos dian"],
        categoria: "Gobierno",
        direccion: "Calle 19 con Carrera 22",
        lat: 1.2150,
        lng: -77.2748,
        paradaCercana: "Calle 19 Carrera 22 / Centro",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-camara-comercio",
        nombre: "Cámara de Comercio de Pasto",
        alias: ["camara de comercio", "camara de comercio de pasto"],
        categoria: "Entidad",
        direccion: "Calle 18 Carrera 28",
        lat: 1.2155,
        lng: -77.2820,
        paradaCercana: "Calle 18 Carrera 27 / Parque Infantil",
        rutas: ["C1", "C9", "C10", "E1", "E2"]
    },

    // ==========================================
    // 8. TEMPLOS E IGLESIAS HISTÓRICAS
    // ==========================================
    {
        id: "poi-san-juan",
        nombre: "Templo San Juan Bautista",
        alias: ["san juan", "templo san juan", "iglesia san juan", "parroquia san juan bautista"],
        categoria: "Templo",
        direccion: "Plaza de Nariño / Carrera 25",
        lat: 1.2145,
        lng: -77.2772,
        paradaCercana: "Plaza de Nariño / Carrera 25",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-catedral",
        nombre: "Catedral de Pasto",
        alias: ["catedral", "la catedral", "catedral de pasto"],
        categoria: "Templo",
        direccion: "Calle 17 con Carrera 26",
        lat: 1.2135,
        lng: -77.2790,
        paradaCercana: "Calle 17 Carrera 26 / Centro",
        rutas: ["C1", "C7", "C9", "C10", "E1"]
    },
    {
        id: "poi-cristo-rey",
        nombre: "Templo Cristo Rey",
        alias: ["cristo rey", "iglesia cristo rey", "templo cristo rey"],
        categoria: "Templo",
        direccion: "Calle 20 con Carrera 24",
        lat: 1.2168,
        lng: -77.2770,
        paradaCercana: "Calle 20 Carrera 24 / Centro",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },
    {
        id: "poi-san-juan-bosco",
        nombre: "Templo San Juan Bosco",
        alias: ["san juan bosco", "iglesia san juan bosco", "don bosco"],
        categoria: "Templo",
        direccion: "Calle 17 con Carrera 16",
        lat: 1.2110,
        lng: -77.2715,
        paradaCercana: "San Juan Bosco / Calle 17 Carrera 16",
        rutas: ["C1", "C2", "C7", "C10", "E1"]
    },

    // ==========================================
    // 9. BARRIOS Y CORREGIMIENTOS POPULARES
    // ==========================================
    {
        id: "poi-obonuco",
        nombre: "Corregimiento de Obonuco",
        alias: ["obonuco", "pueblo obonuco", "plaza obonuco"],
        categoria: "Corregimiento",
        direccion: "Vía a Obonuco",
        lat: 1.1925,
        lng: -77.3060,
        paradaCercana: "Atención Integral Obonuco",
        rutas: ["C1", "C15"]
    },
    {
        id: "poi-chapalito",
        nombre: "Altos de Chapalito / Chapalito",
        alias: ["chapalito", "altos de chapalito", "barrio chapalito"],
        categoria: "Barrio",
        direccion: "Comuna 4 Sur",
        lat: 1.1895,
        lng: -77.2720,
        paradaCercana: "Altos de Chapalito / Chambú",
        rutas: ["C1", "C7", "E2"]
    },
    {
        id: "poi-catambuco",
        nombre: "Corregimiento de Catambuco",
        alias: ["catambuco", "pueblo catambuco", "coba negra"],
        categoria: "Corregimiento",
        direccion: "Salida al Sur / Panamericana",
        lat: 1.1680,
        lng: -77.2850,
        paradaCercana: "Plaza Principal Catambuco",
        rutas: ["C6", "E5"]
    },
    {
        id: "poi-tamasagra",
        nombre: "Barrio Tamasagra (Etapas I y II)",
        alias: ["tamasagra", "tamasagra 1", "tamasagra 2", "manzana 27 tamasagra"],
        categoria: "Barrio",
        direccion: "Comuna 6 Occidente",
        lat: 1.2005,
        lng: -77.2935,
        paradaCercana: "Tamasagra Manzana 27 / Manzana 28",
        rutas: ["C1", "C6", "C15"]
    },
    {
        id: "poi-pandiaco",
        nombre: "Barrio Pandiaco / Maridíaz",
        alias: ["pandiaco", "maridiaz", "museo taminango", "la loma pandiaco"],
        categoria: "Barrio",
        direccion: "Comuna 9 Norte",
        lat: 1.2260,
        lng: -77.2840,
        paradaCercana: "Pandiaco / Museo Taminango",
        rutas: ["C2", "C3", "C5", "C8", "E3"]
    },
    {
        id: "poi-mariluz",
        nombre: "Barrio Mariluz (Etapas I, II y III)",
        alias: ["mariluz", "mariluz 1", "mariluz 2", "mariluz 3"],
        categoria: "Barrio",
        direccion: "Sector Noroccidente / Mijitayo Alto",
        lat: 1.2280,
        lng: -77.3020,
        paradaCercana: "Terminal Mariluz",
        rutas: ["E6"]
    },
    {
        id: "poi-sindagua",
        nombre: "Barrio Sindagua",
        alias: ["sindagua", "barrio sindagua"],
        categoria: "Barrio",
        direccion: "Sector Suroriente",
        lat: 1.1920,
        lng: -77.2650,
        paradaCercana: "Terminal Sindagua",
        rutas: ["E6"]
    },
    {
        id: "poi-jamondino",
        nombre: "Corregimiento de Jamondino",
        alias: ["jamondino", "jamondino alto", "jamondino bajo"],
        categoria: "Corregimiento",
        direccion: "Sector Suroriente",
        lat: 1.1790,
        lng: -77.2550,
        paradaCercana: "Parada Jamondino Alto",
        rutas: ["C10", "E4"]
    },
    {
        id: "poi-briceno",
        nombre: "Sector Briceño / Patio Taller Briceño",
        alias: ["briceno", "patio taller briceno", "barrio briceno"],
        categoria: "Sector",
        direccion: "Sector Oriente",
        lat: 1.2180,
        lng: -77.2480,
        paradaCercana: "Terminal Briceño",
        rutas: ["C5", "C10", "C12", "E5"]
    },
    {
        id: "poi-genoy",
        nombre: "Corregimiento de Genoy",
        alias: ["genoy", "pueblo genoy", "aguas termales genoy"],
        categoria: "Corregimiento",
        direccion: "Vía al Volcán Galeras",
        lat: 1.2580,
        lng: -77.3150,
        paradaCercana: "Parada Principal Genoy",
        rutas: ["E4"]
    },
    {
        id: "poi-cabrera-laguna",
        nombre: "Corregimientos Cabrera y La Laguna",
        alias: ["cabrera", "la laguna", "corregimiento cabrera"],
        categoria: "Corregimiento",
        direccion: "Sector Oriente de Pasto",
        lat: 1.2110,
        lng: -77.2280,
        paradaCercana: "Plaza Cabrera / La Laguna",
        rutas: ["C16"]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LUGARES_PASTO };
}
