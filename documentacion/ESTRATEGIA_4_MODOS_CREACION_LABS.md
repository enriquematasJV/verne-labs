# Estrategia: 4 Modos de Creación de Labs

**Objetivo:** Definir flujos de trabajo para crear labs según contexto del usuario y herramientas disponibles.

---

## 📋 Los 4 Modos

### 1️⃣ MODO MONOLÍTICO (Chat sin Acceso a Archivos)

**Usuarios:** ChatGPT, Gemini, Claude en chat simple  
**Acceso:** NO tiene acceso a carpetas/archivos  
**Restricción:** Una conversación nueva, no puede descargar/modificar proyecto existente

**Flujo:**
```
Usuario
  ↓
Abre Dashboard Asistente (lab-generator-v3.html)
  ↓
Rellena formulario (nombre, componentes, etc)
  ↓
Dashboard genera: BLUEPRINT + PROMPT INICIAL
  ↓
Abre Chat (ChatGPT/Gemini/Claude)
  ↓
Copia: BLUEPRINT + PROMPT INICIAL en el chat
  ↓
IA genera: HTML AUTOCONTENIDO (monolítico)
  ↓
Usuario descarga: archivo.html
  ↓
Hace double-click → Funciona sin dependencias
```

**Característica crítica del HTML generado:**
```html
<!-- UN ÚNICO ARCHIVO HTML -->
<html>
  <head>
    <style>
      /* TODO el CSS incrustado aquí */
    </style>
  </head>
  <body>
    <canvas id="scene"></canvas>
    
    <script>
      // TODA la lógica incrustada aquí
      
      // Canvas2DRenderer (código completo)
      class Canvas2DRenderer { /* ... */ }
      
      // Vector2D (código completo)
      class Vector2D { /* ... */ }
      
      // Model, View, Presenter (código completo)
      class MiLabModel { /* ... */ }
      class MiLabView { /* ... */ }
      class MiLabPresenter { /* ... */ }
      
      // Inicialización
      const presenter = new MiLabPresenter(/* ... */);
    </script>
  </body>
</html>
```

**Ventajas:**
- ✅ Completamente independiente
- ✅ Funciona en cualquier ordenador
- ✅ No requiere servidor
- ✅ Fácil de compartir (1 archivo = 1 lab)
- ✅ Ideal para prototipar rápido

**Desventajas:**
- ❌ Código incrustado (más grande)
- ❌ Difícil de mantener a largo plazo
- ❌ No sigue estructura verne-labs

**Cuándo usar:**
- Prototipado rápido
- Laboratorio simple/proof-of-concept
- Usuario quiere resultado FAST sin configuración

---

### 2️⃣ MODO MODULAR LOCAL (Estructura de carpetas en PC del usuario)

**Usuarios:** Desarrolladores que descargan estructura verne-labs  
**Acceso:** Tiene carpeta `verne-labs/` en su ordenador  
**Restricción:** Debe mantener estructura idéntica a verne-labs

**Flujo:**
```
Usuario
  ↓
Descarga/Clona estructura verne-labs
  ↓
Abre Dashboard Asistente
  ↓
Rellena formulario (modo MODULAR)
  ↓
Dashboard genera: BLUEPRINT + PROMPT MODULAR
  ↓
Abre Chat (cualquier IA)
  ↓
Copia: BLUEPRINT + PROMPT MODULAR en el chat
  ↓
IA genera: 4 archivos (index.html, Model.js, View.js, Presenter.js)
  ↓
Usuario copia archivos a:
  simulaciones/mi-lab/
  ├── index.html
  ├── css/mi-lab.css
  ├── js/MiLabModel.js
  ├── js/MiLabView.js
  └── js/MiLabPresenter.js
  ↓
Ejecuta: python -m http.server 8000
  ↓
Abre: http://localhost:8000/simulaciones/mi-lab/
```

**Prompt que genera el dashboard:**
```
MODO: MODULAR
ESTRUCTURA: /simulaciones/mi-lab/
BLUEPRINT: [incluido]

Las referencias a componentes SHARED serán:
- ../../shared/js/math/Vector2D.js
- ../../shared/components/GraphRenderer/GraphRenderer.js
etc.

Crea una estructura modular compatible con VerneLabs...
```

**Ventajas:**
- ✅ Sigue arquitectura verne-labs
- ✅ Componentes SHARED reutilizables
- ✅ Más mantenible a largo plazo
- ✅ Compatible con la plataforma

**Desventajas:**
- ❌ Requiere descargar estructura completa (~100MB)
- ❌ Engorroso si solo quieres hacer un lab
- ❌ Usuario debe mantener sincronización manual
- ❌ Requiere servidor local para ejecutar

**Cuándo usar:**
- Desarrollador serio que hará múltiples labs
- Quiere contribuir a verne-labs
- Necesita componentes SHARED específicos

---

