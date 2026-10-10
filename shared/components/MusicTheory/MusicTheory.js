/**
 * MusicTheory: utilidades de teoría musical para laboratorios de VerneLabs
 *
 * Catálogo de notas, tipos de acorde e intervalos, y reconocimiento de armonía
 * a partir de un conjunto de notas MIDI. Funciones puras, sin DOM ni audio.
 *
 * Uso: cargar ../../shared/components/MusicTheory/MusicTheory.js con una etiqueta script
 * Expone globales: NOTE_NAMES_SHARP, NOTE_NAMES_ES, CHORD_TYPES, INTERVAL_NAMES,
 * CHORD_SYMBOLS, midiToNoteLabel(), recognizeHarmony(), chordSymbol(), harmonyTitle().
 */

const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_NAMES_ES = { C: 'Do', 'C#': 'Do#', D: 'Re', 'D#': 'Re#', E: 'Mi', F: 'Fa', 'F#': 'Fa#', G: 'Sol', 'G#': 'Sol#', A: 'La', 'A#': 'La#', B: 'Si' };

const CHORD_TYPES = {
  mayor: { label: 'Mayor', intervals: [0, 4, 7], degrees: ['1', '3M', '5J'] },
  menor: { label: 'Menor', intervals: [0, 3, 7], degrees: ['1', '3m', '5J'] },
  disminuido: { label: 'Disminuido', intervals: [0, 3, 6], degrees: ['1', '3m', '5dim'] },
  dim7: { label: 'Séptima disminuida', intervals: [0, 3, 6, 9], degrees: ['1', '3m', '5dim', '7dim'] },
  aumentado: { label: 'Aumentado', intervals: [0, 4, 8], degrees: ['1', '3M', '5aum'] },
  '7': { label: 'Séptima dominante', intervals: [0, 4, 7, 10], degrees: ['1', '3M', '5J', '7m'] },
  maj7: { label: 'Mayor séptima / maj7', intervals: [0, 4, 7, 11], degrees: ['1', '3M', '5J', '7M'] },
  m7: { label: 'Menor séptima / m7', intervals: [0, 3, 7, 10], degrees: ['1', '3m', '5J', '7m'] },
  m7b5: { label: 'Semidisminuido / m7b5', intervals: [0, 3, 6, 10], degrees: ['1', '3m', '5dim', '7m'] },
  sus2: { label: 'Suspendido 2 / sus2', intervals: [0, 2, 7], degrees: ['1', '2M', '5J'] },
  sus4: { label: 'Suspendido 4 / sus4', intervals: [0, 5, 7], degrees: ['1', '4J', '5J'] },
  add9: { label: 'Add9', intervals: [0, 4, 7, 14], degrees: ['1', '3M', '5J', '9M'] }
};

const INTERVAL_NAMES = { 0: 'Tónica', 1: '2ª menor', 2: '2ª mayor', 3: '3ª menor', 4: '3ª mayor', 5: '4ª justa', 6: '5ª disminuida / tritono', 7: '5ª justa', 8: '5ª aumentada / 6ª menor', 9: '6ª mayor', 10: '7ª menor', 11: '7ª mayor', 12: 'Octava', 14: '9ª mayor' };

function midiToNoteLabel(midi) {
  const pc = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES_SHARP[pc];
  return { midi, pc, octave, name, label: name + octave, es: NOTE_NAMES_ES[name] + octave };
}

const CHORD_SYMBOLS={mayor:'',menor:'m',disminuido:'dim',dim7:'dim7',aumentado:'aug','7':'7',maj7:'maj7',m7:'m7',m7b5:'m7♭5',sus2:'sus2',sus4:'sus4',add9:'add9'};

function recognizeHarmony(midis, preferredRoot=null) {
  if(!midis.length)return {matches:[],bass:null};
  const bass=Math.min(...midis), bassPc=bass%12;
  const pcs=[...new Set(midis.map(n=>n%12))];
  const matches=[];
  for(let root=0;root<12;root++){
    const actual=pcs.map(pc=>(pc-root+12)%12).sort((a,b)=>a-b);
    for(const [key,chord] of Object.entries(CHORD_TYPES)){
      const formula=[...new Set(chord.intervals.map(n=>n%12))].sort((a,b)=>a-b);
      if(formula.length===actual.length && formula.every((n,i)=>n===actual[i])){
        matches.push({root,key,chord,bassPc,slash:root!==bassPc});
      }
    }
  }
  // La fundamental indicada por el usuario tiene prioridad absoluta sobre
  // cualquier inversión o interpretación enharmónica del mismo conjunto.
  matches.sort((a,b)=>Number(b.root===preferredRoot)-Number(a.root===preferredRoot)||Number(a.root===bassPc)-Number(b.root===bassPc)||a.chord.intervals.length-b.chord.intervals.length);
  return {matches,bass,bassPc};
}

function chordSymbol(match){
  return NOTE_NAMES_SHARP[match.root]+(CHORD_SYMBOLS[match.key]??match.key)+(match.slash?'/'+NOTE_NAMES_SHARP[match.bassPc]:'');
}

function harmonyTitle(result,midis=[]){
  if(!midis.length)return 'Selecciona notas para identificar el acorde. El reconocimiento es inmediato, sin pulsar Reproducir.';
  const pcs=[...new Set(midis.map(n=>n%12))];
  const names=pcs.map(pc=>NOTE_NAMES_ES[NOTE_NAMES_SHARP[pc]]+' ('+NOTE_NAMES_SHARP[pc]+')').join(' · ');
  if(!result.matches.length){
    const bassPc=Math.min(...midis)%12;
    const distances=pcs.map(pc=>(pc-bassPc+12)%12).sort((a,b)=>a-b);
    return 'Notas seleccionadas: '+names+' | Sin coincidencia exacta en el catálogo. Intervalos desde el bajo: '+distances.join('–')+' semitonos.';
  }
  const primary=result.matches[0];
  const descriptions={mayor:'mayor',menor:'menor',disminuido:'disminuido',dim7:'séptima disminuida',aumentado:'aumentado','7':'séptima dominante',maj7:'séptima mayor',m7:'menor séptima',m7b5:'semidisminuido',sus2:'suspendido de segunda',sus4:'suspendido de cuarta',add9:'mayor con novena añadida'};
  const spanishRoot=NOTE_NAMES_ES[NOTE_NAMES_SHARP[primary.root]];
  const title=chordSymbol(primary)+' — '+spanishRoot+' '+(descriptions[primary.key]||primary.chord.label);
  const alternatives=result.matches.length>1?' | Otras interpretaciones: '+result.matches.slice(1,4).map(chordSymbol).join(', '):'';
  return 'Acorde identificado: '+title+' | Notas: '+names+alternatives;
}
