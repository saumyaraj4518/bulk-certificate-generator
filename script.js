

const $ = id => document.getElementById(id);
const cv = $('cv'), ctx = cv.getContext('2d');
let img = null, idx = 0, dragging = false;
let pos = {x: .5, y: .5};

/* ---------- sample template ---------- */
function makeSample() {
  const c = document.createElement('canvas'); c.width = 1600; c.height = 1131;
  const g = c.getContext('2d');
  g.fillStyle = '#fbf7ec'; g.fillRect(0, 0, 1600, 1131);
  g.strokeStyle = '#b58a2b'; g.lineWidth = 14; g.strokeRect(50, 50, 1500, 1031);
  g.lineWidth = 3; g.strokeRect(80, 80, 1440, 971);
  g.fillStyle = '#1b2a49'; g.textAlign = 'center';
  g.font = 'bold 110px Georgia, serif'; g.fillText('CERTIFICATE', 800, 270);
  g.font = '44px Georgia, serif'; g.fillText('OF ACHIEVEMENT', 800, 340);
  g.font = 'italic 36px Georgia, serif'; g.fillStyle = '#555'; g.fillText('This certificate is proudly presented to', 800, 470);
  g.fillStyle = '#b58a2b'; g.fillRect(450, 640, 700, 4);
  g.fillStyle = '#555'; g.font = '32px Georgia, serif';
  g.fillText('for outstanding participation and dedication.', 800, 740);
  const i = new Image(); i.onload = () => setImage(i); i.src = c.toDataURL('image/png');
}
function setImage(i) {
  img = i; cv.width = i.naturalWidth; cv.height = i.naturalHeight;
  const s = Math.round(i.naturalWidth / 20);
  $('size').value = Math.min(400, Math.max(12, s)); 
  draw();
}
$('sample').onclick = () => { makeSample(); pos = {x: .5, y: .55}; syncPos(); };
$('tpl').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  const i = new Image(); i.onload = () => setImage(i); i.src = URL.createObjectURL(f);
};

/* ---------- names ---------- */
function getNames() {
  return $('names').value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}
function updateCount() {
  const n = getNames().length;
  $('count').textContent = n + ' name' + (n === 1 ? '' : 's') + ' loaded';
  if (idx >= n) idx = Math.max(0, n - 1);
  draw();
}
$('names').oninput = updateCount;
$('namesFile').onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const wb = XLSX.read(await f.arrayBuffer(), {type: 'array'});
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1, blankrows: false});
    let list = rows.map(r => String(r[0] ?? '').trim()).filter(Boolean);
    if (list.length && /^(names?|participants?|full ?name)$/i.test(list[0])) list.shift();
    $('names').value = list.join('\n');
    updateCount();
  } catch (err) { $('count').textContent = 'Could not read file: ' + err.message; }
};

