# SliderControl — Control deslizante para UI

Componente para gestionar sliders (input range) con estilos consistentes y funcionalidad mejorada.

## Uso

```html
<!-- HTML -->
<div class="control">
  <label>Velocidad</label>
  <input type="range" id="speedSlider" min="0" max="50" step="0.5" value="25">
  <span id="speedDisplay">25.0</span> m/s
</div>
```

```javascript
<script src="../../shared/components/SliderControl/SliderControl.js"></script>

const slider = new SliderControl(
  document.getElementById('speedSlider'),
  document.getElementById('speedDisplay'),
  (value) => {
    console.log('Velocidad cambió a:', value);
    updateSimulation(value);
  }
);

// Métodos
slider.getValue();        // 25
slider.setValue(30);      // Cambia valor y muestra
slider.setMin(0);
slider.setMax(100);
slider.setStep(1);
slider.disable();
slider.enable();
```

## Características

- ✅ Sincroniza automáticamente input range con display de valor
- ✅ Formato decimal automático basado en `step`
- ✅ Callback `onChange` cuando el usuario arrastra
- ✅ Métodos para cambiar min/max/step dinámicamente
- ✅ Métodos para habilitar/deshabilitar

## Ejemplo: Laboratorio de Cinemática

```javascript
const timeSlider = new SliderControl(
  document.getElementById('timeRange'),
  document.getElementById('timeValue'),
  (t) => {
    model.setTime(t);
    render();
  }
);

timeSlider.setMin(0);
timeSlider.setMax(model.maxTime);
```
