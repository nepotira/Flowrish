import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { showToast, inferToastType } from '../../js/toast.js';

function installMockDOM() {
  const createEl = (tag) => {
    const listeners = {};
    const children = [];
    const classSet = new Set();
    const attrs = {};
    const el = {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      style: {},
      children,
      parentNode: null,
      offsetWidth: 320,
      offsetHeight: 80,
      isConnected: true,
      classList: {
        add: (...cls) => cls.forEach((c) => classSet.add(c)),
        remove: (...cls) => cls.forEach((c) => classSet.delete(c)),
        contains: (c) => classSet.has(c),
      },
      setAttribute: (k, v) => { attrs[k] = String(v); },
      getAttribute: (k) => attrs[k],
      appendChild: (child) => {
        child.parentNode = el;
        children.push(child);
        if (!el.firstElementChild) el.firstElementChild = child;
        return child;
      },
      remove: () => {
        el.isConnected = false;
        if (el.parentNode) {
          const idx = el.parentNode.children.indexOf(el);
          if (idx >= 0) el.parentNode.children.splice(idx, 1);
          el.parentNode.firstElementChild = el.parentNode.children[0] || null;
        }
      },
      addEventListener: (type, fn) => {
        (listeners[type] ||= []).push(fn);
      },
      dispatchEvent: (event) => {
        const list = (listeners[event.type] || []).slice();
        list.forEach((fn) => fn(event));
      },
      setPointerCapture: () => {},
      releasePointerCapture: () => {},
      closest: () => null,
      set innerHTML(html) {
        if (html.includes('toast-close')) {
          const closeBtn = createEl('button');
          closeBtn.className = 'toast-close';
          closeBtn.closest = (sel) => (sel === '.toast-close' ? closeBtn : null);
          el._closeBtn = closeBtn;
        }
      },
      querySelector: (sel) => (sel === '.toast-close' ? el._closeBtn || null : null),
    };
    return el;
  };

  const containerMap = {};
  const body = createEl('body');
  body.appendChild = (child) => {
    child.parentNode = body;
    body.children.push(child);
    if (child.id) containerMap[child.id] = child;
    return child;
  };
  const origRemoveContainer = () => {};
  globalThis.document = {
    body,
    createElement: createEl,
    getElementById: (id) => (containerMap[id] && containerMap[id].isConnected !== false ? containerMap[id] : null),
  };
  return { body, origRemoveContainer };
}

afterEach(() => {
  delete globalThis.document;
  vi.useRealTimers();
});

describe('modern toast notification system (toast.js)', () => {
  it('exporta showToast e inferToastType', () => {
    expect(typeof showToast).toBe('function');
    expect(typeof inferToastType).toBe('function');
  });

  it('infere tipo de erro corretamente a partir do titulo ou mensagem', () => {
    expect(inferToastType('Erro ao entrar', 'E-mail ou senha incorretos.')).toBe('error');
    expect(inferToastType('Senha fraca')).toBe('error');
    expect(inferToastType('WhatsApp inválido')).toBe('error');
    expect(inferToastType('Não foi possível salvar')).toBe('error');
    expect(inferToastType('As senhas não coincidem')).toBe('error');
  });

  it('infere tipo de sucesso corretamente', () => {
    expect(inferToastType('Login realizado!', 'Bem-vindo(a) de volta.')).toBe('success');
    expect(inferToastType('Conta criada!')).toBe('success');
    expect(inferToastType('Perfil atualizado!')).toBe('success');
    expect(inferToastType('Livro publicado!')).toBe('success');
  });

  it('infere tipo de aviso (warning) corretamente', () => {
    expect(inferToastType('Informe seu WhatsApp')).toBe('warning');
    expect(inferToastType('Preencha os campos obrigatórios')).toBe('warning');
    expect(inferToastType('Atenção aos detalhes')).toBe('warning');
  });

  it('retorna info como padrao quando nao ha palavras-chave de erro ou sucesso', () => {
    expect(inferToastType('Ajuda e orientações')).toBe('info');
  });

  it('executa com seguranca em ambiente headless sem document', () => {
    expect(() => showToast('Teste', 'Mensagem')).not.toThrow();
    const result = showToast('Teste', 'Mensagem');
    expect(result).toBeNull();
  });

  it('possui classes e estilizacao de toast no components.css sem bloqueio !important em animations.css', () => {
    const cssPath = path.resolve(__dirname, '../../css/components.css');
    const animPath = path.resolve(__dirname, '../../css/animations.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    const anim = fs.readFileSync(animPath, 'utf8');
    expect(css).toContain('.toast-container');
    expect(css).toContain('.toast--error');
    expect(css).toContain('.toast--success');
    expect(css).toContain('.toast-icon-badge');
    expect(css).toContain('[data-theme="light"] .toast');
    expect(css).toContain('touch-action: none');
    expect(anim).not.toMatch(/\.toast\s*\{[^}]*!important/);
  });

  it('fecha ao clicar no botao X mesmo sem evento animationend', () => {
    vi.useFakeTimers();
    const { body } = installMockDOM();
    showToast('Erro ao entrar', 'Tente novamente.');
    const container = body.children[0];
    const toast = container.children[0];
    const closeBtn = toast.querySelector('.toast-close');

    closeBtn.dispatchEvent({ type: 'click', stopPropagation: () => {} });
    expect(toast.classList.contains('toast--dismissing')).toBe(true);

    vi.advanceTimersByTime(320);
    expect(container.children.length).toBe(0);
    expect(body.children.length).toBe(0);
  });

  it.each([
    ['esquerda', -80, 5],
    ['direita', 85, -4],
    ['cima', 4, -70],
    ['baixo', -6, 75],
  ])('permite arrastar para %s para fechar a notificacao', (_dir, moveX, moveY) => {
    vi.useFakeTimers();
    const { body } = installMockDOM();
    showToast('Aviso', 'Arraste para limpar.');
    const container = body.children[0];
    const toast = container.children[0];

    toast.dispatchEvent({ type: 'pointerdown', pointerId: 1, pointerType: 'touch', clientX: 200, clientY: 100, target: toast });
    toast.dispatchEvent({ type: 'pointermove', pointerId: 1, pointerType: 'touch', clientX: 200 + moveX, clientY: 100 + moveY });
    toast.dispatchEvent({ type: 'pointerup', pointerId: 1, pointerType: 'touch', clientX: 200 + moveX, clientY: 100 + moveY });

    expect(toast.classList.contains('toast--swiped')).toBe(true);
    vi.advanceTimersByTime(320);
    expect(container.children.length).toBe(0);
  });

  it('retorna a posicao original quando o arrasto e curto e lento', () => {
    vi.useFakeTimers();
    const { body } = installMockDOM();
    showToast('Aviso', 'Toque curto.');
    const container = body.children[0];
    const toast = container.children[0];

    toast.dispatchEvent({ type: 'pointerdown', pointerId: 2, pointerType: 'touch', clientX: 150, clientY: 80, target: toast });
    vi.advanceTimersByTime(500);
    toast.dispatchEvent({ type: 'pointermove', pointerId: 2, pointerType: 'touch', clientX: 162, clientY: 84 });
    toast.dispatchEvent({ type: 'pointerup', pointerId: 2, pointerType: 'touch', clientX: 162, clientY: 84 });

    expect(toast.classList.contains('toast--swiped')).toBe(false);
    expect(toast.style.transform).toBe('translate3d(0, 0, 0)');
    expect(container.children.length).toBe(1);
  });
});
