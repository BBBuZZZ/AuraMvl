// ==========================================================================
// AURA APP - LÓGICA DE LA APLICACIÓN (MÓVIL & OFFLINE)
// Adaptable a cualquier curso, fechas libres para deberes y código parental
// ==========================================================================

// Confetti festivo al tachar tareas o guardar recuerdos
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#06B6D4', '#0D9488', '#CCFBF1', '#38BDF8', '#FEF3C7', '#F472B6'];
  
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.alpha -= 0.02;
      if (p.alpha > 0) {
        alive = true;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    if (alive) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// Nombres de los días en español
const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DAY_SHORT = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

// ==========================================================================
// UTILIDADES DE TIEMPO Y ORDENACIÓN CRONOLÓGICA
// ==========================================================================

// Extrae minutos desde las 00:00 para ordenar horas (ej: "08:15", "10 a 11", "9:00 - 10:00")
function parseStartTime(timeStr) {
  if (!timeStr) return 9999;
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 9999;
  const h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  return h * 60 + m;
}

// Ordena cualquier lista de clases cronológicamente por su hora de inicio
function sortClassesChronologically(classList) {
  if (!Array.isArray(classList)) return [];
  return [...classList].sort((a, b) => parseStartTime(a.time) - parseStartTime(b.time));
}

// Formato YYYY-MM-DD local
function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Formatea etiquetas de cuenta atrás para tareas futuras (semanas, meses vista)
function formatDueDateBadge(dueDateStr) {
  if (!dueDateStr) return 'Sin fecha';
  const parts = dueDateStr.split('-');
  if (parts.length < 3) return dueDateStr;
  const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  const options = { day: 'numeric', month: 'short' };
  const dateFormatted = target.toLocaleDateString('es-ES', options);

  let countdown = '';
  if (diffDays < 0) countdown = '¡Atrasada!';
  else if (diffDays === 0) countdown = '¡Hoy!';
  else if (diffDays === 1) countdown = 'Mañana';
  else if (diffDays < 7) countdown = `En ${diffDays} días`;
  else if (diffDays < 31) countdown = `En ${Math.round(diffDays / 7)} sem.`;
  else countdown = `En ${Math.round(diffDays / 30)} mes(es)`;

  return `${dateFormatted} • ${countdown}`;
}

// Calcula las fechas exactas de la semana actual sincronizadas con el dispositivo
function getWeekDates() {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes ... 6 = Sábado
  const mondayOffset = (currentDayOfWeek === 0) ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    week.push({
      dayIndex: i, // 0 = Lunes, 6 = Domingo
      name: DAY_SHORT[i],
      fullName: DAY_NAMES[i],
      dateNumber: d.getDate(),
      dateStr: toLocalDateStr(d),
      isToday: d.toDateString() === now.toDateString(),
      fullDate: d
    });
  }
  return week;
}

