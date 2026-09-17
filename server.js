const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// CREATE - Cadastro de Usuário
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Faltam dados' });

    try {
        const hash = await bcrypt.hash(senha, 10);
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hash]
        );
        res.status(201).json({ id: result.insertId, nome, email });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Email já cadastrado' });
        res.status(500).json({ erro: err.message });
    }
});

// POST - Autenticação / Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ erro: 'Credenciais inválidas' });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) return res.status(401).json({ erro: 'Credenciais inválidas' });

        res.json({ 
            mensagem: 'Login efetuado com sucesso!',
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// READ - Listagem
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nome, email FROM usuarios');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// UPDATE - Atualização
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', 
            [nome, email, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Usuário não existe' });
        res.json({ mensagem: 'Atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// DELETE - Exclusão
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json({ mensagem: 'Usuário deletado' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.listen(3000, () => console.log('API operante'));