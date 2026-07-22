# Arquitectura de VerneLabs

## Estructura del proyecto

```
verne-labs/
├── css/                          # Estilos de la página principal
│   └── styles.css                # Tema general (reutilizable en labs)
│
├── shared/                        # Módulos y recursos COMPARTIDOS
│   ├── assets/
│   │   └── css/
│   │       └── verne-theme.css    # Tema compartido (disponible para simulaciones)
│   │
│   ├── js/                        # Librerías funcionales reutilizables
│   │   ├── graphics/              # Motor de gráficos, dibujo, visualización
│   │   ├── math/                  # Utilidades matemáticas, cálculos
│   │   ├── models/                # Modelos de datos abstractos
│   │   ├── physics/               # Físicas: cinemática, dinámica, etc.
│   │   ├── presenters/            # Lógica de presentación (MVC/MVP)
│   │   ├── simulations/           # Motores de simulación genéricos
│   │   ├── ui/                    # Componentes UI reutilizables
│   │   └── utils/                 # Funciones auxiliares generales
│   │
│   ├── templates/
│   │   └── simulation-card/       # Template de tarjeta (usado en index.html)
│   │
│   └── tests/                     # Tests para módulos compartidos
│
├── simulaciones/                  # Laboratorios PUBLICADOS
│   ├── config.json                # Configuración de categorías y metadata
│   ├── manifest.js                # Índice dinámico de cards (generado)
│   │
│   ├── ecologia-poblaciones/      # Lab específico
│   │   ├── index.html             # Simulación interactiva
│   │   ├── unidad-didactica.html  # Recursos educativos
│   │   ├── card-*.html            # Tarjeta del catálogo
│   │   └── EcologySimulationEngine.js  # Lógica específica (usa shared/)
│   │
│   ├── plano-inclinado/
│   │   ├── index.html
│   │   ├── PlanoInclinadoModel.js     # Modelo específico
│   │   ├── PlanoInclinadoPresenter.js # Presentador específico
│   │   └── ...
│   │
│   └── [otros laboratorios]/
│
├── BETA/                          # Laboratorios en DESARROLLO
│   ├── aceleración-circular/
│   ├── dinámica-de-sistemas-dinámicos/
│   └── ...
│
├── index.html                     # Página principal (catálogo)
└── documentacion/                 # Documentación del proyecto
```

---

## Propósito de cada carpeta

### 🎨 **css/** (Estilos de página principal)
- **Qué**: Hoja de estilos única para index.html
- **Uso**: Visual de la página de catálogo
- **Reutilizable**: SÍ - labs pueden importarlo si lo necesitan

### 📦 **shared/** (Librerías funcionales reutilizables)
Módulos que se usan en múltiples simulaciones:

#### `shared/js/physics/`
- Leyes de Newton, cinemática, dinámica
- Gravitación, colisiones, rozamiento
- **Usado por**: plano-inclinado, cinematica-2d, etc.

#### `shared/js/math/`
- Cálculo de derivadas, integrales
- Álgebra vectorial, matrices
- **Usado por**: derivadas, funciones-inecuaciones

#### `shared/js/graphics/`
- Canvas rendering, gráficas, animaciones
- Visualización de datos
- **Usado por**: Todas las simulaciones

#### `shared/js/ui/`
- Sliders, botones, inputs interactivos
- Paneles de control
- **Usado por**: Interfaces comunes

#### `shared/js/simulations/`
- Motor de simulación genérico (paso de tiempo, estados)
- Loop de actualización
- **Usado por**: Todas las simulaciones

### 🧪 **simulaciones/** (Labs PUBLICADOS)
Cada carpeta = un laboratorio completo y funcional

**Estructura típica de un lab:**
```
simulaciones/mi-lab/
├── index.html                    # La simulación (lo que el usuario ve)
├── unidad-didactica.html         # Material educativo (opcional)
├── card-mi-lab.html              # Tarjeta en el catálogo
└── MiLabEngine.js / MiLabModel.js # Lógica ESPECÍFICA de este lab
```

**Importante**: Cada lab:
- ✅ Importa módulos de `shared/`
- ✅ Puede tener lógica propia en archivos locales
- ✅ NO duplica código (usa shared/)
- ❌ NO modifica shared/ (solo lo consume)

### 🚀 **BETA/** (Labs en desarrollo)
- Misma estructura que simulaciones/
- Cuando están listos → se mueven a simulaciones/
- El script PowerShell `lab-manager.ps1` maneja esto

---

## Cómo debería usarse config.json

**Actual** (solo categorías):
```json
{
  "etiquetas": ["Biología", "Física", "Matemáticas", "Informática / IA"]
}
```

**Propuesta mejorada** (con metadata y módulos):
```json
{
  "version": "1.0",
  "etiquetas": [
    {
      "nombre": "Física",
      "id": "fisica",
      "color": "#fee2e2"
    },
    {
      "nombre": "Biología",
      "id": "biologia",
      "color": "#ccfbf1"
    }
  ],
  
  "modulosCompartidos": {
    "physics": {
      "version": "1.0",
      "descripcion": "Motores de física (cinemática, dinámica, fuerzas)",
      "modulos": [
        "NewtonianPhysics",
        "KinematicsSolver",
        "CollisionDetector"
      ]
    },
    "graphics": {
      "version": "1.0",
      "descripcion": "Gráficas y visualización 2D/3D",
      "modulos": [
        "Canvas2DRenderer",
        "GraphPlotter",
        "AnimationEngine"
      ]
    },
    "math": {
      "version": "1.0",
      "descripcion": "Cálculos matemáticos",
      "modulos": [
        "Calculus",
        "VectorMath",
        "LinearAlgebra"
      ]
    }
  },

  "laboratorios": [
    {
      "id": "ecologia-poblaciones",
      "nombre": "Ecología de Poblaciones",
      "categoria": "biologia",
      "carpeta": "ecologia-poblaciones",
      "modulosRequeridos": ["graphics", "math"],
      "estado": "publicado"
    },
    {
      "id": "plano-inclinado",
      "nombre": "Dinámica en plano inclinado",
      "categoria": "fisica",
      "carpeta": "plano-inclinado",
      "modulosRequeridos": ["physics", "graphics"],
      "estado": "publicado"
    }
  ]
}
```

---

## Flujo de uso

### 1. **Crear nuevo lab**
```
BETA/mi-simulacion/
├── index.html                      # Tu simulación
├── MiSimulationEngine.js
└── (importa shared/js/physics/*, shared/js/graphics/*, etc.)
```

### 2. **Publicar con PowerShell**
```
lab-manager.ps1 → Publish
  1. Mueve BETA/mi-simulacion → simulaciones/mi-simulacion
  2. Crea card-mi-simulacion.html
  3. Actualiza config.json (si es necesario)
  4. Actualiza manifest.js
  5. git add + commit + push
```

### 3. **El index.html**
- Lee config.json → genera botones de filtro
- Lee manifest.js → genera tarjetas
- Los estilos vienen de css/styles.css

---

## Ventajas de esta estructura

✅ **Reutilización**: Los labs comparten código via `shared/`
✅ **Mantenibilidad**: Bug en physics/ → todos los labs lo heredan
✅ **Escalabilidad**: 50 labs reutilizan 1 motor de gráficos
✅ **Organización**: Claro qué es compartido vs. específico
✅ **Testabilidad**: Modulos compartidos = tests centralizados
