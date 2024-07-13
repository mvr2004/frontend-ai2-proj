// auth.js

// Função para fazer login
function fazerLogin(nome, password) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // Armazena o token JWT no localStorage
      localStorage.setItem('token', data.token);
      // Redireciona para a página protegida ou atualiza a interface do utilizador
      window.location.href = '/dashboard';
    } else {
      alert('Login falhou');
    }
  })
  .catch(error => console.error('Erro ao fazer login:', error));
}

// Função para verificar se o utilizador está autenticado
function verificarAutenticacao() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Redireciona para a página de login se o token não estiver presente
    window.location.href = '/login';
  }
}

// Função para fazer logout
function fazerLogout() {
  localStorage.removeItem('token');
  // Redireciona para a página de login após fazer logout
  window.location.href = '/login';
}
