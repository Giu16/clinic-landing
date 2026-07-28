/* ═══════════ Fallback de imagem SEM handler inline (compatível com CSP) ═══════════
   O evento 'error' de recursos (img) não borbulha, então escutamos na fase de
   captura. Se uma imagem falhar ao carregar, ela some e revela o placeholder;
   a imagem da tela de detalhe (#pd-image) apenas se esconde. Isso permite uma
   Content-Security-Policy rígida (script-src 'self', sem 'unsafe-inline'). */
window.addEventListener('error', e => {
  const el = e.target;
  if (!(el instanceof HTMLImageElement)) return;
  if (el.id === 'pd-image') el.style.display = 'none';
  else el.remove();
}, true);

/* Reset state on bfcache restore */
window.addEventListener('pageshow', e => {
  if (e.persisted) {
    document.body.classList.remove('detail-open');
    const d = document.getElementById('proc-detail');
    if (d) d.setAttribute('aria-hidden', 'true');
  }
});


/* ═══════════ Scroll ═══════════
   NÃO voltar a mexer em classe/estilo do .site-header aqui dentro. Mutar um
   elemento sticky/fixed durante o scroll tira ele do caminho de scroll
   assíncrono do WebKit e faz a barra ser desenhada com offset defasado — era
   o gap no topo no Safari iOS. A classe .scrolled era código morto: tinha
   exatamente os mesmos valores da regra base. */
window.addEventListener('scroll', () => {
  document.getElementById('btt').classList.toggle('show', scrollY > 600);
}, { passive: true });

/* ═══════════ Mobile menu ═══════════ */
const ham = document.getElementById('hamburger');
const mNav = document.getElementById('mobile-nav');
ham.addEventListener('click', () => {
  const open = mNav.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open);
  /* Sem travar o scroll do body: o menu é um dropdown (não cobre a tela toda),
     então a página continua rolável com o menu aberto — como a Giu pediu. */
});
mNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mNav.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
  });
});

/* Fecha o menu assim que a página começa a rolar. A guarda no início mantém o
   handler barato: em rolagem normal (menu fechado) ele sai na primeira linha. */
window.addEventListener('scroll', () => {
  if (!mNav.classList.contains('open')) return;
  mNav.classList.remove('open');
  ham.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}, { passive: true });

/* ═══════════ Seção atual em dourado (scroll-spy) — menu desktop + mobile ═══════════ */
const spyLinks = [...document.querySelectorAll('.nav-links .nav-link, .mobile-nav .nav-link')];
const spyTargets = [...new Set(spyLinks.map(a => a.getAttribute('href')))]
  .map(h => document.querySelector(h))
  .filter(Boolean);

const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const href = '#' + e.target.id;
      spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

spyTargets.forEach(s => spy.observe(s));

