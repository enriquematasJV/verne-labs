const LABS_MANIFEST = {
  laboratorios: [
    {
      id: "ecologia-poblaciones",
      nombre: "Laboratorio de Ecología de Poblaciones",
      carpeta: "ecologia-poblaciones",
      html: `<article class="simulation-card" data-subject="biologia">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag bio">Biología</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Laboratorio de Ecología de Poblaciones</h3>
  </div>
  <div class="card-body">
    <p>Simulación interactiva para estudiar cómo evolucionan distintas poblaciones dentro de un ecosistema sencillo. Permite observar crecimiento, competencia, equilibrio, extinción y cambios derivados de modificar las condiciones iniciales.</p>
    <ul class="features">
      <li>Dinámica de poblaciones.</li>
      <li>Interacciones entre organismos.</li>
      <li>Experimentación con parámetros.</li>
      <li>Análisis de patrones emergentes.</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/ecologia-poblaciones/index.html">Abrir simulación</a>
    <a class="button secondary" href="simulaciones/ecologia-poblaciones/unidad-didactica.html">Ver unidad didáctica</a>
  </div>
</article>`
    },
    {
      id: "cinematica-encuentros-alcances",
      nombre: "Cinemática: encuentros y alcances",
      carpeta: "cinematica-encuentros-alcances",
      html: `<article class="simulation-card" data-subject="fisica">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Física</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Cinemática: encuentros y alcances</h3>
  </div>
  <div class="card-body">
    <p>Laboratorio virtual para estudiar problemas clásicos de cinemática rectilínea con dos móviles: encuentros en sentidos contrarios, alcances en la misma dirección y movimientos con velocidad constante o aceleración.</p>
    <ul class="features">
      <li>Resolución visual de problemas de encuentro y alcance.</li>
      <li>Comparación entre MRU y MRUA con dos móviles.</li>
      <li>Representación de ecuaciones de posición y condición xâ‚(t) = xâ‚‚(t).</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/cinematica-encuentros-alcances/index.html">Abrir simulación</a>
    <a class="button secondary" href="simulaciones/cinematica-encuentros-alcances/unidad-didactica.html">Ver unidad didáctica</a>
  </div>
</article>`
    },
    {
      id: "cinematica-2d",
      nombre: "Cinemática 2D: tiro vertical y parabólico",
      carpeta: "cinematica-2d",
      html: `<article class="simulation-card" data-subject="fisica">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Física</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Cinemática 2D: tiro vertical y parabólico</h3>
  </div>
  <div class="card-body">
    <p>Laboratorio virtual para analizar el movimiento de una pelota en dos dimensiones, incluyendo tiro vertical, lanzamiento horizontal desde una altura y tiro parabólico completo con descomposición de velocidades.</p>
    <ul class="features">
      <li>Estudio del movimiento vertical con aceleración gravitatoria negativa.</li>
      <li>Descomposición de la velocidad inicial en componentes vâ‚€x y vâ‚€y.</li>
      <li>Análisis de altura máxima, tiempo de vuelo, alcance horizontal y velocidad de impacto.</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/cinematica-2d/index.html">Abrir simulación</a>
    <a class="button secondary" href="simulaciones/cinematica-2d/unidad-didactica.html">Ver unidad didáctica</a>
  </div>
</article>`
    },
    {
      id: "plano-inclinado",
      nombre: "Dinámica en plano inclinado",
      carpeta: "plano-inclinado",
      html: `<article class="simulation-card" data-subject="fisica">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Física</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Dinámica en plano inclinado</h3>
  </div>
  <div class="card-body">
    <p>Laboratorio virtual de un bloque que desliza por una rampa con rozamiento. Calcula el peso, la normal, el rozamiento y la aceleración resultante, además del tiempo y la velocidad teóricos al final de la pendiente.</p>
    <ul class="features">
      <li>Descomposición del peso en componentes paralela y perpendicular.</li>
      <li>Condición de equilibrio frente a deslizamiento (rozamiento estático).</li>
      <li>Cálculo de la aceleración y del tiempo de bajada.</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/plano-inclinado/index.html">Abrir simulación</a>
  </div>
</article>`
    },
    {
      id: "derivadas",
      nombre: "Derivada como límite",
      carpeta: "derivadas",
      html: `<article class="simulation-card" data-subject="matematicas">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag math">Matemáticas</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Derivada como límite</h3>
  </div>
  <div class="card-body">
    <p>Laboratorio virtual para visualizar la derivada como límite de la pendiente de la recta secante cuando el incremento h tiende a cero, con una función definida por el propio usuario.</p>
    <ul class="features">
      <li>Recta secante entre x y x+h frente a la recta tangente.</li>
      <li>Animación de h â†' 0 y lectura del cociente incremental.</li>
      <li>Entrada de funciones personalizadas: sin(x), cos(x), exp(x)...</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/derivadas/index.html">Abrir simulación</a>
    <a class="button secondary" href="simulaciones/derivadas/unidad-didactica.html">Ver unidad didáctica</a>
  </div>
</article>`
    },
    {
      id: "funciones-inecuaciones",
      nombre: "Plano XY: inecuaciones y funciones",
      carpeta: "funciones-inecuaciones",
      html: `<article class="simulation-card" data-subject="matematicas">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag math">Matemáticas</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Plano XY: inecuaciones y funciones</h3>
  </div>
  <div class="card-body">
    <p>Representación en el plano de inecuaciones (con sombreado de la región solución) o de varias funciones a la vez, introducidas como texto libre, una por línea, con color propio.</p>
    <ul class="features">
      <li>Modo inecuaciones: y &lt; f(x), x â‰¤ k, etc.</li>
      <li>Modo funciones: varias curvas simultáneas.</li>
      <li>Control de zoom y escala vertical.</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/funciones-inecuaciones/index.html">Abrir simulación</a>
  </div>
</article>`
    },
    {
      id: "representacion-mapas-geologicos",
      nombre: "Representación de mapas geológicos",
      carpeta: "representación-de-mapas-geológicos",
      html: `<article class="simulation-card" data-subject="ciencias">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Ciencias</span>
      <span class="tag js">JavaScript</span>
    </div>
    <h3>Representación de mapas geológicos</h3>
  </div>
  <div class="card-body">
    <p>Estudio interactivo de la representación e interpretación de mapas geológicos, clasificación de minerales y estructuras geológicas.</p>
    <ul class="features">
      <li>Interactivo y personalizable</li>
      <li>Integración con módulos compartidos</li>
    </ul>
  </div>
  <div class="card-actions">
    <a class="button primary" href="simulaciones/representación-de-mapas-geológicos/index.html">Abrir simulación</a>
  </div>
</article>`
    }
  ]
};
