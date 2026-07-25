# Análisis: Publicación y Aspecto Pedagógico

**Contexto:** El asistente no solo genera el código del lab, sino también los artefactos de publicación:
1. **Tarjeta del Lab** (card visual para plataforma)
2. **Unidad Didáctica** (situaciones de aprendizaje - terminología Junta de Andalucía)

Ambos se entregan al responsable del proyecto para publicación.

---

## 📋 ENTENDIMIENTO DEL CONTEXTO

### ¿Qué entra en cada artefacto?

#### 1️⃣ TARJETA DEL LAB (card)
```html
Ejemplo actual en plataforma:

┌─────────────────────────────┐
│ [Física] [JavaScript]       │
│                             │
│ Derivada como Límite       │
│                             │
│ Laboratorio virtual para   │
│ visualizar la derivada     │
│ como límite de la pendiente│
│ secante cuando el...       │
│                             │
│ [Abrir simulación]          │
│ [Ver unidad didáctica]      │
└─────────────────────────────┘
```

**Contiene:**
- Categoría (Física, Matemáticas, Biología, etc)
- Lenguaje (JavaScript)
- Título del lab
- Descripción corta (2-3 líneas)
- 2 botones: Abrir + Ver didáctica

---

#### 2️⃣ UNIDAD DIDÁCTICA (Situación de Aprendizaje)
```
Terminología Junta de Andalucía:

Estructura estándar:
├── Título
├── Situación de aprendizaje (descripción)
├── Competencias clave que desarrolla
├── Saberes básicos implicados
├── Criterios de evaluación
├── Actividades
│   ├── Actividad 1: Exploración
│   ├── Actividad 2: Experimentación
│   └── Actividad 3: Aplicación
├── Recursos necesarios
├── Temporalización
└── Evaluación

Enfoque: Problem-based learning + experimentación
```

---

## 🤖 ANÁLISIS: ¿Qué debería generar el asistente?

### Opción A: Asistente genera TODO
```
Dashboard (inputs usuario)
  ↓
Genera:
  ├─ Código del lab (HTML+CSS+JS o modular)
  ├─ Tarjeta (card HTML/template)
  └─ Unidad didáctica (markdown con estructura)
  ↓
Entrega al responsable: 
  ├─ /simulaciones/mi-lab/ (carpeta funcional)
  ├─ card-mi-lab.html (publicable en index)
  └─ unidad-didactica-mi-lab.md (publicable en web)
```

**Viabilidad:** 🟢 ALTA

**Por qué funciona:**
- El usuario ya proporciona: tema, asignatura, descripción, tipo
- La IA puede generar:
  - Card: Templated (categoría + título + descripción)
  - Unidad: Estructurada según plantilla andaluza

---

### Opción B: Usuario rellena formularios adicionales
```
Dashboard paso 4+: Información adicional
├─ Competencias clave (multiselect)
├─ Saberes básicos (text)
├─ Criterios evaluación (text)
├─ Actividades propuestas (text)
├─ Temporalización (number)
  ↓
Asistente genera unidad didáctica personalizada
```

**Viabilidad:** 🟢 MEDIA-ALTA

**Problema:** Añade 10+ campos más al formulario (carga usuario)

---

### Opción C: Híbrida (RECOMENDADA)
```
Asistente genera PLANTILLA de:
  ├─ Card (automático)
  └─ Unidad didáctica (borrador automático)
  
Usuario completa campos específicos:
  ├─ Competencias clave
  ├─ Saberes básicos
  └─ Criterios evaluación

O mejor aún:
  Asistente pregunta: "¿Quieres generar también la Unidad Didáctica?"
  SI → Rellena formulario adicional (opcional)
  NO → Solo genera código del lab
```

---

## 📊 ANÁLISIS: ¿Qué incluir en BLUEPRINT para esto?

### Para TARJETA (Card):

```markdown
# Sección: Plantilla de Card

## Estructura HTML

```html
<!-- card-mi-lab.html -->
<div class="card">
  <div class="card-header">
    <span class="category">Física</span>
    <span class="language">JavaScript</span>
  </div>
  
  <h3 class="card-title">Derivada como Límite</h3>
  
  <p class="card-description">
    Laboratorio virtual para visualizar la derivada como límite...
  </p>
  
  <div class="card-actions">
    <a href="./simulaciones/derivadas/">Abrir</a>
    <a href="./unidades/derivadas/unidad.html">Ver Unidad</a>
  </div>
</div>
```

## Estilos CSS (integrados en labs-common.css)
```css
.card {
  /* Estilos compartidos */
}
```

## Reglas de generación
- Categoría: Seleccionada por usuario
- Título: Del formulario
- Descripción: Del formulario (max 150 caracteres)
- Links: Automáticos según estructura
```

---

### Para UNIDAD DIDÁCTICA:

```markdown
# Sección: Plantilla de Unidad Didáctica (Situación de Aprendizaje)

## Estructura Markdown (Junta de Andalucía)

```markdown
# Unidad Didáctica: [Nombre Lab]