// ==========================================================================
// HORARIO ESCOLAR BASE (Extraído del cuaderno y editable para cualquier curso)
// ==========================================================================
const OFFICIAL_SCHEDULE = {
  0: [ // LUNES
    { name: 'Inglés', time: '08:15 - 09:10', icon: '🇬🇧', tag: 'Idiomas', type: 'normal' },
    { name: 'Biología y Geología', time: '09:10 - 10:05', icon: '🌿', tag: 'Ciencias', type: 'normal' },
    { name: 'Educación Física', time: '10:05 - 11:00', icon: '🏃‍♀️', tag: '#Deporte', type: 'sports' },
    { name: 'Matemáticas', time: '11:25 - 12:20', icon: '📐', tag: 'Números', type: 'normal' },
    { name: 'Lengua Castellana', time: '12:20 - 13:15', icon: '📖', tag: 'Lectura', type: 'normal' },
    { name: 'Tutoría', time: '13:15 - 14:10', icon: '💬', tag: 'Grupo', type: 'normal' },
    { name: 'Geografía e Historia', time: '14:10 - 15:05', icon: '🗺️', tag: 'Historia', type: 'normal' }
  ],
  1: [ // MARTES
    { name: 'Inglés', time: '08:15 - 09:10', icon: '🇬🇧', tag: 'Idiomas', type: 'normal' },
    { name: 'Música', time: '09:10 - 10:05', icon: '🎵', tag: 'Música', type: 'normal' },
    { name: 'Atención Educativa', time: '10:05 - 11:00', icon: '📚', tag: 'Valores', type: 'normal' },
    { name: 'Lengua Castellana', time: '11:25 - 12:20', icon: '📖', tag: 'Lectura', type: 'normal' },
    { name: 'Optativa (Taller)', time: '12:20 - 13:15', icon: '🛠️', tag: 'Taller', type: 'special' },
    { name: 'Matemáticas', time: '13:15 - 14:10', icon: '📐', tag: 'Números', type: 'normal' }
  ],
  2: [ // MIÉRCOLES
    { name: 'Inglés', time: '08:15 - 09:10', icon: '🇬🇧', tag: 'Idiomas', type: 'normal' },
    { name: 'Educación Física', time: '09:10 - 10:05', icon: '🏃‍♀️', tag: '#Deporte', type: 'sports' },
    { name: 'Matemáticas', time: '10:05 - 11:00', icon: '📐', tag: 'Números', type: 'normal' },
    { name: 'Lengua Castellana', time: '11:25 - 12:20', icon: '📖', tag: 'Lectura', type: 'normal' },
    { name: 'Geografía e Historia', time: '12:20 - 13:15', icon: '🗺️', tag: 'Historia', type: 'normal' },
    { name: 'Biología y Geología', time: '13:15 - 14:10', icon: '🌿', tag: 'Ciencias', type: 'normal' },
    { name: 'EPVA (Plástica)', time: '14:10 - 15:05', icon: '🎨', tag: '#Plastica', type: 'special' }
  ],
  3: [ // JUEVES
    { name: 'Biología y Geología', time: '08:15 - 09:10', icon: '🌿', tag: 'Ciencias', type: 'normal' },
    { name: 'Educación Física', time: '09:10 - 10:05', icon: '🏃‍♀️', tag: '#Deporte', type: 'sports' },
    { name: 'Atención Educativa', time: '10:05 - 11:00', icon: '📚', tag: 'Valores', type: 'normal' },
    { name: 'Música', time: '11:25 - 12:20', icon: '🎵', tag: 'Música', type: 'normal' },
    { name: 'Lengua Castellana', time: '12:20 - 13:15', icon: '📖', tag: 'Lectura', type: 'normal' },
    { name: 'Inglés', time: '13:15 - 14:10', icon: '🇬🇧', tag: 'Idiomas', type: 'normal' }
  ],
  4: [ // VIERNES
    { name: 'Inglés', time: '08:15 - 09:10', icon: '🇬🇧', tag: 'Idiomas', type: 'normal' },
    { name: 'Optativa (Taller)', time: '09:10 - 10:05', icon: '🛠️', tag: 'Taller', type: 'special' },
    { name: 'Matemáticas', time: '10:05 - 11:00', icon: '📐', tag: 'Números', type: 'normal' },
    { name: 'EPVA (Plástica)', time: '11:25 - 12:20', icon: '🎨', tag: '#Plastica', type: 'special' },
    { name: 'Lengua Castellana', time: '12:20 - 13:15', icon: '📖', tag: 'Lectura', type: 'normal' },
    { name: 'Geografía e Historia', time: '13:15 - 14:10', icon: '🗺️', tag: 'Historia', type: 'normal' }
  ],
  5: [], // SÁBADO
  6: []  // DOMINGO
};

const DEFAULT_PROFILE = {
  name: 'Campeona',
  grade: '1º ESO',
  subtitle: 'CURSO 2026/2027'
};

const DEFAULT_SECURITY = {
  daughterPin: '1234',
  parentPin: '9999', // Código maestro de emergencia para el padre
  isLocked: true     // Inicia bloqueado para máxima privacidad
};

const DEFAULT_OUTFITS = [
  {
    id: 1,
    date: 'Para Mañana',
    notes: 'Sudadera oversize turquesa + joggers claros y zapatillas blancas',
    accessories: ['👟 Zapatillas', '🎒 Mochila', '💍 Joyitas'],
    photo: null
  }
];

const DEFAULT_DIARY = [
  {
    id: 1,
    date: '14 de Octubre',
    emoji: '✨',
    text: 'Aprobé el examen de Historia y nos reímos un montón en el recreo.'
  }
];

