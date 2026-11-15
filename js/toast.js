// Flowrish — Sistema Moderno de Notificações / Toasts (Claymorphism Soft 3D)

const ICONS = {
  error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5 5.5-5.5"/></svg>`,
  warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

export function inferToastType(titulo = '', texto = '') {
  const full = `${titulo} ${texto}`.toLowerCase();
  if (/erro|inválid|falha|fraca|não coincidem|indisponível|não foi possível|não encontrado|mínima|aceite/.test(full)) {
    return 'error';
  }
  if (/sucesso|realizado|criada|enviad[ao]|redefinida|publicad[ao]|atualizado|adicionado|conectad[ao]|removid[ao]/.test(full)) {
    return 'success';
  }
  if (/atenção|aviso|preencha|obrigatóri|descreva|informe/.test(full)) {
    return 'warning';
  }
  return 'info';
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getOrCreateContainer() {
  if (typeof document === 'undefined') return null;
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(titulo, texto = '', tipo = '', duracao = 4500) {
  if (!titulo && !texto) return null;
  if (typeof document === 'undefined') return null;

  const resolvedType = tipo && ICONS[tipo] ? tipo : inferToastType(titulo, texto);
  const container = getOrCreateContainer();
  if (!container) return null;

  const toast = document.createElement('div');
  toast.className = `toast toast--${resolvedType}`;
  toast.setAttribute('role', resolvedType === 'error' ? 'alert' : 'status');

  const iconSvg = ICONS[resolvedType] || ICONS.info;
  const bodyText = texto ? `<p class="toast-desc">${escapeHTML(texto)}</p>` : '';

  toast.innerHTML = `
    <div class="toast-icon-badge" aria-hidden="true">
      ${iconSvg}
    </div>
    <div class="toast-content">
      <h4 class="toast-title">${escapeHTML(titulo)}</h4>
      ${bodyText}
    </div>
    <button class="toast-close" type="button" aria-label="Fechar notificação">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  let timeoutId = null;
  let fallbackRemoveId = null;
  let remainingTime = duracao;
  let startTime = Date.now();
  let dismissed = false;

  const finalizeRemove = () => {
    clearTimeout(fallbackRemoveId);
    if (toast.isConnected !== false) {
      toast.remove();
    }
    if (container && container.children.length === 0) {
      container.remove();
    }
  };

  const dismiss = (swipeVector = null) => {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(timeoutId);
    toast.classList.remove('toast--swiping');

    if (swipeVector) {
      toast.classList.add('toast--swiped');
      toast.style.animation = 'none';
      toast.style.transition = 'transform 0.22s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease';
      toast.style.transform = `translate3d(${Math.round(swipeVector.x)}px, ${Math.round(swipeVector.y)}px, 0) scale(0.95)`;
      toast.style.opacity = '0';
      toast.addEventListener('transitionend', finalizeRemove, { once: true });
    } else {
      toast.style.animation = '';
      toast.style.transition = '';
      toast.style.transform = '';
      toast.style.opacity = '';
      toast.classList.add('toast--dismissing');
      toast.addEventListener('animationend', finalizeRemove, { once: true });
    }

    // Garantia de remoção caso animação/transição seja desativada (ex: prefers-reduced-motion)
    fallbackRemoveId = setTimeout(finalizeRemove, 300);
  };

  const startTimer = () => {
    clearTimeout(timeoutId);
    if (dismissed || remainingTime <= 0) return;
    startTime = Date.now();
    timeoutId = setTimeout(() => dismiss(), remainingTime);
  };

  const pauseTimer = () => {
    clearTimeout(timeoutId);
    remainingTime = Math.max(0, remainingTime - (Date.now() - startTime));
  };

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn?.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismiss();
  });

  // Pausa apenas com hover real de mouse (evita travar em toque no iOS Safari)
  toast.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse' && !dismissed) pauseTimer();
  });
  toast.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse' && !dismissed && !isDragging) {
      if (remainingTime > 0) startTimer();
      else dismiss();
    }
  });

  // Gestos de arrastar (touch, caneta ou mouse) para qualquer direção: esquerda, direita, cima ou baixo
  let isDragging = false;
  let hasMoved = false;
  let activePointerId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragTime = 0;
  let dx = 0;
  let dy = 0;

  const computeSwipeExitVector = (deltaX, deltaY) => {
    const dist = Math.hypot(deltaX, deltaY) || 1;
    const ux = deltaX / dist;
    const uy = deltaY / dist;
    const minOutX = Math.max(toast.offsetWidth || 260, 220);
    const minOutY = Math.max((toast.offsetHeight || 90) + 60, 140);
    const push = Math.abs(ux) >= Math.abs(uy) ? minOutX : minOutY;
    return { x: ux * push, y: uy * push };
  };

  toast.addEventListener('pointerdown', (e) => {
    if (dismissed) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target && e.target.closest?.('.toast-close')) return;

    isDragging = true;
    hasMoved = false;
    activePointerId = e.pointerId;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragTime = Date.now();
    dx = 0;
    dy = 0;
    pauseTimer();
  });

  toast.addEventListener('pointermove', (e) => {
    if (!isDragging || e.pointerId !== activePointerId || dismissed) return;
    dx = e.clientX - dragStartX;
    dy = e.clientY - dragStartY;
    const dist = Math.hypot(dx, dy);

    if (!hasMoved && dist > 4) {
      hasMoved = true;
      toast.classList.add('toast--swiping');
      toast.style.animation = 'none';
      toast.style.transition = 'none';
      try { toast.setPointerCapture?.(e.pointerId); } catch {}
    }

    if (hasMoved) {
      toast.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      toast.style.opacity = String(Math.max(0.2, 1 - dist / 160));
    }
  });

  const handlePointerEnd = (e, cancelled = false) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;

    if (hasMoved) {
      try { toast.releasePointerCapture?.(e.pointerId); } catch {}
    }
    toast.classList.remove('toast--swiping');

    if (dismissed) return;

    const dist = Math.hypot(dx, dy);
    const elapsed = Math.max(1, Date.now() - dragTime);
    const velocity = dist / elapsed;
    const shouldDismiss = !cancelled && hasMoved && (dist >= 44 || (dist >= 20 && velocity >= 0.38));

    if (shouldDismiss) {
      dismiss(computeSwipeExitVector(dx, dy));
      return;
    }

    if (hasMoved) {
      toast.style.transition = 'transform 0.24s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.2s ease';
      toast.style.transform = 'translate3d(0, 0, 0)';
      toast.style.opacity = '1';
    }

    remainingTime = Math.max(remainingTime, 1200);
    startTimer();
  };

  toast.addEventListener('pointerup', (e) => handlePointerEnd(e, false));
  toast.addEventListener('pointercancel', (e) => handlePointerEnd(e, true));

  // Limite de até 3 toasts simultâneos
  while (container.children.length >= 3) {
    const oldest = container.firstElementChild;
    oldest.remove();
  }

  container.appendChild(toast);
  startTimer();

  return { dismiss };
}