/* ---------- drawing ---------- */
function paint(c, name) {
  const g = c.getContext('2d');
  g.clearRect(0, 0, c.width, c.height);
  if (img) g.drawImage(img, 0, 0, c.width, c.height);
  else { g.fillStyle = '#ddd'; g.fillRect(0, 0, c.width, c.height); }
  g.fillStyle = $('color').value;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `${$('weight').value} ${$('size').value}px ${$('font').value}`;
  g.fillText(name, pos.x * c.width, pos.y * c.height);
}
function draw() {
  if (!img) { cv.width = 1600; cv.height = 1131; }
  const names = getNames();
  const name = names[idx] || 'Participant Name';
  paint(cv, name);
  if (!img) { ctx.fillStyle = '#777'; ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Upload a template or use the sample', 800, 200); }
  // position marker
  ctx.save(); ctx.fillStyle = 'rgba(220,40,40,.85)';
  ctx.beginPath(); ctx.arc(pos.x * cv.width, pos.y * cv.height, Math.max(5, cv.width / 250), 0, 7); ctx.fill(); ctx.restore();
  $('who').textContent = names.length ? `${idx + 1} / ${names.length} — ${name}` : 'No names';
  $('sizeV').textContent = $('size').value;
}
function syncPos() {
  $('px').value = (pos.x * 100).toFixed(1); $('py').value = (pos.y * 100).toFixed(1); draw();
}
['size', 'color', 'font', 'weight'].forEach(id => $(id).addEventListener('input', draw));
['px', 'py'].forEach(id => $(id).addEventListener('input', () => {
  pos.x = (+$('px').value || 0) / 100; pos.y = (+$('py').value || 0) / 100; draw();
}));
$('prev').onclick = () => { const n = getNames().length; if (n) { idx = (idx - 1 + n) % n; draw(); } };
$('next').onclick = () => { const n = getNames().length; if (n) { idx = (idx + 1) % n; draw(); } };

/* ---------- drag & drop positioning ---------- */
function setFromEvent(e) {
  const r = cv.getBoundingClientRect();
  pos.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  pos.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  syncPos();
}
cv.addEventListener('pointerdown', e => { dragging = true; cv.setPointerCapture(e.pointerId); cv.classList.add('drag'); setFromEvent(e); });
cv.addEventListener('pointermove', e => { if (dragging) setFromEvent(e); });
cv.addEventListener('pointerup', () => { dragging = false; cv.classList.remove('drag'); });

/* ---------- export ---------- */
const safe = s => s.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80) || 'certificate';
function render(name) {
  const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height;
  paint(c, name); return c;
}
const toBlob = (c, type, q) => new Promise(r => c.toBlob(r, type, q));
function progress(p, text) {
  $('bar').style.display = p == null ? 'none' : 'block';
  $('bar').firstChild.style.width = ((p || 0) * 100) + '%';
  $('status').textContent = text || '';
}
async function save(filename, blob) {
  let d = null;
  try { d = window.claude && await claude.use('downloads'); } catch (e) {}
  if (d) {
    try { await d.save({filename, data: blob}); return; }
    catch (e) { if (e && e.code === 'declined') return; /* else fall back */ }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
}
function guard() {
  if (!img) { progress(null, 'Please upload a template (or use the sample) first.'); return null; }
  const n = getNames(); if (!n.length) { progress(null, 'Add at least one name.'); return null; }
  return n;
}
const tick = () => new Promise(r => setTimeout(r, 0));

$('dlOne').onclick = async () => {
  if (!img) return guard();
  const names = getNames(); const nm = names[idx] || 'certificate';
  await save(safe(nm) + '.png', await toBlob(render(names[idx] || ''), 'image/png'));
};
$('dlZip').onclick = async () => {
  const names = guard(); if (!names) return;
  const zip = new JSZip();
  for (let i = 0; i < names.length; i++) {
    zip.file(`${String(i + 1).padStart(3, '0')}_${safe(names[i])}.png`, await toBlob(render(names[i]), 'image/png'));
    progress((i + 1) / names.length, `Rendering ${i + 1} / ${names.length}`); await tick();
  }
  progress(1, 'Zipping…');
  const blob = await zip.generateAsync({type: 'blob'});
  progress(null, 'Done — ' + names.length + ' images.');
  await save('certificates.zip', blob);
};
$('dlPdf').onclick = async () => {
  const names = guard(); if (!names) return;
  const {jsPDF} = window.jspdf, W = cv.width, H = cv.height;
  const pdf = new jsPDF({orientation: W >= H ? 'l' : 'p', unit: 'px', format: [W, H], hotfixes: ['px_scaling']});
  for (let i = 0; i < names.length; i++) {
    if (i) pdf.addPage([W, H], W >= H ? 'l' : 'p');
    pdf.addImage(render(names[i]).toDataURL('image/jpeg', .92), 'JPEG', 0, 0, W, H);
    progress((i + 1) / names.length, `Building PDF ${i + 1} / ${names.length}`); await tick();
  }
  progress(null, 'Done — ' + names.length + ' pages.');
  await save('certificates.pdf', pdf.output('blob'));
};

makeSample(); pos = {x: .5, y: .55}; syncPos(); updateCount();
