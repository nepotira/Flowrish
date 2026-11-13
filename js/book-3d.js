/**
 * Flowrish — 3D Scrollytelling Book Controller (V2)
 * Movimento 100% acoplado à rolagem do usuário (zero movimento autônomo).
 * Títulos unitários gigantes e transições precisas por seção.
 */

export function init3DBook() {
  const bookEl = document.getElementById('book3D');
  const bookArea = document.getElementById('bookArea');
  if (!bookEl || !bookArea) return;

  // Elementos do cartão dinâmico de texto gigante da página direita
  const pageBigNum = document.getElementById('pageBigNum');
  const pageBigBadge = document.getElementById('pageBigBadge');
  const pageBigTitle = document.getElementById('pageBigTitle');
  const pageBigDesc = document.getElementById('pageBigDesc');
  const pageBigTag = document.getElementById('pageBigTag');

  // Estados angulares
  let currentRotY = -18;
  let targetRotY = -18;
  let currentRotX = 8;
  let targetRotX = 8;
  let isOpen = false;
  let isTicking = false;

  // Dados unitários e grandiosos por etapa
  const STEPS_DATA = [
    {
      num: '01',
      badge: 'PASSO 1',
      title: 'ANUNCIE',
      desc: 'Cadastre seus livros pelo ISBN com capa e dados automáticos.',
      tag: '✦ Rápido & Sem burocracia'
    },
    {
      num: '02',
      badge: 'PASSO 2',
      title: 'ENCONTRE',
      desc: 'Explore centenas de títulos no catálogo com busca em tempo real.',
      tag: '✦ Filtros por gênero literário'
    },
    {
      num: '03',
      badge: 'PASSO 3',
      title: 'COMBINE',
      desc: 'Conecte-se direto no WhatsApp com o dono do livro sem taxas.',
      tag: '✦ Conversa direta & ágil'
    },
    {
      num: '04',
      badge: 'PASSO 4',
      title: 'AVALIE',
      desc: 'Troque histórias e fortaleça a confiança na comunidade.',
      tag: '✦ Reputação real e transparente'
    }
  ];

  const HIGHLIGHTS_DATA = {
    num: '★',
    badge: 'EM ALTA',
    title: 'ACERVO',
    desc: 'Os livros mais amados e procurados pelos leitores hoje.',
    tag: '✦ Destaques da semana'
  };

  const FINAL_DATA = {
    num: '✦',
    badge: 'JUNTE-SE',
    title: 'FLORESÇA',
    desc: 'Dê uma nova história aos seus livros e encontre seus próximos favoritos.',
    tag: '✦ Cadastro gratuito'
  };

  // Seções para rastreamento
  const heroSection = document.querySelector('.hero');
  const stepsSection = document.getElementById('como-funciona');
  const booksSection = document.getElementById('destaques');
  const benefitsSection = document.getElementById('beneficios');
  const ctaSection = document.getElementById('depoimentos');

  function updatePageText(data) {
    if (!data) return;
    if (pageBigNum && pageBigNum.textContent !== data.num) {
      pageBigNum.textContent = data.num;
    }
    if (pageBigBadge && pageBigBadge.textContent !== data.badge) {
      pageBigBadge.textContent = data.badge;
    }
    if (pageBigTitle && pageBigTitle.textContent !== data.title) {
      pageBigTitle.textContent = data.title;
    }
    if (pageBigDesc && pageBigDesc.textContent !== data.desc) {
      pageBigDesc.textContent = data.desc;
    }
    if (pageBigTag && pageBigTag.textContent !== data.tag) {
      pageBigTag.textContent = data.tag;
    }
  }

  function setOpenState(open) {
    if (isOpen === open) return;
    isOpen = open;
    if (isOpen) {
      bookArea.classList.add('is-open');
    } else {
      bookArea.classList.remove('is-open');
    }
  }

  // Atualização estritamente vinculada ao scroll (sem movimento autônomo)
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;

    const stepsRect = stepsSection?.getBoundingClientRect();
    const booksRect = booksSection?.getBoundingClientRect();
    const benefitsRect = benefitsSection?.getBoundingClientRect();
    const ctaRect = ctaSection?.getBoundingClientRect();

    // 1. Hero: Livro Fechado (Seção 1)
    if (scrollY < (heroSection?.offsetHeight || 600) * 0.4) {
      setOpenState(false);
      targetRotY = -18;
      targetRotX = 8;
      return;
    }

    // 2. Como Funciona: Livro Aberto com Passos Unitários (Seção 2)
    if (stepsRect && stepsRect.top < windowH * 0.75 && stepsRect.bottom > windowH * 0.25) {
      setOpenState(true);
      targetRotY = -5;
      targetRotX = 4;

      const stepCards = stepsSection.querySelectorAll('.step-card');
      let activeIndex = 0;
      stepCards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < windowH * 0.6) {
          activeIndex = idx;
        }
      });
      updatePageText(STEPS_DATA[activeIndex] || STEPS_DATA[0]);
      return;
    }

    // 3. Livros Mais Amados (Seção 3)
    if (booksRect && booksRect.top < windowH * 0.75 && booksRect.bottom > windowH * 0.25) {
      setOpenState(true);
      targetRotY = -8;
      targetRotX = 5;
      updatePageText(HIGHLIGHTS_DATA);
      return;
    }

    // 4. Benefícios e CTA (Seções Finais)
    if ((benefitsRect && benefitsRect.top < windowH * 0.75) || (ctaRect && ctaRect.top < windowH * 0.8)) {
      setOpenState(true);
      targetRotY = -4;
      targetRotX = 3;
      updatePageText(FINAL_DATA);
      return;
    }

    // Padrão caso esteja em transição aberta
    setOpenState(true);
    targetRotY = -6;
    targetRotX = 4;
  }

  // Loop de Animação com Lerp para amortecimento suave ao rolar
  function render() {
    const deltaY = targetRotY - currentRotY;
    const deltaX = targetRotX - currentRotX;

    // Só atualiza estilo se ainda houver diferença mensurável (evita gasto de CPU parado)
    if (Math.abs(deltaY) > 0.01 || Math.abs(deltaX) > 0.01) {
      currentRotY += deltaY * 0.12;
      currentRotX += deltaX * 0.12;
      bookEl.style.transform = `translate3d(0, 0, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Escuta de Scroll passiva
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Inicializa estado imediato
  updatePageText(STEPS_DATA[0]);
  handleScroll();
}
