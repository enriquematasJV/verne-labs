# AudioEngine: síntesis de cuerdas pulsadas

Motor de sonido para laboratorios musicales, construido sobre la Web Audio API. Genera cada nota con osciladores (triángulo y armónicos) y un pulso de ruido filtrado que simula la pulsación. No depende del DOM.

## Uso

```html
<script src="../../shared/components/AudioEngine/AudioEngine.js"></script>
```

```javascript
const audio = new AudioEngine({ volumePercent: 70, sustainPercent: 45 });

// La primera llamada crea el contexto de audio. Llamar a esto desde un evento
// del usuario (clic), porque el navegador bloquea el audio antes de una interacción.
audio.playMidi(60, 0.8);       // Do central, 0.8 s
audio.playMidi(64, 0.8, 0.2);  // Mi, con retardo de 0.2 s
```

## API

**`new AudioEngine({ volumePercent = 70, sustainPercent = 45 } = {})`**

**`playMidi(midi, duration = 0.8, delay = 0)`**: toca una nota MIDI.
- `duration`: duración en segundos antes de empezar la liberación.
- `delay`: retardo en segundos respecto al momento actual (útil para arpegios).

**`ensure()`**: crea el contexto de audio y el nodo de volumen si no existen. `playMidi` lo llama automáticamente.

**`createPluckNoise(now, duration = 0.05)`**: añade el pulso de ruido de la pulsación. Uso interno.

**`midiToFrequency(midi)`** (global): frecuencia en Hz para una nota MIDI, con La4 = 440 Hz.

## Propiedades

- `volumePercent` (0–100): volumen maestro. Se aplica en cada `playMidi`, así que puede cambiarse en cualquier momento.
- `sustainPercent` (10–100): cuánto dura la nota tras soltarla. Se lee en cada `playMidi`.
- `ctx`: contexto de `AudioContext` (`null` hasta la primera llamada).
- `masterGain`: nodo de ganancia maestra.
- `activeOscillators`: osciladores en curso. Cada uno se quita de la lista al terminar.

## Limitaciones

- No hay método para parar las notas que suenan. `activeOscillators` queda preparado para añadirlo, pero hoy no existe `stop()`.
- Solo sintetiza cuerdas pulsadas. Para otros timbres habría que añadir otra síntesis.
