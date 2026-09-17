const API_URL = 'http://localhost:3000';

// Tema Persistente
const btnTema = document.getElementById('btn-tema');
const temaSalvo = localStorage.getItem('tema') || 'light';
document.documentElement.setAttribute('data-theme', temaSalvo);

btnTema.addEventListener('click', () => {
    const temaAtual = document.documentElement.getAttribute('data-theme');
    const novoTema = temaAtual === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', novoTema);
    localStorage.setItem('tema', novoTema);
});

// Login POST
document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        email: document.getElementById('loginEmail').value,
        senha: document.getElementById('loginSenha').value
    };

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok) alert(`Bem-vindo, ${data.usuario.nome}! 🔥`);
        else alert('Erro: ' + data.erro);
    } catch (err) {
        console.error('🚩 API Offline:', err);
        alert('Erro de conexão.');
    }
});

// Cadastro POST
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok) {
            alert('Usuário criado com sucesso!');
            carregarUsuarios(); 
        } else {
            alert('Erro: ' + data.erro);
        }
    } catch (err) {
        console.error('🚩 Falha na requisição:', err);
    }
});

// Listagem GET
async function carregarUsuarios() {
    try {
        const res = await fetch(`${API_URL}/usuarios`);
        const data = await res.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    } catch (err) {
        document.getElementById('output').textContent = '🚩 Erro ao buscar dados. Backend operante?';
    }
}

// DELETE - Remover Usuário pelo ID
document.getElementById('formDelete').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('deleteId').value;

    if (!confirm(`Tem certeza que quer apagar o usuário ID ${id}?`)) return;

    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (res.ok) {
            alert(data.mensagem);
            carregarUsuarios();
            document.getElementById('deleteId').value = '';
        } else {
            alert('Erro: ' + data.erro);
        }
    } catch (err) {
        console.error('🚩 Falha ao deletar:', err);
        alert('Erro de conexão ao tentar deletar.');
    }
}); // <-- Estava faltando fechar essa função aqui

// PUT - Atualizar Usuário pelo ID
document.getElementById('formUpdate').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateId').value;
    const payload = {
        nome: document.getElementById('updateNome').value,
        email: document.getElementById('updateEmail').value
    };

    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok) {
            alert(data.mensagem);
            carregarUsuarios();
            document.getElementById('formUpdate').reset();
        } else {
            alert('Erro: ' + data.erro);
        }
    } catch (err) {
        console.error('Falha ao atualizar:', err);
        alert('Erro de conexão ao tentar atualizar.');
    }
});

document.getElementById('btnAtualizar').addEventListener('click', carregarUsuarios);
carregarUsuarios();