// ==========================================================================
// ESTADO DE LA APLICACIÓN
// ==========================================================================
class AuraAppState {
  constructor() {
    this.currentView = 'schedule';
    this.selectedDay = this.getTodayIndex();
    
    // Versión del horario
    const savedVersion = localStorage.getItem('aura_schedule_version');
    if (savedVersion !== '2.2') {
      localStorage.setItem('aura_schedule', JSON.stringify(OFFICIAL_SCHEDULE));
      localStorage.setItem('aura_schedule_version', '2.2');
      this.schedule = OFFICIAL_SCHEDULE;
    } else {
      this.schedule = JSON.parse(localStorage.getItem('aura_schedule')) || OFFICIAL_SCHEDULE;
    }

    // Ordenar clases de todos los días cronológicamente
    for (let d = 0; d < 7; d++) {
      if (this.schedule[d]) {
        this.schedule[d] = sortClassesChronologically(this.schedule[d]);
      }
    }

    // Perfil y Datos Personales (Adaptable a cualquier curso/año)
    this.profile = JSON.parse(localStorage.getItem('aura_user_profile')) || DEFAULT_PROFILE;

    // Seguridad Parental y Personal
    this.security = JSON.parse(localStorage.getItem('aura_security')) || DEFAULT_SECURITY;
    this.diaryUnlocked = !this.security.isLocked;
    this.isParentModeActive = false;

    // Tareas con soporte de cualquier fecha futura
    const savedTasks = JSON.parse(localStorage.getItem('aura_tasks'));
    if (savedTasks && Array.isArray(savedTasks)) {
      this.tasks = savedTasks;
    } else {
      const today = new Date();
      const inThreeDays = new Date(today);
      inThreeDays.setDate(today.getDate() + 3);
      const inTwoWeeks = new Date(today);
      inTwoWeeks.setDate(today.getDate() + 14);

      this.tasks = [
        { id: 1, dueDate: toLocalDateStr(today), text: 'Ejercicios de Inglés pág 22', subject: 'Inglés', completed: false },
        { id: 2, dueDate: toLocalDateStr(inThreeDays), text: 'Traer flauta dulce para Música', subject: 'Música', completed: false },
        { id: 3, dueDate: toLocalDateStr(inTwoWeeks), text: 'Entrega de Proyecto y Examen tema 2', subject: 'Biología y Geología', completed: false }
      ];
    }

    this.outfits = JSON.parse(localStorage.getItem('aura_outfits')) || DEFAULT_OUTFITS;
    this.diary = JSON.parse(localStorage.getItem('aura_diary')) || DEFAULT_DIARY;
    this.currentPhotoBase64 = null;
    this.selectedMood = { emoji: '✨', label: 'Increíble' };
  }

  getTodayIndex() {
    const day = new Date().getDay(); // 0 es Domingo
    return day === 0 ? 6 : day - 1; // 0 = Lunes ... 6 = Domingo
  }

  save() {
    localStorage.setItem('aura_schedule', JSON.stringify(this.schedule));
    localStorage.setItem('aura_tasks', JSON.stringify(this.tasks));
    localStorage.setItem('aura_outfits', JSON.stringify(this.outfits));
    localStorage.setItem('aura_diary', JSON.stringify(this.diary));
    localStorage.setItem('aura_user_profile', JSON.stringify(this.profile));
    localStorage.setItem('aura_security', JSON.stringify(this.security));
  }
}

const app = new AuraAppState();

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  updateProfileUI();
  updateDeviceDateAndClock();
  setInterval(updateDeviceDateAndClock, 1000);
  setupDaysCarousel();
  renderScheduleAndTasks();
  setupOutfitPlanner();
  setupMoodDiary();
  setupTaskModal();
  setupScheduleEditorModal();
  setupProfileModal();
  checkTomorrowSmartAlert();
});

// Sincronización continua de Fecha y Hora del Dispositivo
function updateDeviceDateAndClock() {
  const now = new Date();
  
  // Reloj superior
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const clockEl = document.getElementById('current-clock');
  if (clockEl) {
    clockEl.textContent = `${hours}:${minutes}`;
  }

  // Fecha del dispositivo en el encabezado
  const headerDateEl = document.getElementById('header-current-date');
  if (headerDateEl) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateFormatted = now.toLocaleDateString('es-ES', options);
    headerDateEl.textContent = `${dateFormatted.toUpperCase()} ✨`;
  }
}

// Actualizar datos del perfil en pantalla
function updateProfileUI() {
  const nameEl = document.getElementById('header-user-name');
  const gradeEl = document.getElementById('header-user-grade');
  if (nameEl) nameEl.textContent = `¡Hola, ${app.profile.name || 'Campeona'}! ✨`;
  if (gradeEl) gradeEl.textContent = `${app.profile.grade || '1º ESO'} • ${app.profile.subtitle || 'CURSO ACTUAL'}`;
}

// Navegación de Pestañas
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.view-section');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.dataset.view;
      app.currentView = targetView;

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === `${targetView}-view`) {
          sec.classList.add('active');
        }
      });

      if (targetView === 'outfit') {
        checkTomorrowSmartAlert();
        renderSavedOutfits();
      } else if (targetView === 'diary') {
        renderDiaryView();
      }
    });
  });
}