## 1. Situación de Aprendizaje

**Contexto:** 
[Descripción que da sentido al aprendizaje]

**Pregunta esencial:** 
¿Cómo [pregunta motivadora]?

---

## 2. Competencias Clave

- Competencia matemática y competencia en ciencia, tecnología e ingeniería (STEM)
- Competencia digital
- Competencia en conciencia y expresión culturales

---

## 3. Saberes Básicos

[Según Real Decreto 243/2022]
- Bloque 1: [tema]
- Bloque 2: [tema]

---

## 4. Criterios de Evaluación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

---

## 5. Actividades

### Actividad 1: Exploración (15 min)
- Objetivo: Que el alumno...
- Recursos: Lab [nombre]
- Procedimiento: 
  1. Abre el lab
  2. Experimenta con valores
  3. Observa cambios

### Actividad 2: Experimentación (20 min)
- Objetivo: Que el alumno...
- Procedimiento: ...

### Actividad 3: Aplicación (15 min)
- Objetivo: Aplicar a problema real
- Tarea: [Descripción]

---

## 6. Recursos

- Lab: [Nombre]
- Calculadora (opcional)
- Hoja de trabajo

---

## 7. Temporalización

- Total: 50 minutos
- Distribución: 15+20+15

---

## 8. Evaluación

- Rúbrica: [Criterios]
- Autoevaluación: [Preguntas reflexivas]
- Heteroevaluación: [Observación del profesor]
```

## Reglas de generación automática
- Situación: Generada a partir de descripción + tipo de lab
- Competencias: Predefinidas por asignatura
- Saberes: Template según asignatura
- Actividades: Template adaptado (3 actividades estándar)
- Criterios: Template adaptado
```

---

## 🎯 IMPLICACIONES PARA EL ASISTENTE

### Dashboard necesita nuevas secciones:

#### Opción Simplificada (Recomendada):
```
Paso 0: Modo (monolítico, modular, etc)
Paso 1: Información básica
Paso 2: Componentes SHARED
Paso 3: Variables
Paso 4: ¿Generar también unidad didáctica?
         ○ No (solo lab)
         ○ Sí, básica (auto-generada)
         ○ Sí, completa (con formulario adicional)
```

Si usuario elige "Sí, completa":
```
Paso 5a: Competencias clave (multiselect con opciones por asignatura)
Paso 5b: Saberes básicos (texto libre)
Paso 5c: Actividades propuestas (3 inputs de texto)
Paso 6: Output (código + card + unidad didáctica)
```

#### Salida (Output):
```
Prompt generado incluye:

BLUEPRINT (secciones relevantes)
+
Código de componentes (si monolítico)
+
Lab modelo (del tipo seleccionado)
+
PLANTILLA DE UNIDAD DIDÁCTICA (con campos completados)
+
PLANTILLA DE CARD (con datos del usuario)
+
Instrucción: "Genera:
  1. Código del lab
  2. Card del lab
  3. Unidad didáctica (completando los campos)"
```

---

## 📦 ENTREGA AL RESPONSABLE

El asistente genera una carpeta lista para publicar:

```
mi-lab-entrega/
├── LAB (código funcional)
│   ├── simulaciones/mi-lab/
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   └── README.md
│
├── PUBLICACIÓN (artefactos web)
│   ├── card-mi-lab.html
│   └── unidad-didactica-mi-lab.md
│
└── DOCUMENTACIÓN
    ├── GUÍA_PROFESOR.md
    ├── GUÍA_ALUMNO.md
    └── NOTAS_IMPLEMENTACIÓN.md
```

**Responsable solo necesita:**
1. Copiar carpeta simulaciones/ al proyecto
2. Agregar card-mi-lab.html a index.html
3. Publicar unidad didáctica en web pedagógica
4. Push a repositorio

---

## 🧠 ANÁLISIS PEDAGÓGICO

### ¿Por qué generar la Unidad Didáctica?

**Antes (sin unidad):**
```
Profesor: "Aquí hay un lab de derivadas"
Alumno: ¿Qué hago? ¿Para qué?
Resultado: Experimentación sin dirección
```

**Después (con unidad):**
```
Profesor: "Aquí hay la Situación de Aprendizaje"
├─ Contexto: ¿Por qué importa?
├─ Actividades: Qué hacer y para qué
├─ Evaluación: Cómo demostraste aprendizaje
Alumno: Claro, tengo dirección
Resultado: Experimentación + aprendizaje
```

### Alineación con "Situaciones de Aprendizaje" (Junta Andalucía):

**Cinco características clave:**
1. ✅ Contexto significativo
   - El lab MISMO es el contexto
2. ✅ Problem-based
   - Pregunta esencial: "¿Cómo funciona [concepto]?"
3. ✅ Competencias integradas
   - STEM, digital, etc
4. ✅ Actividades progresivas
   - Exploración → Experimentación → Aplicación
