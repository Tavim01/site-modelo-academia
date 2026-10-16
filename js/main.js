// ===== Configuração por cliente: edite só este bloco =====
const GYM = {
  nome: 'Pulse',
  whatsapp: '5500900000000',          // DDI+DDD+número, só dígitos
  telefone: '(00) 90000-0000',
  endereco: 'Rua Exemplo, 123 — Centro',
  instagram: '@pulseacademia',
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wa = txt => `https://wa.me/${GYM.whatsapp}?text=${encodeURIComponent(txt)}`;

// textos configuráveis
$$('[data-gym]').forEach(el => { el.textContent = GYM[el.dataset.gym]; });
$('#ano').textContent = new Date().getFullYear();
$('#credito').href = '#contato';

// links de WhatsApp
$$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

// nav: fundo ao rolar + menu mobile
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
const onScroll = () => nav.classList.toggle('is-solid', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
$$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));

// revelar ao rolar
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

// contadores
const countIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1400;
  const step = t => {
    const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
    el.textContent = v.toFixed(dec).replace('.', ',') + (p === 1 ? suf : '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step); countIO.unobserve(el);
}), { threshold: .6 });
$$('[data-count]').forEach(el => countIO.observe(el));

// planos: período
const desc = { mensal: 1, trimestral: .9, anual: .8 };
const fmt = n => Math.round(n).toString();
$$('.toggle button').forEach(b => b.addEventListener('click', () => {
  $$('.toggle button').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
  $$('[data-base]').forEach(s => { s.textContent = fmt(s.dataset.base * desc[b.dataset.per]); });
  window.periodo = b.dataset.per;
}));
$$('[data-wa-plan]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const per = window.periodo || 'mensal';
  window.open(wa(`Olá! Quero o plano ${a.dataset.waPlan} (${per}).`), '_blank', 'noopener');
}));

// grade de aulas
const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const base = [
  ['06:30', 'Funcional', 'Prof. Lucas', 'Todos os níveis'],
  ['08:00', 'Spinning', 'Profa. Ana', 'Intermediário'],
  ['12:00', 'Treino rápido 40min', 'Prof. Diego', 'Todos os níveis'],
  ['18:30', 'Muay thai', 'Mestre Caio', 'Iniciante'],
  ['19:30', 'Zumba', 'Profa. Bia', 'Todos os níveis'],
];
const grade = Object.fromEntries(dias.map((d, i) => [d,
  d === 'Sáb' ? [['09:00', 'Funcional ao ar livre', 'Prof. Lucas', 'Todos os níveis'], ['10:30', 'Spinning', 'Profa. Ana', 'Todos os níveis']]
  : base.map(a => i % 2 ? a : a.map((v, k) => k === 1 && a[1] === 'Muay thai' ? 'Jiu-jitsu' : v))]));
const tabs = $('#tabs'), sched = $('#sched');
const render = d => {
  $$('button', tabs).forEach(b => b.setAttribute('aria-selected', b.textContent === d));
  sched.innerHTML = grade[d].map(([h, n, p, nv]) =>
    `<li><time>${h}</time><div><b>${n}</b><small>${p}</small></div><span class="tag">${nv}</span></li>`).join('');
};
dias.forEach(d => {
  const b = document.createElement('button');
  b.role = 'tab'; b.textContent = d; b.addEventListener('click', () => render(d)); tabs.append(b);
});
render(dias[Math.min((new Date().getDay() + 6) % 7, 5)]);

// IMC
$('#imcForm').addEventListener('submit', e => {
  e.preventDefault();
  const kg = parseFloat($('#peso').value.replace(',', '.')), cm = parseFloat($('#altura').value);
  const out = $('#imcOut');
  if (!(kg >= 20 && kg <= 300 && cm >= 100 && cm <= 250)) { out.textContent = 'Informe peso e altura válidos.'; return; }
  const imc = kg / ((cm / 100) ** 2);
  const faixa = imc < 18.5 ? 'abaixo do peso' : imc < 25 ? 'peso adequado' : imc < 30 ? 'sobrepeso' : 'obesidade';
  out.innerHTML = `Seu IMC é <strong>${imc.toFixed(1).replace('.', ',')}</strong> — ${faixa}. Referência geral; a avaliação física completa é mais precisa.`;
});

// formulário de lead -> WhatsApp
$('#leadForm').addEventListener('submit', e => {
  e.preventDefault();
  const nome = $('#fNome').value.trim();
  if (!nome) { $('#fNome').focus(); return; }
  window.open(wa(`Olá! Me chamo ${nome} e meu objetivo é: ${$('#fObj').value}. Quero agendar uma aula experimental.`), '_blank', 'noopener');
});
