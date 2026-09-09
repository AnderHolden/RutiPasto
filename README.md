# Rutas Pasto Offline (PWA)

Aplicación web instalable (Progressive Web App - PWA) para la consulta completa y sin conexión del **Sistema Estratégico de Transporte Público de San Juan de Pasto (SETPasto / Avante)**, en el departamento de Nariño, Colombia.

Diseñada con enfoque **Mobile-First**, construida **exclusivamente con tecnologías nativas (HTML5, CSS3, JavaScript Vanilla ES6+ y Leaflet local)**, lista para desplegarse directamente en Netlify o cualquier servidor de archivos estáticos.

---

## 📱 Características Principales

- **23 Rutas Urbanas Completas**:
  - **16 Rutas Complementarias**: C1 a C16.
  - **7 Rutas Estratégicas**: E1 a E7.
- **Sentidos de Recorrido Diferenciados**:
  - Alternancia entre **IDA** y **RETORNO**, actualizando de forma dinámica el trazado, los orígenes, destinos, fichas técnicas y paradas.
- **Trazados Reales y Georreferenciados**:
  - Polilíneas GPS exactas de los circuitos urbanos de Pasto, sin líneas rectas simplificadas.
- **Directorio de más de 1.700 Paradas Oficiales**:
  - Cada parada cuenta con su nombre, código oficial del sistema y coordenadas verificadas.
  - Al pulsar una parada en el listado o en el mapa se visualiza su información y se hace zoom a su ubicación.
- **Buscador Inteligente Tolerante**:
  - Búsqueda insensible a mayúsculas, minúsculas y tildes (`centro`, `parque narino`, `udenar`, `cesmag`, `terminal`, `hospital`, etc.).
  - Explica la razón de la coincidencia (por parada, destino, origen o código).
- **100% Funcional Offline (PWA)**:
  - Service Worker con estrategia **Cache First**.
  - Datos de rutas, horarios, tarifas y coordenadas almacenados en el archivo estático local `data/rutas.js` (sin APIs ni servidores intermedios).
  - Leaflet y sus recursos incluidos en el repositorio local.
- **Tarifa Oficial Vigente**:
  - **$2.700 COP** fijada por el sistema.
- **Modo Claro y Oscuro**:
  - Implementado mediante **CSS Custom Properties** y persistido en `localStorage`.
- **Geolocalización ("Mi ubicación")**:
  - Botón para centrar el mapa en la ubicación del usuario mediante `navigator.geolocation` con indicador de precisión.
- **Instalable en Teléfonos y Escritorio**:
  - Cumple con los criterios de PWA (manifest.json, iconos 192x192 y 512x512, standalone mode y evento `beforeinstallprompt`).

---

## 📁 Estructura del Proyecto

```text
rutas-pasto-offline/
│
├── index.html          # Interfaz semántica principal HTML5
├── styles.css          # Estilos CSS3 responsivos para móvil y escritorio (CSS Variables)
├── app.js              # Lógica y controlador modular en JS Vanilla ES6+
├── sw.js               # Service Worker con estrategia Cache First
├── manifest.json       # Manifiesto de la PWA para instalación nativa
│
├── data/
│   └── rutas.js        # Base de datos estática con las 23 rutas, paradas y coordenadas
│
├── assets/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   │
│   └── leaflet/
│       ├── leaflet.css
│       ├── leaflet.js
│       └── images/
│           ├── marker-icon.png
│           ├── marker-icon-2x.png
│           └── marker-shadow.png
│
└── README.md
```

---

## 🚌 Detalle de las 23 Rutas Incluidas

### Rutas Complementarias (16)
- **C1**: Obonuco ↔ Altos de Chapalito
- **C2**: Altavista ↔ La Paz
- **C3**: Gilberto Pabón ↔ Arnulfo Guerrero
- **C4**: Jongovito ↔ El Porvenir
- **C5**: Buesaquillo / Puente Tabla ↔ UDENAR / Briceño
- **C6**: Catambuco / Coba Negra ↔ CAM Anganoy
- **C7**: San Juan de Anganoy ↔ Altos de Chapalito
- **C8**: Cujacal ↔ San Martín
- **C9**: Villa Nueva ↔ UDENAR
- **C10**: Jamondino ↔ Briceño
- **C11**: Villa Nueva ↔ Mocondino
- **C12**: Briceño ↔ Villaflor / Briceño
- **C13**: Hospital de Santa Mónica ↔ Santa Rita
- **C14**: Altos de Daza ↔ Lorenzo
- **C15**: Obonuco ↔ Villa Nueva
- **C16**: Cabrera / La Laguna ↔ Anganoy

