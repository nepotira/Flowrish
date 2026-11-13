/**
 * Flowrish — 3D Scrollytelling Book Controller (V3: Gigante & Abridinha)
 * Movimento 100% acoplado à rolagem do usuário (zero movimento autônomo).
 * Títulos unitários gigantes e transições suaves por etapa.
 */

export function init3DBook() {
  const bookEl = document.getElementById('book3D');
  const bookArea = document.getElementById('bookArea');
  if (!bookEl || !bookArea) return;

  // Elementos do texto unitário gigante dentro do livro
  const bookWordWrap = document.getElementById('bookWordWrap');
  const bookWordNum = document.getElementById('bookWordNum');
  const bookSingleWord = document.getElementById('bookSingleWord');
  const bookSingleSub = document.getElementById('bookSingleSub');

  // Estados angulares
  let currentRotY = -16;
  let targetRotY = -16;
  let currentRotX = 6;
  let targetRotX = 6;
  let isOpen = false;
  let isTicking = false;
  let currentActiveWord = '';

  // Dados unitários e grandiosos por etapa
  const STEPS_DATA = [
    {
      num: '01',
      word: 'ANUNCIE',
      sub: 'ISBN com capa e dados automáticos'
    },
    {
      num: '02',
      word: 'ENCONTRE',
      sub: 'Filtros rápidos e busca em tempo real'
    },
    {
      num: '03',
      word: 'COMBINE',
      sub: 'Direto pelo WhatsApp sem taxas'
    },
    {
      num: '04',
      word: 'AVALIE',
      sub: 'Reputação real na comunidade leitora'
    }
  ];

  const HIGHLIGHTS_DATA = {
    num: '★',
    word: 'DESTAQUES',
    sub: 'Livros mais amados da semana'
  };

  const FINAL_DATA = {
    num: '🌸',
    word: 'FLORESÇA',
    sub: 'Comece a trocar hoje mesmo'
  };

  // Seções para rastreamento
  const heroSection = document.querySelector('.hero');
  const stepsSection = document.getElementById('como-funciona');
  const booksSection = document.getElementById('destaques');
  const benefitsSection = document.getElementById('beneficios');
  const ctaSection = document.getElementById('depoimentos');

  function updatePageText(data) {
    if (!data || data.word === currentActiveWord) return;
    currentActiveWord = data.word;

    if (bookWordWrap) {
      bookWordWrap.classList.add('is-updating');
      setTimeout(() => {
        if (bookWordNum) bookWordNum.textContent = data.num;
        if (bookSingleWord) bookSingleWord.textContent = data.word;
        if (bookSingleSub) bookSingleSub.textContent = data.sub;
        bookWordWrap.classList.remove('is-updating');
      }, 120);
    } else {
      if (bookWordNum) bookWordNum.textContent = data.num;
      if (bookSingleWord) bookSingleWord.textContent = data.word;
      if (bookSingleSub) bookSingleSub.textContent = data.sub;
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
    if (scrollY < (heroSection?.offsetHeight || 600) * 0.45) {
      setOpenState(false);
      targetRotY = -16;
      targetRotX = 6;
      return;
    }

    // 2. Como Funciona: Livro com Abridinha e Palavras Unitárias (Seção 2)
    if (stepsRect && stepsRect.top < windowH * 0.75 && stepsRect.bottom > windowH * 0.25) {
      setOpenState(true);
      targetRotY = -12;
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
      targetRotY = -10;
      targetRotX = 4;
      updatePageText(HIGHLIGHTS_DATA);
      return;
    }

    // 4. Benefícios e CTA (Seções Finais)
    if ((benefitsRect && benefitsRect.top < windowH * 0.75) || (ctaRect && ctaRect.top < windowH * 0.8)) {
      setOpenState(true);
      targetRotY = -12;
      targetRotX = 4;
      updatePageText(FINAL_DATA);
      return;
    }

    // Padrão em transição aberta
    setOpenState(true);
    targetRotY = -12;
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
