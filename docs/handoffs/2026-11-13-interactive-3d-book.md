# Especificação e Registro: Livro 3D Scrollytelling Interativo (Flowrish)

> **Data de Registro:** 13 de Novembro de 2026  
> **Status:** Concluído e Guardado em Branch Separada  
> **Branch Preservada:** [`test/interactive-3d-book`](https://github.com/nepotira/Flowrish/tree/test/interactive-3d-book)  
> **Remoto:** `origin/test/interactive-3d-book` e `fork-flourish/test/interactive-3d-book`  
> **Referência Visual Principal:** Imagem anotada pelo usuário com traçado vermelho (`media_1794543769127_67a685e5.png`)

---

## 1. Visão Geral da Funcionalidade
O Livro 3D Interativo foi desenvolvido como uma experiência de **Scrollytelling** na página inicial do Flowrish (`index.html`), projetada para guiar o leitor visualmente ao longo da narrativa da plataforma enquanto ele rola a página.

### Diretrizes de Engenharia:
- **Ultra Leve ("Roda em qualquer batata")**: Construído 100% com CSS 3D Transforms (`transform-style: preserve-3d`), aceleração por GPU (`will-change: transform`, `translate3d`) e manipulação passiva de scroll via `requestAnimationFrame`. Sem Three.js, WebGL ou bibliotecas pesadas de terceiros.
- **Zero Mocks**: Totalmente integrado aos dados e identidade visual autênticos do Flowrish.
- **Zero Movimento Autônomo**: A rotação angular e a abertura do livro reagem **estritamente à rolagem do usuário**. Não há animações cíclicas de flutuação (`Math.sin()`), nem seguimento de mouse desnecessário.

---

## 2. Requisitos & Especificações Estritas do Usuário

### A. Dimensões & Preenchimento Monumental
- O livro deve ser **MUITO MAIOR** do que um card padrão.
- Altura: `clamp(740px, 90vh, 890px)` — toca e quase transborda a borda superior (abaixo do header) e a borda inferior da viewport.
- Largura: `clamp(480px, 36vw, 580px)` — preenche toda a metade direita da tela.
- Sangria: `margin-right: -55px` — sangra suavemente para fora da borda direita da janela, gerando sensação de profundidade infinita.
- Grid: `.scrolly-container` com largura total da tela (`100vw`), permitindo que a coluna esquerda de conteúdo (`max-width: 560px`) conviva com o livro sem colisão.

### B. Palco Fixo e Sem Arrasto (Stationary Stage)
- O livro **NÃO deve ser arrastado ou deslizar pela tela** ao abrir ou fechar.
- Largura e margens do container (`.book-interactive-area`) permanecem 100% estáticas. A lombada do livro permanece firmemente ancorada no palco fixo à direita.

### C. Mecanismo da "Abridinha em V"
- O livro **NÃO abre 180° plano** (duas páginas abertas retas como revista).
- O livro dá uma **abridinha em V**: a capa frontal gira para a esquerda em torno da lombada (`transform: rotateY(-114deg)`), ficando em um ângulo tridimensional natural de leitura (~60° em relação ao miolo).
- A página interna do lado direito permanece exposta e quase frontal aos olhos do leitor (`rotateY(-12deg)`), garantindo legibilidade imediata.
- O lado interno da capa revela a guarda em couro trabalhado com o selo comemorativo da marca (`🌸`).

### D. Títulos Unitários Gigantes
No interior da página exposta pela abridinha, exibe títulos unitários em tipografia monumental (`clamp(2.8rem, 5vw, 4.4rem)`):
1. **Passo 1**: `01 ANUNCIE` — *ISBN com capa e dados automáticos*
2. **Passo 2**: `02 ENCONTRE` — *Filtros rápidos e busca em tempo real*
3. **Passo 3**: `03 COMBINE` — *Direto pelo WhatsApp sem taxas*
4. **Passo 4**: `04 AVALIE` — *Reputação real na comunidade leitora*
5. **Destaques**: `★ DESTAQUES` — *Livros mais amados da semana*
6. **CTA Final**: `🌸 FLORESÇA` — *Comece a trocar hoje mesmo*

As trocas de texto possuem transição suave de opacidade e leve deslocamento de 120ms (`.book-word-wrap.is-updating`), sem saltos visuais bruscos.

### E. Capa Frontal Limpa
- **Sem texto algum**: Removidas todas as palavras da capa.
- Apenas a flor 3D do Flowrish (`assets/logomarca.png`) centralizada em tamanho grande (`280px`), emoldurada por filigranas douradas em relevo com cantoneiras.

### F. Paleta de Cores Nobre (Couro Havana / Caramelo Tostado)
- **Capa & Lombada**: Couro Havana natural (`linear-gradient(150deg, #945738 0%, #7A4225 55%, #592D17 100%)`).
- **Filigranas & Ouro**: Dourado acetinado suave (`#F5E0B7`).
- **Miolo**: Papel marfim quente de alta gramatura (`#FFFDF9`) com tinta espresso profunda (`#281912`).
- **Destaques**: Terracota quente (`#B06E4A`) e Rosa Flowrish (`#DF949D`).
- **Contraste**: Alta distinção visual contra o fundo Oliva Escuro do Flowrish (`#43442A`).

---

## 3. Arquivos Envolvidos na Branch `test/interactive-3d-book`
- [`css/book-3d.css`](css/book-3d.css) — Estilos tridimensionais, variáveis de dimensão, perspectiva de 2200px, sombras e acabamento.
- [`js/book-3d.js`](js/book-3d.js) — Módulo controlador com Lerp (interpolação linear), escuta passiva de scroll e atualização de seções.
- [`index.html`](index.html) — Marcação semântica com `.scrolly-container`, `.scrolly-aside` e palco do livro.
- [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md) — Registro de estado da branch de teste.

---

## 4. Como Reativar ou Voltar a Mexer
Caso queira retomar este desenvolvimento no futuro:
```bash
# 1. Acessar a pasta do repositório
cd /home/nepo/.gemini/antigravity/scratch/Flourish

# 2. Alternar para a branch de teste do livro
git checkout test/interactive-3d-book

# 3. Iniciar o servidor local de testes
node server.js
# ou: ./iniciar-localhost.sh

# 4. Acessar no navegador
# http://localhost:8080
```
Tudo está versionado, testado e seguro no Git remoto (`origin/test/interactive-3d-book`).