5. ✅ Evaluación formativa
   - Rúbrica, autoevaluación

**El lab + Unidad = Situación de Aprendizaje COMPLETA**

---

## 📊 IMPACTO EN BLUEPRINT

BLUEPRINT debe incluir ejemplos de:

```
Sección A: CÓDIGO (ya existe)
├─ Estructura directorios
├─ Componentes SHARED COMPLETOS
└─ 3 Labs modelo COMPLETOS

Sección B: PUBLICACIÓN (NUEVA)
├─ 3 Tarjetas modelo (HTML + CSS)
└─ 3 Unidades Didácticas modelo
    ├─ Derivadas (STATIC)
    ├─ Cinemática (DYNAMIC-DET)
    └─ Ecología (DYNAMIC-STO)

Sección C: PLANTILLAS (NUEVA)
├─ Plantilla de Card (HTML)
├─ Plantilla de Unidad Didáctica (Markdown)
└─ Instrucciones de generación
```

---

## 🎯 CHECKLIST: BLUEPRINT AMPLIADO + PUBLICACIÓN

### Contenido del BLUEPRINT (80-120 páginas total):

```
Sección 1: Introducción (5 págs)
Sección 2: Estructura (10 págs)
Sección 3: Componentes SHARED (30 págs)
Sección 4: Labs Modelo CÓDIGO (40 págs)
  ├─ Derivadas COMPLETO
  ├─ Cinemática COMPLETO
  └─ Ecología COMPLETO

[NUEVO] Sección 5: Publicación (20-30 págs)
  ├─ Tarjeta: Ejemplos + Plantilla
  ├─ Unidad Didáctica: Ejemplos (3) + Plantilla
  └─ Instrucciones de generación

Sección 6: Patrones (10 págs)
Sección 7: Troubleshooting (5 págs)
```

---

## 💡 IMPLICACIONES TÉCNICAS

### 1. Dashboard crece en complejidad:
```
Antes: 4 pasos
Después: 4 pasos + Paso 4 (¿generar unidad?)
         Si sí → +5 pasos adicionales

Total: Máximo 9 pasos
```

**Solución:** Hacer paso 4 en pestaña separada o "formulario expandible"

### 2. Prompts generados serán más complejos:

```
Estructura actual:
[BLUEPRINT] + [información usuario] + [componentes]

Estructura nueva:
[BLUEPRINT] + [información usuario] + [componentes]
+ [TEMPLATE UNIDAD] + [datos específicos unidad]
+ [TEMPLATE CARD] + [datos específicos card]
```

**Solución:** Bien formateado (usar secciones claras con `===`)

### 3. Validación de Unidad Didáctica:

La IA debe generar una unidad que:
- ✅ Siga estructura andaluza
- ✅ Incluya competencias relevantes
- ✅ Tenga actividades coherentes
- ✅ Sea pedagógicamente válida

**Solución:** BLUEPRINT incluye ejemplos EXCELENTES de unidades bien hechas

---

## 🏆 VALORACIÓN FINAL

### Generar Tarjeta + Unidad Didáctica añade:

| Aspecto | Impacto |
|---------|---------|
| **Valor pedagógico** | 🟢 CRÍTICO (transforma lab en SA completa) |
| **Carga en usuario** | 🟡 MEDIA (5 campos adicionales opcionales) |
| **Carga en IA** | 🟢 BAJA (templates bien definidas) |
| **Viabilidad técnica** | 🟢 ALTA (templates están claras) |
| **Validación** | 🟡 MEDIA (IA podría generar contenido débil) |
| **Beneficio para responsable** | 🟢 ENORME (lista para publicar) |

---

## 📋 RECOMENDACIÓN

### Implementar en 3 fases:

**Fase 1 (Ahora):**
- BLUEPRINT incluye plantillas de Card + Unidad
- Dashboard: Simple → SI/NO ¿generar?
- Si SÍ → Asistente genera versiones BÁSICAS (auto-completadas)

**Fase 2 (2 semanas):**
- Dashboard Paso 4: Expandible con 5 campos específicos
- Asistente genera versiones PERSONALIZADAS

**Fase 3 (Futuro):**
- Validador de Unidad Didáctica (verifica estructura andaluza)
- Preview de Card antes de generar

---

## 🎓 SÍNTESIS

La **Unidad Didáctica** es lo que:
- Transforma un "lab interactivo" en "Situación de Aprendizaje"
- Da dirección pedagógica al alumno
- Alinea con normativa Junta Andalucía
- Facilita trabajo del profesor
- Garantiza coherencia curricular

**Generarla automáticamente = +80% de valor pedagógico**

---

**Conclusión:** 🟢 **ALTAMENTE RECOMENDADO**

Implementar generación de Tarjeta + Unidad Didáctica.

Esto no es un "nice-to-have", es **parte esencial de la propuesta educativa.**

Sin la Unidad Didáctica, es un lab. Con ella, es una experiencia pedagógica completa.
