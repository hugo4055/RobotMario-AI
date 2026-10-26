(() => {
  "use strict";
  const COLS = 32, ROWS = 14, FORMAT = "robotmario-level", VERSION = 1;
  const tiles = ["empty", "ground", "block", "coin", "pipe", "enemy", "hazard"];
  const labels = {empty:"Apagar",ground:"Chão",block:"Bloco",coin:"Moeda",pipe:"Cano",enemy:"Inimigo",hazard:"Perigo"};
  let grid = Array.from({length: ROWS}, () => Array(COLS).fill("empty"));
  let selected = "ground", painting = false;
  const $ = id => document.getElementById(id);
  const gridEl = $("levelGrid"), messageEl = $("message");
  function say(message, error=false) { messageEl.textContent = message; messageEl.classList.toggle("error", error); }
  function setSelected(tile) {
    selected = tile;
    document.querySelectorAll(".tile-option").forEach(btn => btn.classList.toggle("selected", btn.dataset.tile === tile));
    $("selectedLabel").textContent = labels[tile];
  }
  function render() {
    gridEl.replaceChildren();
    const fragment = document.createDocumentFragment();
    for (let y=0; y<ROWS; y++) for (let x=0; x<COLS; x++) {
      const cell = document.createElement("button");
      cell.type = "button"; cell.className = "cell " + grid[y][x];
      cell.dataset.x = x; cell.dataset.y = y;
      cell.setAttribute("role","gridcell");
      cell.setAttribute("aria-label", `Coluna ${x+1}, linha ${y+1}: ${labels[grid[y][x]]}`);
      cell.title = `(${x+1}, ${y+1}) — ${labels[grid[y][x]]}`;
      fragment.appendChild(cell);
    }
    gridEl.appendChild(fragment); updateCount();
  }
  function updateCount() { $("tileCount").textContent = grid.flat().filter(t => t !== "empty").length; }
  function paint(cell, tile=selected) {
    if (!cell || !cell.classList.contains("cell")) return;
    const x=Number(cell.dataset.x), y=Number(cell.dataset.y);
    if (!Number.isInteger(x)||!Number.isInteger(y)||!grid[y]) return;
    if (grid[y][x] === tile) return;
    grid[y][x] = tile; cell.className = "cell " + tile;
    cell.setAttribute("aria-label", `Coluna ${x+1}, linha ${y+1}: ${labels[tile]}`);
    cell.title = `(${x+1}, ${y+1}) — ${labels[tile]}`;
    updateCount();
  }
  function updateTitle() { const name = $("levelName").value.trim() || "Fase sem nome"; $("canvasTitle").textContent = name; document.title = "RobotMario-AI — " + name; }
  function randomInt(max) { return Math.floor(Math.random()*max); }
  function generate() {
    const prompt = $("prompt").value.toLocaleLowerCase("pt-BR");
    grid = Array.from({length: ROWS}, () => Array(COLS).fill("empty"));
    // Chão básico e pequenas variações de altura.
    let height = 11;
    for(let x=0;x<COLS;x++){
      if(x>2 && x<COLS-2 && Math.random()<0.13) height = Math.max(8,Math.min(11,height+(Math.random()<.5?-1:1)));
      for(let y=height;y<ROWS;y++) grid[y][x]="ground";
    }
    // Gaps pontuais, exceto nas bordas.
    for(let x=4;x<COLS-3;x++) if(Math.random()<0.08){ for(let y=10;y<ROWS;y++) grid[y][x]="empty"; x+=1; }
    const hasPipes = /cano|tubo|pipe/.test(prompt), hasCoins = /moeda|coin|tesouro/.test(prompt), hasEnemies = /inimig|goomba|monstro|inimigo/.test(prompt), hasHazards = /perigo|espinho|lava|armadilha/.test(prompt);
    // Distribui objetos acima do chão, evitando que o chão desapareça.
    for(let x=3;x<COLS-2;x+=2){
      const groundY = grid[10][x]==="ground" ? 10 : 9;
      if(hasCoins ? Math.random()<.58 : Math.random()<.18) grid[Math.max(3,groundY-3-randomInt(2))][x]="coin";
      if(hasEnemies && Math.random()<.17 && grid[groundY-1][x]==="empty") grid[groundY-1][x]="enemy";
      if(hasHazards && Math.random()<.12) grid[groundY][x]="hazard";
    }
    if(hasPipes) for(let x=7;x<COLS-3;x+=9){ const y=grid[10][x]==="ground"?9:8; grid[y][x]="pipe"; if(y+1<ROWS)grid[y+1][x]="pipe"; }
    // Blocos flutuantes e moedas para dar ritmo à fase.
    for(let x=5;x<COLS-3;x+=randomInt(4)+5){ const y=5+randomInt(3); grid[y][x]="block"; if(Math.random()<.7)grid[y-1][x]="coin"; }
    if(/noturn|noite|escuro/.test(prompt)) say("Fase gerada com tema noturno sugerido. O tema é textual nesta versão; a grade é procedural.");
    else say("Fase gerada! Agora selecione peças e personalize o mapa.");
    render();
  }
  function downloadJSON() {
    const data={format:FORMAT,version:VERSION,name:$("levelName").value.trim()||"Minha fase",width:COLS,height:ROWS,grid,createdAt:new Date().toISOString(),note:"Formato próprio do protótipo RobotMario-AI; não é um arquivo .swe."};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url; a.download=(data.name.replace(/[^a-z0-9-_ ]/gi,"").trim().replace(/\s+/g,"-")||"fase")+".json";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    say("Projeto exportado como JSON. Esse arquivo ainda não é compatível com .swe.");
  }
  async function importJSON(file) {
    if(!file) return;
    try {
      if(file.size>2_000_000) throw new Error("Arquivo muito grande (limite de 2 MB).");
      const data=JSON.parse(await file.text());
      if(data.format!==FORMAT) throw new Error("Formato não reconhecido. Importe um JSON exportado pelo RobotMario-AI.");
      if(data.version!==VERSION) throw new Error("Versão de arquivo não suportada.");
      if(data.width!==COLS||data.height!==ROWS||!Array.isArray(data.grid)||data.grid.length!==ROWS) throw new Error("Tamanho de grade inválido.");
      const next=data.grid.map(row=>{
        if(!Array.isArray(row)||row.length!==COLS||row.some(t=>!tiles.includes(t))) throw new Error("A grade contém peças inválidas.");
        return [...row];
      });
      grid=next; $("levelName").value=String(data.name||"Fase importada").slice(0,60); updateTitle(); render(); say("Projeto importado com sucesso.");
    } catch(err) { say(err.message||"Não foi possível importar o arquivo.",true); }
  }
  gridEl.addEventListener("click",e=>{const cell=e.target.closest(".cell");if(cell)paint(cell);});
  gridEl.addEventListener("contextmenu",e=>{const cell=e.target.closest(".cell");if(cell){e.preventDefault();paint(cell,"empty");}});
  gridEl.addEventListener("pointerdown",e=>{if(e.button===0&&e.target.closest(".cell"))painting=true;});
  gridEl.addEventListener("pointerover",e=>{if(painting&&e.buttons===1)paint(e.target.closest(".cell"));});
  window.addEventListener("pointerup",()=>painting=false);
  document.querySelectorAll(".tile-option").forEach(btn=>btn.addEventListener("click",()=>setSelected(btn.dataset.tile)));
  $("generateBtn").addEventListener("click",generate);
  $("exportBtn").addEventListener("click",downloadJSON);
  $("importBtn").addEventListener("click",()=>$("fileInput").click());
  $("fileInput").addEventListener("change",e=>{importJSON(e.target.files[0]);e.target.value="";});
  $("clearBtn").addEventListener("click",()=>{if(confirm("Limpar todas as peças da fase?")){grid=Array.from({length:ROWS},()=>Array(COLS).fill("empty"));render();say("Grade limpa.");}});
  $("levelName").addEventListener("input",updateTitle);
  document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea"))return;const map={"1":"ground","2":"block","3":"coin","4":"pipe","5":"enemy","6":"hazard","0":"empty"};if(map[e.key])setSelected(map[e.key]);});
  // Primeiro mapa: uma pequena plataforma simples para não abrir uma tela vazia.
  for(let x=0;x<COLS;x++)for(let y=11;y<ROWS;y++)grid[y][x]="ground";
  for(const [x,y,t] of [[7,8,"block"],[8,8,"coin"],[13,7,"block"],[13,6,"coin"],[20,9,"pipe"],[20,10,"pipe"],[25,10,"enemy"]])grid[y][x]=t;
  render(); updateTitle();
})();