### Rutas Estratégicas (7)
- **E1**: Dolores ↔ UDENAR
- **E2**: Altos de Chapalito ↔ UDENAR
- **E3**: Altamira ↔ San Ezequiel Moreno
- **E4**: Genoy ↔ Jamondino
- **E5**: Briceño ↔ Catambuco
- **E6**: Sindagua ↔ Mariluz
- **E7**: Anganoy ↔ Sol de Oriente

---

## 📚 Fuentes de Información

Los datos incorporados en esta aplicación han sido recopilados y estructurados a partir de fuentes públicas oficiales y actualizadas:

1. **AVANTE SETP (Sistema Estratégico de Transporte Público de Pasto)**:
   - Fichas técnicas, paradas georreferenciadas y capas KML de Google My Maps del portal oficial de Avante SETP (`http://181.49.177.91/index.php/rutas/`).
   - Horarios oficiales de despacho (lunes a viernes, sábados, domingos y festivos) y tiempos estimados de viaje.
2. **Alcaldía de San Juan de Pasto & Secretaría de Tránsito y Transporte**:
   - Decretos de tarifas del transporte público colectivo de Pasto ($2.700 COP).
3. **OpenStreetMap**:
   - Cartografía base del municipio de Pasto y verificación de nomenclatura vial.

> [!IMPORTANT]
> **Nota de Transparencia:**
> Los recorridos y horarios del transporte público pueden cambiar según disposiciones operativas, obras viales o decretos de la Alcaldía de Pasto.
> Esta aplicación utiliza información almacenada localmente y debe actualizarse periódicamente para mantenerla vigente.
> Ninguna coordenada en esta aplicación es inventada; cuando alguna parada secundaria requiera ajuste de precisión en campo, se encuentra debidamente documentada.

---

## 🗺️ Limitación de Mosaicos de Mapa Offline

Leaflet no incluye mapas base por sí mismo. La aplicación utiliza mosaicos de OpenStreetMap (`tile.openstreetmap.org`).
El Service Worker almacena en caché las zonas exploradas mientras el usuario tenga conexión a internet. Si el usuario navega en una zona nunca antes vista mientras está desconectado:
- Los trazados de las 23 rutas,
- Las más de 1.700 paradas,
- Las fichas técnicas,
- Los horarios,
- Las búsquedas y listas
funcionarán al 100% sin importar la disponibilidad de la cartografía base de fondo.

---

## 🚀 Despliegue en Netlify

El proyecto no requiere ningún proceso de compilación (`build command`) ni configuración de backend.

### Pasos para desplegar:
1. **Opción 1: Arrastrar y soltar (Netlify Drop)**
   - Ingresa a [app.netlify.com/drop](https://app.netlify.com/drop).
   - Arrastra la carpeta del proyecto `RutiPastov2` (o su contenido).
   - ¡Listo! En segundos tu PWA estará disponible con HTTPS activado.

2. **Opción 2: Conectar repositorio Git (GitHub/GitLab)**
   - Sube el proyecto a tu repositorio.
   - En Netlify, crea un "New site from Git".
   - **Build command:** Dejar vacío (no requerido).
   - **Publish directory:** `.` (o directorio raíz).
   - Despliega.

---

## 🛠️ Tecnologías Empleadas

- **HTML5**: Marcado semántico y accesible.
- **CSS3**: Variables nativas (CSS Custom Properties), diseño adaptable Mobile-First y animaciones fluidas.
- **JavaScript ES6+ Vanilla**: Arquitectura modular sin frameworks pesados ni transpiladores.
- **Leaflet 1.9.4**: Biblioteca de mapas almacenada de forma local en `assets/leaflet/`.
- **Service Worker API & Cache Storage**: Disponibilidad offline e instalación PWA.
