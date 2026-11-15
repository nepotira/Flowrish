# Guia para a Lorrayne — Autorizar o Domínio do Site no Firebase (Auth + Firestore)

Este guia explica passo a passo como liberar o domínio do site hospedado no GitHub Pages (`nepotira.github.io`) no projeto do Firebase para que o **login com Google**, a **autenticação de usuários** e o **banco de dados (Cloud Firestore)** funcionem no site publicado.

> **URL do site hospedado:** `https://nepotira.github.io/Flowrish/`  
> **Domínio (hostname) que deve ser autorizado:** `nepotira.github.io` *(sem `https://` e sem `/Flowrish`)*  
> **Projeto Firebase configurado em `js/firebase-config.js`:** `biblioteca-76f0c` (`authDomain: biblioteca-76f0c.firebaseapp.com`)

---

## Passo 1 — Autorizar o domínio no Firebase Authentication (resolve o "Erro ao entrar com Google")

1. Acesse o [Firebase Console](https://console.firebase.google.com/) usando a conta Google dona do projeto **`biblioteca-76f0c`**.
2. Abra o projeto **`biblioteca-76f0c`**.
3. No menu lateral esquerdo, clique em **Build (Criação)** → **Authentication**.
4. Na barra superior da página de Authentication, clique na aba **Settings (Configurações)**.
5. No submenu lateral, clique em **Authorized domains (Domínios autorizados)**.
6. Clique no botão **Add domain (Adicionar domínio)**.
7. Digite exatamente:
   ```text
   nepotira.github.io
   ```
8. Clique em **Add (Adicionar)** para salvar.

> **Por que isso é obrigatório?**  
> Por segurança, o Firebase Authentication bloqueia popups e redirecionamentos de login (como o botão **"Entrar com Google"**) quando o site está rodando em um domínio que ainda não foi liberado nessa lista (`auth/unauthorized-domain`). `localhost` já vem autorizado por padrão, mas `nepotira.github.io` precisa ser adicionado manualmente uma única vez.

---

## Passo 2 — Conferir os métodos de login ativados

Ainda em **Build (Criação) → Authentication → Sign-in method (Método de login)**:
1. Confirme que **Email/Password (E-mail/senha)** está **Enabled (Ativado)**.
2. Confirme que **Google** está **Enabled (Ativado)** e com um e-mail de suporte do projeto preenchido.

---

## Passo 3 — Conferir o Banco de Dados (Cloud Firestore)

O Firestore não exige uma lista separada de domínios como o Authentication — assim que o usuário se autentica pelo domínio autorizado (`nepotira.github.io`), o banco libera acesso de acordo com as **Regras de Segurança (Rules)**.

1. No menu lateral, clique em **Build (Criação) → Firestore Database**.
2. Clique na aba **Rules (Regras)**.
3. Confirme que as regras publicadas permitem o funcionamento normal das coleções usadas pelo site:
   - `books` (catálogo de livros — leitura pública, escrita pelo dono autenticado `request.auth.uid == resource.data.ownerId`)
   - `users` (perfil público dos leitores — escrita restrita ao próprio `uid`)
   - `users/{uid}/contato/whatsapp` (leitura para usuários logados, escrita pelo próprio `uid`)
   - `users/{uid}/favorites` (leitura/escrita pelo próprio `uid`)
   - `ratings` (avaliações de leitores — escrita por usuário autenticado)
4. Se alguma regra foi editada para teste local restrito, clique em **Publish (Publicar)** após revisar.

---

## Passo 4 — (Opcional) Conferir restrições de chave no Google Cloud Console

Só é necessário se você ou alguém ativou **restrições por HTTP referrer** nas chaves de API:

1. Acesse [Google Cloud Console → APIs e Serviços → Credenciais](https://console.cloud.google.com/apis/credentials) no projeto **`biblioteca-76f0c`**.
2. Verifique a chave web do Firebase (`AIzaSyD8...`) e a chave da Google Books API (`AIzaSyDS...` em `js/firebase-config.js`):
   - Se estiverem em **Não restringir chave (Unrestricted)** ou **Restrições de API** sem restrição de site, já funcionam em produção.
   - Se tiverem **Restrições de aplicativo → Sites (referenciadores HTTP)** ativado, adicione também:
     ```text
     https://nepotira.github.io/*
     ```
     *(e mantenha `http://localhost:*/*` se quiser continuar testando localmente).*

---

## Como testar depois de salvar

1. Aguarde cerca de **1 a 2 minutos** após adicionar `nepotira.github.io` em **Authorized domains**.
2. Abra `https://nepotira.github.io/Flowrish/login.html` no celular ou computador.
3. Clique em **"Entrar com Google"** — a conta deve autenticar normalmente, criar/carregar o documento do usuário no Firestore e redirecionar para `perfil.html`.
