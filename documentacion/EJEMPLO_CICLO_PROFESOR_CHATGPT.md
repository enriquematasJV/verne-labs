# Ejemplo Detallado: Ciclo Completo de Trabajo (Profesor + ChatGPT)

**Escenario:** Un profesor de Física quiere crear un lab sobre **"Lanzamiento de Proyectiles con Resistencia del Aire"**

**Herramientas disponibles:**
- BLUEPRINT (documento/s con código completo)
- Dashboard lab-generator-v3.html (autocontenido, abre en navegador)
- ChatGPT (o Claude o Gemini)

---

## 📅 FASE 1: PREPARACIÓN (Profesor, 5 min)

### Paso 1: Descargar recursos
```
Profesor recibe:
  ├─ BLUEPRINT-VERNE-LABS-COMPLETO.md (o BLUEPRINT-*.md)
  ├─ lab-generator-v3.html (dashboard)
  └─ README: "Instrucciones de uso"
```

### Paso 2: Abrir dashboard
```
Profesor:
  1. Hace doble clic en lab-generator-v3.html
  2. Se abre en navegador (autocontenido, sin servidor)
  3. Ve formulario con pasos
```

---

## 🖥️ FASE 2: CONFIGURAR EN DASHBOARD (Profesor, 10 min)

### Dashboard - Paso 0: Seleccionar Modo

```
┌──────────────────────────────────────────┐
│ ¿Cómo crearás tu lab?                    │
├──────────────────────────────────────────┤
│ ○ Monolítico (1 HTML autocontenido)      │
│   → Para ChatGPT, sin dependencias       │
│   ✓ SELECCIONA ESTE                      │
│                                           │
│ ○ Modular (estructura de carpetas)       │
│ ○ Claude Code (acceso directo a proyecto)│
│ ○ Contribución Externa (para validación) │
└──────────────────────────────────────────┘
```

**Profesor elige:** Monolítico ✓

---

### Dashboard - Paso 1: Información

```
┌──────────────────────────────────────────┐
│ Paso 1: Información del Laboratorio      │
├──────────────────────────────────────────┤
│ Nombre del laboratorio *                 │
│ [Lanzamiento de Proyectiles con Aire]    │
│                                           │
│ Asignatura *                             │
│ [Física ▼]                               │
│                                           │
│ Descripción del laboratorio *            │
│ [Simulación interactiva que permite     │
│  estudiar el movimiento de un proyectil │
│  considerando la resistencia del aire.   │
│  Ajusta ángulo, velocidad, masa y      │
│  densidad del aire para experimentar]    │
│                                           │
│ Tipo de escenario *                      │
│ [Dinámico Determinista ▼]                │
│ (Con animación, sin aleatoriedad)        │
└──────────────────────────────────────────┘
```

**Profesor completa:** Todos los campos ✓

---

### Dashboard - Paso 2: Componentes SHARED

```
┌──────────────────────────────────────────┐
│ Paso 2: Componentes SHARED a usar        │
│ (para incrustar en HTML monolítico)      │
├──────────────────────────────────────────┤
│ Parsing & Matemática                    │
│ ☑ VerneMath (parser de funciones)       │
│                                           │
│ Gráficos 2D                             │
│ ☑ GraphRenderer (ejes, grid)            │
│ ☑ Graph2DEngine (motor de gráficos)     │
│                                           │
│ Matemática                              │
│ ☑ Vector2D (operaciones vectoriales)    │
│                                           │
│ Interactividad                          │
│ ☑ GraphNavigator (pan/zoom)             │
│                                           │
│ Física                                  │
│ ☑ PhysicsEngine (fuerzas)               │
│                                           │
│ Integración Numérica                    │
│ ☑ OdeSolverRK4 (ecuaciones diferenciales)│
│                                           │
│ Control                                 │
│ ☑ SimulationLifecycle (play/pause)      │
│                                           │
│ UI & Presentación                       │
│ ☑ MathematicalModelPanel (fórmulas)     │
└──────────────────────────────────────────┘
```

**Profesor selecciona:** Los 8 componentes relevantes ✓

---

### Dashboard - Paso 3: Variables