### 3️⃣ MODO CLAUDE CODE (Acceso Directo a Carpetas)

**Usuarios:** Desarrolladores con Claude Code / acceso a MCP  
**Acceso:** Código accede directamente a `verne-labs/`  
**Restricción:** Debe validarse antes de subir a remoto

**Flujo:**
```
Usuario
  ↓
Abre Claude Code en su ordenador
  ↓
Claude tiene acceso a verne-labs/ (local)
  ↓
Abre Dashboard Asistente
  ↓
Rellena formulario
  ↓
Genera: BLUEPRINT + PROMPT
  ↓
Copia en Claude Code (misma sesión)
  ↓
Claude Code:
  - Lee estructura verne-labs
  - Crea archivos en lugar correcto
  - Importa componentes SHARED automáticamente
  - Ejecuta tests si existen
  - Verifica patrón MVP
  ↓
Usuario ve cambios en tiempo real
  ↓
Claude valida con git status
  ↓
Si OK: Usuario hace git commit + push
```

**Ventajas:**
- ✅ Más seguro (validación automática)
- ✅ Integración perfecta con verne-labs
- ✅ Componentes SHARED se resuelven automáticamente
- ✅ Puede ejecutar validaciones en tiempo real
- ✅ Control de versiones integrado

**Desventajas:**
- ❌ Requiere Claude Code (de pago)
- ❌ Requiere acceso local a verne-labs
- ❌ Riesgo si Claude Code hace algo inesperado

**Cuándo usar:**
- Desarrollo serio en verne-labs
- Colaboradores del proyecto
- Máxima seguridad y validación

---

### 4️⃣ MODO VALIDACIÓN Y TRANSFORMACIÓN (Flujo de Contribución)

**Usuarios:** Desarrolladores externos + Mantenedor de Proyecto  
**Acceso:** Desarrollador: SIN acceso | Mantenedor: CON acceso  
**Restricción:** Validación centralizada

**Flujo:**
```
DESARROLLADOR EXTERNO (sin acceso)
  ↓
Crea lab en MODO MONOLÍTICO (1 archivo HTML)
  ↓
Completa: descripción, documentación, tests
  ↓
Sube a GitHub como ISSUE + archivo HTML
  
MANTENEDOR DEL PROYECTO (con Claude Code)
  ↓
Recibe HTML monolítico
  ↓
Abre Claude Code
  ↓
Instrucción: "Convierte este HTML monolítico a estructura verne-labs"
  ↓
Claude Code:
  - Extrae CSS → css/lab-name.css
  - Extrae HTML → index.html
  - Extrae Model → js/LabNameModel.js
  - Extrae View → js/LabNameView.js
  - Extrae Presenter → js/LabNamePresenter.js
  - Reemplaza referencias a componentes
  - Importa SHARED correctamente
  ↓
Ejecuta validaciones
  ↓
Si OK: git commit, git push a main
  ↓
GitHub Pages actualiza automáticamente
```

**Ventajas:**
- ✅ Desarrolladores sin setup complejo
- ✅ Validación centralizada
- ✅ Garantiza compatibilidad
- ✅ Historial limpio en main
- ✅ Seguridad: solo mantenedor puede pushear a main

**Desventajas:**
- ❌ Requiere coordinación entre desarrollador y mantenedor
- ❌ Más lento (2 pasos)
- ❌ Depende de disponibilidad mantenedor

**Cuándo usar:**
- Contribuciones externas (GitHub Contributions)
- Máxima calidad/seguridad
- Proyecto con muchos colaboradores

---

## 🎯 ¿Cómo Mejorar el Asistente?

### Lo que DEBE hacer el Dashboard (lab-generator-v3.html)

**Paso 0: Seleccionar modo**
```
┌────────────────────────────────┐
│ ¿Cómo crearás tu lab?          │
├────────────────────────────────┤
│ ○ Monolítico                   │
│   (1 archivo HTML, sin deps)   │
│                                │
│ ○ Modular                      │
│   (Estructura carpetas, SHARED)│
│                                │
│ ○ Claude Code                  │
│   (Acceso directo a verne-labs)│
│                                │
│ ○ Contribución Externa         │
│   (Monolítico para validación) │
└────────────────────────────────┘
```

**Según modo seleccionado:**

#### Si MONOLÍTICO:
- Selecciona componentes SHARED a incrustar
- Dashboard busca código de componentes
- Genera PROMPT que dice: "Incrusta este código en el HTML"
- Incluye BLUEPRINT completo

#### Si MODULAR:
- Selecciona componentes SHARED a usar
- Genera PROMPT que dice: "Crea estructura en /simulaciones/mi-lab/"
- Genera rutas relativas correctas (../../shared/)
- Incluye BLUEPRINT

#### Si CLAUDE CODE:
- Solicita ubicación de verne-labs (campo de entrada)
- Valida que existe
- Genera PROMPT para Claude Code con instrucción especial
- Incluye comando: "Crea archivo en /simulaciones/mi-lab/"