// Carrusel de Días Sincronizado Dinámicamente con el Calendario Real
function setupDaysCarousel() {
  const carousel = document.getElementById('days-carousel');
  carousel.innerHTML = '';
  const weekDates = getWeekDates();

  weekDates.forEach((dayInfo) => {
    const pill = document.createElement('div');
    const isSelected = dayInfo.dayIndex === app.selectedDay;
    pill.className = `day-pill ${isSelected ? 'active' : ''} ${dayInfo.isToday ? 'today-pill' : ''}`;
    pill.innerHTML = `
      <span class="day-name">${dayInfo.name}</span>
      <span class="day-num">${dayInfo.dateNumber}</span>
      ${dayInfo.isToday ? '<span class="today-indicator">HOY</span>' : ''}
    `;
    pill.addEventListener('click', () => {
      document.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      app.selectedDay = dayInfo.dayIndex;
      renderScheduleAndTasks();
      checkTomorrowSmartAlert();
    });
    carousel.appendChild(pill);
  });
}

// Renderizar Horario y Deberes (Día actual + Agenda de tareas a semanas/meses vista)
function renderScheduleAndTasks() {
  const classesList = document.getElementById('classes-list');
  const tasksList = document.getElementById('tasks-list');
  const upcomingTasksList = document.getElementById('upcoming-tasks-list');
  const upcomingCountEl = document.getElementById('upcoming-tasks-count');
  
  // Asegurar ordenación cronológica por hora de inicio
  if (app.schedule[app.selectedDay]) {
    app.schedule[app.selectedDay] = sortClassesChronologically(app.schedule[app.selectedDay]);
  }
  const dayClasses = app.schedule[app.selectedDay] || [];
  
  // Actualizar etiqueta del día en la cabecera
  const weekDates = getWeekDates();
  const currentDayInfo = weekDates[app.selectedDay];
  const dayLabel = document.getElementById('schedule-day-label');
  if (dayLabel && currentDayInfo) {
    dayLabel.textContent = `${currentDayInfo.fullName} ${currentDayInfo.dateNumber}${currentDayInfo.isToday ? ' (Hoy)' : ''}`;
  }

  // Clases
  if (dayClasses.length === 0) {
    classesList.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px; background: #fff; border-radius: 18px; border: 1px dashed var(--border-light);">
        🎉 ¡Sin clases este día! Toca descansar y disfrutar.
      </div>
    `;
  } else {
    classesList.innerHTML = dayClasses.map(c => `
      <div class="class-card ${c.type}">
        <div class="class-left">
          <span class="class-icon">${c.icon}</span>
          <div class="class-info">
            <h4>${c.name}</h4>
            <p>${c.time}</p>
          </div>
        </div>
        <div class="class-tags">
          <span class="class-tag ${c.type === 'sports' ? 'tag-sport' : ''}">${c.tag}</span>
        </div>
      </div>
    `).join('');
  }

  // Tareas para la fecha seleccionada en el carrusel
  const targetDateStr = currentDayInfo ? currentDayInfo.dateStr : '';
  const dayTasks = app.tasks.filter(t => {
    if (t.dueDate) return t.dueDate === targetDateStr;
    return t.targetDay === app.selectedDay;
  });

  if (dayTasks.length === 0) {
    tasksList.innerHTML = `
      <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 13px; background: #fff; border-radius: 18px; border: 1px dashed var(--border-light);">
        ✨ No tienes deberes pendientes para este día. ¡Bravo!
      </div>
    `;
  } else {
    tasksList.innerHTML = dayTasks.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}" data-id="${t.id}">
        <div class="task-left">
          <div class="custom-checkbox" onclick="toggleTask(${t.id})">
            ${t.completed ? '✓' : ''}
          </div>
          <div>
            <div class="task-text">${t.text}</div>
            <div style="display:flex; gap:6px; align-items:center; margin-top:2px; flex-wrap:wrap;">
              <span class="task-badge">${t.subject}</span>
              <span style="font-size:10px; font-weight:700; color:var(--primary-turquoise); background:var(--soft-aqua); padding:2px 6px; border-radius:8px;">
                ${t.dueDate ? formatDueDateBadge(t.dueDate) : `Para el ${DAY_NAMES[t.targetDay]}`}
              </span>
            </div>
          </div>
        </div>
        <button class="btn-delete-task" onclick="deleteTask(${t.id})">✕</button>
      </div>
    `).join('');
  }

  // Todas las tareas pendientes futuras (semanas y meses vista)
  const pendingFutureTasks = app.tasks
    .filter(t => !t.completed)
    .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));

  if (upcomingCountEl) {
    upcomingCountEl.textContent = `${pendingFutureTasks.length} pendiente(s)`;
  }

  if (upcomingTasksList) {
    if (pendingFutureTasks.length === 0) {
      upcomingTasksList.innerHTML = `
        <div style="padding:12px; font-size:12px; color:var(--text-muted); text-align:center;">
          🎉 No hay entregas ni exámenes pendientes registrados.
        </div>
      `;
    } else {
      upcomingTasksList.innerHTML = pendingFutureTasks.map(t => `
        <div class="task-item" style="margin-bottom:8px; padding:10px 14px;" data-id="${t.id}">
          <div class="task-left">
            <div class="custom-checkbox" onclick="toggleTask(${t.id})"></div>
            <div>
              <div class="task-text" style="font-size:12.5px;">${t.text}</div>
              <div style="display:flex; gap:6px; align-items:center; margin-top:3px; flex-wrap:wrap;">
                <span class="task-badge">${t.subject}</span>
                <span style="font-size:10px; font-weight:800; color:#0369A1; background:#E0F2FE; padding:2px 6px; border-radius:6px;">
                  📅 ${formatDueDateBadge(t.dueDate)}
                </span>
              </div>
            </div>
          </div>
          <button class="btn-delete-task" onclick="deleteTask(${t.id})">✕</button>
        </div>
      `).join('');
    }
  }
}