```
┌──────────────────────────────────────────┐
│ Paso 3: Variables de Entrada y Salida    │
├──────────────────────────────────────────┤
│ Variables de entrada (ej: altura...)     │
│ [ángulo, velocidad inicial, masa,       │
│  densidad del aire, coeficiente de       │
│  fricción]                               │
│                                           │
│ Variables de salida (ej: posición...)    │
│ [alcance máximo, altura máxima,         │
│  tiempo de vuelo, trayectoria,           │
│  velocidad en impacto]                   │
└──────────────────────────────────────────┘
```

**Profesor completa:** Variables ✓

---

### Dashboard - Paso 4: Output

```
Profesor hace clic en: "Generar Prompt"

Dashboard genera:

═══════════════════════════════════════════════════════
PROMPT PARA CHATGPT (LISTO PARA COPIAR)
═══════════════════════════════════════════════════════

[BLUEPRINT COMPLETO INCLUIDO AQUÍ - 80+ páginas]

[Código fuente de todos los componentes SHARED]

[Lab modelo Cinemática 2D como referencia]

===

ESPECIFICACIÓN DEL NUEVO LAB:

Nombre: Lanzamiento de Proyectiles con Resistencia del Aire
Modo: MONOLÍTICO (1 archivo HTML autocontenido)
Asignatura: Física
Tipo: Dinámico Determinista

Descripción: Simulación interactiva que permite estudiar el 
movimiento de un proyectil considerando resistencia del aire...

Componentes a incrustar:
- VerneMath (parser)
- Vector2D (operaciones)
- GraphRenderer (rendering)
- Graph2DEngine (motor gráficos)
- PhysicsEngine (simulación)
- OdeSolverRK4 (integración)
- SimulationLifecycle (control)
- GraphNavigator (interactividad)
- MathematicalModelPanel (fórmulas)

Variables entrada: ángulo, velocidad inicial, masa...
Variables salida: alcance, altura máxima, tiempo vuelo...

INSTRUCCIONES:

1. Incrusta el código de TODOS los componentes arriba en el HTML
2. Crea un HTML autocontenido que funcione sin dependencias
3. Estructura MVP:
   - MiLabModel (gestiona simulación de proyectil con aire)
   - MiLabView (interfaz, sliders, botones)
   - MiLabPresenter (orquesta Model+View)
4. El Model debe usar OdeSolverRK4 para integrar ecuaciones
5. La View debe permitir ajustar: ángulo, v0, masa, densidad
6. El Presenter debe animar la trayectoria en tiempo real
7. Estilo: CSS integrado, interfaz limpia y pedagógica

Sigue el patrón del lab modelo Cinemática 2D (incluido arriba).
```

**Profesor:** Copia todo el prompt ✓

---

## 💬 FASE 3: DESARROLLO EN CHATGPT (Profesor + IA, 30-45 min)

### Interacción 1: Primera versión

**Profesor:** Pega el prompt en ChatGPT

```
ChatGPT responde:

Entendido. Voy a crear un laboratorio de lanzamiento de 
proyectiles con resistencia del aire.

Estructura del HTML:
- Sección 1: Canvas para gráfico
- Sección 2: Controles (sliders)
- Sección 3: Métricas (alcance, altura, etc)
- Sección 4: Scripts (todo el código incrustado)

Generando código...

[Genera 500+ líneas de HTML/CSS/JS]

HTML COMPLETO (archivo listo):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lanzamiento Proyectiles</title>
  <style>
    /* CSS INCRUSTADO - Estilos del lab */
    body { ... }
    .controls { ... }
    ...
  </style>
</head>
<body>
  <h1>Lanzamiento de Proyectiles</h1>
  
  <div class="controls">
    <label>Ángulo: <input type="range" id="angle" min="0" max="90" value="45"></label>
    <label>Velocidad: <input type="range" id="velocity" min="10" max="100" value="50"></label>
    <label>Masa: <input type="range" id="mass" min="0.1" max="5" value="1"></label>
    <label>Densidad aire: <input type="range" id="density" min="0" max="2" value="1.225"></label>
  </div>
  
  <canvas id="scene" width="800" height="600"></canvas>
  
  <div class="metrics">
    <p>Alcance: <span id="range">0</span> m</p>
    <p>Altura máxima: <span id="maxHeight">0</span> m</p>
    <p>Tiempo vuelo: <span id="time">0</span> s</p>
  </div>
  
  <script>
    // [TODO el código incrustado aquí]
    
    // Vector2D class
    class Vector2D { ... }
    
    // VerneMath
    class VerneMath { ... }
    
    // Graph rendering
    class GraphRenderer { ... }
    class Graph2DEngine { ... }
    
    // Physics
    class PhysicsEngine { ... }
    class OdeSolverRK4 { ... }
    
    // Model
    class ProyectilModel { ... }
    
    // View
    class ProyectilView { ... }
    
    // Presenter
    class ProyectilPresenter { ... }
    
    // Inicialización
    const presenter = new ProyectilPresenter(...);
  </script>
</body>
</html>
```