#### Si CONTRIBUCIÓN:
- Igual que MONOLÍTICO
- Pero agrega instrucción: "Documento será convertido a verne-labs por mantenedor"

---

## 📊 Tabla Comparativa

| Aspecto | Monolítico | Modular | Claude Code | Contribución |
|---------|-----------|---------|-------------|------------|
| **Setup requerido** | 🟢 Ninguno | 🟡 Descargar estructura | 🟡 Claude Code | 🟡 GitHub solo |
| **Esfuerzo usuario** | 🟢 Mínimo | 🟡 Medio | 🟡 Medio | 🟡 Mínimo (solo upload) |
| **Seguridad** | 🔴 Baja | 🟡 Media | 🟢 Alta | 🟢 Alta |
| **Componentes SHARED** | 🔴 Incrustados | 🟢 Referencias | 🟢 Automático | 🔴 Incrustados |
| **Ejecución** | 🟢 Direct | 🟡 Servidor | 🟢 Direct | 🟢 Direct |
| **Mantenibilidad** | 🔴 Baja | 🟢 Alta | 🟢 Alta | 🟢 Alta |
| **Ideal para** | Prototipos | Desarrollo serio | Colaboradores | Contribuciones |

---

## 🔧 Mejoras al Dashboard (Prioridad)

### 🔴 CRÍTICA
- [ ] **Selector de modo (4 opciones)**
  - Afecta todo lo demás
  - Esfuerzo: 2 horas (cambios UI + lógica)

- [ ] **Generador de PROMPT según modo**
  - Cada modo tiene instrucción diferente
  - Esfuerzo: 3 horas (lógica condicional)

- [ ] **Incluir BLUEPRINT en prompt**
  - Actualmente NO se incluye
  - Esfuerzo: 1 hora (cargar fichero)

### 🟡 IMPORTANTE
- [ ] **Lista de componentes a incrustar (monolítico)**
  - Si modo monolítico: mostrar "¿Qué componentes incluir?"
  - Esfuerzo: 1 hora

- [ ] **Validación de rutas (modular)**
  - Si modo modular: calcular rutas relativas correctas
  - Esfuerzo: 1.5 horas

- [ ] **Verificación de verne-labs (Claude Code)**
  - Preguntar ubicación de carpeta verne-labs
  - Esfuerzo: 1 hora

### 🟢 NICE-TO-HAVE
- [ ] Preview del prompt antes de copiar
- [ ] Histórico de labs creados
- [ ] Template selector (physics, graphics, data, etc)

---

## 📁 Archivos a Actualizar

### 1. lab-generator-v3.html
```html
<!-- Agregar selector de modo en Paso 0 -->
<!-- Cambiar UI según modo -->
<!-- Incluir BLUEPRINT en prompt -->
<!-- Generar prompt condicional -->
```

**Tiempo estimado:** 4-5 horas

### 2. BLUEPRINT-VERNE-LABS-COMPLETO.md
```markdown
<!-- Agregar sección: "Modo Monolítico: Instrucciones para IA" -->
<!-- Agregar sección: "Modo Modular: Instrucciones para IA" -->
<!-- Agregar sección: "Modo Claude Code: Instrucciones para IA" -->
```

**Tiempo estimado:** 1-2 horas

### 3. Crear: PROMPTS_POR_MODO.md
```markdown
# Prompts según Modo

## Modo MONOLÍTICO
[Prompt específico para monolítico]

## Modo MODULAR
[Prompt específico para modular]

## Modo CLAUDE CODE
[Prompt específico para Claude Code]

## Modo CONTRIBUCIÓN
[Prompt específico para contribución]
```

**Tiempo estimado:** 2 horas

---

## 🚀 Plan de Implementación

**Fase 1 (Esta semana):**
1. Actualizar lab-generator-v3.html: agregar selector de modo
2. Generar prompts según modo
3. Incluir BLUEPRINT automáticamente

**Fase 2 (Próxima semana):**
4. Crear guía de cada modo (documentación)
5. Crear ejemplos de output para cada modo

**Fase 3 (Opcional):**
6. Agregar validaciones (rutas, dependencias)
7. Agregar preview de prompt

---

## ✅ Resumen

El asistente debería permitir al usuario elegir **CÓMO** quiere crear su lab:

1. **Monolítico** → Para prototipos rápidos, sin dependencias
2. **Modular** → Para desarrollo serio con estructura local
3. **Claude Code** → Para máxima seguridad y validación
4. **Contribución** → Para externos que valida luego mantenedor

Cada modo genera un **PROMPT DIFERENTE** optimizado para esa situación.

El BLUEPRINT se incluye en TODOS los prompts.

---

**Impacto:** Simplifica enormemente la creación de labs en cualquier contexto.