window.toggleTask = function(taskId) {
  const task = app.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    app.save();
    renderScheduleAndTasks();
    if (task.completed) {
      launchConfetti();
    }
  }
};

window.deleteTask = function(taskId) {
  app.tasks = app.tasks.filter(t => t.id !== taskId);
  app.save();
  renderScheduleAndTasks();
};

// ==========================================================================
// FUNCIÓN 2: ORGANIZADOR DE OUTFITS INTELIGENTE
// ==========================================================================
function checkTomorrowSmartAlert() {
  const tomorrowIndex = (app.selectedDay + 1) % 7;
  const tomorrowClasses = app.schedule[tomorrowIndex] || [];
  
  const hasSports = tomorrowClasses.some(c => 
    c.type === 'sports' || 
    c.tag === '#Deporte' || 
    c.name.toLowerCase().includes('física') || 
    c.name.toLowerCase().includes('educación física')
  );

  const hasArt = tomorrowClasses.some(c => 
    c.type === 'special' && (
      c.tag === '#Plastica' || 
      c.name.toLowerCase().includes('plástica') || 
      c.name.toLowerCase().includes('epva') || 
      c.name.toLowerCase().includes('taller')
    )
  );

  const alertContainer = document.getElementById('outfit-smart-alert');
  const tomorrowName = DAY_NAMES[tomorrowIndex];
  
  let title = `Horario para el ${tomorrowName}`;
  let message = "Día sin actividades especiales. ¡Elige tu outfit favorito!";
  let tag = "Normal";

  if (hasSports && hasArt) {
    tag = "Deporte + Plástica";
    title = `¡El ${tomorrowName} tienes Educación Física y Plástica! 👟🎨`;
    message = "Día completo: Lleva zapatillas de deporte y ropa cómoda que no te dé miedo manchar en el taller.";
  } else if (hasSports) {
    tag = "Educación Física";
    title = `¡El ${tomorrowName} toca Educación Física! 🏃‍♀️👟`;
    message = "No olvides preparar tus zapatillas deportivas, calcetines cómodos y ropa de chándal o mallas.";
  } else if (hasArt) {
    tag = "Plástica / Taller";
    title = `¡El ${tomorrowName} tienes Taller / EPVA (Plástica)! 🎨🖌️`;
    message = "Te recomendamos ropa cómoda que sea fácil de lavar por si usáis témperas o carboncillo.";
  }

  alertContainer.innerHTML = `
    <div class="alert-header">
      <span class="alert-tag">${tag}</span>
      <span class="alert-title">${title}</span>
    </div>
    <div class="alert-message">${message}</div>
  `;
}

