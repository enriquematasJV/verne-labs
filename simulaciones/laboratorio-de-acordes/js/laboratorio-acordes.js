
    'use strict';

    const audio = new AudioEngine();






    const NOTES = [];
    for (let midi = 48; midi <= 71; midi += 1) {
      const pc = midi % 12;
      const octave = Math.floor(midi / 12) - 1;
      const name = NOTE_NAMES_SHARP[pc];
      NOTES.push({ midi, pc, name, octave, label: name + octave, es: NOTE_NAMES_ES[name] + octave });
    }

    const state = {
      selectedMidi: new Set(),
      currentRootPc: null
    };

    const els = {};

    function cacheElements() {
      els.whiteKeys = document.getElementById('whiteKeys');
      els.blackKeys = document.getElementById('blackKeys');
      els.selectedNotes = document.getElementById('selectedNotes');
      els.intervalTable = document.getElementById('intervalTable');
      els.staff = document.getElementById('staff');
      els.chordNameBox = document.getElementById('chordNameBox');
      els.rootSelect = document.getElementById('rootSelect');
      els.chordSelect = document.getElementById('chordSelect');
    }






    function isBlack(pc) { return [1, 3, 6, 8, 10].includes(pc); }
    function noteByMidi(midi) { return NOTES.find(note => note.midi === midi); }

    function renderPiano() {
      els.whiteKeys.innerHTML = '';
      els.blackKeys.innerHTML = '';
      let whiteIndex = 0;
      const whitePositions = new Map();

      NOTES.forEach(note => {
        if (!isBlack(note.pc)) {
          const key = document.createElement('div');
          key.className = 'key white';
          key.dataset.midi = String(note.midi);
          key.textContent = note.es;
          key.addEventListener('click', () => togglePianoNote(note.midi, true));
          els.whiteKeys.appendChild(key);
          whitePositions.set(note.midi, whiteIndex);
          whiteIndex += 1;
        }
      });

      const whiteWidth = window.matchMedia("(max-width: 600px)").matches ? 46 : 60;
      NOTES.forEach(note => {
        if (isBlack(note.pc)) {
          const prevWhiteIndex = whitePositions.get(note.midi - 1);
          if (prevWhiteIndex === undefined) return;
          const key = document.createElement('div');
          key.className = 'key black';
          key.dataset.midi = String(note.midi);
          key.textContent = note.name;
          key.style.left = `${prevWhiteIndex * whiteWidth + (whiteWidth - (whiteWidth === 46 ? 9 : 19))}px`;
          key.addEventListener('click', () => togglePianoNote(note.midi, true));
          els.blackKeys.appendChild(key);
        }
      });
      updatePianoUI();
    }

    function centerPianoOnSelection() {
      const viewport = document.getElementById('pianoViewport');
      if (!viewport || !state.selectedMidi.size || viewport.scrollWidth <= viewport.clientWidth + 1) return;
      const positions = [...state.selectedMidi].map(midi => {
        const key = viewport.querySelector(`.key[data-midi="${midi}"]`);
        return key ? key.offsetLeft + key.offsetWidth / 2 : null;
      }).filter(x => x !== null);
      if (!positions.length) return;
      const min = Math.min(...positions), max = Math.max(...positions);
      const midpoint = (min + max) / 2;
      const target = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, midpoint - viewport.clientWidth / 2));
      viewport.scrollTo({left: target, behavior: 'smooth'});
    }
    function keepPianoNoteVisible(midi) {
      const viewport = document.getElementById('pianoViewport');
      if (!viewport || viewport.scrollWidth <= viewport.clientWidth + 1) return;
      const key = viewport.querySelector(`.key[data-midi="${midi}"]`);
      if (!key) return;
      const left=key.offsetLeft, right=left+key.offsetWidth;
      if (left < viewport.scrollLeft + 8 || right > viewport.scrollLeft + viewport.clientWidth - 8) {
        viewport.scrollTo({left: Math.max(0, left - viewport.clientWidth / 3), behavior:'smooth'});
      }
    }
    let pianoMarkedRootMidi = null;
    function togglePianoNote(midi, sound = false) {
      if(pianoMode!=="free") { pianoMode="free";document.getElementById("pianoMode").value="free"; }
      if (pianoMarkedRootMidi === midi) {
        // Desmarcar la fundamental no elimina su sonido: queda azul.
        pianoMarkedRootMidi = null;
      } else if (state.selectedMidi.has(midi)) {
        // Si no hay fundamental, una nota azul también puede designarse como nueva fundamental.
        if(pianoMarkedRootMidi===null) pianoMarkedRootMidi=midi;
        else state.selectedMidi.delete(midi);
      } else {
        state.selectedMidi.add(midi);
        if(pianoMarkedRootMidi===null) pianoMarkedRootMidi=midi;
      }
      state.currentRootPc=pianoMarkedRootMidi===null?null:pianoMarkedRootMidi%12;
      if (sound) audio.playMidi(midi, 0.95);
      updatePianoUI();
      keepPianoNoteVisible(midi);
    }

    function playSelectedChord() { Array.from(state.selectedMidi).sort((a, b) => a - b).forEach(midi => audio.playMidi(midi, 1.3)); }
    function playSelectedArpeggio() { Array.from(state.selectedMidi).sort((a, b) => a - b).forEach((midi, index) => audio.playMidi(midi, 0.75, index * 0.22)); }

    function updatePianoUI() {
      document.querySelectorAll('.key').forEach(key => {
        const midi = Number(key.dataset.midi);
        const note = noteByMidi(midi);
        key.classList.toggle('selected', state.selectedMidi.has(midi));
        key.classList.toggle('root', state.selectedMidi.has(midi) && pianoMarkedRootMidi === midi);
      });
      const notes = Array.from(state.selectedMidi).sort((a, b) => a - b).map(noteByMidi);
      els.selectedNotes.innerHTML = '';
      pianoUpdateInversionOptions();
      if (notes.length === 0) els.selectedNotes.textContent = 'Ninguna nota seleccionada.';
      else notes.forEach(note => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = `${note.es} (${note.label})`;
        els.selectedNotes.appendChild(pill);
      });
      renderStaff(notes);
      renderIntervalAnalysis(notes);
    }

    function renderStaff(notes) {
      els.staff.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const startX = 40, endX = 490, topY = 70, lineGap = 14;
      // En registros graves, clave de fa evita un exceso de líneas adicionales.
      const useBassClef = notes.length > 0 && notes.reduce((a,n)=>a+n.midi,0)/notes.length < 60;
      for (let i = 0; i < 5; i += 1) {
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', String(startX));
        line.setAttribute('x2', String(endX));
        line.setAttribute('y1', String(topY + i * lineGap));
        line.setAttribute('y2', String(topY + i * lineGap));
        line.setAttribute('stroke', '#111827');
        line.setAttribute('stroke-width', '1.2');
        els.staff.appendChild(line);
      }
      const clef = document.createElementNS(ns, 'text');
      clef.setAttribute('x', '48'); clef.setAttribute('y', '124'); clef.setAttribute('font-size', '58'); clef.textContent = useBassClef ? '𝄢' : '𝄞';
      els.staff.appendChild(clef);
      const diatonicIndex = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
      function staffY(note) {
        const diff = note.octave * 7 + diatonicIndex[note.name[0]] - (useBassClef ? 2 * 7 + diatonicIndex.G : 4 * 7 + diatonicIndex.E);
        return topY + 4 * lineGap - diff * (lineGap / 2);
      }
      notes.forEach((note, index) => {
        const x = 125 + (index > 0 && Math.abs(staffY(note)-staffY(notes[index-1])) <= lineGap/2 + 0.1 ? 20 : 0), y = staffY(note);
        // Líneas adicionales (ledger lines) en cada posición de línea fuera del pentagrama.
        // Clave de sol: Mi4 abajo; clave de fa: Sol2 abajo.
        const bottomLine = topY + 4 * lineGap;
        if (y > bottomLine) {
          for (let ly = bottomLine + lineGap; ly <= y + 0.01; ly += lineGap) {
            const ledger = document.createElementNS(ns, 'line');
            ledger.setAttribute('x1', String(x - 16)); ledger.setAttribute('x2', String(x + 16));
            ledger.setAttribute('y1', String(ly)); ledger.setAttribute('y2', String(ly));
            ledger.setAttribute('stroke', '#111827'); ledger.setAttribute('stroke-width', '1.2');
            els.staff.appendChild(ledger);
          }
        } else if (y < topY) {
          for (let ly = topY - lineGap; ly >= y - 0.01; ly -= lineGap) {
            const ledger = document.createElementNS(ns, 'line');
            ledger.setAttribute('x1', String(x - 16)); ledger.setAttribute('x2', String(x + 16));
            ledger.setAttribute('y1', String(ly)); ledger.setAttribute('y2', String(ly));
            ledger.setAttribute('stroke', '#111827'); ledger.setAttribute('stroke-width', '1.2');
            els.staff.appendChild(ledger);
          }
        }
        const ellipse = document.createElementNS(ns, 'ellipse');
        ellipse.setAttribute('cx', String(x)); ellipse.setAttribute('cy', String(y)); ellipse.setAttribute('rx', '10'); ellipse.setAttribute('ry', '7');
        ellipse.setAttribute('fill', state.currentRootPc !== null && note.pc === state.currentRootPc ? '#f59e0b' : '#2563eb');
        ellipse.setAttribute('transform', `rotate(-18 ${x} ${y})`);
        els.staff.appendChild(ellipse);
        if (note.name.includes('#')) {
          const sharp = document.createElementNS(ns, 'text');
          sharp.setAttribute('x', String(x - 28)); sharp.setAttribute('y', String(y + 5)); sharp.setAttribute('font-size', '22'); sharp.textContent = '#';
          els.staff.appendChild(sharp);
        }
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', String(65 + index * Math.min(85, 300 / Math.max(1, notes.length)))); label.setAttribute('y', '263'); label.setAttribute('class', 'note-label'); label.textContent = note.es;
        els.staff.appendChild(label);
      });
    }

    // Detecta acordes por clases de altura, independientemente de su inversión.
    // Devuelve interpretaciones exactas y deja claras las ambigüedades.
    function renderIntervalAnalysis(notes) {
      els.intervalTable.innerHTML='';
      if(!notes.length){els.chordNameBox.textContent='Selecciona notas o forma un acorde preparado.';return;}
      const recognition=recognizeHarmony(notes.map(n=>n.midi),state.currentRootPc);
      const rootPc=recognition.matches[0]?.root ?? state.currentRootPc ?? notes[0].pc;
      const representatives=new Map();
      for(const n of notes)if(!representatives.has(n.pc))representatives.set(n.pc,n);
      const ordered=[...representatives.values()].sort((a,b)=>((a.pc-rootPc+12)%12)-((b.pc-rootPc+12)%12));
      for(const note of ordered){
        const sem=(note.pc-rootPc+12)%12;
        const tr=document.createElement('tr');
        for(const value of [note.es,INTERVAL_NAMES[sem]||sem+' semitonos',sem]){const td=document.createElement('td');td.textContent=value;tr.appendChild(td);}
        els.intervalTable.appendChild(tr);
      }
      els.chordNameBox.textContent=harmonyTitle(recognition,notes.map(n=>n.midi));
    }


    function populatePianoSelectors() {
      NOTE_NAMES_SHARP.forEach((name, pc) => {
        const opt = document.createElement('option'); opt.value = String(pc); opt.textContent = `${NOTE_NAMES_ES[name]} (${name})`; els.rootSelect.appendChild(opt);
      });
      els.rootSelect.value = '9';
      Object.entries(CHORD_TYPES).forEach(([key, chord]) => {
        const opt = document.createElement('option'); opt.value = key; opt.textContent = chord.label; els.chordSelect.appendChild(opt);
      });
      els.chordSelect.value = 'menor';
    }

    function pianoApplyInversion(index){
      const old=[...state.selectedMidi].sort((a,b)=>a-b);
      if(old.length<2)return;
      const pcs=[...new Set(old.map(m=>m%12))];
      const preferred=state.currentRootPc;
      // El orden interválico de la inversión se calcula desde la fundamental, si se conoce.
      const root=preferred!==null?preferred:pcs[0];
      const order=pcs.sort((a,b)=>((a-root+12)%12)-((b-root+12)%12));
      const rotation=((index%order.length)+order.length)%order.length;
      const rotated=[...order.slice(rotation),...order.slice(0,rotation)];
      const candidates=[];
      for(let base=48;base<=71;base++){
        if(base%12!==rotated[0])continue;
        let current=base;const midis=[base];
        for(const pc of rotated.slice(1)){
          while(++current<=71&&current%12!==pc){}
          midis.push(current);
        }
        if(midis.every(m=>m<=71))candidates.push(midis);
      }
      if(!candidates.length)return;
      const chosen=candidates.sort((a,b)=>Math.abs(a[0]-old[0])-Math.abs(b[0]-old[0]))[0];
      state.selectedMidi=new Set(chosen);
      pianoMarkedRootMidi=chosen.find(m=>m%12===root)??null;
      state.currentRootPc=root;
      updatePianoUI();
      centerPianoOnSelection();
    }
    function pianoUpdateInversionOptions(){
      const sel=document.getElementById('pianoInversion');
      const count=new Set([...state.selectedMidi].map(m=>m%12)).size;
      [...sel.options].forEach((o,i)=>o.disabled=i>=count);
      if(Number(sel.value)>=count)sel.value='0';
    }
    function buildChordFromSelectors(play = false) {
      if(pianoMode==="free"){pianoMode="prepared";document.getElementById("pianoMode").value="prepared";}
      const rootPc = Number(els.rootSelect.value);
      const chord = CHORD_TYPES[els.chordSelect.value];
      state.currentRootPc = rootPc; pianoMarkedRootMidi=null;
      state.selectedMidi.clear();
      let rootMidi = NOTES.find(note => note.pc === rootPc && note.octave === 3)?.midi;
      if (rootMidi === undefined) rootMidi = NOTES.find(note => note.pc === rootPc)?.midi;
      chord.intervals.forEach(interval => {
        const midi = rootMidi + interval;
        if (NOTES.some(note => note.midi === midi)) state.selectedMidi.add(midi);
      });
      pianoMarkedRootMidi = [...state.selectedMidi].filter(midi=>midi%12===rootPc).sort((a,b)=>a-b)[0] ?? null;
      updatePianoUI();
      document.getElementById("pianoInversion").value="0";
      centerPianoOnSelection();
      if (play) playSelectedChord();
    }

































    function setupTabs() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
          document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById(target).classList.add('active');
        });
      });
    }

    function bindEvents() {
      document.getElementById('pianoInversion').addEventListener('change',e=>pianoApplyInversion(Number(e.target.value)));
      document.getElementById('pianoNextInversion').addEventListener('click',()=>{const sel=document.getElementById('pianoInversion');const n=new Set([...state.selectedMidi].map(m=>m%12)).size;if(n<2)return;sel.value=String((Number(sel.value)+1)%n);pianoApplyInversion(Number(sel.value));});
      document.getElementById('playSelectedBtn').addEventListener('click', playSelectedChord);
      document.getElementById('playArpeggioBtn').addEventListener('click', playSelectedArpeggio);
      document.getElementById('clearBtn').addEventListener('click', () => { state.selectedMidi.clear(); state.currentRootPc = null; pianoMarkedRootMidi=null; updatePianoUI(); });
      document.getElementById('buildChordBtn').addEventListener('click', () => buildChordFromSelectors(false));
      document.getElementById('playPresetBtn').addEventListener('click', () => buildChordFromSelectors(true));

    }


    const GUITAR_OPEN = [40,45,50,55,59,64];
    const guitarState = { positions: Array(6).fill(null), rootPc: null, markedRootString: null };
    let pianoMode="prepared",guitarMode="prepared";
    function guitarNotes() {
      return guitarState.positions.map((fret,i)=>fret===null?null:{midi:GUITAR_OPEN[i]+fret,string:i,fret}).filter(Boolean);
    }
    function guitarDisplayedRootString(){
      // Priorizar la fundamental más grave de la digitación convencional.
      return guitarState.positions.findIndex((f,i)=>f!==null && (GUITAR_OPEN[i]+f)%12===guitarState.rootPc);
    }
    function guitarRender() {
      const board=document.getElementById('guitarFretboard');board.innerHTML='';
      const make=(tag,cls,styles={},parent=board)=>{const node=document.createElement(tag);node.className=cls;Object.assign(node.style,styles);parent.appendChild(node);return node;};
      make('div','guitar-wood');
      // Vertical fingerboard: six closely spaced strings, open strings at the nut.
      const xs=GUITAR_OPEN.map((_,i)=>71+i*46);
      const nutY=116,step=62;
      GUITAR_OPEN.forEach((midi,i)=>{
        const n=make('div','guitar-string-name',{left:xs[i]+'px'});
        n.textContent=['Mi','La','Re','Sol','Si','Mi'][i];
        make('div','guitar-string',{left:xs[i]+'px',width:(4.5-i*.52)+'px'});
      });
      make('div','guitar-fret-line guitar-nut',{top:nutY+'px'});
      for(let f=1;f<=8;f++)make('div','guitar-fret-line',{top:(nutY+f*step)+'px'});
      for(let f=0;f<=8;f++){
        const y=f===0?86:nutY+(f-.5)*step;
        const num=make('div','guitar-fret-number',{top:y+'px'});num.textContent=f;
        if([3,5,7].includes(f))make('div','guitar-marker',{top:y+'px'});
        for(let i=0;i<6;i++){
          const midi=GUITAR_OPEN[i]+f;
          const dot=make('button','guitar-position',{left:xs[i]+'px',top:y+'px'});
          dot.type='button';dot.dataset.note=NOTE_NAMES_SHARP[midi%12];
          if(guitarState.positions[i]===f){dot.classList.add('selected');if(guitarState.markedRootString===i || (guitarMode==='prepared' && guitarState.rootPc!==null && midi%12===guitarState.rootPc && i===guitarDisplayedRootString()))dot.classList.add('root');}
          dot.title=`Cuerda ${6-i}, traste ${f}: ${midiToNoteLabel(midi).es}`;
          dot.setAttribute('aria-label',dot.title);
          dot.addEventListener('click',()=>{
            if(guitarMode!=="free"){guitarMode="free";document.getElementById("guitarMode").value="free";}
            if(guitarState.positions[i]===f && guitarState.markedRootString===i){
              guitarState.markedRootString=null; // verde -> azul
            }else if(guitarState.positions[i]===f){
              if(guitarState.markedRootString===null)guitarState.markedRootString=i;
              else guitarState.positions[i]=null; // azul -> sin pulsar
            }else{
              guitarState.positions[i]=f;
              if(guitarState.markedRootString===i)guitarState.markedRootString=null;
              if(guitarState.markedRootString===null)guitarState.markedRootString=i;
            }
            guitarState.rootPc=guitarState.markedRootString===null?null:(GUITAR_OPEN[guitarState.markedRootString]+guitarState.positions[guitarState.markedRootString])%12;
            audio.playMidi(midi,.8);guitarRender();
          });
        }
      }
      const notes=guitarNotes(),selected=document.getElementById('guitarSelected');selected.innerHTML='';
      if(!notes.length)selected.textContent='Ninguna nota seleccionada.';
      for(const n of notes){const p=document.createElement('span');p.className='pill';p.textContent=`${midiToNoteLabel(n.midi).es} · ${6-n.string}ª/${n.fret}`;selected.appendChild(p);}
      guitarAnalyze(notes);
      const mute=document.getElementById('guitarMuteControls');mute.innerHTML='';
      if(guitarMode==='free'){
        const caption=document.createElement('strong');caption.textContent='Silenciar cuerdas:';mute.appendChild(caption);
        for(let i=0;i<6;i++){
          const b=document.createElement('button');b.type='button';b.textContent=(6-i)+'ª '+(guitarState.positions[i]===null?'×':'✓');
          b.title='Alternar cuerda '+(6-i)+' entre silenciada y al aire';
          b.onclick=()=>{guitarState.positions[i]=guitarState.positions[i]===null?0:null;if(guitarState.markedRootString===i)guitarState.markedRootString=null;if(guitarState.markedRootString===null){const next=guitarState.positions.findIndex(f=>f!==null);if(next!==-1)guitarState.markedRootString=next;}guitarState.rootPc=guitarState.markedRootString===null?null:(GUITAR_OPEN[guitarState.markedRootString]+guitarState.positions[guitarState.markedRootString])%12;guitarRender();};mute.appendChild(b);
        }
      }
    }
    function guitarAnalyze(notes){
      const tbody=document.getElementById('guitarIntervals'),box=document.getElementById('guitarName');tbody.innerHTML='';
      if(!notes.length){box.textContent='Selecciona notas o forma un acorde.';guitarStaff([]);return;}
      const sorted=[...notes].sort((a,b)=>a.midi-b.midi);
      const recognition=recognizeHarmony(sorted.map(n=>n.midi),guitarState.rootPc);
      const root=recognition.matches[0]?.root ?? guitarState.rootPc ?? sorted[0].midi%12;
      box.textContent=harmonyTitle(recognition,sorted.map(n=>n.midi));
      // Análisis armónico: una sola fila por nota diferente del acorde.
      // La representante es la nota más grave realmente pulsada para cada altura,
      // y las filas se ordenan por grados desde la tónica (no por altura absoluta).
      const representatives=new Map();
      for(const n of sorted){
        const sem=(n.midi%12-root+12)%12;
        if(!representatives.has(sem))representatives.set(sem,n);
      }
      for(const [sem,n] of [...representatives.entries()].sort((a,b)=>a[0]-b[0])){
        const tr=document.createElement('tr');
        for(const val of [midiToNoteLabel(n.midi).es,INTERVAL_NAMES[sem]||`${sem} semitonos`,sem]){
          const td=document.createElement('td');td.textContent=val;tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
      guitarStaff(sorted);
    }
    // Pentagrama con líneas adicionales y tablatura separada de las notas.
    function drawInstrumentStaff(svg, notes, tuning, instrument, staffNotesOverride=null){
      // En guitarra, el pentagrama representa las alturas distintas del acorde;
      // la tablatura conserva la digitación completa de las seis cuerdas.
      const staffNotes=staffNotesOverride || notes;
      const ns='http://www.w3.org/2000/svg';svg.innerHTML='';
      const add=(tag,attrs,txt)=>{const el=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);if(txt!==undefined)el.textContent=txt;svg.appendChild(el);return el;};
      const dia={C:0,D:1,E:2,F:3,G:4,A:5,B:6};
      const baseY=120, spacing=14;
      for(let i=0;i<5;i++)add('line',{x1:48,x2:505,y1:baseY-i*spacing,y2:baseY-i*spacing,stroke:'#334155','stroke-width':1.2});
      add('text',{x:51,y:119,'font-size':52},instrument==='bass'?'𝄢':'𝄞');
      const ref=instrument==='bass'?(2*7+dia.G):(4*7+dia.E); // Clave de fa: línea inferior Sol2; clave de sol: Mi4
      // Calcular el límite inferior real de las notas para separar pentagrama y TAB.
      const noteYs=staffNotes.map(n=>{
        const note=midiToNoteLabel(n.midi+(instrument==='guitar'?12:0));
        return baseY-((note.octave*7+dia[note.name[0]])-ref)*spacing/2;
      });
      const lowestY=Math.max(baseY,...noteYs);
      const tabY=Math.max(205,Math.ceil(lowestY+43));
      const tabGap=12;
      const noteLabelY=Math.max(175,Math.ceil(lowestY+23));
      svg.setAttribute('viewBox',`0 0 520 ${Math.max(280,tabY+(tuning.length-1)*tabGap+22)}`);
      // Las notas extremas tienen líneas adicionales tanto arriba como abajo.
      staffNotes.forEach((n,i)=>{
        const note=midiToNoteLabel(n.midi+(instrument==='guitar'?12:0)),di=note.octave*7+dia[note.name[0]];
        const y=baseY-(di-ref)*spacing/2;
        const x=instrument==='guitar' ? 125 + (i>0 && Math.abs(y-noteYs[i-1])<=spacing/2+.1 ? 20 : 0) : 90+i*Math.min(55,310/Math.max(1,notes.length));
        if(y>=baseY+spacing)for(let ly=baseY+spacing;ly<=y+.1;ly+=spacing)add('line',{x1:x-15,x2:x+15,y1:ly,y2:ly,stroke:'#334155'});
        if(y<=baseY-5*spacing)for(let ly=baseY-5*spacing;ly>=y-.1;ly-=spacing)add('line',{x1:x-15,x2:x+15,y1:ly,y2:ly,stroke:'#334155'});
        add('ellipse',{cx:x,cy:y,rx:10,ry:7,fill:n.isRoot?'#16a34a':'#2563eb',transform:`rotate(-18 ${x} ${y})`});
        if(note.name.includes('#'))add('text',{x:x-27,y:y+5,'font-size':20},'♯');
        add('text',{x:instrument==='guitar'? 90+i*Math.min(70,310/Math.max(1,notes.length)):x,y:noteLabelY,'text-anchor':'middle','font-size':12,fill:'#334155'},note.es);
      });
      // Tablatura debajo del pentagrama, con suficiente margen para evitar solapamientos.
      add('text',{x:12,y:tabY+15,'font-size':12,fill:'#334155','font-weight':'bold'},'TAB');
      for(let i=0;i<tuning.length;i++){
        const y=tabY+i*tabGap;
        add('line',{x1:48,x2:505,y1:y,y2:y,stroke:'#94a3b8','stroke-width':1});
        add('text',{x:40,y:y+4,'text-anchor':'end','font-size':10,fill:'#475569'},NOTE_NAMES_SHARP[tuning[i]%12]);
      }
      notes.forEach((n,i)=>{
        const x=90+i*Math.min(55,310/Math.max(1,notes.length));
        const str=n.string;
        if(str===undefined||n.fret===undefined)return;
        const row=tuning.length-1-str, y=tabY+row*tabGap;
        add('rect',{x:x-11,y:y-8,width:22,height:16,rx:3,fill:'#fff'});
        add('text',{x,y:y+4,'text-anchor':'middle','font-size':12,'font-weight':'bold',fill:n.isRoot?'#15803d':'#1d4ed8'},String(n.fret));
      });
    }
    function guitarStaff(notes){
      const recognition=notes.length?recognizeHarmony(notes.map(n=>n.midi),guitarState.rootPc):null;
      const root=recognition?.matches[0]?.root ?? guitarState.rootPc ?? (notes[0]?.midi%12) ?? null;
      const played=notes.map(n=>({...n,isRoot:root!==null&&n.midi%12===root}));
      // Esqueleto armónico: una sola aparición de cada clase de altura.
      // Elegimos la nota más grave realmente pulsada de cada clase y mantenemos
      // sus alturas sonoras; la escritura de guitarra sube una octava. El acorde se dibuja apilado en una sola vertical.
      const byPitch=new Map();
      for(const n of [...played].sort((a,b)=>a.midi-b.midi)){
        const pc=n.midi%12;
        if(!byPitch.has(pc))byPitch.set(pc,n);
      }
      const skeleton=[...byPitch.values()].sort((a,b)=>a.midi-b.midi);
      drawInstrumentStaff(document.getElementById('guitarStaff'),played,GUITAR_OPEN,'guitar',skeleton);
    }
    function guitarPlay(arpeggio=false){guitarNotes().sort((a,b)=>a.string-b.string).forEach((n,i)=>audio.playMidi(n.midi,1.4,arpeggio?i*.22:0));}
    // Digitaciones tradicionales, de sexta a primera cuerda; null = cuerda silenciada.
    // Preferimos posiciones reales y conocidas antes que combinaciones de notas arbitrarias.
    const GUITAR_VOICINGS = {
      mayor: {
        0:[null,3,2,0,1,0], 2:[null,null,0,2,3,2],
        4:[0,2,2,1,0,0], 5:[1,3,3,2,1,1],
        7:[3,2,0,0,0,3], 9:[null,0,2,2,2,0],
        10:[null,1,3,3,3,1], 11:[null,2,4,4,4,2]
      },
      menor: {
        0:[null,3,5,5,4,3], 2:[null,null,0,2,3,1],
        4:[0,2,2,0,0,0], 5:[1,3,3,1,1,1],
        7:[3,5,5,3,3,3], 9:[null,0,2,2,1,0],
        11:[null,2,4,4,3,2]
      },
      '7': {
        0:[null,3,2,3,1,0], 2:[null,null,0,2,1,2],
        4:[0,2,0,1,0,0], 5:[1,3,1,2,1,1],
        7:[3,2,0,0,0,1], 9:[null,0,2,0,2,0],
        11:[null,2,1,2,0,2]
      },
      maj7: {
        0:[null,3,2,0,0,0], 2:[null,null,0,2,2,2],
        4:[0,2,1,1,0,0], 5:[1,3,2,2,1,1],
        7:[3,2,0,0,0,2], 9:[null,0,2,1,2,0]
      },
      m7: {
        0:[null,3,5,3,4,3], 2:[null,null,0,2,1,1],
        4:[0,2,0,0,0,0], 5:[1,3,1,1,1,1],
        7:[3,5,3,3,3,3], 9:[null,0,2,0,1,0],
        11:[null,2,0,2,0,2]
      }
    };
    // Formas móviles de cejilla: Mi mayor/menor y La mayor/menor.
    function guitarConventionalVoicing(root, type){
      const fixed=GUITAR_VOICINGS[type]?.[root];
      if(fixed)return [...fixed];
      const shapes={
        mayor:[[4,[0,2,2,1,0,0]],[9,[null,0,2,2,2,0]]],
        menor:[[4,[0,2,2,0,0,0]],[9,[null,0,2,2,1,0]]],
        '7':[[4,[0,2,0,1,0,0]],[9,[null,0,2,0,2,0]]],
        maj7:[[4,[0,2,1,1,0,0]],[9,[null,0,2,1,2,0]]],
        m7:[[4,[0,2,0,0,0,0]],[9,[null,0,2,0,1,0]]]
      };
      const choices=[];
      for(const [shapeRoot,frets] of shapes[type]||[]){
        const shift=(root-shapeRoot+12)%12;
        const moved=frets.map(f=>f===null?null:f+shift);
        if(Math.max(...moved.filter(f=>f!==null))<=8)
          choices.push({moved,shift,max:Math.max(...moved.filter(f=>f!==null))});
      }
      choices.sort((a,b)=>a.max-b.max||a.shift-b.shift);
      return choices[0]?.moved||null;
    }
    let guitarVariantIndex=0;
    const GUITAR_JAZZ_SHAPES={
      '7':[[9,[null,0,2,0,2,null]],[4,[0,7,6,7,null,null]]],
      maj7:[[9,[null,0,2,1,2,null]],[4,[0,7,6,8,null,null]]],
      m7:[[9,[null,0,2,0,1,null]],[4,[0,7,5,7,null,null]]],
      m7b5:[[9,[null,0,1,0,1,null]]],
      dim7:[[9,[null,0,1,2,1,null]]],
      menor:[[9,[null,0,2,2,1,null]]],
      mayor:[[9,[null,0,2,2,2,null]]]
    };
    function guitarVoicingChoices(root,type){
      const all=[];const seen=new Set();
      const add=(positions,style,label)=>{
        if(!positions||positions.some(f=>f!==null&&(f<0||f>8)))return;
        const sounding=positions.map((f,i)=>f===null?null:GUITAR_OPEN[i]+f).filter(m=>m!==null);
        const required=new Set(CHORD_TYPES[type].intervals.map(n=>(root+n)%12));
        const present=new Set(sounding.map(m=>m%12));
        if([...present].some(pc=>!required.has(pc)))return;
        // Los voicings de jazz pueden omitir la quinta, pero no la tercera ni la séptima.
        const essential=type==='maj7'||type==='7'||type==='m7'||type==='m7b5'||type==='dim7'
          ? CHORD_TYPES[type].intervals.filter(n=>n!==7&&n!==6).map(n=>(root+n)%12)
          : [...required];
        if(essential.some(pc=>!present.has(pc)))return;
        const key=positions.map(f=>f===null?'x':f).join('-');if(seen.has(key))return;
        seen.add(key);all.push({positions:[...positions],style,label});
      };
      const fixed=GUITAR_VOICINGS[type]?.[root];
      if(fixed)add(fixed,fixed.some(f=>f===0)?'open':'barre','Posición habitual');
      const shapes={
        mayor:[[4,[0,2,2,1,0,0]],[9,[null,0,2,2,2,0]]],
        menor:[[4,[0,2,2,0,0,0]],[9,[null,0,2,2,1,0]]],
        '7':[[4,[0,2,0,1,0,0]],[9,[null,0,2,0,2,0]]],
        maj7:[[4,[0,2,1,1,0,0]],[9,[null,0,2,1,2,0]]],
        m7:[[4,[0,2,0,0,0,0]],[9,[null,0,2,0,1,0]]]
      };
      for(const [base,shape] of shapes[type]||[]){
        const shift=(root-base+12)%12;
        const moved=shape.map(f=>f===null?null:f+shift);
        add(moved,shift===0?'open':'barre',shift===0?'Forma abierta':'Forma móvil con cejilla');
      }
      for(const [base,shape] of GUITAR_JAZZ_SHAPES[type]||[]){
        const shift=(root-base+12)%12;
        add(shape.map(f=>f===null?null:f+shift),'jazz','Voicing compacto de jazz');
      }
      return all;
    }
    function guitarApplyVoicing(play=false){
      const root=Number(document.getElementById('guitarRoot').value),type=document.getElementById('guitarChord').value;
      const style=document.getElementById('guitarVoicingStyle').value;
      const all=guitarVoicingChoices(root,type);
      const choices=style==='auto'?all:all.filter(v=>v.style===style);
      const info=document.getElementById('guitarVoicingInfo');
      if(!choices.length){info.textContent='No hay una digitación verificada de este estilo dentro de los ocho trastes. Prueba otro estilo.';return false;}
      const chosen=choices[guitarVariantIndex%choices.length];
      guitarState.positions=[...chosen.positions];guitarState.markedRootString=null;guitarState.rootPc=root;
      guitarRender();if(play)guitarPlay();
      info.textContent=`${chosen.label} · ${guitarVariantIndex%choices.length+1} de ${choices.length} · ${chosen.positions.map(f=>f===null?'x':f).join('–')} (6.ª a 1.ª)`;
      return true;
    }
    function guitarBuild(play=false){
      if(guitarMode==="free"){guitarMode="prepared";document.getElementById("guitarMode").value="prepared";}
      const root=Number(document.getElementById('guitarRoot').value),chord=CHORD_TYPES[document.getElementById('guitarChord').value];
      if(guitarApplyVoicing(play))return;
      if(document.getElementById("guitarVoicingStyle").value!=="auto")return;
      const conventional=guitarConventionalVoicing(root,document.getElementById('guitarChord').value);
      if(conventional){
        guitarState.positions=conventional;
        guitarState.markedRootString=null; guitarState.rootPc=root;
        guitarRender();
        if(play)guitarPlay();
        return;
      }
      const pcs=new Set(chord.intervals.map(v=>(root+v)%12));
      // Search for compact voicings, prioritizing root in bass and full chord tones.
      let best=null,bestScore=-Infinity;
      for(let base=0;base<=8;base++){
        const options=GUITAR_OPEN.map(open=>[null,...Array.from({length:5},(_,k)=>base+k).filter(f=>f<=8&&pcs.has((open+f)%12)),...(base===0&&pcs.has(open%12)?[0]:[])]);
        const picks=Array(6).fill(null);
        function visit(i){
          if(i===6){const sounding=picks.map((f,j)=>f===null?null:GUITAR_OPEN[j]+f).filter(v=>v!==null);if(sounding.length<3)return;
            const present=new Set(sounding.map(m=>m%12));if([...pcs].some(pc=>!present.has(pc)))return;
            const bass=sounding[0]%12,frets=picks.filter(f=>f!==null&&f>0),span=frets.length?Math.max(...frets)-Math.min(...frets):0;
            const score=(bass===root?15:0)+sounding.length*1.2-span*2-base*.65-picks.filter(f=>f===null).length*.4;
            if(score>bestScore){bestScore=score;best=[...picks];}return;
          }
          for(const f of [...new Set(options[i])]){picks[i]=f;visit(i+1);}
        }
        visit(0);
      }
      guitarState.positions=best||Array(6).fill(null);guitarState.markedRootString=null;guitarState.rootPc=root;guitarRender();if(play)guitarPlay();
      if(!best)document.getElementById('guitarName').textContent+=' · No se encontró digitación compacta; selecciona las notas manualmente.';
    }
    function setupGuitar(){
      const root=document.getElementById('guitarRoot'),type=document.getElementById('guitarChord');
      NOTE_NAMES_SHARP.forEach((n,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${NOTE_NAMES_ES[n]} (${n})`;root.appendChild(o);});
      Object.entries(CHORD_TYPES).forEach(([key,ch])=>{const o=document.createElement('option');o.value=key;o.textContent=ch.label;type.appendChild(o);});
      root.value='0';type.value='mayor';
      document.getElementById('guitarPlay').onclick=()=>guitarPlay();
      document.getElementById('guitarArp').onclick=()=>guitarPlay(true);
      document.getElementById('guitarClear').onclick=()=>{guitarState.positions.fill(null);guitarState.rootPc=null;guitarState.markedRootString=null;guitarRender();};
      document.getElementById('guitarVoicingStyle').addEventListener('change',()=>{guitarVariantIndex=0;guitarBuild();});
      document.getElementById('guitarNextVoicing').onclick=()=>{guitarVariantIndex++;guitarBuild();};
      for(const id of ['guitarRoot','guitarChord'])document.getElementById(id).addEventListener('change',()=>{guitarVariantIndex=0;});
      document.getElementById('guitarBuild').onclick=()=>{guitarVariantIndex=0;guitarBuild();};
      document.getElementById('guitarPreset').onclick=()=>guitarBuild(true);
      document.getElementById('guitarMode').addEventListener('change',e=>{guitarMode=e.target.value;if(guitarMode==='free'){guitarState.rootPc=null;guitarState.markedRootString=null;}guitarRender();});
      guitarRender();guitarBuild();
    }


    // Contrabajo 1: mapa de posiciones e intervalos, independiente del editor Contrabajo 2.
    const bassExplore = {root:0, intervals:new Set()};
    const BASS_EXPLORE_OPEN=[28,33,38,43];
    const BASS_EXPLORE_NAMES=['Mi','La','Re','Sol'];
    const BASS_EXPLORE_TONES={0:['#16a34a','1'],3:['#93c5fd','♭3'],4:['#2563eb','3'],7:['#facc15','5'],10:['#dc2626','♭7'],11:['#dc2626','7']};
    function bassExploreTone(interval){
      if(BASS_EXPLORE_TONES[interval])return BASS_EXPLORE_TONES[interval];
      return ['#a78bfa', ({1:'♭2',2:'2',5:'4',6:'♭5',8:'♯5',9:'6'})[interval]||String(interval)];
    }
    function renderBassExplore(){
      const board=document.getElementById('bassExploreBoard');board.innerHTML='';
      const add=(className,style,text)=>{const el=document.createElement('div');el.className=className;Object.assign(el.style,style);if(text!==undefined)el.textContent=text;board.appendChild(el);return el;};
      add('bass-explore-wood',{});
      const xs=[77,130,183,236],top=69,step=57;
      BASS_EXPLORE_NAMES.forEach((name,i)=>{
        add('bass-explore-string-label',{left:xs[i]+'px'},name);
        add('bass-explore-string',{left:xs[i]+'px',width:(5-i*.8)+'px'});
      });
      for(let fret=0;fret<=12;fret++){
        const y=top+fret*step;
        add('bass-explore-fret'+(fret===0?' bass-explore-nut':''),{top:(fret===0?top+23:y+step/2)+'px'});
        add('bass-explore-label',{top:y+'px'},fret===0?'0':String(fret));
        if([3,5,7,9,12].includes(fret))add('bass-explore-marker',{top:y+'px'});
        for(let i=0;i<4;i++){
          const midi=BASS_EXPLORE_OPEN[i]+fret,pc=midi%12,interval=(pc-bassExplore.root+12)%12;
          const visible=interval===0||bassExplore.intervals.has(interval);
          const [color,degree]=bassExploreTone(interval);
          const btn=document.createElement('button');btn.type='button';btn.className='bass-explore-position'+(visible?' lit':'')+([3,7].includes(interval)?' light':'');
          btn.style.left=xs[i]+'px';btn.style.top=y+'px';if(visible)btn.style.setProperty('--tone',color);
          btn.textContent=visible?degree:'';
          btn.title=`${BASS_EXPLORE_NAMES[i]}, traste ${fret}: ${NOTE_NAMES_ES[NOTE_NAMES_SHARP[pc]]}. Pulsar para elegir fundamental.`;
          btn.setAttribute('aria-label',btn.title);
          btn.addEventListener('click',()=>{bassExplore.root=pc;document.getElementById('bassExploreRoot').value=String(pc);audio.playMidi(midi,.6);renderBassExplore();});
          board.appendChild(btn);
        }
      }
      const rootName=NOTE_NAMES_ES[NOTE_NAMES_SHARP[bassExplore.root]];
      document.getElementById('bassExploreInfo').innerHTML=`<strong>Fundamental: ${rootName} (${NOTE_NAMES_SHARP[bassExplore.root]})</strong>. Todas las posiciones de esta nota están en verde. Pulsa otra posición para cambiar la fundamental.`;
      document.querySelectorAll('.bass-explore-degree').forEach(b=>b.classList.toggle('active',bassExplore.intervals.has(Number(b.dataset.interval))));
      const chordKey=document.getElementById('bassExploreChord').value,chord=CHORD_TYPES[chordKey];
      document.getElementById('bassExploreChordInfo').textContent=`${rootName} ${chord.label} (${NOTE_NAMES_SHARP[bassExplore.root]}${CHORD_SYMBOLS[chordKey]||''}) · Fórmula: ${chord.degrees.join(' – ')}`;
      const body=document.getElementById('bassExploreIntervals');body.innerHTML='';
      const all=[0,...[...bassExplore.intervals].sort((a,b)=>a-b)];
      const bassStaffNotes=all.map(interval=>{
        const pc=(bassExplore.root+interval)%12;
        const possibilities=[];
        BASS_EXPLORE_OPEN.forEach((open,string)=>{for(let fret=0;fret<=12;fret++)if((open+fret)%12===pc)possibilities.push({midi:open+fret,string,fret});});
        // Preferimos la aparición más grave disponible de cada grado.
        possibilities.sort((a,b)=>a.midi-b.midi);
        return {...possibilities[0],isRoot:interval===0};
      }).filter(n=>Number.isFinite(n.midi));
      drawInstrumentStaff(document.getElementById('bassExploreStaff'),bassStaffNotes,BASS_EXPLORE_OPEN,'bass');
      all.forEach(n=>{const tr=document.createElement('tr');const pc=(bassExplore.root+n)%12;const name=NOTE_NAMES_ES[NOTE_NAMES_SHARP[pc]];const tone=bassExploreTone(n);const cells=[name,n===0?'Fundamental':(INTERVAL_NAMES[n]||tone[1]),String(n)];cells.forEach((v,i)=>{const td=document.createElement('td');td.textContent=v;if(i===1)td.style.color=tone[0];tr.appendChild(td);});body.appendChild(tr);});
    }
    function setupBassExplore(){
      const root=document.getElementById('bassExploreRoot'),type=document.getElementById('bassExploreChord');
      NOTE_NAMES_SHARP.forEach((n,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${NOTE_NAMES_ES[n]} (${n})`;root.appendChild(o);});
      Object.entries(CHORD_TYPES).forEach(([k,c])=>{const o=document.createElement('option');o.value=k;o.textContent=c.label;type.appendChild(o);});
      root.value='0';type.value='mayor';
      root.addEventListener('change',()=>{bassExplore.root=Number(root.value);renderBassExplore();});
      type.addEventListener('change',()=>{bassExplore.intervals=new Set(CHORD_TYPES[type.value].intervals.map(x=>x%12).filter(x=>x!==0));renderBassExplore();});
      document.querySelectorAll('.bass-explore-degree').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.interval);if(bassExplore.intervals.has(n))bassExplore.intervals.delete(n);else bassExplore.intervals.add(n);renderBassExplore();}));
      document.getElementById('bassExploreClear').addEventListener('click',()=>{bassExplore.intervals.clear();renderBassExplore();});
      renderBassExplore();
    }

    function init() {
      cacheElements();
      setupTabs();
      populatePianoSelectors();
      bindEvents();
      document.getElementById('pianoMode').addEventListener('change',e=>{pianoMode=e.target.value;if(pianoMode==='free'){state.currentRootPc=null;pianoMarkedRootMidi=null;}updatePianoUI();});
      setupGuitar();
      setupBassExplore();
      renderPiano();
      let pianoMobileLayout = window.matchMedia('(max-width: 600px)').matches;
      window.addEventListener('resize', () => {
        const nowMobile = window.matchMedia('(max-width: 600px)').matches;
        if (nowMobile !== pianoMobileLayout) {
          pianoMobileLayout = nowMobile;
          renderPiano();
          centerPianoOnSelection();
        }
      });
      buildChordFromSelectors(false);
      
    }

    document.addEventListener('DOMContentLoaded', init);
  