/* ═══════════ Carrossel da equipe — seta avança um card (loop no fim) ═══════════ */
const teamGrid = document.querySelector('.team-grid');
const teamNext = document.getElementById('team-next');
if (teamGrid && teamNext) {
  teamNext.addEventListener('click', () => {
    const card = teamGrid.querySelector('.team-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(teamGrid).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const atEnd = teamGrid.scrollLeft + teamGrid.clientWidth >= teamGrid.scrollWidth - 4;
    teamGrid.scrollTo({ left: atEnd ? 0 : teamGrid.scrollLeft + step, behavior: 'smooth' });
  });
}

/* ═══════════ Contadores animados nos números ═══════════ */
(function () {
  const els = document.querySelectorAll('.stat-val, .badge-num');
  if (!els.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function run(el) {
    const raw = el.dataset.countTarget || el.textContent.trim();
    el.dataset.countTarget = raw;
    const m = raw.match(/^(\D*)([\d.]+)(.*)$/);
    if (!m) return;
    const prefix = m[1], suffix = m[3];
    const target = parseInt(m[2].replace(/\./g, ''), 10);
    if (!isFinite(target)) return;
    if (reduce) { el.textContent = raw; return; }
    const dur = 1400, t0 = performance.now();
    const fmt = n => n.toLocaleString('pt-BR');
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: .6 });
  els.forEach(el => io.observe(el));
})();

/* ═══════════ Scroll reveal ═══════════ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ═══════════ Procedimentos data ═══════════ */
const procedimentos = {
  facial: [
    {
      name: 'Harmonização Facial',
      desc: 'Reequilíbrio das proporções faciais com técnicas minimamente invasivas e resultados naturais.',
      bg: 'rgba(184,149,90,.07)',
      img: 'assets/images/procedimentos/harmonizacao-facial.webp',
      duration: '90 minutos',
      lead: 'Conjunto personalizado de procedimentos minimamente invasivos para reequilibrar proporções, suavizar assimetrias e realçar a beleza natural de cada rosto.',
      longDesc: 'A Harmonização Facial une toxina botulínica, preenchimento com ácido hialurônico e bioestimuladores em protocolos individualizados. Conduzida com rigor técnico e sensibilidade estética, a Dra. Helena desenha cada plano respeitando as características únicas do seu rosto — o resultado é uma aparência mais descansada, equilibrada e elegante, sem alterar a sua essência.',
      faq: [
        { q: 'Quanto tempo duram os resultados da harmonização?', a: 'Varia por técnica: toxina de 4 a 6 meses, ácido hialurônico de 12 a 18 meses e bioestimuladores até cerca de 2 anos. Na avaliação você recebe o cronograma do seu caso.' },
        { q: 'A harmonização vai deixar meu rosto artificial?', a: 'Não, quando é planejada e feita por médica. Doses individualizadas respeitam a sua expressão — o resultado é sutil e natural, sem cara de "fez algo".' },      ]
    },
    {
      name: 'Toxina Botulínica',
      desc: 'Relaxamento muscular seletivo para suavizar linhas de expressão com elegância e naturalidade.',
      bg: 'rgba(46,107,110,.07)',
      img: 'assets/images/procedimentos/toxina-botulinica.webp',
      duration: '30 minutos',
      lead: 'Aplicação precisa de toxina botulínica para relaxamento muscular seletivo, suavizando linhas de expressão e prevenindo o aprofundamento de rugas com resultado natural.',
      longDesc: 'A toxina botulínica atua bloqueando temporariamente os sinais nervosos nos músculos da expressão facial, reduzindo contrações involuntárias que geram rugas. Com técnica de injeção precisa e dose calibrada individualmente, o procedimento suaviza linhas da testa, região entre os olhos (glabela) e ao redor dos olhos (pés de galinha), mantendo expressividade e naturalidade. Os resultados aparecem entre 7 e 14 dias.',
      faq: [
        { q: 'Em quanto tempo aparece o resultado e quanto dura?', a: 'Os efeitos surgem em 3 a 5 dias, com resultado pleno em 10 a 14. A duração média é de 4 a 6 meses.' },
        { q: 'A toxina botulínica vai travar a minha expressão?', a: 'Não, com dose e pontos individualizados. Suaviza as rugas mantendo os movimentos naturais — o aspecto "congelado" vem do excesso, que evitamos.' },      ]
    },
    {
      name: 'Bioestimuladores de Colágeno',
      desc: 'Estimulação da produção natural de colágeno para firmeza e rejuvenescimento progressivo e duradouro.',
      bg: 'rgba(184,149,90,.05)',
      img: 'assets/images/procedimentos/bioestimuladores-de-colageno.webp',
      duration: '60 minutos',
      lead: 'Tratamento que estimula o próprio organismo a produzir colágeno, promovendo firmeza, volumização e rejuvenescimento progressivo com resultados naturais e duradouros.',
      longDesc: 'Os bioestimuladores de colágeno — como Sculptra (PLLA) e Radiesse (hidroxiapatita de cálcio) — agem como biocatalisadores, desencadeando a neocolagênese: a produção natural de colágeno pelo próprio organismo. Diferente dos preenchedores, o resultado é gradual e progressivo, atingindo seu ápice entre 2 e 4 meses após a aplicação. Indicados para laxidão da pele, perda de volume e rejuvenescimento global, com efeito que pode durar de 1,5 a 2 anos.',
      faq: [
        { q: 'Qual a diferença entre bioestimulador e preenchimento?', a: 'O preenchimento repõe volume na hora. O bioestimulador estimula o seu corpo a produzir colágeno aos poucos, focando em firmeza e naturalidade, não em volume imediato.' },        { q: 'Quando aparece o resultado e quanto tempo dura?', a: 'O efeito é gradual: primeiras melhoras em 4 a 8 semanas e resultado pleno em 2 a 4 meses. Pode durar de 1,5 a 2 anos.' },
      ]
    },
    {
      name: 'Preenchimento Facial',
      desc: 'Restauração de volume e definição do contorno facial com ácido hialurônico de alta performance.',
      bg: 'rgba(46,107,110,.05)',
      img: 'assets/images/procedimentos/preenchimento-facial.webp',
      duration: '60 minutos',
      lead: 'Restauração de volume, definição de contornos e suavização de sulcos com ácido hialurônico de alta performance — resultado imediato, natural e 100% reversível.',
      longDesc: 'O preenchimento com ácido hialurônico (AH) repõe volume, define contornos e suaviza sulcos e rugas com géis biocompatíveis de alta densidade. Trabalhamos com produtos aprovados pela ANVISA e de procedência certificada. Lábios, maçãs do rosto, sulco nasogeniano, mandíbula e bigode chinês são algumas das áreas tratadas. Por ser uma molécula naturalmente presente no organismo, o AH é seguro, e o procedimento é 100% reversível com enzima hialuronidase.',
      faq: [
        { q: 'O preenchimento com ácido hialurônico é reversível?', a: 'Sim. Se necessário, o produto pode ser dissolvido com a enzima hialuronidase, de forma segura — uma camada extra de segurança do tratamento.' },
        { q: 'O resultado é imediato? Incha muito depois?', a: 'O resultado é imediato e se refina nos dias seguintes. Um leve inchaço nos primeiros dias é comum, sobretudo nos lábios, e passa naturalmente.' },      ]
    },
    {
      name: 'Ultraformer MPT',
      desc: 'Ultrassom microfocado que promove lifting não cirúrgico e estimula colágeno em camadas profundas da pele.',
      bg: 'rgba(184,149,90,.07)',
      img: 'assets/images/procedimentos/ultraformer-mpt.webp',
      duration: '60 minutos',
      lead: 'Lifting não cirúrgico por ultrassom microfocado de última geração que atua em camadas profundas da pele, estimulando colágeno e promovendo efeito tensor progressivo e duradouro.',
      longDesc: 'O Ultraformer MPT utiliza ultrassom microfocado de alta intensidade (HIFU) para depositar energia térmica precisa no SMAS, derme profunda e derme superficial sem lesionar a superfície cutânea. O calor controlado provoca microlesões que desencadeiam a produção de colágeno e elastina, resultando em lifting facial, definição do contorno e melhora da flacidez. Os resultados são progressivos, com efeito tensor mais evidente entre 2 e 3 meses após o procedimento e duração de até 12 a 18 meses.',
      faq: [
        { q: 'O Ultraformer substitui a cirurgia de lifting?', a: 'Não. É um lifting não cirúrgico para flacidez leve a moderada; em casos acentuados, a cirurgia tem resultado superior. A avaliação indica o ideal para você.' },
        { q: 'Quando os resultados aparecem e quanto duram?', a: 'A melhora é progressiva, mais evidente em 2 a 3 meses, com duração de 12 a 18 meses. Uma manutenção anual prolonga o efeito.' },      ]
    },
    {
      name: 'Laser Lavieen',
      desc: 'Laser de Thulium que uniformiza a textura da pele, trata manchas e devolve luminosidade com mínimo tempo de recuperação.',
      bg: 'rgba(46,107,110,.07)',
      img: 'assets/images/procedimentos/lazer-lavieen.webp',
      duration: '45 minutos',
      lead: 'Tratamento com laser de Thulium fracionado para uniformização da textura da pele, redução de manchas e restauração da luminosidade natural com mínimo downtime.',
      longDesc: 'O Laser Lavieen utiliza tecnologia de Thulium fracionado para promover fotorrejuvenescimento com precisão e segurança. A emissão fracionada cria microcanais na pele que estimulam a renovação celular e a produção de colágeno, uniformizando a textura, reduzindo manchas solares e sinais de fotoenvelhecimento. Diferente de lasers ablativos mais agressivos, o Lavieen oferece excelente resultado com recuperação mínima — a maioria das pacientes retorna às atividades em 1 a 3 dias.',
      faq: [
        { q: 'Preciso ficar muitos dias em recuperação?', a: 'Não. Costuma haver leve vermelhidão e fina descamação por 1 a 3 dias, com retorno rápido à rotina. A fotoproteção no pós é essencial.' },
        { q: 'Para o que o Laser Lavieen é indicado e quantas sessões faço?', a: 'Uniformiza a textura, reduz manchas e devolve luminosidade. Em geral são de 3 a 5 sessões, definidas conforme a sua pele.' },      ]
    },
  ],
  corporal: [
    {
      name: 'Bioestimulador Corporal',
      desc: 'Firmeza e rejuvenescimento para colo, braços, abdômen e glúteos com estimulação de colágeno.',
      bg: 'rgba(184,149,90,.07)',
      img: 'assets/images/procedimentos/bioestimulador-corporal.webp',
      duration: '60 minutos',
      lead: 'Estimulação de colágeno em regiões corporais com laxidão, promovendo firmeza, melhora da textura e rejuvenescimento progressivo e duradouro sem cirurgia.',
      longDesc: 'A aplicação corporal de bioestimuladores de colágeno — como Sculptra e Radiesse — é indicada para regiões com laxidão e perda de firmeza, como colo, braços, abdômen, glúteos e face interna das coxas. O procedimento estimula a neocolagênese, devolvendo sustentação e vitalidade à pele de forma progressiva. Os resultados são naturais, graduais e podem durar de 1,5 a 2 anos, com manutenção anual recomendada para preservar os ganhos.',
      faq: [
        { q: 'Quais regiões do corpo podem ser tratadas?', a: 'As áreas com flacidez precoce: colo, parte interna dos braços, abdômen, glúteos e face interna das coxas. A avaliação define as prioridades.' },
        { q: 'Em quanto tempo vejo resultado no corpo?', a: 'O efeito é progressivo: primeiras melhoras em 4 a 8 semanas e resultado mais expressivo em 2 a 4 meses.' },      ]
    },
    {
      name: 'Gordura Localizada',
      desc: 'Redução de adiposidade localizada com protocolos enzimáticos de alta eficácia e segurança.',
      bg: 'rgba(46,107,110,.07)',
      img: 'assets/images/procedimentos/gordura-localizada.webp',
      duration: '60 minutos',
      lead: 'Protocolos injetáveis com enzimas lipolíticas para dissolução de gordura localizada resistente a dieta e exercício, com segurança e eficácia comprovadas.',
      longDesc: 'O tratamento para gordura localizada utiliza compostos enzimáticos injetáveis que promovem a lipólise (quebra das células de gordura) de forma localizada e controlada. Indicado para papada, flancos, abdômen inferior, culote e região dos joelhos, o protocolo é personalizado conforme a área e o volume a ser tratado. Os resultados são progressivos e os adipócitos destruídos não se regeneram — tornando o resultado definitivo quando aliado a hábitos saudáveis.',
      faq: [
        { q: 'O tratamento injetável substitui a lipoaspiração?', a: 'Não. É indicado para gordura localizada de pequeno a médio volume — não é emagrecimento nem substitui a lipo em grandes volumes.' },
        { q: 'Os resultados são permanentes?', a: 'As células eliminadas não voltam, mas as remanescentes podem crescer com ganho de peso. Manter hábitos saudáveis preserva o resultado.' },      ]
    },
    {
      name: 'Remoção de Tatuagem',
      desc: 'Remoção segura de tatuagens com laser de alta precisão, fragmentando o pigmento sem agredir a pele ao redor.',
      bg: 'rgba(184,149,90,.05)',
      img: 'assets/images/procedimentos/remocao-tatuagem.webp',
      duration: '60 minutos',
      lead: 'Tecnologia laser de última geração para remover tatuagens de forma gradual e segura, fragmentando as partículas de pigmento para eliminação natural pelo organismo.',
      longDesc: 'A remoção de tatuagem é realizada com laser de alta precisão, que emite pulsos de energia capazes de fragmentar as partículas de pigmento em micropartículas, posteriormente eliminadas de forma natural pelo sistema imunológico. O número de sessões varia conforme a cor, o tamanho, a profundidade e a idade da tatuagem, além do tipo de pele. Cada protocolo é planejado individualmente pela Dra. Helena após avaliação detalhada, priorizando a segurança da pele e o clareamento progressivo, com intervalos adequados entre as sessões para uma recuperação saudável.',
      faq: [
        { q: 'Quantas sessões são necessárias para remover uma tatuagem?', a: 'Varia conforme cor, tamanho, profundidade e idade da tatuagem. Em média, entre 6 e 12 sessões, com intervalos de algumas semanas entre elas para a pele se recuperar.' },        { q: 'A remoção a laser deixa cicatriz?', a: 'Quando bem indicada e realizada com a técnica correta, o risco é baixo. Respeitar os intervalos e os cuidados pós-sessão é essencial para preservar a pele.' },
      ]
    },
  ],
  saude: [
    {
      name: 'Transplante Capilar',
      desc: 'Restauração de densidade capilar com implante de fios próprios e desenho natural nas áreas de calvície.',
      bg: 'rgba(184,149,90,.07)',
      img: 'assets/images/procedimentos/transplante-capilar.webp',
      duration: '60 minutos',
      lead: 'Redistribuição de folículos capilares saudáveis para áreas de rarefação ou calvície, restaurando densidade e o desenho natural dos fios de forma definitiva.',
      longDesc: 'O transplante capilar é uma técnica minimamente invasiva que consiste na retirada de folículos de uma área doadora — geralmente a região posterior da cabeça, resistente à queda — e no seu implante nas áreas de rarefação ou calvície. Com a técnica FUE (extração de unidades foliculares), os fios são transplantados individualmente, respeitando o ângulo e a direção naturais do crescimento, para um resultado harmônico e discreto. Indicado principalmente para alopecia androgenética, o procedimento devolve densidade de forma definitiva, já que os fios transplantados preservam as características da área doadora.',
      faq: [
        { q: 'O resultado do transplante capilar é definitivo?', a: 'Sim. Os fios vêm de áreas resistentes à queda e tendem a se manter de forma permanente. O crescimento é gradual, ao longo de 6 a 12 meses.' },        { q: 'O procedimento é doloroso?', a: 'É realizado com anestesia local, então o desconforto durante é mínimo. No pós pode haver leve sensibilidade nos primeiros dias, controlada com os cuidados orientados.' },
      ]
    },
  ],
};

/* ═══════════ Proc cards render ═══════════ */
function renderProcs(cat) {
  const grid = document.getElementById('procs-grid');
  grid.innerHTML = procedimentos[cat].map((p, i) => `
    <article class="proc-card" data-cat="${cat}" data-idx="${i}" tabindex="0" role="button" aria-label="Ver detalhes de ${p.name}">
      <div class="proc-img">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy">` : ''}
        <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <ellipse cx="160" cy="90" rx="80" ry="55" stroke="rgba(184,149,90,.7)" stroke-width="1.2" fill="none"/>
          <line x1="80" y1="90" x2="240" y2="90" stroke="rgba(184,149,90,.4)" stroke-width=".7"/>
          <circle cx="160" cy="90" r="5" fill="rgba(184,149,90,.5)"/>
        </svg>
      </div>
      <div class="proc-body">
        <span class="label proc-tag">Procedimento</span>
        <h3 class="proc-name">${p.name}</h3>
        <p class="proc-desc">${p.desc}</p>
        <span class="proc-link" role="link">Saiba mais</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.proc-card').forEach(card => {
    const c = card.dataset.cat;
    const idx = parseInt(card.dataset.idx);
    const im = card.querySelector('.proc-img');
    if (im) im.style.background = procedimentos[c][idx].bg;  /* CSSOM: permitido pela CSP sem 'unsafe-inline' */
    const handler = () => {
      openDetail(procedimentos[c][idx], c, idx, false, card.querySelector('img'));
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

/* ═══════════ Proc detail ═══════════ */
/* View Transition com fallback (navegador antigo + prefers-reduced-motion) */
function viewTransition(mutate) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mutate();
    return { finished: Promise.resolve() };
  }
  return document.startViewTransition(mutate);
}

function closeDetail(scrollTarget) {
  viewTransition(() => {
    document.body.classList.remove('detail-open');
    document.getElementById('proc-detail').setAttribute('aria-hidden', 'true');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  if (location.hash.startsWith('#proc-')) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  const target = scrollTarget || '#procedimentos';
  setTimeout(() => {
    if (target === '#inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 80);
}

function openDetail(proc, cat, idx, skipPush, sourceImg) {
  document.getElementById('pd-title').textContent = proc.name;
  document.getElementById('pd-lead').textContent = proc.lead;
  document.getElementById('pd-body').textContent = proc.longDesc;
  document.getElementById('pd-duration').textContent = proc.duration;

  const pdImage = document.getElementById('pd-image');
  if (proc.img) {
    pdImage.src = proc.img;
    pdImage.alt = proc.name;
    pdImage.style.display = 'block';
  } else {
    pdImage.removeAttribute('src');
    pdImage.style.display = 'none';
  }

  const faqWrap = document.getElementById('pd-faq');
  faqWrap.innerHTML = proc.faq.map(f => `
    <div class="faq-item">
      <button class="faq-q" aria-expanded="false">
        ${f.q}
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-body" role="region">
        <div class="faq-inner"><p>${f.a}</p></div>
      </div>
    </div>
  `).join('');

  faqWrap.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      faqWrap.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (sourceImg && proc.img) sourceImg.style.viewTransitionName = 'proc-media';
  const vt = viewTransition(() => {
    document.body.classList.add('detail-open');
    document.getElementById('proc-detail').setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  vt.finished.finally(() => { if (sourceImg) sourceImg.style.viewTransitionName = ''; });
  if (!skipPush) {
    history.pushState({ detailOpen: true }, '', '#proc-' + cat + '-' + idx);
  }
}

/* Botão voltar do navegador */
window.addEventListener('popstate', () => {
  if (!document.body.classList.contains('detail-open')) return;
  document.body.classList.remove('detail-open');
  document.getElementById('proc-detail').setAttribute('aria-hidden', 'true');
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(() => {
    const el = document.querySelector('#procedimentos');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 80);
});

/* Botão "← Todos os Tratamentos" */
document.getElementById('pd-back').addEventListener('click', () => {
  closeDetail('#procedimentos');
});

/* Links do header/footer com âncora fecham o detalhe primeiro */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    if (!document.body.classList.contains('detail-open')) return;
    e.preventDefault();
    closeDetail(a.getAttribute('href'));
  });
});

document.getElementById('pd-duvidas-btn').addEventListener('click', () => {
  document.getElementById('pd-faq-section').scrollIntoView({ behavior: 'smooth' });
});

/* ═══════════ Tabs ═══════════ */
const tabsEl = document.querySelector('.tabs');
function positionTabPill(tab) {
  if (!tabsEl || !tab) return;
  /* Aba sem layout (ex.: seção escondida enquanto o detalhe está aberto no mobile).
     Sem este guarda, um 'resize' — comum quando a barra de endereço do mobile
     aparece/some — zeraria a pílula (--tab-w/h: 0) e o texto da aba ativa, que é
     escuro sobre a pílula, sumiria no fundo escuro ao voltar. */
  if (!tab.offsetWidth && !tab.offsetHeight) return;
  tabsEl.style.setProperty('--tab-x', tab.offsetLeft + 'px');
  tabsEl.style.setProperty('--tab-y', tab.offsetTop + 'px');
  tabsEl.style.setProperty('--tab-w', tab.offsetWidth + 'px');
  tabsEl.style.setProperty('--tab-h', tab.offsetHeight + 'px');
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => { b.classList.remove('on'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('on'); btn.setAttribute('aria-selected', 'true');
    positionTabPill(btn);
    renderProcs(btn.dataset.cat);
  });
});
renderProcs('facial');

/* Posiciona a pílula na aba ativa inicial (sem transição), depois habilita o deslize */
positionTabPill(document.querySelector('.tab.on'));
requestAnimationFrame(() => tabsEl && tabsEl.classList.add('ready'));
window.addEventListener('resize', () => positionTabPill(document.querySelector('.tab.on')));

/* Abre o procedimento direto se URL tiver hash (ex: após refresh) */
(function () {
  const m = location.hash.match(/^#proc-(\w+)-(\d+)$/);
  if (!m) return;
  const cat = m[1], idx = +m[2];
  if (procedimentos[cat]?.[idx]) {
    openDetail(procedimentos[cat][idx], cat, idx, true);
  }
})();

/* ═══════════ FAQ ═══════════ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* Fecha qualquer pergunta aberta assim que a seção sai da tela — seja rolando,
   navegando pelo menu ou abrindo um procedimento (que oculta a seção). Assim,
   ao voltar, o FAQ está sempre recolhido. */
const faqSection = document.getElementById('faq');
if (faqSection) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) return;
      faqSection.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
    });
  }, { threshold: 0 }).observe(faqSection);
}

/* ═══════════ Cookie ═══════════ */
['cookie-accept', 'cookie-decline'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => {
    document.getElementById('cookie-banner').style.display = 'none';
  });
});

/* ═══════════ Back to top ═══════════ */
document.getElementById('btt').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