function setupOutfitPlanner() {
  const photoInput = document.getElementById('outfit-photo-input');
  const photoBox = document.getElementById('outfit-photo-box');
  const photoImg = document.getElementById('outfit-preview-img');
  const photoPlaceholder = document.getElementById('photo-placeholder-content');

  photoBox.addEventListener('click', () => photoInput.click());
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        app.currentPhotoBase64 = event.target.result;
        photoImg.src = app.currentPhotoBase64;
        photoImg.style.display = 'block';
        photoPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  const chips = document.querySelectorAll('.acc-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  document.getElementById('btn-save-outfit').addEventListener('click', () => {
    const notes = document.getElementById('outfit-notes').value.trim();
    const selectedAcc = Array.from(document.querySelectorAll('.acc-chip.selected')).map(c => c.textContent.trim());

    if (!notes && !app.currentPhotoBase64) {
      alert('¡Escribe una nota o sube una foto de tu look!');
      return;
    }

    const tomorrowName = DAY_NAMES[(app.selectedDay + 1) % 7];
    const newOutfit = {
      id: Date.now(),
      date: `Para el ${tomorrowName}`,
      notes: notes || 'Look preparado con estilo ✨',
      accessories: selectedAcc,
      photo: app.currentPhotoBase64
    };

    app.outfits.unshift(newOutfit);
    app.save();
    launchConfetti();
    alert('¡Outfit guardado con éxito! 👗👟✨');

    document.getElementById('outfit-notes').value = '';
    app.currentPhotoBase64 = null;
    photoImg.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
    chips.forEach(c => c.classList.remove('selected'));
    renderSavedOutfits();
  });
}