Archivo listo para descargar y ejecutar.
```

**Profesor:** Descarga archivo, hace doble clic, abre en navegador ✓

---

### Interacción 2: Ajustes iniciales

**Profesor:** "El gráfico no muestra la trayectoria correctamente"

```
ChatGPT: Tienes razón. El problema es que Graph2DEngine 
no está configurado con los límites correctos. Voy a 
ajustar los parámetros...

[Modifica sección de Graph2DEngine en el HTML]

Prueba ahora. Debería mostrar la trayectoria del proyectil
en tiempo real.
```

**Profesor:** Recarga página, prueba ✓

---

### Interacción 3: Añadir física de resistencia

**Profesor:** "¿Puedo ver cómo cambia la trayectoria sin resistencia del aire?"

```
ChatGPT: Buena idea. Voy a añadir un checkbox 
"Incluir resistencia del aire" que active/desactive 
la fuerza de fricción en PhysicsEngine.

[Modifica Model para permitir toggle]

Ahora puedes comparar trayectorias con y sin aire.
```

**Profesor:** Prueba feature, ve diferencia entre trayectorias ✓

---

### Interacción 4: Refinamiento visual

**Profesor:** "¿Puedo ver vector de velocidad en cada punto?"

```
ChatGPT: Sí. Voy a incrustar también VectorRenderer 
para mostrar vectores de velocidad...

[Añade código de VectorRenderer]

Ahora la visualización es más pedagógica.
```

**Profesor:** Verifica, está bien ✓

---

### Resultado después de iteraciones:

```
lanzamiento-proyectiles.html (AUTOCONTENIDO)
├─ Funciona abriendo en navegador
├─ Interactivo (sliders, botones)
├─ Gráfico dinámico
├─ Cálculos físicos correctos
└─ Listo para usar en clase
```

---

## 📄 FASE 4: GENERAR TARJETA (Profesor + IA, 5 min)

**Profesor en ChatGPT:**

```
ChatGPT, ahora necesito una tarjeta (card) para 
este laboratorio que se pueda publicar en la plataforma 
VerneLabs.

Características:
- Categoría: Física
- Título: Lanzamiento de Proyectiles
- Descripción: Simulación interactiva que permite...
- Botones: "Abrir Simulación" y "Ver Unidad Didáctica"

Sigue el patrón de las tarjetas modelo en el BLUEPRINT.
```

---

**ChatGPT responde:**

```html
<!-- card-lanzamiento-proyectiles.html -->
<div class="card">
  <div class="card-header">
    <span class="category">Física</span>
    <span class="language">JavaScript</span>
  </div>
  
  <h3 class="card-title">Lanzamiento de Proyectiles</h3>
  
  <p class="card-description">
    Simulación interactiva que permite estudiar el movimiento 
    de un proyectil considerando la resistencia del aire. 
    Ajusta ángulo, velocidad, masa y densidad del aire...
  </p>
  
  <div class="card-actions">
    <a href="./index.html" class="btn-primary">Abrir Simulación</a>
    <a href="./unidad-didactica.html" class="btn-secondary">
      Ver Unidad Didáctica
    </a>
  </div>
</div>

<style>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 300px;
  font-family: Arial, sans-serif;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
}

.category {
  background: #e0e7ff;
  color: #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.language {
  background: #f0fdf4;
  color: #10b981;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.card-title {
  font-size: 18px;
  margin: 10px 0;
  color: #1f2937;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 10px 0;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
}
</style>
```

Card lista para usar.
```

**Profesor:** Copia el HTML ✓

---

## 📚 FASE 5: GENERAR UNIDAD DIDÁCTICA (Profesor + IA, 20-30 min)

**Profesor en ChatGPT:**

