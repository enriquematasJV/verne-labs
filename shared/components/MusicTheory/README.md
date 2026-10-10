# MusicTheory: teoría musical para laboratorios

Catálogo de notas, tipos de acorde e intervalos, y reconocimiento de armonía a partir de un conjunto de notas MIDI. Funciones puras: no usan DOM ni audio.

## Uso

```html
<script src="../../shared/components/MusicTheory/MusicTheory.js"></script>
```

```javascript
const notes = [57, 60, 64]; // La3, Do4, Mi4
const result = recognizeHarmony(notes, null);
console.log(chordSymbol(result.matches[0]));  // "Am"
console.log(harmonyTitle(result, notes));     // "Acorde identificado: Am — La menor | Notas: ..."
```

## Constantes (globales)

- `NOTE_NAMES_SHARP`: nombres en inglés con sostenidos, índice = clase de altura (0 = C).
- `NOTE_NAMES_ES`: nombres en español (`C` → `Do`, `A` → `La`...).
- `CHORD_TYPES`: `{ clave: { label, intervals, degrees } }`. Claves: `mayor`, `menor`, `disminuido`, `dim7`, `aumentado`, `7`, `maj7`, `m7`, `m7b5`, `sus2`, `sus4`, `add9`. `intervals` son semitonos desde la fundamental.
- `INTERVAL_NAMES`: nombre del intervalo por semitonos (`0` → `Tónica`, `7` → `5ª justa`...).
- `CHORD_SYMBOLS`: símbolo de cifrado por clave de acorde (`mayor` → `''`, `menor` → `m`...).

## Funciones

**`midiToNoteLabel(midi)`** → `{ midi, pc, octave, name, label, es }`
- `label` en notación inglesa (`C4`), `es` en español (`Do4`).

**`recognizeHarmony(midis, preferredRoot = null)`** → `{ matches, bass, bassPc }`
- `matches`: lista de `{ root, key, chord, bassPc, slash }`, ordenada por preferencia.
- Si `preferredRoot` coincide con un candidato, ese candidato va primero.
- `slash` es `true` cuando la nota más grave no es la fundamental (inversión).
- Si no hay notas, devuelve `{ matches: [], bass: null }`.

**`chordSymbol(match)`** → `string`
- Cifrado del acorde, por ejemplo `Am` o `C/E`.

**`harmonyTitle(result, midis = [])`** → `string`
- Texto explicativo para mostrar al estudiante. Incluye las notas seleccionadas y otras interpretaciones posibles.
- Si no hay coincidencia exacta, indica los intervalos desde el bajo en semitonos.

## Limitaciones

- El catálogo es solo de tríadas y tétradas de la tabla `CHORD_TYPES`. Un conjunto de notas fuera de esa tabla se describe por intervalos, sin nombre de acorde.
- Las notas se tratan por clase de altura (módulo 12). No distingue enarmonías (`C#` y `Db` son la misma nota).