function renderSavedOutfits() {
  const container = document.getElementById('saved-outfits-list');
  if (app.outfits.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:12px;">Aún no tienes looks guardados.</p>';
    return;
  }

  container.innerHTML = app.outfits.map(o => `
    <div class="saved-outfit-card">
      <div class="saved-outfit-thumb">
        ${o.photo ? `<img src="${o.photo}" alt="Outfit">` : '👗'}
      </div>
      <div class="saved-outfit-info" style="flex:1;">
        <h5>${o.date}</h5>
        <p>${o.notes}</p>
        <div style="margin-top:4px; font-size:11px; color:var(--primary-turquoise);">
          ${o.accessories.join(' • ')}
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// FUNCIÓN 3: DIARIO DE ÁNIMO CON CÓDIGO MAESTRO PARENTAL DE EMERGENCIA
// ==========================================================================
function setupMoodDiary() {
  const moodCards = document.querySelectorAll('.mood-card');
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      moodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      app.selectedMood = {
        emoji: card.dataset.emoji,
        label: card.dataset.label
      };
    });
  });

  const journalInput = document.getElementById('journal-input');
  const charCounter = document.getElementById('journal-char-count');
  if (journalInput && charCounter) {
    journalInput.addEventListener('input', () => {
      charCounter.textContent = `${journalInput.value.length} / 250`;
    });
  }

  // Guardar entrada
  const btnSave = document.getElementById('btn-save-diary');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const text = journalInput.value.trim();
      if (!text) {
        alert('¡Escribe al menos una frase sobre cómo ha ido tu día! ✍️💙');
        return;
      }

      const todayDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
      const newEntry = {
        id: Date.now(),
        date: todayDate,
        emoji: app.selectedMood.emoji,
        text: text
      };

      app.diary.unshift(newEntry);
      app.save();
      launchConfetti();
      alert('¡Cápsula del día guardada bajo llave! 🔒🌊');

      journalInput.value = '';
      charCounter.textContent = '0 / 250';
      renderDiaryTimeline();
    });
  }

  // Botón para bloquear manualmente
  const btnLock = document.getElementById('btn-relock-diary');
  if (btnLock) {
    btnLock.addEventListener('click', () => {
      app.diaryUnlocked = false;
      app.isParentModeActive = false;
      renderDiaryView();
    });
  }

  // Desbloqueo (Hija o Código de Emergencia Parental)
  const btnUnlock = document.getElementById('btn-submit-diary-unlock');
  const pinInput = document.getElementById('diary-unlock-input');
  const errorMsg = document.getElementById('diary-unlock-error');

  if (btnUnlock && pinInput) {
    btnUnlock.addEventListener('click', () => {
      const enteredPin = pinInput.value.trim();
      const daughterPin = app.security.daughterPin || '1234';
      const parentPin = app.security.parentPin || '9999';

      if (enteredPin === parentPin) {
        // Desbloqueo Parental de Emergencia
        app.diaryUnlocked = true;
        app.isParentModeActive = true;
        pinInput.value = '';
        if (errorMsg) errorMsg.style.display = 'none';
        renderDiaryView();
        alert('🛡️ Acceso de Emergencia Parental activado.');
      } else if (enteredPin === daughterPin) {
        // Desbloqueo Alumna
        app.diaryUnlocked = true;
        app.isParentModeActive = false;
        pinInput.value = '';
        if (errorMsg) errorMsg.style.display = 'none';
        renderDiaryView();
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
      }
    });

    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnUnlock.click();
    });
  }
}

function renderDiaryView() {
  const lockedView = document.getElementById('diary-locked-view');
  const unlockedView = document.getElementById('diary-unlocked-content');
  const parentBanner = document.getElementById('diary-parent-emergency-banner');

  if (!app.diaryUnlocked) {
    if (lockedView) lockedView.style.display = 'block';
    if (unlockedView) unlockedView.style.display = 'none';
  } else {
    if (lockedView) lockedView.style.display = 'none';
    if (unlockedView) unlockedView.style.display = 'block';
    if (parentBanner) {
      parentBanner.style.display = app.isParentModeActive ? 'flex' : 'none';
    }
    renderDiaryTimeline();
  }
}

function renderDiaryTimeline() {
  const container = document.getElementById('history-timeline');
  if (!container) return;
  if (app.diary.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted); font-size:12px;">Aún no tienes recuerdos grabados en tu cápsula.</p>';
    return;
  }

  container.innerHTML = app.diary.map(e => `
    <div class="timeline-entry">
      <div class="entry-badge">${e.emoji}</div>
      <div class="entry-content">
        <div class="entry-date">${e.date}</div>
        <div class="entry-text">"${e.text}"</div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// MODAL DE AÑADIR TAREAS (FECHA LIBRE - SEMANAS O MESES VISTA)
// ==========================================================================
function setupTaskModal() {
  const modal = document.getElementById('add-task-modal');
  const btnOpen = document.getElementById('btn-open-add-task');
  const btnClose = document.getElementById('btn-close-modal');
  const btnSave = document.getElementById('btn-confirm-add-task');
  const dateInput = document.getElementById('task-input-date');

  btnOpen.addEventListener('click', () => {
    // Por defecto sugerir la fecha seleccionada en el carrusel
    const weekDates = getWeekDates();
    const currentDay = weekDates[app.selectedDay];
    if (dateInput) {
      dateInput.value = currentDay ? currentDay.dateStr : toLocalDateStr(new Date());
    }
    modal.classList.add('open');
  });

  btnClose.addEventListener('click', () => modal.classList.remove('open'));

  btnSave.addEventListener('click', () => {
    const textInput = document.getElementById('task-input-text');
    const subjInput = document.getElementById('task-input-subject');
    const chosenDate = dateInput ? dateInput.value : toLocalDateStr(new Date());

    if (!textInput.value.trim()) {
      alert('Por favor escribe qué deberes tienes.');
      return;
    }

    app.tasks.push({
      id: Date.now(),
      dueDate: chosenDate,
      text: textInput.value.trim(),
      subject: subjInput.value.trim() || 'General',
      completed: false
    });

    app.save();
    renderScheduleAndTasks();
    textInput.value = '';
    subjInput.value = '';
    modal.classList.remove('open');
    alert('¡Tarea guardada con éxito en tu agenda! 📅');
  });
}

// ==========================================================================
// MODAL PARA MODIFICAR EL HORARIO ESCOLAR (ORDEN CRONOLÓGICO GARANTIZADO)
// ==========================================================================
function setupScheduleEditorModal() {
  const modal = document.getElementById('edit-schedule-modal');
  const btnOpen = document.getElementById('btn-open-edit-schedule');
  const btnClose = document.getElementById('btn-close-edit-schedule');
  const dayFilter = document.getElementById('schedule-edit-day-select');
  const editorList = document.getElementById('schedule-editor-classes-list');
  const btnAddClass = document.getElementById('btn-add-class-to-schedule');
  const btnReset = document.getElementById('btn-reset-official-schedule');

  btnOpen.addEventListener('click', () => {
    const weekDates = getWeekDates();
    dayFilter.innerHTML = weekDates.map(d => `
      <option value="${d.dayIndex}" ${d.dayIndex === app.selectedDay ? 'selected' : ''}>
        ${d.fullName} (${d.name} ${d.dateNumber})
      </option>
    `).join('');
    renderEditorClassesList();
    modal.classList.add('open');
  });

  btnClose.addEventListener('click', () => {
    modal.classList.remove('open');
    renderScheduleAndTasks();
    checkTomorrowSmartAlert();
  });

  dayFilter.addEventListener('change', () => {
    renderEditorClassesList();
  });

  function renderEditorClassesList() {
    const day = parseInt(dayFilter.value, 10);
    if (app.schedule[day]) {
      app.schedule[day] = sortClassesChronologically(app.schedule[day]);
    }
    const classes = app.schedule[day] || [];

    if (classes.length === 0) {
      editorList.innerHTML = '<p style="color:var(--text-muted); font-size:12px; padding:10px;">No hay clases en este día.</p>';
      return;
    }

    editorList.innerHTML = classes.map((c, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#F8FAFC; border:1px solid #E2E8F0; padding:10px 14px; border-radius:14px; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:20px;">${c.icon}</span>
          <div>
            <div style="font-size:13px; font-weight:800; color:var(--text-main);">${c.name}</div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:700;">🕒 ${c.time} • ${c.tag}</div>
          </div>
        </div>
        <button onclick="removeClassFromSchedule(${day}, ${idx})" style="background:#FEE2E2; border:none; color:#DC2626; padding:6px 10px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer;">
          Eliminar
        </button>
      </div>
    `).join('');
  }

  window.removeClassFromSchedule = function(day, idx) {
    if (confirm('¿Eliminar esta clase del horario?')) {
      app.schedule[day].splice(idx, 1);
      app.save();
      renderEditorClassesList();
      renderScheduleAndTasks();
    }
  };

  // Añadir nueva clase con ordenación cronológica automática
  btnAddClass.addEventListener('click', () => {
    const day = parseInt(dayFilter.value, 10);
    const name = document.getElementById('new-class-name').value.trim();
    const time = document.getElementById('new-class-time').value.trim();
    const icon = document.getElementById('new-class-icon').value.trim() || '📚';
    const tag = document.getElementById('new-class-tag').value.trim() || 'General';
    const isSport = document.getElementById('new-class-is-sport').checked;

    if (!name || !time) {
      alert('Por favor escribe el nombre de la asignatura y la hora.');
      return;
    }

    if (!app.schedule[day]) {
      app.schedule[day] = [];
    }

    app.schedule[day].push({
      name: name,
      time: time,
      icon: icon,
      tag: isSport ? '#Deporte' : tag,
      type: isSport ? 'sports' : 'normal'
    });

    // Ordenación cronológica inmediata
    app.schedule[day] = sortClassesChronologically(app.schedule[day]);

    app.save();
    document.getElementById('new-class-name').value = '';
    document.getElementById('new-class-time').value = '';
    renderEditorClassesList();
    renderScheduleAndTasks();
    alert('¡Clase añadida y ordenada automáticamente por hora! 🕒✨');
  });

  // Restaurar horario oficial
  btnReset.addEventListener('click', () => {
    if (confirm('¿Quieres restablecer el horario al del cuaderno escolar?')) {
      app.schedule = JSON.parse(JSON.stringify(OFFICIAL_SCHEDULE));
      for (let d = 0; d < 7; d++) {
        if (app.schedule[d]) {
          app.schedule[d] = sortClassesChronologically(app.schedule[d]);
        }
      }
      app.save();
      renderEditorClassesList();
      renderScheduleAndTasks();
      alert('Horario restablecido y ordenado por hora.');
    }
  });
}

// ==========================================================================
// MODAL DE PERFIL, CURSO Y CÓDIGO MAESTRO PARENTAL
// ==========================================================================
function setupProfileModal() {
  const modal = document.getElementById('profile-settings-modal');
  const btnOpenHeader = document.getElementById('btn-header-profile');
  const btnOpenUser = document.getElementById('btn-open-profile');
  const btnClose = document.getElementById('btn-close-profile-modal');
  const btnSave = document.getElementById('btn-save-profile');

  const inputName = document.getElementById('profile-input-name');
  const inputGrade = document.getElementById('profile-input-grade');
  const inputSubtitle = document.getElementById('profile-input-subtitle');
  const inputDaughterPin = document.getElementById('profile-input-daughter-pin');
  const inputParentPin = document.getElementById('profile-input-parent-pin');

  function openProfile() {
    inputName.value = app.profile.name || 'Campeona';
    inputGrade.value = app.profile.grade || '1º ESO';
    inputSubtitle.value = app.profile.subtitle || 'CURSO 2026/2027';
    inputDaughterPin.value = app.security.daughterPin || '1234';
    inputParentPin.value = app.security.parentPin || '9999';
    modal.classList.add('open');
  }

  if (btnOpenHeader) btnOpenHeader.addEventListener('click', openProfile);
  if (btnOpenUser) btnOpenUser.addEventListener('click', openProfile);
  if (btnClose) btnClose.addEventListener('click', () => modal.classList.remove('open'));

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      app.profile.name = inputName.value.trim() || 'Campeona';
      app.profile.grade = inputGrade.value.trim() || '1º ESO';
      app.profile.subtitle = inputSubtitle.value.trim() || 'CURSO ACTUAL';

      if (inputDaughterPin.value.trim()) {
        app.security.daughterPin = inputDaughterPin.value.trim();
      }
      if (inputParentPin.value.trim()) {
        app.security.parentPin = inputParentPin.value.trim();
      }

      app.save();
      updateProfileUI();
      modal.classList.remove('open');
      alert('¡Perfil, curso y códigos de seguridad actualizados con éxito! ✨');
    });
  }
}
