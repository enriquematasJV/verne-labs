# Plantilla: Tarjeta de Simulación

**Componente reutilizable para presentar laboratorios en GitHub Pages.**

---

## 📋 Estructura

Una tarjeta de simulación incluye:
- **Header:** Categoría (etiqueta) + Nombre del lab
- **Body:** Descripción + 3 conceptos clave
- **Footer:** Botones de acción (Abrir simulación, Ver unidad didáctica)

---

## 🔧 Uso

### Paso 1: Copiar la plantilla

```html
<article class="simulation-card" data-subject="fisica">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Física</span>
      <span class="tag js">JavaScript</span>
    </div>

    <h3>Nombre de la simulación</h3>
  </div>

  <div class="card-body">
    <p>
      Descripción breve de la simulación.
    </p>

    <ul class="features">
      <li>Concepto clave 1.</li>
      <li>Concepto clave 2.</li>
      <li>Concepto clave 3.</li>
    </ul>
  </div>

  <div class="card-actions">
    <a class="button primary" href="simulaciones/nombre-carpeta/index.html">
      Abrir simulación
    </a>

    <a class="button secondary" href="simulaciones/nombre-carpeta/unidad-didactica.html">
      Ver unidad didáctica
    </a>
  </div>
</article>
```

### Paso 2: Rellenar campos

**data-subject** (atributo HTML):
- `"fisica"` — Física
- `"biologia"` — Biología
- `"matematicas"` — Matemáticas
- `"informatica"` — Informática / IA
- Múltiples: `"fisica biologia"` (si aplica a varias áreas)

**Tag de categoría** (primera etiqueta):
- `<span class="tag phys">Física</span>`
- `<span class="tag bio">Biología</span>`
- `<span class="tag math">Matemáticas</span>`
- `<span class="tag info">Informática / IA</span>`

**Tag de lenguaje** (segunda etiqueta):
- `<span class="tag js">JavaScript</span>` (por defecto)
- `<span class="tag py">Python</span>` (si aplica)

**Nombre:** Rellenar `<h3>`

**Descripción:** 2-3 líneas en `<p>`

**Conceptos:** 3 items en `<li>` dentro de `<ul class="features">`

**Enlaces:**
- Botón primario: `href="simulaciones/nombre-carpeta/index.html"` (obligatorio)
- Botón secundario: `href="simulaciones/nombre-carpeta/unidad-didactica.html"` (opcional)

### Paso 3: Insertar en index.html

Dentro de `<div class="simulations-grid" id="simulationsGrid">`, pegar la tarjeta rellena.

---

## ⚙️ Cómo funciona el filtrado

1. **data-subject** → filtro por categoría (JavaScript lo lee)
2. **Chips** en la navbar → usuario hace click en "Física", "Biología", etc.
3. **Script** en index.html → muestra/oculta tarjetas según data-subject
4. **Búsqueda** → filtra por texto también

Si una tarjeta tiene `data-subject="fisica"`, aparecerá cuando:
- Usuario hace click en chip "Física"
- O cuando busca un término que coincide con la tarjeta

---

## 🎨 Estilos CSS

Los estilos están en `index.html` (líneas 195-290):
- `.simulation-card` — estructura general
- `.tag` — etiquetas de categoría
- `.tag.phys`, `.tag.bio`, `.tag.math`, `.tag.info` — colores por categoría
- `.button` — botones de acción
- `.features` — lista de conceptos

**Los estilos se aplican automáticamente** si usas las clases correctas.

---

## ✅ Checklist para nueva tarjeta

- [ ] `data-subject` correcto (fisica, biologia, matematicas, informatica)
- [ ] Tag de categoría correcto (class="tag phys|bio|math|info")
- [ ] Nombre descriptivo en `<h3>`
- [ ] Descripción clara (2-3 líneas)
- [ ] 3 conceptos en `<li>`
- [ ] Botón primario apunta a `simulaciones/nombre-carpeta/index.html`
- [ ] Botón secundario (si existe unidad) apunta a `unidad-didactica.html`
- [ ] Carpeta de simulación existe en `simulaciones/nombre-carpeta/`

---

## 📄 Ejemplo Completo

```html
<article class="simulation-card" data-subject="fisica matematicas">
  <div class="card-header">
    <div class="tag-row">
      <span class="tag phys">Física</span>
      <span class="tag js">JavaScript</span>
    </div>

    <h3>Movimiento Parabólico</h3>
  </div>

  <div class="card-body">
    <p>
      Analiza el movimiento de un proyectil bajo la acción de la gravedad.
      Varía ángulo y velocidad inicial para estudiar altura máxima, alcance y tiempo de vuelo.
    </p>

    <ul class="features">
      <li>Descomposición de velocidad en componentes x e y.</li>
      <li>Ecuaciones de posición y velocidad en 2D.</li>
      <li>Cálculo de altura máxima y alcance horizontal.</li>
    </ul>
  </div>

  <div class="card-actions">
    <a class="button primary" href="simulaciones/movimiento-parabolico/index.html">
      Abrir simulación
    </a>

    <a class="button secondary" href="simulaciones/movimiento-parabolico/unidad-didactica.html">
      Ver unidad didáctica
    </a>
  </div>
</article>
```

---

## 📚 Referencias

- **index.html** — Estructura actual con todas las tarjetas
- **Líneas 744-792** — Script que maneja el filtrado
- **Líneas 195-290** — Estilos CSS de las tarjetas

