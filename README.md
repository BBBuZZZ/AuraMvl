# 🌊 Aura - Tu Espacio Diario & Agenda Escolar Inteligente

> **Aplicación móvil personal (PWA) diseñada para estudiantes y preadolescentes. Combina organización escolar, planificación de ropa según el horario del día y un diario emocional privado con control parental de emergencia.**

![PWA](https://img.shields.io/badge/PWA-Installable-0D9488?style=for-the-badge&logo=pwa&logoColor=white)
![Privacidad](https://img.shields.io/badge/Privacidad-100%25_Local-06B6D4?style=for-the-badge)
![Offline](https://img.shields.io/badge/Modo-Offline_First-38BDF8?style=for-the-badge)
![Diseño](https://img.shields.io/badge/Estética-Ocean_Turquoise-CCFBF1?style=for-the-badge)

---

## ✨ Características Principales

### 1. 📅 Horario Escolar Inteligente & Agenda de Deberes
* **Sincronización en tiempo real:** Calendario semanal sincronizado con el reloj del dispositivo que muestra los días exactos del mes y destaca automáticamente el día actual.
* **Ordenación cronológica automática:** Las asignaturas se organizan por orden de hora de inicio, sin importar el orden en que se introduzcan.
* **Horario 100% editable:** Botón *`✏️ Modificar`* para adaptar asignaturas, horas y etiquetas a cualquier curso escolar o cambio de trimestre.
* **Deberes a cualquier fecha (semanas y meses vista):** Selector de fecha libre para programar entregas o exámenes a corto, medio y largo plazo.
* **Panel de Próximas Entregas:** Vista de todas las tareas pendientes con cuenta atrás inteligente (*"En 4 días"*, *"En 2 sem."*, etc.) y animación de confeti festivo al completarlas.

### 2. 👗 Organizador de Outfits Sincronizado
* **Detección inteligente de horario:** La app lee el horario de clases de mañana y emite avisos automáticos:
  * Si tiene **Educación Física**, recuerda preparar chándal y zapatillas de deporte 👟🏃‍♀️.
  * Si tiene **Plástica o Taller**, avisa de no llevar ropa delicada que pueda mancharse 🎨.
* **Lienzo de estilo:** Permite tomar o subir fotos de la ropa desde la cámara del móvil, escribir notas y seleccionar complementos rápidos (*Mochila, Chaqueta, Gorra, Joyitas, etc.*).
* **Historial de looks:** Registro de los conjuntos utilizados en días anteriores.

### 3. 💭 Diario de Ánimo (Mood Capsule) con Acceso Parental
* **100% Privado:** Los pensamientos y notas se almacenan de forma local en la memoria interna del teléfono; no viajan a ningún servidor externo.
* **Micro-journaling positivo:** Registro de la vibra del día con emojis temáticos y espacio para *"Lo mejor de mi jornada"* (máx. 250 caracteres).
* **Seguridad y privacidad por PIN:** El diario se mantiene cerrado con candado de seguridad.
* **🛡️ Doble código de acceso (Privacidad + Código de Emergencia Parental):**
  * La alumna dispone de su propio PIN personal para su intimidad.
  * Los padres disponen de un **Código Maestro de Emergencia** configurable para poder supervisar o acceder al diario en cualquier situación urgente.
  * Botón de re-bloqueo instantáneo con un solo toque.

### 4. ⚙️ Adaptable a Cualquier Nivel y Curso Escolar
* Totalmente personalizable desde el panel de Ajustes (⚙️):
  * **Nombre o apodo** de la alumna/alumno.
  * **Curso escolar** (adaptable a Primaria, 1º a 4º de la ESO, Bachillerato, etc.).
  * **Año o subtítulo** editable (ej: *Curso 2026/2027*).

---

## 🔒 Privacidad por Diseño (Privacy by Design)

* **Sin rastreo ni analíticas:** No requiere registro de cuentas ni recopila datos personales.
* **Almacenamiento Local-First:** Toda la información (tareas, outfits, horario y diario) se guarda en el `localStorage` exclusivo del navegador del usuario.
* **Seguridad sin servidores:** Ideal para menores, cumpliendo con los estándares más estrictos de protección de datos.

---

## 📱 ¿Cómo instalarla en el móvil? (PWA)

Al estar desplegada bajo protocolo seguro HTTPS en GitHub Pages, puede instalarse en el teléfono como una aplicación nativa:

* **En iPhone (Safari):**  
  Abre el enlace ➔ Pulsa el botón central de **Compartir** ➔ Selecciona **"Añadir a la pantalla de inicio"**.
* **En Android (Chrome):**  
  Abre el enlace ➔ Pulsa los **3 puntos** del menú ➔ Selecciona **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**.

> Se abrirá a pantalla completa con su propio icono en el escritorio del móvil y seguirá funcionando **incluso en Modo Avión o sin conexión a internet**.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 semántico** con metaetiquetas PWA y viewport optimizado para smartphones.
* **CSS3 moderno** (variables CSS, diseño responsivo móvil, microinteracciones, paleta *Aqua Turquoise*).
* **JavaScript Vanilla (ES6+)** sin librerías externas pesadas (motor ultra ligero y rápido).
* **Service Workers (`sw.js`)** con estrategia de caché para funcionamiento offline.
* **Web App Manifest (`manifest.json`)** para integración nativa en iOS y Android.