```
Ahora necesito la Unidad Didáctica (Situación de Aprendizaje) 
para este laboratorio.

Información:
- Lab: Lanzamiento de Proyectiles con Resistencia del Aire
- Asignatura: Física
- Curso: 1º Bachillerato
- Tiempo: 50 minutos (una clase)
- Competencias: STEM, Digital
- Saberes clave: Movimiento, fuerzas, resistencia

Estructura: Sigue el patrón de las unidades modelo en BLUEPRINT
- Situación de aprendizaje
- Competencias clave
- Saberes básicos
- Criterios de evaluación
- Actividades (3: exploración, experimentación, aplicación)
- Temporalización
- Evaluación
```

---

**ChatGPT responde (EXTENSA):**

```markdown
# Unidad Didáctica: Lanzamiento de Proyectiles con Resistencia del Aire

## 1. Situación de Aprendizaje

**Contexto:** En el mundo real, cuando lanzas una pelota, 
un avión vuela o una flecha se dispara, hay un factor que 
muchas veces ignoramos en clase: la resistencia del aire.

**Pregunta esencial:** 
¿Cómo afecta la resistencia del aire a la trayectoria de un 
proyectil y cómo podemos predecirlo?

**Problema a resolver:** 
Eres un ingeniero de una empresa de deportes. Necesitas diseñar 
un nuevo tipo de pelota de fútbol que viaje más lejos. 
¿Qué parámetros cambiarías? ¿Cómo influye la densidad del aire?

---

## 2. Competencias Clave

✓ Competencia Matemática y en Ciencia, Tecnología e Ingeniería (STEM)
  - Usar modelos matemáticos de movimiento
  - Aplicar leyes de Newton

✓ Competencia Digital
  - Usar herramientas de simulación
  - Analizar datos gráficos

✓ Competencia en Conciencia y Expresión Culturales
  - Apreciar la ciencia en deportes y tecnología

---

## 3. Saberes Básicos

(Según currículo de Bachillerato)

- Movimiento en dos dimensiones
- Componentes de velocidad (x, y)
- Fuerzas y segunda ley de Newton
- Movimiento bajo fuerzas constantes
- Resistencia del aire (fuerza de fricción)
- Integración numérica

---

## 4. Criterios de Evaluación

- [ ] Explica cómo la resistencia del aire afecta el movimiento
- [ ] Predice cambios en trayectoria ajustando parámetros
- [ ] Identifica diferencias entre movimiento ideal vs real
- [ ] Usa correctamente el simulador para experimentar

---

## 5. Actividades

### Actividad 1: Exploración (15 minutos)

**Objetivo:** Que el alumno entienda la interfaz y observe 
cómo varían las trayectorias.

**Procedimiento:**
1. Abre el lab en tu navegador
2. Deja todos los valores por defecto (ángulo 45°, velocidad 50 m/s)
3. Observa la trayectoria que dibuja
4. Anota en tu cuaderno:
   - ¿Dónde cae el proyectil? (alcance)
   - ¿Cuál es la altura máxima?
   - ¿Cuánto tiempo dura el vuelo?

5. Ahora activa "Resistencia del aire"
6. Compara: ¿Cómo cambió la trayectoria?
7. Anota diferencias

**Recursos:** Simulador, cuaderno

---

### Actividad 2: Experimentación (20 minutos)

**Objetivo:** Que el alumno descubra patrones manipulando 
parámetros.

**Procedimiento:**
1. Manteniendo ángulo = 45°, varía la VELOCIDAD
   - Velocidad 30: observa alcance
   - Velocidad 50: observa alcance
   - Velocidad 70: observa alcance
   - Conclusión: ¿Cómo afecta velocidad al alcance?

2. Manteniendo velocidad = 50°, varía el ÁNGULO
   - Prueba 30°, 45°, 60°
   - ¿Cuál da el mayor alcance?
   - ¿Es diferente con resistencia?

3. Varía la MASA
   - Masa 0.1 kg vs Masa 5 kg
   - ¿Cómo afecta?

4. Varía DENSIDAD del aire
   - Densidad 0 (vacío): ¿Qué pasa?
   - Densidad 2 (aire denso): ¿Qué pasa?

**Registro:** Completa tabla de resultados

---

### Actividad 3: Aplicación (15 minutos)

**Objetivo:** Aplicar conocimiento a problema real.

**Problema:** 
Un equipo de tenis necesita una pelota que viaje 25 metros 
en condiciones normales (aire estándar, ángulo 20°). 
Actualmente viaja solo 20 metros.

¿Qué parámetro (masa, aerodinámica = densidad) podrías 
cambiar para mejorar el alcance?

**Tarea:**
1. Usa el simulador para encontrar la solución
2. Realiza al menos 5 pruebas diferentes
3. Documenta qué cambios probaste
4. Explica por qué funciona tu solución

---

## 6. Recursos Necesarios

- Computadora con navegador
- Simulador (index.html)
- Cuaderno
- Opcional: Calculadora

---

## 7. Temporalización

| Actividad | Tiempo |
|-----------|--------|
| Introducción + exploración | 15 min |
| Experimentación | 20 min |
| Aplicación + reflexión | 15 min |
| **Total** | **50 min** |

---

## 8. Evaluación

### Autoevaluación (alumno)
- ¿Entendí cómo funciona la resistencia del aire?
- ¿Pude predecir cambios en la trayectoria?
- ¿Resolví el problema de la pelota de tenis?

### Heteroevaluación (profesor)

**Rúbrica:**

| Criterio | Insuficiente | Básico | Competente | Avanzado |
|----------|-------------|--------|-----------|----------|
| Uso simulador | No lo usa | Uso básico | Maneja bien | Explora a fondo |
| Análisis resultados | No analiza | Describe | Compara | Predice |
| Problema tenis | No intenta | Intenta sin éxito | Encuentra solución | Explica física |

---

## 9. Notas para el Profesor

- Los estudiantes suelen sorprenderse con la resistencia del aire
- Algunos predecirán mal los efectos; eso es parte del aprendizaje
- El problema del tenis motiva porque es real
- Puedes extender a: balística, deportes, aeronáutica

---

**Tiempo total de preparación:** 5 minutos (copiar-pegar)
**Tiempo de clase:** 50 minutos
**Valor pedagógico:** ★★★★★
```

