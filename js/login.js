import { loginWithEmail, loginWithGoogle, isLoggedIn, authReady, sendPasswordReset } from './storage.js';
import { showToast } from './toast.js';
import { openForgotPasswordModal } from './auth.js';
import { initTheme } from './theme.js';

initTheme();
await authReady;
if (isLoggedIn()) window.location.href = 'perfil.html';

function mensagemErro(err) {
  const map = {
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/cancelled-popup-request': 'Login cancelado.',
    'auth/unauthorized-domain': 'Este domínio ainda não foi autorizado no Firebase Auth.',
    'auth/operation-not-allowed': 'Login com Google ainda não está ativado no Firebase Auth.',
  };
  return map[err?.code] || 'Não foi possível entrar. Verifique os dados e tente novamente.';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  if (!email || !senha) return;

  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    await loginWithEmail({ email, senha });
    showToast('Login realizado!', 'Bem-vindo(a) de volta.');
    setTimeout(() => window.location.href = 'perfil.html', 500);
  } catch (err) {
    showToast('Erro ao entrar', mensagemErro(err));
    btn.disabled = false;
  }
});

const googleBtn = document.getElementById('googleLoginBtn');
googleBtn.addEventListener('click', async () => {
  googleBtn.disabled = true;
  try {
    const user = await loginWithGoogle();
    if (!user) {
      setTimeout(() => { googleBtn.disabled = false; }, 4000);
      return;
    }
    showToast('Login com Google', 'Conta conectada com sucesso.');
    setTimeout(() => window.location.href = 'perfil.html', 500);
  } catch (err) {
    showToast('Erro ao entrar com Google', mensagemErro(err));
    googleBtn.disabled = false;
  }
});

document.getElementById('forgotBtn').addEventListener('click', () => openForgotPasswordModal(sendPasswordReset));
