# Handoff de Continuidade — Flowrish

> **Data:** 14/11/2026  
> **Autor:** Antigravity  
> **Contexto:** Correção completa da interface mobile e eliminação de overflow horizontal (`320px`–`960px`) em `nepotira/Flowrish` (`fix/mobile-layout-overflow` -> `main`).

---

## Última Atualização (14/11/2026)
- **Navbar e Cabeçalho Mobile (`css/variables.css`, `css/components.css`):** Corrigido recorte do botão `≡` fora da viewport com `--header-h: 68px` (`<= 640px`), `justify-content: space-between`, redução proporcional do logo (`32px`/`28px`) e botões compactos (`36px`–`40px`).
- **Busca na Gaveta Mobile e Footer (`css/components.css`):** Escopo corrigido para `.navbar .nav-search` restaurando `.mobile-search` na gaveta; `.footer-grid` e `.footer-bottom` empilhados em `<= 768px`.
- **Páginas e Filtros (`css/base.css`, `css/pages/*.css`, `index.html`, `*.html`):** `overflow-x: clip` global, `scroll-padding-top`, quebra de linha em `.filter-chip-list`, refinamento de modais/abas/hero mobile e cache-busting `?v=1.3.5` nas 11 páginas HTML.
- **Verificação:** `18/18` testes Vitest aprovados e auditoria Chrome headless com `0` overflows horizontais nas 11 páginas em `390x844`, `360x800` e `320x640`.

---

## Histórico Anterior (03/11/2026)
- **Integração Claymorphism Soft 3D & Troca via WhatsApp** (ver `docs/JOURNAL.md`).

## O que foi realizado
1. **Configuração e Governança do Repositório Público**:
   - `nepotira/Flourish`: Configurado com tópicos (`livros`, `troca-de-livros`, `claymorphism`, etc.), labels padrão (`breaking-change`), squash merge habilitado e `.github/dependabot.yml`.
2. **Integração do Sistema Mais Recente com Claymorphism**:
   - Adotada a arquitetura mais recente de trocas diretas por WhatsApp, Acervo (`acervo.html`) e Perfil do Anunciante (`anunciante.html`).
   - Aplicado o design system Claymorphism Soft 3D em todas as páginas, componentes, botões, modais e formulários.
   - Alternância de tema claro/escuro persistente via `theme.js` e navbar com ícone SVG.
3. **Eliminação Absoluta de Mocks**:
   - Substituídos todos os links para `placehold.co` pelo asset local `assets/sem-capa.svg`.
   - Adicionada resiliência ao carrossel da home com fallback para livros recentes reais.
4. **Testes e Suporte Linux**:
   - 9 testes unitários Vitest passando em <300ms.
   - Scripts nativos bash `iniciar-localhost.sh` e `exportar-sessao.sh` operacionais.