**Profesor:** Lee la unidad generada ✓

---

## ✏️ FASE 6: ITERACIÓN SOBRE UNIDAD DIDÁCTICA (Profesor + IA, 10-15 min)

**Profesor en ChatGPT:**

```
La unidad está bien, pero quiero hacer algunos cambios:

1. En Actividad 2, añade una pregunta sobre la física:
   "¿Por qué la resistencia del aire es proporcional 
   a la velocidad al cuadrado?"

2. Cambia el problema del tenis por otro más apropiado:
   "Diseña una trayectoria para un lanzamiento de peso"

3. Simplifica la rúbrica (demasiadas columnas)

4. Añade una reflexión final para los alumnos:
   "¿Dónde ves resistencia del aire en tu vida diaria?"
```

---

**ChatGPT modifica:**

```markdown
[Unidad actualizada con cambios]

Cambios realizados:
✓ Pregunta sobre física cuadrática añadida
✓ Problema de tenis → problema de lanzamiento de peso
✓ Rúbrica simplificada a 3 niveles
✓ Reflexión final integrada

¿Algo más que ajustar?
```

**Profesor:** "Perfecto, esto está listo" ✓

---

## 📦 FASE 7: PREPARAR ENTREGA (Profesor, 5 min)

**Profesor crea carpeta:**

```
lanzamiento-proyectiles/
├── index.html (lab autocontenido - 800 líneas)
├── card.html (tarjeta para plataforma - 100 líneas)
└── unidad-didactica.html (documento pedagógico - 300 líneas)
```

**Nota:** Los 3 archivos están en HTML para máxima compatibilidad

```
<!-- unidad-didactica.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Unidad Didáctica: Lanzamiento Proyectiles</title>
  <style>
    body { font-family: Arial; margin: 40px; max-width: 900px; }
    h1 { color: #667eea; }
    h2 { color: #1f2937; margin-top: 30px; }
    .actividad { background: #f9fafb; padding: 15px; margin: 15px 0; }
  </style>
</head>
<body>
  [Contenido markdown convertido a HTML]
</body>
</html>
```

**Profesor:** Comprime carpeta en ZIP ✓

---

## ✅ FASE 8: ENVÍO AL RESPONSABLE

**Profesor envía por email:**

```
Asunto: Nuevo Lab - Lanzamiento de Proyectiles

Adjunto: lanzamiento-proyectiles.zip

Contenido:
- index.html → Laboratorio interactivo (probado, funciona)
- card.html → Tarjeta para publicar
- unidad-didactica.html → Material pedagógico

Estado: Listo para validar, modularizar y publicar
```

---

## 🔧 FASE 9: VALIDACIÓN Y PUBLICACIÓN (Responsable, 20 min)

**Responsable del proyecto (con Claude Code):**

```
1. Valida que funcione:
   - Descarga ZIP
   - Abre index.html → Funciona ✓
   - Prueba interactividad ✓
   - Verifica que código sea válido ✓

2. Valida estructura:
   - ¿Es pedagógicamente coherente? ✓
   - ¿Unidad didáctica sigue estructura andaluza? ✓
   - ¿Card es visualmente consistente? ✓

3. Modulariza (si es necesario):
   - Si el HTML es muy largo, separa en archivos
   - Crea estructura: /simulaciones/lanzamiento-proyectiles/
   - Actualiza imports a /shared/
   - Verifica que siga el patrón verne-labs

4. Publica:
   - Coloca en repositorio
   - Actualiza index.html principal
   - Publica unidad didáctica en web pedagógica
   - Git commit + push
   - GitHub Pages se actualiza automáticamente

5. Comunica:
   - Notifica al profesor: "Tu lab ya está publicado"
```

---

## 📊 RESUMEN DEL CICLO COMPLETO

| Fase | Quién | Tiempo | Qué produce |
|------|-------|--------|------------|
| 1. Preparación | Profesor | 5 min | Recursos descargados |
| 2. Dashboard | Profesor | 10 min | Prompt inicial |
| 3. ChatGPT | Profesor+IA | 30-45 min | Lab funcional |
| 4. Tarjeta | Profesor+IA | 5 min | Card HTML |
| 5. Unidad v1 | Profesor+IA | 20 min | Unidad básica |
| 6. Iteración | Profesor+IA | 10-15 min | Unidad final |
| 7. Preparar | Profesor | 5 min | Carpeta ZIP |
| 8. Envío | Profesor | 1 min | Email al responsable |
| 9. Validación | Responsable | 20 min | Lab publicado |
| **TOTAL** | | **2-3 horas** | **Lab completo en producción** |

---

## 🎯 RESULTADO FINAL

```
verne-labs/
├── simulaciones/
│   └── lanzamiento-proyectiles/
│       ├── index.html (lab)
│       ├── css/lanzamiento.css (extraído)
│       ├── js/ProyectilModel.js (modularizado)
│       ├── js/ProyectilView.js (modularizado)
│       └── js/ProyectilPresenter.js (modularizado)
│
└── index.html (principal)
    ├── card de Lanzamiento Proyectiles
    └── Link a unidad didáctica

pedagogia-verne-labs/
└── unidades/
    └── lanzamiento-proyectiles.html (publicable)
```

**Lab completamente funcional, pedagógicamente coherente, publicado.**

---

## 💡 VENTAJAS DEL FLUJO

✅ **Profesor:** 
- No necesita saber programación avanzada
- Usa herramientas que ya conoce (ChatGPT)
- Itera hasta estar satisfecho
- Recibe recurso listo para clase

✅ **IA (ChatGPT/Claude/Gemini):**
- Lee BLUEPRINT → entiende estructura
- Sigue patrones → código consistente
- Puede iterar rápido

✅ **Responsable:**
- Recibe lab validado y listo
- Solo modulariza (tarea mecánica)
- Garantiza compatibilidad

✅ **Estudiantes:**
- Lab coherente con currículo
- Unidad didáctica clara
- Experimento real en clase

---

## 🚀 IMPACTO

**Sin este flujo:**
- Profesor hace lab en PowerPoint + Excel
- No es interactivo
- Estudiantes no experimentan

**Con este flujo:**
- Profesor crea lab interactivo en 2-3 horas
- Estudiantes pueden experimentar
- Recurso publicado y reutilizable
- Ciclo: Profesor → Responsable → Plataforma en menos de un día

**Escalabilidad:** Un profesor puede hacer 1-2 labs por semana (si dedica tiempo)

---

**Este es el ideal que permite democratizar la creación de recursos educativos digitales.**
